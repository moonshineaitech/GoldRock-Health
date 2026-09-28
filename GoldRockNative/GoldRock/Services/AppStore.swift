import Foundation
import Observation
import UserNotifications

@Observable @MainActor
final class AppStore {
    private(set) var cases: [MemberCase] = []
    private(set) var user: APIUser?
    private(set) var benefits: [Benefit] = []
    private(set) var organizations: [OrganizationRole] = []
    private(set) var config: ServerConfig?
    private(set) var locked = true
    private(set) var sessionOnly = false
    private(set) var hasSuspendedWorkspace = false
    private(set) var busy = false
    var notice: String?
    var error: String?
    var selectedTab = 0
    private var api: APIClient
    private let vault = ProtectedVault()
    private var polling: [UUID: Task<Void, Never>] = [:]
    private var conversationPolling: [String: Task<Void, Never>] = [:]
    private var generation = UUID()
    private var foreground = true
    private var pendingGuestCopies: [MemberCase] = []
    private var pendingGuestCopyOwner: String?
    var serverAddress: String { api.baseURL.absoluteString }
    /// A transient editor can reject work prepared for a prior account/session.
    var workspaceIdentity: UUID { generation }
    var workspaceActive: Bool { foreground && !locked }
    private var scope: String { api.baseURL.absoluteString + ":" + (user?.id ?? "guest") }

    init() {
        #if DEBUG
        let address = UserDefaults.standard.string(forKey: "GoldRockServerURL") ?? "http://127.0.0.1:4390"
        #else
        let address = Bundle.main.object(forInfoDictionaryKey: "GoldRockAPIBaseURL") as? String ?? "https://api.example.invalid"
        #endif
        api = APIClient(baseURL: (try? APIClient.checkedBaseURL(address)) ?? URL(string: "https://api.example.invalid")!)
    }
    func bootstrap() async {
        let service = api; let run = generation
        do {
            try service.restoreToken()
            if service.token != nil {
                let session = try await service.currentSession()
                guard generation == run, api === service else { return }
                if session.user?.id != user?.id, !locked { lock() }
                apply(session)
            }
            let configuration = try await service.config()
            guard api === service else { return }
            config = configuration
        } catch { notice = "Cloud access is unavailable. Your local checks still work. Reconnect in You when ready." }
    }
    func unlock() async {
        busy = true; defer { busy = false }
        let owner = scope; let run = generation
        do {
            if !hasSuspendedWorkspace || !sessionOnly || ProtectedVault.canAuthenticate { try await ProtectedVault.authenticate() }
            guard generation == run, scope == owner, foreground else { return }
            if !hasSuspendedWorkspace { cases = try vault.load(scope: scope); sessionOnly = false }
            appendApprovedGuestCopies()
            locked = false; hasSuspendedWorkspace = false
            resumeJobs()
        } catch { self.error = error.localizedDescription }
    }
    func startSessionOnly() { generation = UUID(); cases = []; appendApprovedGuestCopies(); hasSuspendedWorkspace = false; sessionOnly = true; locked = false }
    private func appendApprovedGuestCopies() {
        guard pendingGuestCopyOwner == scope else { pendingGuestCopies = []; pendingGuestCopyOwner = nil; return }
        cases.insert(contentsOf: pendingGuestCopies, at: 0)
        pendingGuestCopies = []; pendingGuestCopyOwner = nil
    }
    func suspend() {
        foreground = false
        conversationPolling.values.forEach { $0.cancel() }; conversationPolling.removeAll()
        if !locked { hasSuspendedWorkspace = true; locked = true }
        // Keep one-time objects only in process memory during an interruption.
        // Existing work stays bound to the same actor; no disk save is introduced.
    }
    func becameActive() { foreground = true }
    func lock() {
        let temporary = cases.filter { $0.saveMode == .session }
        let service = api
        for item in temporary { if let jobID = item.jobID { Task { try? await service.cancelJob(jobID) } } }
        for item in temporary { for turn in item.conversation?.turns ?? [] where turn.pending || turn.jobID != nil { Task { try? await service.deleteConversationOperation(turn.id) } } }
        polling.values.forEach { $0.cancel() }; polling.removeAll()
        conversationPolling.values.forEach { $0.cancel() }; conversationPolling.removeAll()
        generation = UUID(); cases.removeAll(); pendingGuestCopies = []; pendingGuestCopyOwner = nil; hasSuspendedWorkspace = false; locked = true
    }
    func refreshConnection() async {
        busy = true; defer { busy = false }
        let service = api; let run = generation
        do {
            let configuration = try await service.config()
            guard generation == run, api === service else { return }
            config = configuration
            if service.token != nil {
                let session = try await service.currentSession()
                guard generation == run, api === service else { return }
                if session.user?.id != user?.id { lock() }
                apply(session)
            }
            notice = "Connection checked."
        }
        catch { self.error = error.localizedDescription }
    }
    func publicResearchCatalog() async throws -> ResearchCatalog { try await api.researchCatalog() }
    func publicPolicy(_ providerID: String) async throws -> ResearchResponse { try await api.publicPolicy(providerID) }
    func changeServer(_ address: String) async {
        guard user == nil else { error = "Sign out before changing the server."; return }
        do {
            let url = try APIClient.checkedBaseURL(address)
            lock(); api = APIClient(baseURL: url); config = nil
            #if DEBUG
            UserDefaults.standard.set(url.absoluteString, forKey: "GoldRockServerURL")
            #endif
            await bootstrap()
        } catch { self.error = error.localizedDescription }
    }
    func authenticate(email: String, password: String, name: String, register: Bool, bringGuestCases: Bool = false) async -> Bool {
        busy = true; defer { busy = false }
        let service = api; let run = generation
        // Explicit opt-in only, captured before account identity changes; never copy a personal actor.
        let approvedCopies = guestCopies(approved: bringGuestCases)
        do {
            let session = try await service.authenticate(email: email, password: password, name: name, register: register)
            guard generation == run, api === service else { return false }
            lock(); apply(session)
            pendingGuestCopies = approvedCopies; pendingGuestCopyOwner = scope
            notice = approvedCopies.isEmpty ? "Signed in. Your account has its own local vault; saved guest cases stay in the guest vault." : "Your approved guest copies are one-time cases with new IDs. Original saved guest cases were left untouched. Choose Keep on this iPhone inside a case to save a copy."
            await unlock()
            return true
        } catch { self.error = error.localizedDescription; return false }
    }
    private func apply(_ session: SessionResponse) { user = session.user; benefits = session.benefits; organizations = session.organizations }
    private func guestCopies(approved: Bool) -> [MemberCase] {
        guard user == nil, approved else { return [] }
        return cases.map { original in
            var copy = original; copy.id = UUID(); copy.saveMode = .session; copy.jobID = nil; copy.operationID = nil; copy.jobStatus = nil; copy.consentReceipt = nil
            // Guest conversations cannot own cloud jobs; do not transfer approvals or operation IDs.
            copy.conversation = nil
            copy.updatedAt = Date(); return copy
        }
    }
    func createRecoveryCode(password: String) async throws -> RecoveryCodeResponse {
        let service = api; let owner = scope; let run = generation
        let result = try await service.createRecoveryCode(password: password)
        guard api === service, scope == owner, generation == run else { throw CancellationError() }
        return result
    }
    func revokeRecoveryCode(password: String) async throws {
        let service = api; let owner = scope; let run = generation
        try await service.revokeRecoveryCode(password: password)
        guard api === service, scope == owner, generation == run else { throw CancellationError() }
        notice = "The recovery code was revoked."
    }
    func changePassword(current: String, new: String) async throws {
        let service = api; let owner = scope; let run = generation
        let result = try await service.changePassword(current: current, new: new)
        guard api === service, scope == owner, generation == run else { throw CancellationError() }
        apply(result); notice = "Password changed. Other sessions were signed out and any recovery code was revoked."
    }
    func recoverAccount(email: String, code: String, password: String, bringGuestCases: Bool = false) async -> Bool {
        busy = true; defer { busy = false }
        let service = api; let run = generation
        let approvedCopies = guestCopies(approved: bringGuestCases)
        do {
            let result = try await service.recoverAccount(email: email, code: code, password: password)
            guard api === service, generation == run else { return false }
            lock(); apply(result); notice = "Account recovered. The one-time code is consumed and other sessions were invalidated. Local cases still require their original device key."
            pendingGuestCopies = approvedCopies; pendingGuestCopyOwner = scope
            await unlock(); return true
        } catch { self.error = error.localizedDescription; return false }
    }
    func logout() async {
        busy = true; defer { busy = false }
        let service = api; let owner = scope
        do {
            for item in cases where item.saveMode == .session { for turn in item.conversation?.turns ?? [] where turn.pending || turn.jobID != nil { try await service.deleteConversationOperation(turn.id) } }
            // Require server acknowledgement so signing out never pretends to revoke a remote session.
            try await service.logout()
            guard api === service, scope == owner else { return }
            lock(); user = nil; benefits = []; organizations = []
            notice = "Signed out. Kept cases remain protected in that account's local vault."
        } catch { self.error = "Sign-out could not reach the service. Lock the app now and retry online. " + error.localizedDescription }
    }
    func deleteAccount(password: String) async -> Bool {
        busy = true; defer { busy = false }
        let oldScope = scope; let service = api
        do {
            try await service.deleteAccount(password: password)
            if api === service, scope == oldScope { lock(); user = nil; benefits = []; organizations = [] }
            try vault.erase(scope: oldScope)
            notice = "Account deletion was confirmed and its local vault removed. Exported copies remain outside GoldRock."
            return true
        } catch { self.error = error.localizedDescription; return false }
    }
    func redeem(_ token: String) async {
        busy = true; defer { busy = false }
        let service = api; let run = generation
        do { try await service.redeem(token.trimmingCharacters(in: .whitespacesAndNewlines)); let session = try await service.currentSession(); guard generation == run, api === service else { return }; apply(session); notice = "Benefit linked to your personal account." }
        catch { self.error = error.localizedDescription }
    }
    func unlink(_ id: String) async {
        let service = api; let run = generation
        do { try await service.unlink(id); let session = try await service.currentSession(); guard generation == run, api === service else { return }; apply(session); notice = "Sponsorship removed. Your personal cases remain yours." }
        catch { self.error = error.localizedDescription }
    }
    func createCase(title: String, facts: PublicFacts, mode: SaveMode, taskIntake: TaskIntake? = nil) throws -> UUID {
        guard workspaceActive else { throw AppError.locked }
        var item = MemberCase(); item.title = String(title.prefix(100)).trimmingCharacters(in: .whitespacesAndNewlines)
        if item.title.isEmpty { item.title = "My bill review" }
        item.facts = try facts.validated(); item.saveMode = sessionOnly ? .session : mode
        item.taskIntake = taskIntake
        item.guidance = try LocalGuidance.analyze(facts)
        var next = cases; next.insert(item, at: 0); try persist(next); cases = next
        return item.id
    }
    func item(_ id: UUID) -> MemberCase? { cases.first { $0.id == id } }
    private func persist(_ values: [MemberCase]) throws { if !sessionOnly { try vault.save(values, scope: scope) } }
    func update(_ id: UUID, change: (inout MemberCase) throws -> Void) throws {
        guard (!locked || hasSuspendedWorkspace), let index = cases.firstIndex(where: { $0.id == id }) else { throw AppError.locked }
        var next = cases; try change(&next[index]); next[index].updatedAt = Date()
        try persist(next); cases = next
    }
    func editFacts(_ id: UUID, facts: PublicFacts) async throws {
        let service = api; let run = generation
        if let job = item(id)?.jobID { try await service.cancelJob(job) }
        for turn in item(id)?.conversation?.turns ?? [] where turn.pending { try await service.deleteConversationOperation(turn.id) }
        guard generation == run, api === service else { throw CancellationError() }
        polling[id]?.cancel(); polling[id] = nil
        try update(id) { item in
            if var conversation = item.conversation {
                for turn in conversation.turns where turn.pending { conversation = try LocalGuidance.conversation("appendConversationEvent", arguments: [conversation.object, turn.id, ["kind": "canceled"], LocalGuidance.conversationOptions()]) }
                item.conversation = conversation
            }
            item.facts = try facts.validated(); item.guidance = try LocalGuidance.analyze(facts)
            item.jobID = nil; item.operationID = nil; item.jobStatus = nil; item.consentReceipt = nil
            item.editedDrafts.removeAll()
        }
    }
    func keepCaseOnDevice(_ id: UUID) async throws {
        let run = generation; let owner = scope
        try await ProtectedVault.authenticate()
        guard generation == run, scope == owner, item(id) != nil, !locked else { throw CancellationError() }
        var next = cases
        if sessionOnly {
            let currentIDs = Set(next.map(\.id))
            next += try vault.load(scope: scope).filter { !currentIDs.contains($0.id) }
        }
        guard let index = next.firstIndex(where: { $0.id == id }) else { return }
        next[index].saveMode = .device; next[index].updatedAt = Date()
        try vault.save(next, scope: scope); cases = next; sessionOnly = false
        notice = "This case is now kept in the protected vault on this iPhone."
    }
    func remove(_ id: UUID) async throws {
        guard let item = item(id) else { return }
        let service = api; let run = generation
        // First cancel remotely. If offline, show the failure and retain the reference for retry.
        if let job = item.jobID { try await service.cancelJob(job) }
        for turn in item.conversation?.turns ?? [] where turn.pending || turn.jobID != nil { try await service.deleteConversationOperation(turn.id) }
        guard generation == run, api === service else { throw CancellationError() }
        polling[id]?.cancel(); polling[id] = nil
        let next = cases.filter { $0.id != id }; try persist(next); cases = next
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [id.uuidString])
    }
    func eraseLocalVault() throws {
        guard !cases.contains(where: { $0.jobID != nil }) else { throw AppError.invalid("Delete each cloud-linked case first so its server record can be canceled too.") }
        guard !cases.contains(where: { $0.conversation?.turns.contains(where: { $0.pending || $0.jobID != nil }) == true }) else { throw AppError.invalid("Delete conversation-linked cases first so their server operations can be canceled too.") }
        try vault.erase(scope: scope); cases.removeAll()
    }
    var canAnalyze: Bool { user != nil && config?.cloud.enabled == true && config?.cloud.configured == true }
    func analyzeCloud(_ id: UUID) async throws {
        guard canAnalyze, let config, let item = item(id) else { throw AppError.service("Sign in and connect an enabled cloud service before requesting AI guidance.") }
        let run = generation; let owner = scope; let service = api
        let terminal = ["failed", "expired", "canceled"].contains(item.jobStatus ?? "")
        let operation = terminal ? UUID().uuidString : (item.operationID ?? UUID().uuidString)
        try update(id) { $0.operationID = operation; $0.jobStatus = "submitting" }
        do {
            let response = try await service.createJob(facts: item.facts, operationID: operation, policyVersion: config.privacy.policyVersion)
            guard generation == run, scope == owner, self.item(id)?.operationID == operation else { try? await service.cancelJob(response.job.id); return }
            try update(id) {
                $0.jobID = response.job.id; $0.jobStatus = response.job.status
                $0.consentReceipt = "Approved \(ISO8601DateFormatter().string(from: Date())) · policy \(config.privacy.policyVersion) · OpenAI · fields: \(item.facts.approvedFields.joined(separator: ", ")) · configured server TTL \(config.privacy.jobTtlSeconds) seconds."
            }
            poll(id, job: response.job.id)
        } catch {
            if generation == run {
                try? update(id) { item in
                    if let failure = error as? HTTPFailure, ["OPERATION_DELETED", "OPERATION_CONFLICT"].contains(failure.code) {
                        item.operationID = nil; item.jobStatus = "review_required"
                    } else { item.jobStatus = "submission_failed" }
                }
            }
            throw error
        }
    }
    func cancelAnalysis(_ id: UUID) async throws {
        guard let job = item(id)?.jobID else { return }
        let service = api; let run = generation
        try await service.cancelJob(job)
        guard generation == run, api === service else { throw CancellationError() }
        polling[id]?.cancel(); polling[id] = nil
        try update(id) { $0.jobID = nil; $0.operationID = nil; $0.jobStatus = "canceled"; $0.guidance = try LocalGuidance.analyze($0.facts) }
    }
    func resumeJobs() {
        for item in cases where item.jobID != nil && !["succeeded", "failed", "expired", "canceled"].contains(item.jobStatus ?? "") { poll(item.id, job: item.jobID!) }
        if workspaceActive { for item in cases { for turn in item.conversation?.turns ?? [] where turn.pending { if turn.jobID != nil { pollConversation(item.id, turnID: turn.id) } } } }
    }
    private func poll(_ id: UUID, job: String) {
        polling[id]?.cancel()
        let run = generation; let owner = scope; let service = api
        polling[id] = Task {
            for attempt in 0..<60 {
                do {
                    try Task.checkCancellation()
                    let response = try await service.job(job)
                    guard generation == run, scope == owner, let item = self.item(id), item.jobID == job else { return }
                    if let result = response.job.result { try LocalGuidance.validate(result, facts: item.facts) }
                    try update(id) { item in item.jobStatus = response.job.status; if let result = response.job.result { item.guidance = result } }
                    if ["succeeded", "failed", "canceled", "expired"].contains(response.job.status) {
                        if let message = response.job.error?.message { error = message }
                        return
                    }
                    try await Task.sleep(for: .seconds(min(2 + attempt / 8, 8)))
                } catch is CancellationError { return }
                catch {
                    guard generation == run else { return }
                    notice = "Cloud status could not be refreshed. Your local checks are still available; use Refresh status to reconnect."
                    return
                }
            }
            notice = "The analysis is taking longer than expected. Use Refresh status to check the same job."
        }
    }
    func approveConversation(_ id: UUID, input: ConversationInput, facts: PublicFacts, historyTurnIDs: [String], replyToID: String?, accepted: Bool) throws -> String {
        guard accepted, workspaceActive, canAnalyze, let config, let item = item(id) else { throw AppError.service("Sign in, connect an enabled service and explicitly approve the exact conversation payload.") }
        guard !(item.conversation?.turns.contains(where: \.pending) ?? false) else { throw AppError.invalid("Check or cancel the existing pending turn before approving a new one.") }
        guard try !LocalGuidance.conversationFactsChanged(facts, item.facts) else { throw AppError.invalid("The case facts changed. Review the new snapshot before sending.") }
        let reviewed = try LocalGuidance.validateConversationInput(input)
        let consent = ConversationConsent(policyVersion: config.privacy.policyVersion, approvedFields: facts.approvedFields)
        var fields = try LocalGuidance.workbookObject(reviewed) as! [String: Any]
        fields["facts"] = try LocalGuidance.workbookObject(facts)
        fields["consent"] = try LocalGuidance.workbookObject(consent)
        fields["historyTurnIds"] = historyTurnIDs
        if let replyToID { fields["replyToId"] = replyToID } else { fields["replyToId"] = NSNull() }
        let options = LocalGuidance.conversationOptions(), turnID = options["id"]!
        try update(id) { item in
            let candidate = try LocalGuidance.conversation("addConversationTurn", arguments: [(item.conversation ?? CaseConversation()).object, fields, options])
            guard try LocalGuidance.conversationContextCurrent(candidate, turnID: turnID, facts: item.facts) else { throw AppError.invalid("The selected history or facts are no longer current. Prepare a new review.") }
            item.conversation = candidate
        }
        return turnID
    }
    func sendConversation(_ id: UUID, turnID: String) async throws {
        guard workspaceActive, user != nil, let item = item(id), let state = item.conversation,
              let turn = state.turns.first(where: { $0.id == turnID }), turn.pending, let consent = turn.consent else { throw AppError.invalid("This reviewed turn is no longer available to send.") }
        let run = generation; let owner = scope; let service = api
        let response: ConversationRemoteJob
        if let job = turn.jobID { response = try await service.conversationJob(job) }
        else {
            do { response = try await service.conversationByOperation(turnID) }
            catch let failure as HTTPFailure where failure.status == 404 {
                guard generation == run, scope == owner, workspaceActive, self.item(id)?.facts == turn.facts else { throw CancellationError() }
                guard canAnalyze, config?.privacy.policyVersion == consent.policyVersion else { throw AppError.invalid("The service or privacy policy changed. Cancel this unresolved turn and review a new one; approval is not renewed automatically.") }
                guard let current = self.item(id)?.conversation, try LocalGuidance.conversationContextCurrent(current, turnID: turnID, facts: turn.facts) else { throw AppError.invalid("The reviewed history is no longer current. Cancel this turn and prepare a new review.") }
                response = try await service.createConversation(facts: turn.facts, conversation: turn.input, operationID: turnID, consent: consent)
            }
        }
        guard generation == run, scope == owner, workspaceActive, !Task.isCancelled, self.item(id)?.facts == turn.facts else {
            // Never put a late response into a new actor, changed case or background view.
            // Retain the local turn for a read-only operation lookup after unlock.
            return
        }
        try applyConversationJob(id, turnID: turnID, response: response)
        if self.item(id)?.conversation?.turns.first(where: { $0.id == turnID })?.pending == true { pollConversation(id, turnID: turnID) }
    }
    func cancelConversation(_ id: UUID, turnID: String) async throws {
        guard let turn = item(id)?.conversation?.turns.first(where: { $0.id == turnID }) else { return }
        let run = generation; let owner = scope; let service = api
        // Tombstones an unknown operation too, so a late POST cannot create new work.
        try await service.deleteConversationOperation(turnID)
        guard generation == run, scope == owner else { throw CancellationError() }
        conversationPolling[turnID]?.cancel(); conversationPolling[turnID] = nil
        if turn.pending { try update(id) { item in
            guard let state = item.conversation, state.turns.first(where: { $0.id == turnID })?.pending == true else { return }
            item.conversation = try LocalGuidance.conversation("appendConversationEvent", arguments: [state.object, turnID, ["kind": "canceled"], LocalGuidance.conversationOptions()])
        } }
    }
    private func applyConversationJob(_ id: UUID, turnID: String, response: ConversationRemoteJob) throws {
        guard workspaceActive, let item = item(id), let turn = item.conversation?.turns.first(where: { $0.id == turnID }), turn.pending,
              try !LocalGuidance.conversationFactsChanged(turn.facts, item.facts) else { return }
        try update(id) { item in
            var state = item.conversation!
            if let job = turn.jobID { guard job == response.job.id else { throw AppError.service("The conversation job did not match this reviewed turn.") } }
            else { state = try LocalGuidance.conversation("appendConversationEvent", arguments: [state.object, turnID, ["kind": "job", "jobId": response.job.id], LocalGuidance.conversationOptions()]) }
            if response.job.status == "succeeded" {
                guard let result = response.job.result, result.kind == "conversation", result.engine == "openai", result.provenance.provider == "openai", !result.provenance.responseStorageRequested,
                      try LocalGuidance.conversationSourcesCurrent(result.knowledgeReceipt) else { throw AppError.service("The reply's source review could not be validated. It has not been added as usable guidance.") }
                let completed: [String: Any] = ["kind": "completed", "answer": result.answer, "answerKind": "cloud", "sourceIds": result.sourceIds, "followUpQuestions": result.followUpQuestions, "nextSteps": try LocalGuidance.workbookObject(result.nextSteps), "limitations": result.limitations, "sourceReceipt": try LocalGuidance.workbookObject(result.knowledgeReceipt)]
                state = try LocalGuidance.conversation("appendConversationEvent", arguments: [state.object, turnID, completed, LocalGuidance.conversationOptions()])
            } else if ["failed", "expired", "canceled"].contains(response.job.status) {
                let rawCode = response.job.error?.code ?? "CONVERSATION_FAILED"
                let code = rawCode.range(of: "^[A-Z][A-Z0-9_]{0,79}$", options: .regularExpression) != nil ? rawCode : "CONVERSATION_FAILED"
                let fields: [String: Any] = response.job.status == "canceled" ? ["kind": "canceled"] : ["kind": "failed", "errorCode": code]
                state = try LocalGuidance.conversation("appendConversationEvent", arguments: [state.object, turnID, fields, LocalGuidance.conversationOptions()])
            }
            item.conversation = state
        }
    }
    private func pollConversation(_ id: UUID, turnID: String) {
        conversationPolling[turnID]?.cancel()
        let run = generation; let owner = scope; let service = api
        conversationPolling[turnID] = Task {
            for attempt in 0..<60 {
                do {
                    try Task.checkCancellation()
                    guard generation == run, scope == owner, workspaceActive, let item = self.item(id), let turn = item.conversation?.turns.first(where: { $0.id == turnID }), turn.pending, let job = turn.jobID else { return }
                    let response = try await service.conversationJob(job)
                    guard generation == run, scope == owner, workspaceActive, !Task.isCancelled else { return }
                    try applyConversationJob(id, turnID: turnID, response: response)
                    if self.item(id)?.conversation?.turns.first(where: { $0.id == turnID })?.pending != true { return }
                    try await Task.sleep(for: .seconds(min(2 + attempt / 8, 8)))
                } catch is CancellationError { return }
                catch { if generation == run, workspaceActive { notice = "Conversation status could not be confirmed. Open the turn to check the same operation; no new question was sent." }; return }
            }
            if generation == run, workspaceActive { notice = "The conversation is taking longer than expected. Check its existing operation from the case." }
        }
    }
    func remind(_ id: UUID, at date: Date) async throws {
        guard let item = item(id), item.saveMode == .device else { throw AppError.invalid("Keep this case on your iPhone before scheduling a reminder.") }
        guard date > Date() else { throw AppError.invalid("Choose a future reminder time.") }
        let center = UNUserNotificationCenter.current()
        let run = generation
        let notificationsAllowed = (try? await center.requestAuthorization(options: [.alert, .sound])) ?? false
        guard generation == run, self.item(id) != nil else { throw CancellationError() }
        // The member's chosen date is the source of truth. A denied or failed OS
        // notification must not silently discard the in-app follow-up.
        try update(id) { $0.followUp = date }
        center.removePendingNotificationRequests(withIdentifiers: [id.uuidString])
        guard notificationsAllowed else {
            notice = "Follow-up saved on this iPhone. Notifications are off, so open GoldRock to see it."
            return
        }
        let content = UNMutableNotificationContent(); content.title = "Your GoldRock follow-up"; content.body = "Open your private workspace when you are ready."; content.sound = .default
        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        let request = UNNotificationRequest(identifier: id.uuidString, content: content, trigger: UNCalendarNotificationTrigger(dateMatching: components, repeats: false))
        do { try await center.add(request) }
        catch {
            notice = "Follow-up saved on this iPhone. A notification could not be scheduled; open GoldRock to see it."
            return
        }
        guard generation == run, self.item(id) != nil else {
            center.removePendingNotificationRequests(withIdentifiers: [id.uuidString])
            throw CancellationError()
        }
    }

    /// Remove the local date first; only then cancel its generic device notification.
    /// A failed protected-vault write leaves both the date and notification intact.
    func clearFollowUp(_ id: UUID) throws {
        try update(id) { $0.followUp = nil }
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [id.uuidString])
    }
}

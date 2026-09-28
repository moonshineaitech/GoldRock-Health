import Foundation
import JavaScriptCore
import CoreTransferable
import UniformTypeIdentifiers

struct PolicySource: Decodable, Identifiable {
    var id: String; var title: String; var url: String; var publisher: String
    var applicability: String; var summary: String; var reviewedAt: String; var expiresAt: String
}
struct PublicPlaybook: Decodable, Identifiable {
    var id: String; var title: String; var summary: String; var applicability: String
    var steps: [String]; var draft: String; var sourceIds: [String]; var limitations: [String]
    var reviewedAt: String; var expiresAt: String; var current: Bool
}
enum CountermeasureResponse: String, CaseIterable, Identifiable {
    case prepare, no_reply, more_info, denied
    var id: String { rawValue }
    var title: String {
        switch self {
        case .prepare: "Prepare my first request"
        case .no_reply: "I have not had a reply"
        case .more_info: "They need more information"
        case .denied: "They said no"
        }
    }
}
struct CountermeasureMove: Decodable {
    var title: String; var steps: [String]; var draft: String
}
struct CountermeasureQuestion: Decodable {
    var statementToCheck: String; var response: String; var evidence: [String]
}
struct CountermeasureRoute: Decodable, Identifiable {
    var id: String; var title: String; var category: String; var summary: String
    var pattern: String; var appliesWhen: String; var verify: [String]
    var firstMove: CountermeasureMove; var responses: [String: CountermeasureMove]
    var watchouts: [String]; var sourceIds: [String]; var matchReasons: [String]?
    var reviewedAt: String; var expiresAt: String; var current: Bool
    var evidence: [String]?; var counterQuestions: [CountermeasureQuestion]?
    var taskIds: [String]?; var sourceCoverage: String?; var recommendationMode: String?
    func move(_ response: CountermeasureResponse) -> CountermeasureMove? { response == .prepare ? firstMove : responses[response.rawValue] }
    func isActionable(at now: Date = Date()) -> Bool {
        let formatter = ISO8601DateFormatter(); formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        guard let reviewed = formatter.date(from: reviewedAt), let expiry = formatter.date(from: expiresAt) else { return false }
        return current && reviewed <= now && now < expiry
    }
}
/// Rechecks source freshness when the share system actually requests the bytes.
struct ReviewedDraftExport: Transferable {
    var text: String; var sourceIds: [String]
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .plainText) { value in
            guard try LocalGuidance.sourcesAreCurrent(value.sourceIds) else { throw AppError.service("These sources need review before this template can be shared.") }
            return Data(value.text.utf8)
        }
    }
}
struct CurrentCaseExport: Transferable {
    var item: MemberCase
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .plainText) { value in
            let guidance = try LocalGuidance.analyze(value.item.facts)
            let text = "GoldRock private case summary\n\(value.item.title)\n\(Date().formatted())\n\n\(guidance.summary)\n\n" +
                guidance.findings.map { "\($0.title)\n\($0.detail)" }.joined(separator: "\n\n") +
                "\n\nHistorical actions and personal notes you recorded (not newly verified):\n" +
                value.item.events.map { "\($0.at.formatted()): \($0.kind)\n\($0.note)" }.joined(separator: "\n\n") +
                "\n\nLocal checks were regenerated for this export. This does not submit a request, confirm a hold or verify savings."
            return Data(text.utf8)
        }
    }
}

/// JavaScriptCore runs ONLY the bundled, audited, pure deterministic domain rules.
/// No remote script loading, filesystem, network API or original document bytes are exposed.
/// The local question-preparation helper receives transient user text for privacy checks.
/// This keeps the same calculations and source-expiry gates on native and web.
enum LocalGuidance {
    static func advocacyCatalog(now: Date = Date()) throws -> AdvocacyCatalog {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockTaskCatalog")?.call(withArguments: [ISO8601DateFormatter().string(from: now)])?.toString(), context.exception == nil else { throw AppError.service("The local workflow library could not be loaded. Your case records are unchanged.") }
        return try JSONDecoder().decode(AdvocacyCatalog.self, from: Data(json.utf8))
    }
    static func advocacyTask(_ id: String, now: Date = Date()) throws -> AdvocacyTask {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockTaskItem")?.call(withArguments: [id, ISO8601DateFormatter().string(from: now)])?.toString(), context.exception == nil, json != "null" else { throw AppError.service("This workflow could not be loaded. Return to Tools and choose it again.") }
        return try JSONDecoder().decode(AdvocacyTask.self, from: Data(json.utf8))
    }
    static func taskIntakeJSON(_ action: String, arguments: [Any]) throws -> Data {
        let context = try context()
        let input = String(decoding: try JSONSerialization.data(withJSONObject: arguments), as: UTF8.self)
        guard let json = context.objectForKeyedSubscript("goldrockTaskIntake")?.call(withArguments: [action, input])?.toString(), context.exception == nil else {
            throw AppError.invalid(context.exception?.objectForKeyedSubscript("message")?.toString() ?? "Review the local task fields. Existing notes were kept unchanged.")
        }
        return Data(json.utf8)
    }
    static func createTaskIntake(_ id: String, values: [String: TaskIntakeValue], now: Date = Date()) throws -> TaskIntake {
        try JSONDecoder().decode(TaskIntake.self, from: taskIntakeJSON("createTaskIntake", arguments: [id, values.mapValues(\.object), ["now": ISO8601DateFormatter().string(from: now)]]))
    }
    private static func context() throws -> JSContext {
        guard let url = Bundle.main.url(forResource: "Rules.bundle", withExtension: "js"),
              let context = JSContext() else { throw AppError.service("The bundled guidance rules are missing. Reinstall the app.") }
        context.evaluateScript(try String(contentsOf: url, encoding: .utf8))
        guard context.exception == nil else { throw AppError.service("The local guidance engine could not start.") }
        return context
    }
    static func analyze(_ facts: PublicFacts, now: Date = Date()) throws -> Guidance {
        let context = try context()
        let args = [try facts.jsonString(), ISO8601DateFormatter().string(from: now)]
        guard let json = context.objectForKeyedSubscript("goldrockAnalyze")?.call(withArguments: args)?.toString(), context.exception == nil else { throw AppError.service("The reviewed facts could not be checked. Review the fields and try again.") }
        var result = try JSONDecoder().decode(Guidance.self, from: Data(json.utf8))
        result.knowledgeReceipt = try sources().filter { result.sourceIds.contains($0.id) }.map { KnowledgeReview(id: $0.id, reviewedAt: $0.reviewedAt, expiresAt: $0.expiresAt) }
        return result
    }
    static func sources() throws -> [PolicySource] {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockSources")?.call(withArguments: [])?.toString(), context.exception == nil else { throw AppError.service("Source information is unavailable.") }
        return try JSONDecoder().decode([PolicySource].self, from: Data(json.utf8))
    }
    static func sourcesAreCurrent(_ ids: [String], now: Date = Date()) throws -> Bool {
        let registry = try sources()
        let formatter = ISO8601DateFormatter(); formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return ids.allSatisfy { id in
            guard let source = registry.first(where: { $0.id == id }), let reviewed = formatter.date(from: source.reviewedAt), let expiry = formatter.date(from: source.expiresAt) else { return false }
            return reviewed <= now && now < expiry
        }
    }
    /// Stored results are a receipt, not a perpetual policy verdict. Rebuild canonical
    /// advice for display and admit old AI wording only while its evidence still matches.
    static func display(for item: MemberCase, now: Date = Date()) throws -> Guidance {
        var canonical = try analyze(item.facts, now: now)
        guard let saved = item.guidance, let assistance = saved.aiAssistance,
              try hasCurrentKnowledge(saved, now: now),
              saved.findings == canonical.findings, saved.actions == canonical.actions,
              saved.questions == canonical.questions, Set(saved.sourceIds) == Set(canonical.sourceIds) else { return canonical }
        do { try validate(saved, facts: item.facts) } catch { return canonical }
        canonical.aiAssistance = assistance; canonical.engine = "openai"
        return canonical
    }
    static func hasCurrentKnowledge(_ guidance: Guidance, now: Date = Date()) throws -> Bool {
        guard try sourcesAreCurrent(guidance.sourceIds, now: now) else { return false }
        let registry = try sources(), receipts = guidance.knowledgeReceipt ?? guidance.provenance?.sourceReviews ?? []
        return guidance.sourceIds.allSatisfy { id in
            guard let source = registry.first(where: { $0.id == id }), let receipt = receipts.first(where: { $0.id == id }) else { return false }
            return source.reviewedAt == receipt.reviewedAt && source.expiresAt == receipt.expiresAt
        }
    }
    static func playbooks(now: Date = Date()) throws -> [PublicPlaybook] {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockPlaybooks")?.call(withArguments: [ISO8601DateFormatter().string(from: now)])?.toString(), context.exception == nil else { throw AppError.service("Public playbooks are unavailable.") }
        return try JSONDecoder().decode([PublicPlaybook].self, from: Data(json.utf8))
    }
    static func countermeasures(now: Date = Date()) throws -> [CountermeasureRoute] {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockCountermeasures")?.call(withArguments: [ISO8601DateFormatter().string(from: now)])?.toString(), context.exception == nil else { throw AppError.service("The researched routes could not be loaded. Their sources remain available in the playbook.") }
        return try JSONDecoder().decode([CountermeasureRoute].self, from: Data(json.utf8))
    }
    static func recommendations(for facts: PublicFacts, now: Date = Date()) throws -> [CountermeasureRoute] {
        let context = try context()
        let args = [try facts.jsonString(), ISO8601DateFormatter().string(from: now)]
        guard let json = context.objectForKeyedSubscript("goldrockRecommendations")?.call(withArguments: args)?.toString(), context.exception == nil else { throw AppError.service("The facts could not be matched to a researched route. Review the facts or browse the playbook.") }
        return try JSONDecoder().decode([CountermeasureRoute].self, from: Data(json.utf8))
    }
    static func validate(_ guidance: Guidance, facts: PublicFacts) throws {
        let knownSources = Set(try sources().map(\.id))
        let evidence = Set(facts.approvedFields + facts.lines.map(\.id))
        guard guidance.version == 1, ["rules", "openai"].contains(guidance.engine),
              guidance.sourceIds.allSatisfy(knownSources.contains),
              guidance.findings.allSatisfy({ $0.sourceIds.allSatisfy(knownSources.contains) && $0.evidenceIds.allSatisfy(evidence.contains) }),
              guidance.actions.allSatisfy({ $0.sourceIds.allSatisfy(knownSources.contains) }) else { throw AppError.service("The guidance included evidence that could not be verified. Your local checks are still available.") }
        if let assistance = guidance.aiAssistance {
            let findingIDs = Set(guidance.findings.map(\.id)), actionIDs = Set(guidance.actions.map(\.id))
            guard assistance.findings.allSatisfy({ findingIDs.contains($0.id) }), assistance.actions.allSatisfy({ actionIDs.contains($0.id) }) else { throw AppError.service("AI wording referred to an unknown finding or action.") }
        }
    }
    static func reconciliationJSON(_ action: String, arguments: [Any]) throws -> Data {
        let context = try context()
        let input = String(decoding: try JSONSerialization.data(withJSONObject: arguments), as: UTF8.self)
        guard let json = context.objectForKeyedSubscript("goldrockReconciliation")?.call(withArguments: [action, input])?.toString(), context.exception == nil else {
            let message = context.exception?.objectForKeyedSubscript("message")?.toString()
            throw AppError.invalid(message ?? "The local reconciliation could not be checked. Existing records are unchanged.")
        }
        return Data(json.utf8)
    }
    static func reconciliationIntake(_ facts: PublicFacts) throws -> ReconciliationIntakeProposal {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockReconciliationIntake")?.call(withArguments: [try facts.jsonString()])?.toString(), context.exception == nil else {
            throw AppError.invalid("These extracted fields could not be prepared. Enter the document's figures manually; existing records are unchanged.")
        }
        return try JSONDecoder().decode(ReconciliationIntakeProposal.self, from: Data(json.utf8))
    }
    static func moneyRecoveryGuide(_ kind: String, now: Date = Date()) throws -> MoneyRecoveryGuide {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockMoneyRecoveryGuide")?.call(withArguments: [kind, ISO8601DateFormatter().string(from: now)])?.toString(), context.exception == nil else { throw AppError.service("This preparation guide could not be loaded. Your existing local records are unchanged.") }
        return try JSONDecoder().decode(MoneyRecoveryGuide.self, from: Data(json.utf8))
    }
    static func conversationCandidate(_ text: String) throws -> ConversationCandidate {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockConversationCandidate")?.call(withArguments: [text])?.toString(), context.exception == nil else { throw AppError.invalid("The local privacy check could not prepare this question. Shorten it and remove identifying details before trying again.") }
        return try JSONDecoder().decode(ConversationCandidate.self, from: Data(json.utf8))
    }
    static func validateConversationInput(_ input: ConversationInput) throws -> ConversationInput {
        let context = try context()
        let text = String(decoding: try JSONEncoder().encode(input), as: UTF8.self)
        guard let json = context.objectForKeyedSubscript("goldrockConversationRequest")?.call(withArguments: [text])?.toString(), context.exception == nil else { throw AppError.invalid("Review the exact question and history. Remove identifiers and keep within the conversation limits; nothing was sent.") }
        return try JSONDecoder().decode(ConversationInput.self, from: Data(json.utf8))
    }
    static func conversationJSON(_ action: String, arguments: [Any]) throws -> Data {
        let context = try context()
        let input = String(decoding: try JSONSerialization.data(withJSONObject: arguments), as: UTF8.self)
        guard let json = context.objectForKeyedSubscript("goldrockConversation")?.call(withArguments: [action, input])?.toString(), context.exception == nil else {
            let message = context.exception?.objectForKeyedSubscript("message")?.toString()
            throw AppError.invalid(message ?? "The local conversation could not be checked. Existing history is unchanged.")
        }
        return Data(json.utf8)
    }
    static func conversation(_ action: String, arguments: [Any]) throws -> CaseConversation {
        try JSONDecoder().decode(CaseConversation.self, from: conversationJSON(action, arguments: arguments))
    }
    static func conversationSummary(_ state: CaseConversation, facts: PublicFacts, now: Date = Date()) throws -> ConversationSummary {
        let options: [String: Any] = ["facts": try workbookObject(facts), "now": ISO8601DateFormatter().string(from: now)]
        return try JSONDecoder().decode(ConversationSummary.self, from: conversationJSON("summarizeConversation", arguments: [state.object, options]))
    }
    static func conversationFactsChanged(_ snapshot: PublicFacts, _ current: PublicFacts) throws -> Bool {
        try JSONDecoder().decode(Bool.self, from: conversationJSON("conversationFactsChanged", arguments: [try workbookObject(snapshot), try workbookObject(current)]))
    }
    static func conversationSourcesCurrent(_ receipts: [KnowledgeReview], now: Date = Date()) throws -> Bool {
        try JSONDecoder().decode(Bool.self, from: conversationJSON("conversationSourcesCurrent", arguments: [try workbookObject(receipts), ["now": ISO8601DateFormatter().string(from: now)]]))
    }
    static func conversationContextCurrent(_ state: CaseConversation, turnID: String, facts: PublicFacts, now: Date = Date()) throws -> Bool {
        try JSONDecoder().decode(Bool.self, from: conversationJSON("conversationTurnContextCurrent", arguments: [state.object, turnID, ["facts": try workbookObject(facts), "now": ISO8601DateFormatter().string(from: now)]]))
    }
    static func conversationOptions() -> [String: String] {
        let formatter = ISO8601DateFormatter(); formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return ["id": "cv_" + UUID().uuidString, "now": formatter.string(from: Date())]
    }
    static func moneyRecoveryJSON(_ action: String, arguments: [Any]) throws -> Data {
        let context = try context()
        let input = String(decoding: try JSONSerialization.data(withJSONObject: arguments), as: UTF8.self)
        guard let json = context.objectForKeyedSubscript("goldrockMoneyRecovery")?.call(withArguments: [action, input])?.toString(), context.exception == nil else {
            let message = context.exception?.objectForKeyedSubscript("message")?.toString()
            throw AppError.invalid(message ?? "The local request could not be checked. Existing history is unchanged.")
        }
        return Data(json.utf8)
    }
    static func moneyRecovery(_ action: String, arguments: [Any]) throws -> CaseMoneyRecovery {
        try JSONDecoder().decode(CaseMoneyRecovery.self, from: moneyRecoveryJSON(action, arguments: arguments))
    }
    static func moneyRecoverySummary(_ state: CaseMoneyRecovery) throws -> MoneyRecoverySummary {
        try JSONDecoder().decode(MoneyRecoverySummary.self, from: moneyRecoveryJSON("summarizeMoneyRecovery", arguments: [state.object]))
    }
    static func moneyRecoveryOptions() -> [String: String] {
        let formatter = ISO8601DateFormatter(); formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return ["id": "mr_" + UUID().uuidString, "now": formatter.string(from: Date())]
    }
    static func reconciliation(_ action: String, arguments: [Any]) throws -> CaseReconciliation {
        try JSONDecoder().decode(CaseReconciliation.self, from: reconciliationJSON(action, arguments: arguments))
    }
    static func reconciliationSummary(_ state: CaseReconciliation) throws -> ReconciliationSummary {
        try JSONDecoder().decode(ReconciliationSummary.self, from: reconciliationJSON("summarizeReconciliation", arguments: [state.object]))
    }
    static func reconciliationOptions() -> [String: String] {
        let formatter = ISO8601DateFormatter(); formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return ["id": "rc_" + UUID().uuidString, "now": formatter.string(from: Date())]
    }
    static func workbook(_ action: String, arguments: [Any]) throws -> CaseWorkbook {
        let context = try context()
        let data = try JSONSerialization.data(withJSONObject: arguments)
        guard let input = String(data: data, encoding: .utf8),
              let json = context.objectForKeyedSubscript("goldrockWorkbook")?.call(withArguments: [action, input])?.toString(), context.exception == nil else {
            let message = context.exception?.objectForKeyedSubscript("message")?.toString()
            throw AppError.invalid(message ?? "The local workbook change could not be checked. Your existing records are unchanged.")
        }
        return try JSONDecoder().decode(CaseWorkbook.self, from: Data(json.utf8))
    }
    static func workbookObject<T: Encodable>(_ value: T) throws -> Any { try JSONSerialization.jsonObject(with: JSONEncoder().encode(value)) }
    static func workbookOptions() -> [String: String] {
        let formatter = ISO8601DateFormatter(); formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return ["id": "wb_" + UUID().uuidString, "now": formatter.string(from: Date())]
    }
    static func knowledge(_ query: String, facts: PublicFacts? = nil, now: Date = Date()) throws -> [KnowledgeAnswer] {
        let context = try context()
        let args = [String(query.prefix(400)), try facts?.jsonString() ?? "", ISO8601DateFormatter().string(from: now)]
        guard let json = context.objectForKeyedSubscript("goldrockKnowledge")?.call(withArguments: args)?.toString(), context.exception == nil else { throw AppError.service("The local knowledge library could not be searched.") }
        return try JSONDecoder().decode([KnowledgeAnswer].self, from: Data(json.utf8))
    }
    static func knowledgeItem(_ id: String, now: Date = Date()) throws -> KnowledgeAnswer? {
        let context = try context()
        guard let json = context.objectForKeyedSubscript("goldrockKnowledgeItem")?.call(withArguments: [id, ISO8601DateFormatter().string(from: now)])?.toString(), context.exception == nil else { throw AppError.service("This answer could not be refreshed from the local library.") }
        return try JSONDecoder().decode(KnowledgeAnswer?.self, from: Data(json.utf8))
    }
}

import XCTest
import CoreGraphics
@testable import GoldRock

final class GoldRockTests: XCTestCase {
    func testDocumentSignaturesMustMatchExtensions() throws {
        let pdf = Data("%PDF-1.7\n".utf8)
        let jpeg = Data([0xFF, 0xD8, 0xFF, 0xE0])
        let png = Data([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
        let heic = Data([0, 0, 0, 24] + Array("ftypmif1".utf8) + [0, 0, 0, 0] + Array("heicmif1".utf8))
        XCTAssertEqual(try DocumentIntake.fileFormat(extension: "PDF", data: pdf), .pdf)
        XCTAssertEqual(try DocumentIntake.fileFormat(extension: "jpeg", data: jpeg), .jpeg)
        XCTAssertEqual(try DocumentIntake.fileFormat(extension: "png", data: png), .png)
        XCTAssertEqual(try DocumentIntake.fileFormat(extension: "heic", data: heic), .heif)
        XCTAssertThrowsError(try DocumentIntake.fileFormat(extension: "png", data: pdf))
        XCTAssertThrowsError(try DocumentIntake.fileFormat(extension: "pdf", data: jpeg))
        XCTAssertThrowsError(try DocumentIntake.fileFormat(extension: "txt", data: pdf))
        XCTAssertThrowsError(try DocumentIntake.fileFormat(extension: "heic", data: Data([0, 0, 0, 20] + Array("ftypavif".utf8) + [0, 0, 0, 0] + Array("avif".utf8))))
    }

    func testImporterRejectsRenamedPDFBeforeOCR() async throws {
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString + ".png")
        try Data("%PDF-1.7\nsynthetic test only".utf8).write(to: url)
        defer { try? FileManager.default.removeItem(at: url) }
        do {
            _ = try await DocumentIntake.importFile(url)
            XCTFail("A PDF renamed as an image must not enter either decoder")
        } catch {
            XCTAssertTrue(error.localizedDescription.contains("file type does not match"))
        }
    }

    func testImportedImageDimensionsAndFrameCountAreBoundedBeforeDecode() throws {
        XCTAssertNoThrow(try DocumentIntake.validateImageDimensions(width: 4_000, height: 3_000, frames: 1))
        XCTAssertThrowsError(try DocumentIntake.validateImageDimensions(width: 9_000, height: 9_000, frames: 1))
        XCTAssertThrowsError(try DocumentIntake.validateImageDimensions(width: 20_001, height: 1, frames: 1))
        XCTAssertThrowsError(try DocumentIntake.validateImageDimensions(width: 1_000, height: 1_000, frames: 2))
        XCTAssertThrowsError(try DocumentIntake.validateImageDimensions(width: 0, height: 1_000, frames: 1))
    }

    func testPDFRenderPlanBoundsAbnormalPagesAndPixels() throws {
        let plan = try DocumentIntake.pdfRenderPlan(for: CGRect(x: 0, y: 0, width: 612, height: 792))
        XCTAssertGreaterThan(plan.size.width, 0)
        XCTAssertLessThanOrEqual(plan.size.width * plan.size.height, CGFloat(DocumentIntake.maximumRenderPixels))
        XCTAssertLessThanOrEqual(max(plan.size.width, plan.size.height), 2_200)
        XCTAssertThrowsError(try DocumentIntake.pdfRenderPlan(for: CGRect(x: 0, y: 0, width: 100_000, height: 792)))
        XCTAssertThrowsError(try DocumentIntake.pdfRenderPlan(for: CGRect(x: 0, y: 0, width: 0.01, height: 792)))
        XCTAssertThrowsError(try DocumentIntake.pdfRenderPlan(for: CGRect(x: 2_000_000, y: 0, width: 612, height: 792)))
        XCTAssertThrowsError(try DocumentIntake.pdfRenderPlan(for: CGRect(x: 0, y: 0, width: CGFloat.infinity, height: 792)))
    }

    func testNewCountermeasureRoutesAreBundledWithSourceExpiry() throws {
        let current = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-28T12:00:00Z"))
        let expired = try XCTUnwrap(ISO8601DateFormatter().date(from: "2027-01-01T12:00:00Z"))
        for id in ["medicaid-care-before-application", "hipaa-existing-billing-records", "collector-stop-contact-versus-dispute"] {
            let answer = try XCTUnwrap(LocalGuidance.knowledgeItem(id, now: current), id)
            XCTAssertTrue(answer.current, id)
            XCTAssertFalse(answer.actions.isEmpty, id)
            XCTAssertFalse(answer.sourceIds.isEmpty, id)
            let stale = try XCTUnwrap(LocalGuidance.knowledgeItem(id, now: expired), id)
            XCTAssertFalse(stale.current, id)
            XCTAssertTrue(stale.actions.isEmpty, id)
        }
    }

    private func conversationFixture() throws -> (CaseConversation, PublicFacts) {
        var facts = PublicFacts(); facts.documentType = .eob; facts.coverage = .private; facts.balanceCents = 10000
        let consent = ConversationConsent(policyVersion: "2026-09-27-v2", approvedFields: facts.approvedFields)
        let fields: [String: Any] = ["question": "What should I compare before asking the provider about the balance?", "history": [], "knowledgeIds": [], "facts": try LocalGuidance.workbookObject(facts), "consent": try LocalGuidance.workbookObject(consent)]
        var state = try LocalGuidance.conversation("addConversationTurn", arguments: [CaseConversation().object, fields, ["id": "cv_native_turn0001", "now": "2026-09-27T20:00:00.000Z"]])
        state = try LocalGuidance.conversation("appendConversationEvent", arguments: [state.object, "cv_native_turn0001", ["kind": "job", "jobId": "job_" + String(repeating: "a", count: 32)], ["id": "cv_native_event001", "now": "2026-09-27T20:00:00.000Z"]])
        let source = try XCTUnwrap(LocalGuidance.sources().first { $0.id == "cms-eob" })
        let completed: [String: Any] = ["kind": "completed", "answer": "Compare the matching EOB and bill.", "answerKind": "cloud", "sourceIds": [source.id], "sourceReceipt": [["id": source.id, "reviewedAt": source.reviewedAt, "expiresAt": source.expiresAt]], "followUpQuestions": ["Has the claim been processed?"], "nextSteps": [], "limitations": ["Check this reply against your records."]]
        state = try LocalGuidance.conversation("appendConversationEvent", arguments: [state.object, "cv_native_turn0001", completed, ["id": "cv_native_event002", "now": "2026-09-27T20:00:00.000Z"]])
        return (state, facts)
    }
    func testConversationTypedRoundTripPreservesApprovalAndGatesStaleAnswers() throws {
        let (state, facts) = try conversationFixture()
        let decoded = try JSONDecoder().decode(CaseConversation.self, from: JSONEncoder().encode(state))
        XCTAssertEqual(decoded, state); XCTAssertEqual(decoded.turns[0].consent?.approvedFields, facts.approvedFields)
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T20:00:00Z"))
        let current = try XCTUnwrap(LocalGuidance.conversationSummary(decoded, facts: facts, now: now).turns.first)
        XCTAssertTrue(current.answerAvailable); XCTAssertTrue(current.canUseAsContext); XCTAssertEqual(current.status, "completed")
        let stale = try XCTUnwrap(LocalGuidance.conversationSummary(decoded, facts: facts, now: now.addingTimeInterval(100 * 86400)).turns.first)
        XCTAssertNil(stale.answer); XCTAssertTrue(stale.followUpQuestions.isEmpty); XCTAssertFalse(stale.canUseAsContext)
        var changed = facts; changed.balanceCents = nil
        XCTAssertNil(try LocalGuidance.conversationSummary(decoded, facts: changed, now: now).turns.first?.answer)
        XCTAssertEqual(decoded.turns[0].events.last?.answer, "Compare the matching EOB and bill.")
        XCTAssertThrowsError(try LocalGuidance.conversation("appendConversationEvent", arguments: [decoded.object, decoded.turns[0].id, ["kind": "canceled"], LocalGuidance.conversationOptions()]))
    }
    func testConversationCandidateIsNotPermissionAndKnownIdentifiersFailReview() throws {
        let prepared = try LocalGuidance.conversationCandidate("Email synthetic@example.test about this balance.")
        XCTAssertTrue(prepared.requiresReview); XCTAssertFalse(prepared.candidate.contains("synthetic@example.test"))
        let pasted = "Patient name: Synthetic Person\nAccount number: 12345678\nDate of service: 2026-09-01\nAmount due: $450.00"
        let blocked = try LocalGuidance.conversationCandidate(pasted)
        XCTAssertTrue(blocked.flags.contains("document_like_text")); XCTAssertTrue(blocked.candidate.isEmpty)
        XCTAssertThrowsError(try LocalGuidance.validateConversationInput(.init(question: pasted, history: [], knowledgeIds: [])))
        XCTAssertThrowsError(try LocalGuidance.validateConversationInput(.init(question: "Email synthetic@example.test", history: [], knowledgeIds: [])))
        XCTAssertThrowsError(try LocalGuidance.validateConversationInput(.init(question: "What next?", history: [.init(question: "Earlier question", answer: "Call 312-555-0100")], knowledgeIds: [])))
    }
    @MainActor func testConversationMalformedSaveRollsBackAndMissingOldFieldLoads() throws {
        let (conversation, facts) = try conversationFixture()
        let store = AppStore(); store.startSessionOnly()
        let id = try store.createCase(title: "Synthetic private case", facts: facts, mode: .session)
        try store.update(id) { $0.conversation = conversation }
        let before = try XCTUnwrap(store.item(id))
        XCTAssertThrowsError(try store.update(id) { item in
            item.title = "Must not replace original"
            item.conversation = try LocalGuidance.conversation("validateConversation", arguments: [NSNull()])
        })
        XCTAssertEqual(store.item(id), before)
        var object = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(before)) as? [String: Any])
        object.removeValue(forKey: "conversation")
        XCTAssertNil(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)).conversation)
        let invalidConversationValues: [Any] = [NSNull(), ["version": 2, "turns": []] as [String: Any], ["version": 1, "turns": [], "rawQuestion": "PRIVATE"] as [String: Any]]
        for invalid in invalidConversationValues {
            object["conversation"] = invalid
            XCTAssertThrowsError(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)))
        }
    }
    @MainActor func testConversationExactAPIEnvelopeAndOperationCancellation() async throws {
        CapturedRequestProtocol.clear()
        let client = APIClient(baseURL: URL(string: "https://native-test.invalid")!, protocolClasses: [CapturedRequestProtocol.self])
        let facts = PublicFacts(), input = ConversationInput(question: "How should I ask for an itemized bill?", history: [], knowledgeIds: [])
        let consent = ConversationConsent(policyVersion: "2026-09-27-v2", approvedFields: facts.approvedFields)
        let operation = "cv_native_operation001"
        _ = try await client.createConversation(facts: facts, conversation: input, operationID: operation, consent: consent)
        _ = try await client.conversationByOperation(operation)
        _ = try await client.conversationJob("job_" + String(repeating: "a", count: 32))
        try await client.deleteConversationOperation(operation)
        let requests = CapturedRequestProtocol.recorded(); XCTAssertEqual(requests.count, 4)
        let post = try XCTUnwrap(requests.first), body = try XCTUnwrap(CapturedRequestProtocol.body(of: post))
        let object = try XCTUnwrap(JSONSerialization.jsonObject(with: body) as? [String: Any])
        XCTAssertEqual(Set(object.keys), Set(["clientOperationId", "facts", "conversation", "consent"]))
        let text = try XCTUnwrap(object["conversation"] as? [String: Any])
        XCTAssertEqual(Set(text.keys), Set(["question", "history", "knowledgeIds"]))
        XCTAssertEqual(text["question"] as? String, input.question)
        XCTAssertEqual(post.value(forHTTPHeaderField: "Idempotency-Key"), operation)
        XCTAssertEqual(requests[1].httpMethod, "GET"); XCTAssertTrue(requests[1].url!.path.hasSuffix("by-operation/" + operation))
        XCTAssertEqual(requests[3].httpMethod, "DELETE"); XCTAssertEqual(CapturedRequestProtocol.body(of: requests[3]), Data("{}".utf8))
        XCTAssertFalse(String(decoding: body, as: UTF8.self).contains("historyTurnIds"))
        do { _ = try await client.createConversation(facts: facts, conversation: .init(question: "Email synthetic@example.test", history: [], knowledgeIds: []), operationID: "cv_native_invalid001", consent: consent); XCTFail("Must reject identifiers before networking") } catch { }
        XCTAssertEqual(CapturedRequestProtocol.recorded().count, 4)
    }
    private func moneyRecoveryFixture() throws -> CaseMoneyRecovery {
        func stamp(_ id: String) -> [String: String] { ["id": "mr_" + id, "now": "2026-09-27T20:00:00.000Z"] }
        var state = try LocalGuidance.moneyRecovery("addRecoveryRequest", arguments: [CaseMoneyRecovery().object, ["kind": "refund", "label": "Synthetic provider refund", "recipientLabel": "Billing team", "scopeLabel": "Single visit"], stamp("native_request")])
        state = try LocalGuidance.moneyRecovery("addRecoveryEvent", arguments: [state.object, "mr_native_request", ["kind": "submitted", "date": "2026-09-01", "reference": "Sent copy", "requestedCents": 10000] as [String: Any], stamp("native_submit1")])
        return try LocalGuidance.moneyRecovery("addRecoveryEvent", arguments: [state.object, "mr_native_request", ["kind": "decision", "date": "2026-09-02", "reference": "Decision copy", "decision": "approved", "payee": "member", "approvedCents": 10000] as [String: Any], stamp("native_decide1")])
    }
    func testMoneyRecoveryTypedBridgeSeparatesApprovalUnknownAndActualReceipt() throws {
        var state = try moneyRecoveryFixture()
        var summary = try XCTUnwrap(LocalGuidance.moneyRecoverySummary(state).requests.first)
        XCTAssertEqual(summary.approvedCents, 10000); XCTAssertNil(summary.receivedCents); XCTAssertNil(summary.unreceivedApprovedCents)
        state = try LocalGuidance.moneyRecovery("addRecoveryEvent", arguments: [state.object, "mr_native_request", ["kind": "receipt", "date": "2026-09-03", "reference": "Actual receipt", "payee": "member", "receivedCents": 4000] as [String: Any], ["id": "mr_native_receipt", "now": "2026-09-27T20:00:00.000Z"]])
        summary = try XCTUnwrap(LocalGuidance.moneyRecoverySummary(state).requests.first)
        XCTAssertEqual(summary.receivedCents, 4000); XCTAssertEqual(summary.unreceivedApprovedCents, 6000); XCTAssertEqual(summary.receiptStatus, "partial_recorded")
        state = try LocalGuidance.moneyRecovery("addRecoveryEvent", arguments: [state.object, "mr_native_request", ["kind": "receipt", "date": "2026-09-04", "reference": "Receipt amount to verify", "payee": "member", "receivedCents": NSNull()] as [String: Any], ["id": "mr_native_unknown", "now": "2026-09-27T20:00:00.000Z"]])
        summary = try XCTUnwrap(LocalGuidance.moneyRecoverySummary(state).requests.first)
        XCTAssertNil(summary.receivedCents); XCTAssertEqual(summary.recordedReceivedCents, 4000); XCTAssertNil(summary.unreceivedApprovedCents)
        let decoded = try JSONDecoder().decode(CaseMoneyRecovery.self, from: JSONEncoder().encode(state))
        XCTAssertEqual(decoded, state); XCTAssertNil(decoded.requests[0].events[0].preparation)
        let voided = try LocalGuidance.moneyRecovery("voidRecoveryEvent", arguments: [state.object, "mr_native_request", "mr_native_unknown", ["reason": "Incorrect extra entry"], ["id": "mr_native_void001", "now": "2026-09-27T20:00:00.000Z"]])
        XCTAssertEqual(voided.requests[0].events.last?.kind, "void"); XCTAssertNil(voided.requests[0].events.last?.date)
        XCTAssertEqual(try LocalGuidance.moneyRecoverySummary(voided).requests.first?.receivedCents, 4000)
    }
    func testOlderCaseMissingRecoveryLoadsButPresentCorruptionDoesNotResetHistory() throws {
        var item = MemberCase(); item.recovery = try moneyRecoveryFixture()
        var object = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(item)) as? [String: Any])
        object.removeValue(forKey: "recovery")
        XCTAssertNil(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)).recovery)
        let invalidValues: [Any] = [NSNull(), ["version": 2, "requests": []] as [String: Any], ["version": 1, "requests": [], "rawText": "SYNTHETIC PRIVATE"] as [String: Any]]
        for invalid in invalidValues {
            object["recovery"] = invalid
            XCTAssertThrowsError(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)))
        }
        XCTAssertFalse(try item.facts.jsonString().contains("recovery")); XCTAssertFalse(try item.facts.jsonString().contains("native_request"))
    }
    func testMoneyRecoveryGuideSourceReceiptsAndExpiry() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T20:00:00Z"))
        for kind in ["refund", "reimbursement"] {
            let guide = try LocalGuidance.moneyRecoveryGuide(kind, now: now)
            XCTAssertTrue(guide.current); XCTAssertFalse(guide.draft.isEmpty); XCTAssertFalse(guide.receipts.isEmpty)
            let old = try LocalGuidance.moneyRecoveryGuide(kind, now: now.addingTimeInterval(100 * 86400))
            XCTAssertFalse(old.current); XCTAssertTrue(old.draft.isEmpty); XCTAssertTrue(old.checklist.isEmpty)
            XCTAssertEqual(old.receipts, guide.receipts)
        }
    }
    @MainActor func testFailedRecoverySaveRetainsWholeCaseAndDoesNotUpdateOtherWorkspaces() async throws {
        let store = AppStore(); store.startSessionOnly()
        let id = try store.createCase(title: "Synthetic request case", facts: PublicFacts(), mode: .session)
        try store.update(id) { $0.recovery = try moneyRecoveryFixture(); $0.reconciliation = try reconciliationFixture() }
        let before = try XCTUnwrap(store.item(id))
        XCTAssertThrowsError(try store.update(id) { item in
            item.title = "Must not persist"
            item.recovery = try LocalGuidance.moneyRecovery("validateMoneyRecovery", arguments: [NSNull()])
        })
        XCTAssertEqual(store.item(id), before)
        try await store.remove(id); XCTAssertNil(store.item(id))
    }
    func testVisiblePDFFixtureOCRThenTypedReconciliationProposal() async throws {
        // Supplied for Xcode execution. Windows package checks do not run Vision.
        let samples: [(String, String, String?, Int?, Int?, Int?)] = [
            ("bill", "pdf", "bill", 100000, 70000, nil),
            ("bill", "png", "bill", 100000, 70000, nil),
            ("eob", "pdf", "eob", 80000, nil, nil),
            ("hidden-eob", "pdf", "eob", 80000, nil, nil),
            ("estimate", "pdf", "estimate", nil, nil, 120000),
            ("mixed", "pdf", nil, nil, nil, nil),
            ("blank", "pdf", nil, nil, nil, nil)
        ]
        for (name, ext, kind, responsibility, balance, estimate) in samples {
            let url = try XCTUnwrap(Bundle(for: Self.self).url(forResource: name, withExtension: ext, subdirectory: "ReconciliationIntakeFixtures"))
            let prepared = try await DocumentIntake.importFile(url)
            let proposal = try LocalGuidance.reconciliationIntake(prepared.facts)
            XCTAssertEqual(proposal.candidateKind, kind, name)
            XCTAssertEqual(proposal.draft.totalPatientResponsibilityCents, responsibility, name)
            XCTAssertEqual(proposal.draft.statementBalanceCents, balance, name)
            XCTAssertEqual(proposal.draft.estimateCents, estimate, name)
            XCTAssertTrue(proposal.requiresReview)
            XCTAssertFalse(try prepared.facts.jsonString().contains("PRIVATE-INTAKE-CANARY"))
            if name == "hidden-eob" { XCTAssertFalse(prepared.text.contains("99,999.99")) }
        }
        let locked = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "locked", withExtension: "pdf", subdirectory: "ReconciliationIntakeFixtures"))
        do { _ = try await DocumentIntake.importFile(locked); XCTFail("Locked fixture must retain manual fallback") }
        catch { /* Expected; no protected original is persisted. */ }
    }
    func testReconciliationIntakeBridgeKeepsMoneyScopeAndWithholdsMixedDocuments() throws {
        let result = DocumentIntake.result(text: "Amount due $700.00\nPatient responsibility $1000.00\nPatient payments $300.00\n99213 $1000.00", pages: 1)
        let proposal = try LocalGuidance.reconciliationIntake(result.facts)
        XCTAssertEqual(proposal.candidateKind, "bill"); XCTAssertTrue(proposal.requiresReview)
        XCTAssertEqual(proposal.draft.statementBalanceCents, 70000)
        XCTAssertEqual(proposal.draft.totalPatientResponsibilityCents, 100000)
        XCTAssertNil(proposal.draft.estimateCents)
        XCTAssertEqual(proposal.draft.lines.first?.amountCents, 100000)
        for text in ["Explanation of benefits\nAmount due $700.00\nPatient responsibility $1000.00", "Claim denied\nPatient responsibility $1000.00", "Unreadable document"] {
            let withheld = try LocalGuidance.reconciliationIntake(LocalExtractor.facts(from: text))
            XCTAssertNil(withheld.candidateKind); XCTAssertEqual(withheld.status, "manual_type_required")
            XCTAssertNil(withheld.draft.totalPatientResponsibilityCents); XCTAssertNil(withheld.draft.statementBalanceCents)
            XCTAssertTrue(withheld.draft.lines.isEmpty)
        }
        let malformed = try LocalGuidance.reconciliationIntake(LocalExtractor.facts(from: "Amount due $100.00\nBalance due $1,00.00"))
        XCTAssertNil(malformed.draft.statementBalanceCents)
        let estimate = try LocalGuidance.reconciliationIntake(LocalExtractor.facts(from: "Good faith estimate\nEstimated total $1200.00"))
        XCTAssertEqual(estimate.candidateKind, "estimate"); XCTAssertEqual(estimate.draft.estimateCents, 120000)
    }
    @MainActor func testReconciliationPreparationClearRejectsLateReadAndPreservesCase() async throws {
        let store = AppStore(); store.startSessionOnly()
        let id = try store.createCase(title: "Synthetic one-time case", facts: PublicFacts(), mode: .session)
        let before = try XCTUnwrap(store.item(id)); let run = store.workspaceIdentity
        let preparation = ReconciliationPreparation()
        let started = expectation(description: "Local read started")
        let released = expectation(description: "Cancelled reader returned")
        var pending: CheckedContinuation<IntakeResult, Never>?
        preparation.prepare({
            let result: IntakeResult = await withCheckedContinuation { continuation in pending = continuation; started.fulfill() }
            released.fulfill(); return result
        }, isCurrent: { store.workspaceIdentity == run && store.workspaceActive && store.item(id) != nil })
        await fulfillment(of: [started], timeout: 2)
        preparation.clear()
        pending?.resume(returning: DocumentIntake.result(text: "Amount due $700.00\nPatient responsibility $1000.00", pages: 1))
        await fulfillment(of: [released], timeout: 2); await Task.yield()
        XCTAssertNil(preparation.proposal); XCTAssertFalse(preparation.busy); XCTAssertTrue(preparation.identifierCategories.isEmpty)
        XCTAssertEqual(store.item(id), before)
        store.suspend(); XCTAssertFalse(store.workspaceActive)
        store.lock(); XCTAssertNotEqual(store.workspaceIdentity, run); XCTAssertNil(store.item(id))
    }
    private func reconciliationFixture() throws -> CaseReconciliation {
        func stamp(_ id: String) -> [String: String] { ["id": "rc_" + id, "now": "2026-09-27T12:00:00.000Z"] }
        var state = try LocalGuidance.reconciliation("addReconciliationGroup", arguments: [CaseReconciliation().object, ["label": "Synthetic visit", "billerLabel": "Hospital", "serviceLabel": "One visit"], stamp("native_group1")])
        state = try LocalGuidance.reconciliation("addReconciliationDocument", arguments: [state.object, "rc_native_group1", ["kind": "bill", "label": "Bill", "statementBalanceCents": 70000], stamp("native_bill01")])
        state = try LocalGuidance.reconciliation("addReconciliationDocument", arguments: [state.object, "rc_native_group1", ["kind": "eob", "label": "EOB", "totalPatientResponsibilityCents": 100000], stamp("native_eob001")])
        state = try LocalGuidance.reconciliation("addReconciliationPayment", arguments: [state.object, "rc_native_group1", ["kind": "payment", "amountCents": 30000], stamp("native_paid01")])
        return try LocalGuidance.reconciliation("selectReconciliationDocuments", arguments: [state.object, "rc_native_group1", ["billId": "rc_native_bill01", "eobId": "rc_native_eob001", "estimateId": NSNull(), "responsibilitySource": "eob", "paymentsComplete": true] as [String: Any], stamp("native_review")])
    }
    func testReconciliationDecoderAndBridgeKeepExactBoundary() throws {
        let state = try reconciliationFixture()
        let result = try XCTUnwrap(LocalGuidance.reconciliationSummary(state).groups.first)
        XCTAssertEqual(result.amounts.expectedRemainingCents, 70000)
        XCTAssertEqual(result.amounts.statementBalanceCents, 70000)
        XCTAssertEqual(result.amounts.statementDifferenceCents, 0)
        let encoded = try JSONEncoder().encode(state)
        XCTAssertEqual(try JSONDecoder().decode(CaseReconciliation.self, from: encoded), state)
        XCTAssertNil(state.groups[0].documents[0].totalPatientResponsibilityCents)
        let voided = try LocalGuidance.reconciliation("voidReconciliationPayment", arguments: [state.object, "rc_native_group1", "rc_native_paid01", ["reason": "Synthetic wrong-scope entry"], ["id": "rc_native_void01", "now": "2026-09-27T12:00:00.000Z"]])
        XCTAssertEqual(voided.groups[0].payments.count, 2)
        XCTAssertEqual(voided.groups[0].payments[0].amountCents, 30000)
        XCTAssertNil(voided.groups[0].payments[1].amountCents)
        XCTAssertFalse(try LocalGuidance.reconciliationSummary(voided).groups[0].paymentHistoryComplete)
    }
    func testOldCaseMissingReconciliationWorksButPresentCorruptionFails() throws {
        var item = MemberCase(); item.reconciliation = try reconciliationFixture()
        var object = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(item)) as? [String: Any])
        object.removeValue(forKey: "reconciliation")
        XCTAssertNil(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)).reconciliation)
        let invalidValues: [Any] = [NSNull(), ["version": 2, "groups": []] as [String: Any], ["version": 1, "groups": [], "rawOCR": "SYNTHETIC PRIVATE ORIGINAL"] as [String: Any]]
        for invalid in invalidValues {
            object["reconciliation"] = invalid
            XCTAssertThrowsError(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)))
        }
        XCTAssertFalse(try item.facts.jsonString().contains("reconciliation"))
        XCTAssertFalse(try item.facts.jsonString().contains("native_group1"))
    }
    func testReconciliationMoneyPreservesCentsAndUnknown() throws {
        XCTAssertEqual(try ReconciliationMoney.parse("$9,999,999.99"), 999999999)
        XCTAssertEqual(try ReconciliationMoney.parse("0"), 0)
        XCTAssertNil(try ReconciliationMoney.parse(""))
        XCTAssertThrowsError(try ReconciliationMoney.parse("10000000.01"))
        XCTAssertThrowsError(try ReconciliationMoney.parse("1.005"))
        XCTAssertThrowsError(try ReconciliationMoney.parse("-1"))
        XCTAssertEqual(ReconciliationMoney.input(999999999), "9999999.99")
    }
    @MainActor func testFailedLocalReconciliationMutationRetainsCaseAndSessionDeletionClearsIt() async throws {
        let store = AppStore(); store.startSessionOnly()
        let id = try store.createCase(title: "Synthetic session", facts: PublicFacts(), mode: .session)
        try store.update(id) { $0.reconciliation = try reconciliationFixture() }
        let original = try XCTUnwrap(store.item(id))
        XCTAssertThrowsError(try store.update(id) { item in
            item.title = "This partial change must not persist"
            item.reconciliation = try LocalGuidance.reconciliation("validateReconciliation", arguments: [NSNull()])
        })
        XCTAssertEqual(store.item(id), original)
        try await store.remove(id)
        XCTAssertNil(store.item(id))
    }
    func testWorkbookPreservesNullDatesAndSeparatesReceiptFromOutcome() throws {
        let options = ["id": "wb_native_process", "now": "2026-09-27T12:00:00.000Z"]
        var workbook = try LocalGuidance.workbook("addProcess", arguments: [try LocalGuidance.workbookObject(CaseWorkbook()), ["kind": "appeal", "title": "Synthetic appeal"], options])
        workbook = try LocalGuidance.workbook("addCommunication", arguments: [try LocalGuidance.workbookObject(workbook), "wb_native_process", ["recipient": "Synthetic plan", "subject": "Appeal", "sentAt": "2026-09-27"], ["id": "wb_native_message", "now": "2026-09-27T12:00:00.000Z"]])
        let roundTrip = try LocalGuidance.workbook("validateWorkbook", arguments: [try LocalGuidance.workbookObject(workbook)])
        XCTAssertNil(roundTrip.processes[0].outcome)
        XCTAssertNil(roundTrip.processes[0].communications[0].receivedAt)
        XCTAssertEqual(roundTrip.processes[0].status, "preparing")
        XCTAssertThrowsError(try LocalGuidance.workbook("updateProcess", arguments: [try LocalGuidance.workbookObject(roundTrip), "wb_native_process", ["status": "resolved"], options]))
    }
    func testWorkbookNeverEntersAnalysisFactsAndOlderCasesDecode() throws {
        var item = MemberCase(); item.workbook = CaseWorkbook()
        let facts = try item.facts.jsonString()
        XCTAssertFalse(facts.contains("workbook")); XCTAssertFalse(facts.contains("processes"))
        var object = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(item)) as? [String: Any])
        object.removeValue(forKey: "workbook")
        let older = try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object))
        XCTAssertNil(older.workbook)
    }
    func testKnowledgeSearchUsesBundledReviewAndExpires() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let results = try LocalGuidance.knowledge("QMB", now: now)
        let result = try XCTUnwrap(results.first { $0.id == "qmb-medicare-cost-sharing" })
        XCTAssertTrue(result.current); XCTAssertFalse(result.verify.isEmpty)
        let future = try XCTUnwrap(ISO8601DateFormatter().date(from: "2027-01-15T12:00:00Z"))
        let expired = try XCTUnwrap(LocalGuidance.knowledgeItem(result.id, now: future))
        XCTAssertFalse(expired.current); XCTAssertTrue(expired.actions.isEmpty)
    }
    func testMoneyUsesExactCents() throws {
        XCTAssertEqual(try Money.parse("$1,234.50"), 123450)
        XCTAssertEqual(try Money.parse("0.01"), 1)
        XCTAssertEqual(try Money.parse("12.3"), 1230)
        XCTAssertNil(try Money.parse(""))
        XCTAssertThrowsError(try Money.parse("12.345"))
        XCTAssertThrowsError(try Money.parse("-4"))
        XCTAssertThrowsError(try Money.parse("12,34"))
        XCTAssertThrowsError(try Money.parse("1$24"))
        XCTAssertThrowsError(try Money.parse("10000000.01"))
    }
    func testTypedPayloadCannotIncludeLocalIdentifiers() throws {
        var item = MemberCase(); item.title = "SYNTHETIC PERSON account 123456789"
        item.events = [CaseEvent(kind: "Private", note: "SYNTHETIC PRIVATE NOTE")]
        item.facts.balanceCents = 50125
        let json = try item.facts.jsonString()
        XCTAssertFalse(json.contains("SYNTHETIC")); XCTAssertFalse(json.contains("123456789"))
        let object = try XCTUnwrap(JSONSerialization.jsonObject(with: item.facts.jsonData()) as? [String: Any])
        XCTAssertEqual(Set(object.keys), Set(item.facts.approvedFields))
        XCTAssertNil(object["rawText"]); XCTAssertNil(object["title"]); XCTAssertNil(object["original"])
    }
    func testIdentifierSignalsStayLocal() {
        let text = "Email: example@example.invalid\nAccount: ABC123456\nDate: 09/12/2026\nSSN 123-45-6789"
        let detections = IdentifierDetector.detect(text)
        XCTAssertTrue(detections.contains { $0.category == "Email address" })
        XCTAssertTrue(detections.contains { $0.category == "Account or member identifier" })
        XCTAssertTrue(detections.contains { $0.category == "Exact date" })
        XCTAssertFalse(IdentifierDetector.preview(text, candidates: detections).contains("123-45-6789"))
    }
    func testExtractorNeverTreatsMissingPaymentsAsZero() {
        let facts = LocalExtractor.facts(from: "AMOUNT DUE $1,250.50\nTOTAL CHARGES $1,500.00")
        XCTAssertEqual(facts.documentType, .bill); XCTAssertEqual(facts.balanceCents, 125050)
        XCTAssertEqual(facts.billedCents, 150000); XCTAssertNil(facts.paidCents); XCTAssertNil(facts.insurancePaidCents)
    }
    func testExtractorRejectsConflictingOrMalformedLabeledAmounts() {
        for text in [
            "Amount due $125.00\nBalance due $130.00",
            "Amount due $125.00\nCurrent balance $1,25.00",
            "Balance due $12.345\nAmount due $12.34",
            "Amount due unreadable\nBalance due $125.00",
            "Amount due $125.00 extra digits 99",
            "Amount due $-125.00",
        ] { XCTAssertNil(LocalExtractor.facts(from: text).balanceCents, text) }
        XCTAssertEqual(LocalExtractor.facts(from: "Amount due $125.00\nBalance due $125.00").balanceCents, 12500)
        XCTAssertEqual(LocalExtractor.facts(from: "Balance due:\n$125.00").balanceCents, 12500)
    }
    func testExtractorLeavesMixedDocumentAndClaimSignalsUnknown() {
        XCTAssertEqual(LocalExtractor.facts(from: "Explanation of benefits\nAmount due $125.00").documentType, .unknown)
        XCTAssertEqual(LocalExtractor.facts(from: "Good faith estimate\nClaim denied").documentType, .unknown)
        XCTAssertEqual(LocalExtractor.facts(from: "Claim status: pending\nClaim status: processed").claimStatus, "unknown")
        XCTAssertEqual(LocalExtractor.facts(from: "Claim status: pending\nClaim status: unreadable").claimStatus, "unknown")
        XCTAssertEqual(LocalExtractor.facts(from: "Claim status: pending").claimStatus, "pending")
    }
    func testRejectsProseInMedicalCode() {
        var facts = PublicFacts(); facts.lines = [.init(id: "line-1", code: "JOHNDOE", amountCents: 100, units: 1)]
        XCTAssertThrowsError(try facts.validated())
        facts.lines[0].code = "99213"; XCTAssertNoThrow(try facts.validated())
    }
    func testNilMedicalCodeSerializesAsExplicitNull() throws {
        let line = BillLine(id: "line-1", code: nil, amountCents: 0, units: 1)
        let object = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(line)) as? [String: Any])
        XCTAssertTrue(object["code"] is NSNull)
    }
    func testVaultFiltersOneTimeCasesAndIsolatesOwners() throws {
        let vault = ProtectedVault(); let firstScope = "native-test-" + UUID().uuidString; let secondScope = "native-test-" + UUID().uuidString
        defer { try? vault.erase(scope: firstScope); try? vault.erase(scope: secondScope) }
        var saved = MemberCase(); saved.title = "SYNTHETIC PRIVATE CASE"; saved.saveMode = .device; saved.recovery = try moneyRecoveryFixture()
        var temporary = MemberCase(); temporary.title = "MUST NOT PERSIST"; temporary.saveMode = .session; temporary.recovery = try moneyRecoveryFixture()
        try vault.save([saved, temporary], scope: firstScope)
        let restored = try vault.load(scope: firstScope)
        XCTAssertEqual(restored.count, 1); XCTAssertEqual(restored.first?.id, saved.id)
        XCTAssertEqual(restored.first?.recovery, saved.recovery)
        XCTAssertTrue(try vault.load(scope: secondScope).isEmpty)
        let directory = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true).appendingPathComponent("PrivateCases")
        let file = directory.appendingPathComponent(DeviceKeychain.digest(firstScope) + ".vault")
        let bytes = try Data(contentsOf: file)
        XCTAssertNil(bytes.range(of: Data("SYNTHETIC PRIVATE CASE".utf8)))
        XCTAssertEqual(try file.resourceValues(forKeys: [.isExcludedFromBackupKey]).isExcludedFromBackup, true)
        try vault.erase(scope: firstScope)
        XCTAssertTrue(try vault.load(scope: firstScope).isEmpty)
    }
    func testSharedRuleVectors() throws {
        struct Vector: Decodable {
            var id: String; var facts: PublicFacts; var requiredFindings: [String]; var forbiddenFindings: [String]; var forbiddenActions: [String]?; var amounts: [String: Int]?
        }
        struct Vectors: Decodable { var now: String; var vectors: [Vector] }
        let file = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "rule-vectors", withExtension: "json"))
        let vectors = try JSONDecoder().decode(Vectors.self, from: Data(contentsOf: file))
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: vectors.now))
        for vector in vectors.vectors {
            let result = try LocalGuidance.analyze(vector.facts, now: now)
            let findings = Set(result.findings.map(\.id)); let actions = Set(result.actions.map(\.id))
            for id in vector.requiredFindings { XCTAssertTrue(findings.contains(id), vector.id + ": missing " + id) }
            for id in vector.forbiddenFindings { XCTAssertFalse(findings.contains(id), vector.id + ": unexpected " + id) }
            for id in vector.forbiddenActions ?? [] { XCTAssertFalse(actions.contains(id), vector.id + ": unexpected " + id) }
            for (id, amount) in vector.amounts ?? [:] { XCTAssertEqual(result.findings.first(where: { $0.id == id })?.amountCents, amount, vector.id) }
        }
    }
    func testJavaScriptCoreArithmeticAndFreshness() throws {
        var facts = PublicFacts(); facts.documentType = .bill; facts.coverage = .private
        facts.billedCents = 100000; facts.adjustmentCents = 20000; facts.insurancePaidCents = 50000; facts.paidCents = 0; facts.balanceCents = 40000
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let result = try LocalGuidance.analyze(facts, now: now)
        XCTAssertTrue(result.findings.contains { $0.id == "balance-mismatch" && $0.amountCents == 10000 })
        facts.documentType = .eob; facts.goal = .afford
        let eob = try LocalGuidance.analyze(facts, now: now)
        XCTAssertTrue(eob.findings.contains { $0.id == "eob-not-bill" })
        XCTAssertFalse(eob.actions.contains { $0.id == "payment-options" })
        let expired = try LocalGuidance.analyze(facts, now: now.addingTimeInterval(100 * 86400))
        XCTAssertTrue(expired.findings.contains { $0.id == "source-review-needed" })
        XCTAssertFalse(expired.findings.contains { $0.id == "eob-not-bill" })
    }
    func testCountermeasureBranchesAndFreshnessInJavaScriptCore() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let routes = try LocalGuidance.countermeasures(now: now)
        XCTAssertFalse(routes.isEmpty)
        let collection = try XCTUnwrap(routes.first { $0.id == "collection-validation" })
        for response in CountermeasureResponse.allCases {
            let move = try XCTUnwrap(collection.move(response))
            XCTAssertFalse(move.draft.isEmpty); XCTAssertFalse(move.steps.isEmpty)
        }
        var facts = PublicFacts(); facts.coverage = .private; facts.documentType = .bill; facts.goal = .check
        let recommended = try LocalGuidance.recommendations(for: facts, now: now)
        XCTAssertTrue(recommended.contains { $0.id == "bill-reconcile" })
        XCTAssertFalse(recommended.contains { $0.category == "collections" })
        facts.documentType = .eob; facts.goal = .afford
        XCTAssertFalse(try LocalGuidance.recommendations(for: facts, now: now).contains { $0.id == "financing-pressure" })
        let expiredAt = now.addingTimeInterval(100 * 86400)
        XCTAssertFalse(collection.isActionable(at: expiredAt))
        let expired = try LocalGuidance.countermeasures(now: expiredAt)
        XCTAssertTrue(expired.allSatisfy { !$0.current && $0.firstMove.draft.isEmpty && $0.responses.values.allSatisfy { $0.draft.isEmpty } })
    }
    func testSavedGuidanceRequiresMatchingSourceReceiptForAI() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        var item = MemberCase(); item.facts.documentType = .bill; item.facts.coverage = .private; item.facts.goal = .afford
        var saved = try LocalGuidance.analyze(item.facts, now: now)
        XCTAssertFalse(saved.sourceIds.isEmpty)
        saved.aiAssistance = AIAssistance(summary: "Synthetic AI perspective", findings: [], actions: [], questions: [])
        saved.engine = "openai"; item.guidance = saved
        XCTAssertNotNil(try LocalGuidance.display(for: item, now: now).aiAssistance)
        let expiredAt = now.addingTimeInterval(100 * 86400)
        XCTAssertNil(try LocalGuidance.display(for: item, now: expiredAt).aiAssistance)
        saved.knowledgeReceipt = nil; item.guidance = saved
        XCTAssertNil(try LocalGuidance.display(for: item, now: now).aiAssistance)
        saved.knowledgeReceipt = saved.sourceIds.map { KnowledgeReview(id: $0, reviewedAt: "2026-01-01T00:00:00.000Z", expiresAt: "2026-12-27T00:00:00.000Z") }; item.guidance = saved
        XCTAssertNil(try LocalGuidance.display(for: item, now: now).aiAssistance)
        XCTAssertNil(item.editedDrafts["test"])
        item.editedDrafts["test"] = "Private historical edit"
        _ = try LocalGuidance.display(for: item, now: expiredAt)
        XCTAssertEqual(item.editedDrafts["test"], "Private historical edit")
    }
    @MainActor func testServerURLsDoNotAcceptCredentialsOrUnsecuredRemoteHost() {
        XCTAssertThrowsError(try APIClient.checkedBaseURL("https://name:password@example.com"))
        XCTAssertThrowsError(try APIClient.checkedBaseURL("http://example.com"))
        XCTAssertNoThrow(try APIClient.checkedBaseURL("https://example.com"))
    }
    @MainActor func testNativeDeleteRequestsSendEmptyJSONObject() async throws {
        CapturedRequestProtocol.clear()
        let client = APIClient(baseURL: URL(string: "https://native-test.invalid")!, protocolClasses: [CapturedRequestProtocol.self])
        try await client.unlink("benefit-test")
        try await client.cancelJob("job-test")
        let requests = CapturedRequestProtocol.recorded()
        XCTAssertEqual(requests.count, 2)
        for request in requests {
            XCTAssertEqual(request.httpMethod, "DELETE")
            XCTAssertEqual(request.value(forHTTPHeaderField: "Content-Type"), "application/json")
            XCTAssertEqual(request.value(forHTTPHeaderField: "X-GoldRock-Client"), "native")
            XCTAssertEqual(CapturedRequestProtocol.body(of: request), Data("{}".utf8))
        }
    }
    func testNativeTaskCatalogAndExpiredPreparation() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let catalog = try LocalGuidance.advocacyCatalog(now: now)
        XCTAssertEqual(catalog.tasks.count, 65)
        XCTAssertEqual(catalog.categories.count, 19)
        XCTAssertEqual(catalog.tasks.reduce(0) { $0 + $1.intakeFields.count }, 374)
        for task in catalog.tasks {
            let current = try LocalGuidance.advocacyTask(task.id, now: now)
            XCTAssertEqual(current.intakeFields.map(\.id), task.intakeFields.map(\.id))
            let expired = try LocalGuidance.advocacyTask(task.id, now: now.addingTimeInterval(120 * 86400))
            XCTAssertEqual(expired.current, false); XCTAssertTrue(expired.prepare.isEmpty); XCTAssertTrue(expired.evidence.isEmpty)
        }
    }
    func testNativeScenarioDetailsDecodeAndExpireWithTheirSources() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let routes = try LocalGuidance.countermeasures(now: now)
        XCTAssertEqual(routes.count, 69)
        let scenarios = routes.filter { $0.recommendationMode == "manual-only" }
        XCTAssertEqual(scenarios.count, 60)
        for route in scenarios {
            XCTAssertFalse(try XCTUnwrap(route.evidence).isEmpty)
            XCTAssertFalse(try XCTUnwrap(route.counterQuestions).isEmpty)
            for taskID in route.taskIds ?? [] { XCTAssertEqual(try LocalGuidance.advocacyTask(taskID, now: now).id, taskID) }
        }
        let expired = try LocalGuidance.countermeasures(now: now.addingTimeInterval(120 * 86400))
        for route in expired.filter({ $0.recommendationMode == "manual-only" }) {
            XCTAssertFalse(route.current)
            XCTAssertTrue(try XCTUnwrap(route.evidence).isEmpty)
            XCTAssertTrue(try XCTUnwrap(route.counterQuestions).isEmpty)
            XCTAssertTrue(route.firstMove.draft.isEmpty)
        }
    }
    func testTaskIntakeRoundTripRemainsOutsideAPIFacts() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let catalog = try LocalGuidance.advocacyCatalog(now: now)
        let task = try XCTUnwrap(catalog.tasks.first { $0.intakeFields.contains { $0.type == "text" } })
        let field = try XCTUnwrap(task.intakeFields.first { $0.type == "text" })
        let snapshot = try LocalGuidance.createTaskIntake(task.id, values: [field.id: .text("SYNTHETIC_PRIVATE_LOCAL_NOTE")], now: now)
        var item = MemberCase(); item.taskIntake = snapshot
        let encoded = try JSONEncoder().encode(item)
        let decoded = try JSONDecoder().decode(MemberCase.self, from: encoded)
        XCTAssertEqual(decoded.taskIntake, snapshot)
        XCTAssertTrue(String(decoding: encoded, as: UTF8.self).contains("SYNTHETIC_PRIVATE_LOCAL_NOTE"))
        XCTAssertFalse(try item.facts.jsonString().contains("SYNTHETIC_PRIVATE_LOCAL_NOTE"))
        XCTAssertFalse(item.facts.approvedFields.contains("taskIntake"))
        let old = try JSONEncoder().encode(MemberCase())
        XCTAssertNil(try JSONDecoder().decode(MemberCase.self, from: old).taskIntake)
        var object = try XCTUnwrap(JSONSerialization.jsonObject(with: encoded) as? [String: Any])
        object["taskIntake"] = NSNull()
        XCTAssertThrowsError(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)))
        object["taskIntake"] = ["version": 2, "taskId": task.id, "values": [:], "completedAt": NSNull()] as [String: Any]
        XCTAssertThrowsError(try JSONDecoder().decode(MemberCase.self, from: JSONSerialization.data(withJSONObject: object)))
    }
    func testTaskIntakeMissingTimestampUnknownFieldAndFalseAreDistinct() throws {
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let catalog = try LocalGuidance.advocacyCatalog(now: now)
        let task = try XCTUnwrap(catalog.tasks.first { $0.intakeFields.contains { $0.type == "checkbox" } })
        let field = try XCTUnwrap(task.intakeFields.first { $0.type == "checkbox" })
        let unchecked = try LocalGuidance.createTaskIntake(task.id, values: [field.id: .checked(false)], now: now)
        XCTAssertEqual(unchecked.values[field.id], .checked(false))
        XCTAssertNil(try LocalGuidance.createTaskIntake(task.id, values: [:], now: now).values[field.id])
        XCTAssertThrowsError(try LocalGuidance.createTaskIntake(task.id, values: ["unknownField": .text("private")], now: now))
        var object = try XCTUnwrap(JSONSerialization.jsonObject(with: JSONEncoder().encode(unchecked)) as? [String: Any])
        object.removeValue(forKey: "completedAt")
        XCTAssertThrowsError(try JSONDecoder().decode(TaskIntake.self, from: JSONSerialization.data(withJSONObject: object)))
    }

    func testTodayNextStepsShowRecordedDatesWithoutInventingDeadlines() throws {
        var calendar = Calendar(identifier: .gregorian); calendar.timeZone = TimeZone(secondsFromGMT: 0)!
        let now = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-27T12:00:00Z"))
        let followUp = try XCTUnwrap(ISO8601DateFormatter().date(from: "2026-09-28T15:00:00Z"))
        func deadline(_ id: String, _ title: String, _ date: String, _ kind: String = "filing", _ confirmed: Bool = false) -> WorkbookDeadline {
            WorkbookDeadline(id: id, createdAt: "2026-09-27T12:00:00.000Z", updatedAt: "2026-09-27T12:00:00.000Z",
                             title: title, date: date, kind: kind, confirmed: confirmed, sourceLabel: "Synthetic notice", note: "")
        }
        func process(_ status: String, _ dates: [WorkbookDeadline]) -> WorkbookProcess {
            WorkbookProcess(id: UUID().uuidString, createdAt: "2026-09-27T12:00:00.000Z", updatedAt: "2026-09-27T12:00:00.000Z",
                            kind: "appeal", title: "Appeal", status: status, notes: "", criteria: [], deadlines: dates,
                            communications: [], holds: [], outcome: nil)
        }
        var item = MemberCase(); item.title = "Synthetic case"; item.followUp = followUp
        item.workbook = CaseWorkbook(version: 1, evidence: [], processes: [
            process("waiting", [deadline("verify", "Check notice date", "2026-09-26"),
                                deadline("confirmed", "File response", "2026-09-29", "filing", true),
                                deadline("reminder", "Call billing", "2026-10-01", "follow_up"),
                                deadline("invalid", "Invalid date", "2026-02-31")]),
            process("closed", [deadline("historical", "Closed process date", "2026-09-25")])
        ])
        let steps = CaseNextSteps.build(from: [item], calendar: calendar)
        XCTAssertEqual(steps.map(\.title), ["Check notice date", "Follow up on this case", "File response", "Call billing"])
        XCTAssertTrue(steps.allSatisfy { $0.caseID == item.id })
        XCTAssertEqual(steps.first?.sourceLabel, "Date to verify · Appeal")
        XCTAssertEqual(steps.first.map { CaseNextSteps.status(for: $0, now: now, calendar: calendar) }, "Recorded date passed · verify")
        XCTAssertEqual(steps[2].sourceLabel, "Date you confirmed · Appeal")
        XCTAssertEqual(steps[3].sourceLabel, "Your reminder · Appeal")
        item.resolved = true
        XCTAssertTrue(CaseNextSteps.build(from: [item], calendar: calendar).isEmpty)
    }
    @MainActor func testClearingFollowUpRemovesTodayQueueEntryButKeepsCaseHistory() throws {
        let store = AppStore(); store.startSessionOnly()
        let id = try store.createCase(title: "Synthetic follow-up", facts: PublicFacts(), mode: .session)
        let date = Date().addingTimeInterval(86400)
        try store.update(id) { item in
            item.followUp = date
            item.events.append(CaseEvent(kind: "I contacted the billing office", note: "Synthetic response"))
        }
        XCTAssertEqual(CaseNextSteps.build(from: store.cases).count, 1)
        try store.clearFollowUp(id)
        XCTAssertNil(store.item(id)?.followUp)
        XCTAssertEqual(store.item(id)?.events.count, 1)
        XCTAssertTrue(CaseNextSteps.build(from: store.cases).isEmpty)
    }

}

private final class CapturedRequestProtocol: URLProtocol, @unchecked Sendable {
    private static let lock = NSLock()
    private static var requests: [URLRequest] = []
    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    static func clear() { lock.lock(); defer { lock.unlock() }; requests = [] }
    static func recorded() -> [URLRequest] { lock.lock(); defer { lock.unlock() }; return requests }
    static func body(of request: URLRequest) -> Data? {
        if let body = request.httpBody { return body }
        guard let stream = request.httpBodyStream else { return nil }
        stream.open(); defer { stream.close() }
        var bytes = [UInt8](repeating: 0, count: 256); var result = Data()
        while stream.hasBytesAvailable { let n = stream.read(&bytes, maxLength: bytes.count); if n <= 0 { break }; result.append(contentsOf: bytes.prefix(n)) }
        return result
    }
    override func startLoading() {
        var captured = request; captured.httpBody = Self.body(of: request)
        Self.lock.lock(); Self.requests.append(captured); Self.lock.unlock()
        let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: ["Content-Type": "application/json"])!
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        let isJob = request.httpMethod != "DELETE" && (request.url?.path.contains("/api/jobs/") == true || request.url?.path == "/api/conversations")
        let body = isJob ? "{\"job\":{\"id\":\"job_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\",\"status\":\"queued\",\"expiresAt\":null}}" : "{}"
        client?.urlProtocol(self, didLoad: Data(body.utf8)); client?.urlProtocolDidFinishLoading(self)
    }
    override func stopLoading() {}
}

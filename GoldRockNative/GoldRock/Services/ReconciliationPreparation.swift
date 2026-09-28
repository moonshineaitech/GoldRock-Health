import Foundation
import Observation

/// A typed suggestion only. This object is deliberately not a saved case field.
struct ReconciliationIntakeProposal: Decodable {
    struct Draft: Decodable {
        var totalPatientResponsibilityCents: Int?
        var statementBalanceCents: Int?
        var estimateCents: Int?
        var lines: [Line]
    }
    struct Line: Decodable { var code: String?; var amountCents: Int?; var units: Int? }
    struct SourceFields: Decodable {
        var totalPatientResponsibilityCents: String?; var statementBalanceCents: String?
        var estimateCents: String?; var lines: String?
    }
    struct Warning: Decodable { var code: String; var message: String }
    var version: Int; var requiresReview: Bool; var status: String
    var candidateKind: String?; var draft: Draft; var sourceFields: SourceFields
    var warnings: [Warning]
}

/// No persistence or network methods. Raw OCR survives only for this optional local
/// privacy review. A generation token prevents a late task from repopulating it.
@Observable @MainActor final class ReconciliationPreparation {
    private(set) var proposal: ReconciliationIntakeProposal?
    private(set) var busy = false
    private(set) var pages = 0
    private(set) var warnings: [String] = []
    private(set) var identifierCategories: [String] = []
    private(set) var modelNotice: String?
    private(set) var problem: String?
    private var rawText: String?
    private var epoch = UUID()
    private var operation: Task<Void, Never>?
    var canInspectLocally: Bool { rawText != nil && !busy && OnDeviceAssistant.isAvailable }

    func prepare(_ read: @escaping () async throws -> IntakeResult, isCurrent: @escaping @MainActor () -> Bool) {
        clear(); let run = epoch; busy = true
        operation = Task {
            do {
                let result = try await read(); try Task.checkCancellation()
                guard epoch == run, isCurrent() else { return }
                let typed = try LocalGuidance.reconciliationIntake(result.facts)
                proposal = typed; pages = result.pages; warnings = result.warnings
                identifierCategories = Array(Set(result.identifiers.map(\.category))).sorted()
                rawText = result.text
            } catch is CancellationError { return }
            catch {
                guard epoch == run, isCurrent() else { return }
                problem = "This document could not be prepared. It may be locked, too large, unsupported or unreadable. Try an unlocked PDF or a clearer image (up to 20 pages / 20 MB), or enter the figures manually. Existing history is unchanged."
            }
            guard epoch == run, isCurrent() else { return }
            busy = false; operation = nil
        }
    }
    func inspectLocally(isCurrent: @escaping @MainActor () -> Bool) {
        guard canInspectLocally, let text = rawText else { return }
        let run = epoch; busy = true; problem = nil
        operation = Task {
            do {
                let result = try await OnDeviceAssistant.inspect(text); try Task.checkCancellation()
                guard epoch == run, isCurrent() else { return }
                identifierCategories = Array(Set(identifierCategories + result.candidates.map(\.category))).sorted()
                // A model classification cannot unlock withheld financial amounts.
                modelNotice = result.notice + " Its classification does not change the document type or any amount."
            } catch is CancellationError { return }
            catch {
                guard epoch == run, isCurrent() else { return }
                problem = "The optional on-device review did not finish. Manual review still works. No cloud fallback was used."
            }
            guard epoch == run, isCurrent() else { return }
            busy = false; operation = nil
        }
    }
    func clear() {
        epoch = UUID(); operation?.cancel(); operation = nil
        rawText = nil; proposal = nil; warnings = []; identifierCategories = []
        modelNotice = nil; problem = nil; pages = 0; busy = false
    }
}

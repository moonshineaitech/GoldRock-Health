import Foundation
import CoreTransferable
import UniformTypeIdentifiers

struct MoneyRecoveryGuide: Decodable {
    struct Source: Decodable, Identifiable {
        let id: String; let title: String; let url: String; let publisher: String
        let applicability: String; let reviewedAt: String; let expiresAt: String; let current: Bool
    }
    let kind: String; let title: String; let draft: String; let checklist: [String]
    let sources: [Source]; let sourceIds: [String]; let current: Bool
    let reviewedAt: String; let expiresAt: String; let limitations: [String]
    var receipts: [String] { sources.map { "\($0.id)|\($0.reviewedAt)|\($0.expiresAt)" }.sorted() }
}

/// Re-evaluates the bundled guide at the moment the OS requests export bytes.
/// Existing edited user records are not silently replaced by this template.
struct MoneyRecoveryTemplateExport: Transferable {
    let kind: String; let text: String; let receipts: [String]
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .plainText) { value in
            let fresh = try LocalGuidance.moneyRecoveryGuide(value.kind)
            guard fresh.current, fresh.receipts == value.receipts else { throw AppError.service("The source review changed or expired. Reopen the current preparation guide before sharing a template.") }
            return Data(value.text.utf8)
        }
    }
}

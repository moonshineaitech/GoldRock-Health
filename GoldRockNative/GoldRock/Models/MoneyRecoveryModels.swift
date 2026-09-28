import Foundation

/// Strict local envelope: absent on older cases; present invalid data fails closed.
struct CaseMoneyRecovery: Codable, Equatable {
    private let storage: MoneyRecoveryJSON
    let requests: [MoneyRecoveryRequest]
    init() { storage = .object(["version": .integer(1), "requests": .array([])]); requests = [] }
    init(from decoder: Decoder) throws {
        let input = try MoneyRecoveryJSON(from: decoder)
        let data = try LocalGuidance.moneyRecoveryJSON("validateMoneyRecovery", arguments: [input.foundationValue])
        storage = try JSONDecoder().decode(MoneyRecoveryJSON.self, from: data)
        requests = try JSONDecoder().decode(MoneyRecoveryContainer.self, from: data).requests
    }
    func encode(to encoder: Encoder) throws { try storage.encode(to: encoder) }
    var object: Any { storage.foundationValue }
}
private struct MoneyRecoveryContainer: Decodable { let version: Int; let requests: [MoneyRecoveryRequest] }
struct MoneyRecoveryRequest: Decodable, Equatable, Identifiable {
    let id: String; let createdAt: String; let kind: String; let label: String
    let recipientLabel: String; let scopeLabel: String; let personLabel: String
    let events: [MoneyRecoveryEvent]
}
struct MoneyRecoveryEvent: Decodable, Equatable, Identifiable {
    let id: String; let createdAt: String; let kind: String; let date: String?
    let reference: String; let note: String
    let requestedCents: Int?; let approvedCents: Int?; let receivedCents: Int?
    let decision: String?; let payee: String?; let preparation: MoneyRecoveryPreparation?
    let replacesId: String?
}
struct MoneyRecoveryPreparation: Codable, Equatable {
    struct Check: Codable, Equatable { var label: String; var checked: Bool }
    struct Receipt: Codable, Equatable { let id: String; let reviewedAt: String; let expiresAt: String }
    var draft: String; var checklist: [Check]; var evidenceReferences: [String]; var guideReceipt: [Receipt]
}
struct MoneyRecoverySummary: Decodable { let version: Int; let requests: [MoneyRecoveryRequestSummary]; let notice: String }
struct MoneyRecoveryRequestSummary: Decodable, Identifiable {
    struct FollowUp: Decodable, Identifiable { let id: String; let date: String; let note: String; let reference: String }
    let id: String; let kind: String; let label: String; let recipientLabel: String; let scopeLabel: String; let personLabel: String
    let status: String; let lastEventId: String?; let latestPreparationId: String?; let latestSubmissionId: String?; let latestDecisionId: String?
    let decision: String?; let decisionPayee: String?; let requestedCents: Int?; let approvedCents: Int?
    let recordedReceivedCents: Int?; let receivedCents: Int?; let unreceivedApprovedCents: Int?; let receiptStatus: String
    let activeEventIds: [String]; let supersededEventIds: [String]; let voidedEventIds: [String]
    let followUps: [FollowUp]; let questions: [String]; let notice: String
}
enum MoneyRecoveryLabels {
    static func title(_ value: String) -> String {
        switch value {
        case "refund": "Provider refund"
        case "reimbursement": "Insurer reimbursement"
        case "preparation": "Preparation and draft"
        case "submitted": "Request sent by you"
        case "acknowledged": "Recipient acknowledged the request"
        case "more_info": "More information requested"
        case "decision": "Decision received"
        case "follow_up": "Personal follow-up"
        case "receipt": "Money actually received by you"
        case "reopened": "Request reopened"
        case "closed": "Record closed by you"
        case "void": "Incorrect record voided"
        case "approved": "Approved in the decision"
        case "partly_approved": "Partly approved in the decision"
        case "denied": "Denied in the decision"
        case "member": "You / member"
        case "provider": "Provider"
        case "unknown": "Not established"
        case "none_recorded": "No receipt recorded; amount received is unknown"
        case "amount_unknown": "At least one receipt has an unknown amount"
        case "received_uncompared": "Receipts recorded; no comparable member approval established"
        case "partial_recorded": "Recorded receipts are below the stated member approval"
        case "matches_approval": "Recorded receipts match the stated member approval"
        case "exceeds_approval": "Recorded receipts exceed the stated member approval; review scope"
        case "needs_info": "More information requested"
        default: value.replacingOccurrences(of: "_", with: " ").capitalized
        }
    }
}

/// Retains unknown keys and explicit nulls for the shared strict validator.
private indirect enum MoneyRecoveryJSON: Codable, Equatable {
    case null, bool(Bool), integer(Int), number(Double), string(String), array([Self]), object([String: Self])
    init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if c.decodeNil() { self = .null }
        else if let v = try? c.decode(Bool.self) { self = .bool(v) }
        else if let v = try? c.decode(Int.self) { self = .integer(v) }
        else if let v = try? c.decode(Double.self) { self = .number(v) }
        else if let v = try? c.decode(String.self) { self = .string(v) }
        else if let v = try? c.decode([Self].self) { self = .array(v) }
        else { self = .object(try c.decode([String: Self].self)) }
    }
    func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch self {
        case .null: try c.encodeNil(); case .bool(let v): try c.encode(v)
        case .integer(let v): try c.encode(v); case .number(let v): try c.encode(v)
        case .string(let v): try c.encode(v); case .array(let v): try c.encode(v); case .object(let v): try c.encode(v)
        }
    }
    var foundationValue: Any {
        switch self {
        case .null: NSNull(); case .bool(let v): v; case .integer(let v): v; case .number(let v): v
        case .string(let v): v; case .array(let v): v.map(\.foundationValue); case .object(let v): v.mapValues(\.foundationValue)
        }
    }
}

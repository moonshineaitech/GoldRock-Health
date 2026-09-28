import Foundation

/// A strict, device-only envelope. Validate the original JSON before typed decoding,
/// so Codable cannot silently discard an unsupported field or document version.
struct CaseReconciliation: Codable, Equatable {
    private let storage: ReconciliationJSON
    let groups: [ReconciliationGroup]
    init() { storage = .object(["version": .integer(1), "groups": .array([])]); groups = [] }
    init(from decoder: Decoder) throws {
        let input = try ReconciliationJSON(from: decoder)
        let data = try LocalGuidance.reconciliationJSON("validateReconciliation", arguments: [input.foundationValue])
        storage = try JSONDecoder().decode(ReconciliationJSON.self, from: data)
        groups = try JSONDecoder().decode(ReconciliationContainer.self, from: data).groups
    }
    func encode(to encoder: Encoder) throws { try storage.encode(to: encoder) }
    var object: Any { storage.foundationValue }
}
private struct ReconciliationContainer: Decodable { let version: Int; let groups: [ReconciliationGroup] }

struct ReconciliationGroup: Decodable, Equatable, Identifiable {
    let id: String; let createdAt: String; let label: String; let billerLabel: String
    let serviceLabel: String; let personLabel: String
    let documents: [ReconciliationDocument]; let payments: [ReconciliationPayment]
    let selections: [ReconciliationSelection]
}
struct ReconciliationDocument: Decodable, Equatable, Identifiable {
    let id: String; let createdAt: String; let kind: String; let label: String
    let documentDate: String?; let receivedDate: String?; let reference: String
    let revisionOfId: String?; let totalPatientResponsibilityCents: Int?
    let statementBalanceCents: Int?; let estimateCents: Int?; let lines: [ReconciliationLine]
}
struct ReconciliationLine: Decodable, Equatable {
    let label: String; let code: String?; let amountCents: Int?; let units: Int?
}
struct ReconciliationPayment: Decodable, Equatable, Identifiable {
    let id: String; let createdAt: String; let kind: String; let amountCents: Int?
    let transactionDate: String?; let receiptReference: String; let note: String
    let replacesId: String?
}
struct ReconciliationSelection: Decodable, Equatable, Identifiable {
    let id: String; let createdAt: String
    let billId: String?; let eobId: String?; let estimateId: String?
    let responsibilitySource: String?; let paymentsComplete: Bool; let reason: String
    let paymentRecordIds: [String]
}
struct ReconciliationSummary: Decodable {
    let version: Int; let groups: [ReconciledGroup]; let notice: String
}
struct ReconciledGroup: Decodable, Identifiable {
    struct Selected: Decodable {
        let billId: String?; let eobId: String?; let estimateId: String?; let responsibilitySource: String?
    }
    struct Amounts: Decodable {
        let statementBalanceCents: Int?; let totalPatientResponsibilityCents: Int?; let estimateCents: Int?
        let recordedPaymentsCents: Int?; let recordedRefundsCents: Int?; let recordedNetPaymentsCents: Int?
        let expectedRemainingCents: Int?; let possibleCreditCents: Int?; let statementDifferenceCents: Int?
    }
    let id: String; let label: String; let billerLabel: String; let serviceLabel: String; let personLabel: String
    let selectionId: String?; let selected: Selected; let paymentHistoryComplete: Bool
    let amounts: Amounts; let activePaymentIds: [String]; let supersededPaymentIds: [String]
    let voidedPaymentIds: [String]; let unselectedRevisionIds: [String]
    let questions: [String]; let notice: String
}

enum ReconciliationLabels {
    static func kind(_ raw: String) -> String {
        switch raw { case "bill": "Bill"; case "eob": "Explanation of benefits"; case "estimate": "Estimate"; case "payment": "Payment you made"; case "refund": "Refund you received"; case "void": "Voided record"; default: raw }
    }
}

enum ReconciliationMoney {
    static func parse(_ input: String) throws -> Int? {
        var text = input.trimmingCharacters(in: .whitespacesAndNewlines)
        if text.isEmpty { return nil }
        if text.hasPrefix("$") { text.removeFirst(); text = text.trimmingCharacters(in: .whitespaces) }
        guard text.count <= 23, text.range(of: #"^(?:0|[1-9][0-9]{0,13}|[1-9][0-9]{0,2}(?:,[0-9]{3})+)(?:\.[0-9]{1,2})?$"#, options: .regularExpression) != nil else { throw AppError.invalid("Enter a nonnegative USD amount with at most two decimal places, or leave it blank.") }
        let parts = text.replacingOccurrences(of: ",", with: "").split(separator: ".")
        guard let dollars = Int(parts[0]) else { throw AppError.invalid("The recorded amount is outside the supported range.") }
        let (whole, overflow) = dollars.multipliedReportingOverflow(by: 100)
        let fraction = parts.count == 2 ? Int(parts[1].padding(toLength: 2, withPad: "0", startingAt: 0))! : 0
        let (cents, additionOverflow) = whole.addingReportingOverflow(fraction)
        guard !overflow, !additionOverflow, cents <= 1_000_000_000 else { throw AppError.invalid("An individual recorded amount must be at most $10,000,000.") }
        return cents
    }
    static func input(_ value: Int?) -> String {
        guard let value else { return "" }
        return "\(value / 100).\(String(value % 100).count == 1 ? "0" : "")\(value % 100)"
    }
}

/// Preserves explicit nulls and unknown fields until the strict shared validator
/// sees them. Never used for API facts or document bytes.
private indirect enum ReconciliationJSON: Codable, Equatable {
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
        case .null: try c.encodeNil()
        case .bool(let v): try c.encode(v)
        case .integer(let v): try c.encode(v)
        case .number(let v): try c.encode(v)
        case .string(let v): try c.encode(v)
        case .array(let v): try c.encode(v)
        case .object(let v): try c.encode(v)
        }
    }
    var foundationValue: Any {
        switch self {
        case .null: NSNull()
        case .bool(let v): v
        case .integer(let v): v
        case .number(let v): v
        case .string(let v): v
        case .array(let v): v.map(\.foundationValue)
        case .object(let v): v.mapValues(\.foundationValue)
        }
    }
}

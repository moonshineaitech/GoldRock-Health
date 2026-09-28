import Foundation

enum DocumentKind: String, Codable, CaseIterable, Identifiable {
    case bill, eob, denial, estimate, unknown
    var id: String { rawValue }
    var title: String { switch self { case .bill: "Bill"; case .eob: "Explanation of benefits"; case .denial: "Denial"; case .estimate: "Estimate"; case .unknown: "Not sure yet" } }
}
enum MemberGoal: String, Codable, CaseIterable, Identifiable {
    case understand, check, afford, appeal, plan
    var id: String { rawValue }
    var title: String { switch self { case .understand: "Understand this"; case .check: "Check the charges"; case .afford: "Find affordable options"; case .appeal: "Respond to a denial"; case .plan: "Plan before care" } }
    var symbol: String { switch self { case .understand: "doc.text.magnifyingglass"; case .check: "checkmark.shield"; case .afford: "heart.text.square"; case .appeal: "arrow.uturn.backward"; case .plan: "calendar" } }
}
enum Coverage: String, Codable, CaseIterable, Identifiable {
    case `private`, medicare, medicaid, uninsured, self_pay, unknown
    var id: String { rawValue }
    var title: String { switch self { case .private: "Private insurance"; case .medicare: "Medicare"; case .medicaid: "Medicaid"; case .uninsured: "Uninsured"; case .self_pay: "Choosing self-pay"; case .unknown: "Not sure" } }
}
enum SaveMode: String, Codable, CaseIterable, Identifiable {
    case device, session
    var id: String { rawValue }
    var title: String { self == .device ? "Keep on this iPhone" : "One-time session" }
}
struct BillLine: Codable, Identifiable, Equatable {
    var id: String
    var code: String?
    var amountCents: Int
    var units: Int
    enum CodingKeys: String, CodingKey { case id, code, amountCents, units }
    func encode(to encoder: Encoder) throws {
        var fields = encoder.container(keyedBy: CodingKeys.self)
        try fields.encode(id, forKey: .id)
        if let code { try fields.encode(code, forKey: .code) } else { try fields.encodeNil(forKey: .code) }
        try fields.encode(amountCents, forKey: .amountCents); try fields.encode(units, forKey: .units)
    }
}

/// This type is the ONLY document-derived input accepted by APIClient.createJob.
/// Local name, raw OCR, identifier candidates and document bytes have no fields here.
struct PublicFacts: Codable, Equatable {
    var documentType: DocumentKind = .unknown
    var goal: MemberGoal = .understand
    var coverage: Coverage = .unknown
    var state: String? = "unknown"
    var careSetting: String? = "unknown"
    var billedCents: Int?
    var adjustmentCents: Int?
    var insurancePaidCents: Int?
    var paidCents: Int?
    var balanceCents: Int?
    var estimateCents: Int?
    var eobResponsibilityCents: Int?
    var claimStatus: String? = "unknown"
    var hasItemization: Bool?
    var hasEstimate: Bool?
    var daysSinceInitialBill: Int?
    var daysSinceDenialReceived: Int?
    var denialReason: String? = "unknown"
    var lines: [BillLine] = []
    init() {}
    enum CodingKeys: String, CodingKey { case documentType, goal, coverage, state, careSetting, billedCents, adjustmentCents, insurancePaidCents, paidCents, balanceCents, estimateCents, eobResponsibilityCents, claimStatus, hasItemization, hasEstimate, daysSinceInitialBill, daysSinceDenialReceived, denialReason, lines }
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        documentType = try c.decode(DocumentKind.self, forKey: .documentType); goal = try c.decode(MemberGoal.self, forKey: .goal); coverage = try c.decode(Coverage.self, forKey: .coverage)
        state = try c.decodeIfPresent(String.self, forKey: .state); careSetting = try c.decodeIfPresent(String.self, forKey: .careSetting)
        billedCents = try c.decodeIfPresent(Int.self, forKey: .billedCents); adjustmentCents = try c.decodeIfPresent(Int.self, forKey: .adjustmentCents)
        insurancePaidCents = try c.decodeIfPresent(Int.self, forKey: .insurancePaidCents); paidCents = try c.decodeIfPresent(Int.self, forKey: .paidCents)
        balanceCents = try c.decodeIfPresent(Int.self, forKey: .balanceCents); estimateCents = try c.decodeIfPresent(Int.self, forKey: .estimateCents)
        eobResponsibilityCents = try c.decodeIfPresent(Int.self, forKey: .eobResponsibilityCents); claimStatus = try c.decodeIfPresent(String.self, forKey: .claimStatus)
        hasItemization = try c.decodeIfPresent(Bool.self, forKey: .hasItemization); hasEstimate = try c.decodeIfPresent(Bool.self, forKey: .hasEstimate)
        daysSinceInitialBill = try c.decodeIfPresent(Int.self, forKey: .daysSinceInitialBill); daysSinceDenialReceived = try c.decodeIfPresent(Int.self, forKey: .daysSinceDenialReceived)
        denialReason = try c.decodeIfPresent(String.self, forKey: .denialReason); lines = try c.decodeIfPresent([BillLine].self, forKey: .lines) ?? []
    }

    func validated() throws -> PublicFacts {
        let values = [billedCents, adjustmentCents, insurancePaidCents, paidCents, balanceCents, estimateCents, eobResponsibilityCents]
        guard values.compactMap({ $0 }).allSatisfy({ (0...1_000_000_000).contains($0) }) else { throw AppError.invalid("Amounts must be between $0 and $10,000,000, with at most two decimal places.") }
        let states = Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY AS GU MP PR VI unknown".split(separator: " ").map(String.init))
        guard state == nil || states.contains(state!) else { throw AppError.invalid("Choose a valid state.") }
        guard careSetting == nil || ["emergency", "in_network_facility", "out_of_network_facility", "air_ambulance", "ground_ambulance", "other", "unknown"].contains(careSetting!) else { throw AppError.invalid("Choose a valid care setting.") }
        guard claimStatus == nil || ["pending", "processed", "denied", "unknown"].contains(claimStatus!), denialReason == nil || ["administrative", "coverage", "medical_necessity", "unknown"].contains(denialReason!) else { throw AppError.invalid("Choose a valid claim status and denial reason.") }
        guard [daysSinceInitialBill, daysSinceDenialReceived].compactMap({ $0 }).allSatisfy({ (0...36500).contains($0) }) else { throw AppError.invalid("Elapsed days must be a whole number from 0 to 36500.") }
        guard lines.count <= 100, Set(lines.map(\.id)).count == lines.count else { throw AppError.invalid("A case can include up to 100 distinct line items.") }
        for line in lines {
            guard line.id.range(of: #"^line-[1-9][0-9]{0,3}$"#, options: .regularExpression) != nil,
                  (0...1_000_000_000).contains(line.amountCents), (1...10000).contains(line.units),
                  line.code == nil || line.code!.range(of: #"^(?:[0-9]{5}|[0-9]{4}[FTU]|[A-Z][0-9]{4}|[A-Z][0-9][0-9A-Z](?:\.[0-9A-Z]{1,4}|[0-9A-Z]{1,4}))$"#, options: .regularExpression) != nil else { throw AppError.invalid("Review line codes, amounts and units. Remove anything that is not a medical code.") }
        }
        return self
    }
    func jsonData() throws -> Data { let e = JSONEncoder(); e.outputFormatting = [.prettyPrinted, .sortedKeys]; return try e.encode(validated()) }
    func jsonString() throws -> String { String(decoding: try jsonData(), as: UTF8.self) }
    var approvedFields: [String] { (try? JSONSerialization.jsonObject(with: JSONEncoder().encode(self)) as? [String: Any])?.keys.sorted() ?? [] }
    static func label(for key: String) -> String {
        let labels = ["documentType": "Document type", "goal": "What you want help with", "coverage": "Coverage", "state": "State of care", "careSetting": "Care setting", "billedCents": "Total billed", "adjustmentCents": "Adjustments", "insurancePaidCents": "Insurance paid", "paidCents": "You paid", "balanceCents": "Current balance", "estimateCents": "Written estimate", "eobResponsibilityCents": "EOB responsibility", "claimStatus": "Claim status", "hasItemization": "Itemized statement", "hasEstimate": "Estimate before care", "daysSinceInitialBill": "Days since initial bill", "daysSinceDenialReceived": "Days since denial received", "denialReason": "Denial reason", "lines": "Line items"]
        return labels[key] ?? key.replacingOccurrences(of: "line-", with: "Line ")
    }
    var reviewedRows: [(key: String, value: String)] {
        var rows: [(String, String)] = [("documentType", documentType.title), ("goal", goal.title), ("coverage", coverage.title)]
        for (key, value) in [("state", state), ("careSetting", careSetting), ("claimStatus", claimStatus), ("denialReason", denialReason)] {
            if let value { rows.append((key, value == "unknown" ? "Not sure" : value.replacingOccurrences(of: "_", with: " ").capitalized)) }
        }
        for (key, value) in [("billedCents", billedCents), ("adjustmentCents", adjustmentCents), ("insurancePaidCents", insurancePaidCents), ("paidCents", paidCents), ("balanceCents", balanceCents), ("estimateCents", estimateCents), ("eobResponsibilityCents", eobResponsibilityCents)] { if let value { rows.append((key, Money.display(value))) } }
        for (key, value) in [("hasItemization", hasItemization), ("hasEstimate", hasEstimate)] { if let value { rows.append((key, value ? "Yes" : "No")) } }
        for (key, value) in [("daysSinceInitialBill", daysSinceInitialBill), ("daysSinceDenialReceived", daysSinceDenialReceived)] { if let value { rows.append((key, "\(value) days")) } }
        rows.append(("lines", lines.isEmpty ? "None" : "\(lines.count) reviewed line item(s)"))
        return rows
    }
}

struct Guidance: Codable, Equatable {
    var version: Int = 1
    var engine: String
    var generatedAt: String
    var summary: String
    var findings: [Finding]
    var actions: [ActionStep]
    var questions: [String]
    var sourceIds: [String]
    var limitations: [String]
    var aiAssistance: AIAssistance?
    var knowledgeReceipt: [KnowledgeReview]?
    var provenance: GuidanceProvenance?
}
struct KnowledgeReview: Codable, Equatable { var id: String; var reviewedAt: String?; var expiresAt: String? }
struct GuidanceProvenance: Codable, Equatable { var sourceReviews: [KnowledgeReview]? }
struct AIAssistance: Codable, Equatable {
    struct ExplainedFinding: Codable, Equatable { var id: String; var explanation: String }
    struct ExplainedAction: Codable, Equatable { var id: String; var explanation: String; var draft: String }
    var summary: String; var findings: [ExplainedFinding]; var actions: [ExplainedAction]; var questions: [String]
}
struct Finding: Codable, Identifiable, Equatable {
    var id: String; var title: String; var detail: String; var severity: String
    var amountCents: Int?; var evidenceIds: [String]; var sourceIds: [String]
}
struct ActionStep: Codable, Identifiable, Equatable {
    var id: String; var title: String; var reason: String; var steps: [String]; var draft: String; var sourceIds: [String]; var priority: Int
}
struct CaseEvent: Codable, Identifiable, Equatable {
    var id = UUID(); var at = Date(); var kind: String; var note: String
}
struct MemberCase: Codable, Identifiable, Equatable {
    var id = UUID()
    var title = "My bill review"
    var createdAt = Date()
    var updatedAt = Date()
    var saveMode: SaveMode = .device
    var facts = PublicFacts()
    var guidance: Guidance?
    var editedDrafts: [String: String] = [:]
    var events: [CaseEvent] = []
    var followUp: Date?
    var resolved = false
    var confirmedReductionCents: Int?
    var jobID: String?
    var operationID: String?
    var jobStatus: String?
    var consentReceipt: String?
    var workbook: CaseWorkbook? // Optional keeps earlier protected cases decodable.
    var reconciliation: CaseReconciliation? // Device-only; absent on earlier cases.
    var recovery: CaseMoneyRecovery? // Device-only requests; never part of PublicFacts.
    var conversation: CaseConversation? // Reviewed turns only; raw editor text is transient.
    var taskIntake: TaskIntake? // Local task-specific preparation; never added to API facts.
    init() {}
    enum CodingKeys: String, CodingKey { case id, title, createdAt, updatedAt, saveMode, facts, guidance, editedDrafts, events, followUp, resolved, confirmedReductionCents, jobID, operationID, jobStatus, consentReceipt, workbook, reconciliation, recovery, conversation, taskIntake }
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decode(UUID.self, forKey: .id); title = try c.decode(String.self, forKey: .title)
        createdAt = try c.decode(Date.self, forKey: .createdAt); updatedAt = try c.decode(Date.self, forKey: .updatedAt)
        saveMode = try c.decode(SaveMode.self, forKey: .saveMode); facts = try c.decode(PublicFacts.self, forKey: .facts)
        guidance = try c.decodeIfPresent(Guidance.self, forKey: .guidance); editedDrafts = try c.decode([String: String].self, forKey: .editedDrafts)
        events = try c.decode([CaseEvent].self, forKey: .events); followUp = try c.decodeIfPresent(Date.self, forKey: .followUp)
        resolved = try c.decode(Bool.self, forKey: .resolved); confirmedReductionCents = try c.decodeIfPresent(Int.self, forKey: .confirmedReductionCents)
        jobID = try c.decodeIfPresent(String.self, forKey: .jobID); operationID = try c.decodeIfPresent(String.self, forKey: .operationID)
        jobStatus = try c.decodeIfPresent(String.self, forKey: .jobStatus); consentReceipt = try c.decodeIfPresent(String.self, forKey: .consentReceipt)
        workbook = try c.decodeIfPresent(CaseWorkbook.self, forKey: .workbook)
        // Missing is an older case. A present null/invalid value must not reset history.
        reconciliation = c.contains(.reconciliation) ? try c.decode(CaseReconciliation.self, forKey: .reconciliation) : nil
        recovery = c.contains(.recovery) ? try c.decode(CaseMoneyRecovery.self, forKey: .recovery) : nil
        conversation = c.contains(.conversation) ? try c.decode(CaseConversation.self, forKey: .conversation) : nil
        taskIntake = c.contains(.taskIntake) ? try c.decode(TaskIntake.self, forKey: .taskIntake) : nil
    }
}

enum AppError: LocalizedError {
    case invalid(String), service(String), locked, unsupported
    var errorDescription: String? { switch self { case .invalid(let m), .service(let m): m; case .locked: "Unlock your iPhone to open the local vault."; case .unsupported: "This operation is not available on this device. You can enter the key facts instead." } }
}
enum Money {
    static func parse(_ value: String) throws -> Int? {
        var clean = value.trimmingCharacters(in: .whitespacesAndNewlines)
        if clean.isEmpty { return nil }
        if clean.hasPrefix("$") { clean.removeFirst(); if clean.hasPrefix(" ") { clean.removeFirst() } }
        guard clean.range(of: #"^(?:0|[1-9][0-9]{0,7}|[1-9][0-9]{0,2}(?:,[0-9]{3})+)(?:\.[0-9]{1,2})?$"#, options: .regularExpression) != nil else { throw AppError.invalid("Enter dollars and cents, for example 124.50.") }
        let v = clean.replacingOccurrences(of: ",", with: "")
        guard v.count <= 12 else { throw AppError.invalid("That amount is above the supported limit.") }
        let parts = v.split(separator: ".", omittingEmptySubsequences: false)
        let cents = Int(parts[0])! * 100 + (parts.count == 2 ? Int(parts[1].padding(toLength: 2, withPad: "0", startingAt: 0))! : 0)
        guard cents <= 1_000_000_000 else { throw AppError.invalid("That amount is above the supported limit.") }
        return cents
    }
    static func input(_ value: Int?) -> String { guard let v = value else { return "" }; return String(format: "%d.%02d", v / 100, v % 100) }
    static func display(_ value: Int?) -> String { guard let v = value else { return "Not entered" }; return (Decimal(v) / 100).formatted(.currency(code: "USD")) }
}

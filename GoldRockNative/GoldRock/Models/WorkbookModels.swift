import Foundation

/// Local, user-recorded history. Deliberately separate from PublicFacts.
struct CaseWorkbook: Codable, Equatable {
    var version = 1
    var evidence: [WorkbookEvidence] = []
    var processes: [WorkbookProcess] = []
}
struct WorkbookEvidence: Codable, Equatable, Identifiable {
    var id: String; var createdAt: String; var updatedAt: String
    var label: String; var kind: String; var locator: String; var note: String
}
struct WorkbookProcess: Codable, Equatable, Identifiable {
    var id: String; var createdAt: String; var updatedAt: String
    var kind: String; var title: String; var status: String; var notes: String
    var criteria: [WorkbookCriterion]; var deadlines: [WorkbookDeadline]
    var communications: [WorkbookCommunication]; var holds: [WorkbookHold]
    var outcome: WorkbookOutcome?
    enum CodingKeys: String, CodingKey { case id, createdAt, updatedAt, kind, title, status, notes, criteria, deadlines, communications, holds, outcome }
    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id); try c.encode(createdAt, forKey: .createdAt); try c.encode(updatedAt, forKey: .updatedAt)
        try c.encode(kind, forKey: .kind); try c.encode(title, forKey: .title); try c.encode(status, forKey: .status); try c.encode(notes, forKey: .notes)
        try c.encode(criteria, forKey: .criteria); try c.encode(deadlines, forKey: .deadlines); try c.encode(communications, forKey: .communications); try c.encode(holds, forKey: .holds)
        try c.encode(outcome, forKey: .outcome) // Explicit null is required by the strict shared schema.
    }
}
struct WorkbookOutcome: Codable, Equatable { var decision: String; var date: String; var sourceLabel: String; var note: String }
struct WorkbookCriterion: Codable, Equatable, Identifiable {
    var id: String; var createdAt: String; var updatedAt: String
    var requirement: String; var sourceLabel: String; var assessment: String; var evidenceIds: [String]; var note: String
}
struct WorkbookDeadline: Codable, Equatable, Identifiable {
    var id: String; var createdAt: String; var updatedAt: String
    var title: String; var date: String; var kind: String; var confirmed: Bool; var sourceLabel: String; var note: String
}
struct WorkbookCommunication: Codable, Equatable, Identifiable {
    var id: String; var createdAt: String; var updatedAt: String
    var direction: String; var channel: String; var recipient: String; var subject: String
    var sentAt: String?; var receivedAt: String?; var receiptReference: String; var note: String
    enum CodingKeys: String, CodingKey { case id, createdAt, updatedAt, direction, channel, recipient, subject, sentAt, receivedAt, receiptReference, note }
    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id); try c.encode(createdAt, forKey: .createdAt); try c.encode(updatedAt, forKey: .updatedAt)
        try c.encode(direction, forKey: .direction); try c.encode(channel, forKey: .channel); try c.encode(recipient, forKey: .recipient); try c.encode(subject, forKey: .subject)
        try c.encode(sentAt, forKey: .sentAt); try c.encode(receivedAt, forKey: .receivedAt); try c.encode(receiptReference, forKey: .receiptReference); try c.encode(note, forKey: .note)
    }
}
struct WorkbookHold: Codable, Equatable, Identifiable {
    var id: String; var createdAt: String; var updatedAt: String
    var scope: String; var status: String; var requestedAt: String?; var confirmedAt: String?; var throughDate: String?
    var confirmedBy: String; var reference: String; var note: String
    enum CodingKeys: String, CodingKey { case id, createdAt, updatedAt, scope, status, requestedAt, confirmedAt, throughDate, confirmedBy, reference, note }
    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id); try c.encode(createdAt, forKey: .createdAt); try c.encode(updatedAt, forKey: .updatedAt)
        try c.encode(scope, forKey: .scope); try c.encode(status, forKey: .status); try c.encode(requestedAt, forKey: .requestedAt); try c.encode(confirmedAt, forKey: .confirmedAt); try c.encode(throughDate, forKey: .throughDate)
        try c.encode(confirmedBy, forKey: .confirmedBy); try c.encode(reference, forKey: .reference); try c.encode(note, forKey: .note)
    }
}
enum WorkbookLabels {
    static let processes = ["appeal", "correction", "assistance", "billing_hold", "collection", "court", "estimate_dispute"]
    static let statuses = ["preparing", "in_progress", "waiting", "resolved", "closed"]
    static let evidence = ["bill", "eob", "denial", "estimate", "policy", "plan", "receipt", "letter", "note", "other"]
    static let assessments = ["unknown", "supported", "missing", "disputed"]
    static let deadlines = ["filing", "response", "follow_up", "court", "other"]
    static let channels = ["portal", "mail", "fax", "phone", "email", "in_person", "other"]
    static let holds = ["requested", "confirmed", "denied", "expired", "released"]
    static let outcomes = ["approved", "partly_approved", "denied", "withdrawn", "resolved_other"]
    static func title(_ raw: String) -> String { raw.replacingOccurrences(of: "_", with: " ").capitalized }
    static func today() -> String {
        let formatter = DateFormatter(); formatter.calendar = Calendar(identifier: .gregorian); formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = .current; formatter.dateFormat = "yyyy-MM-dd"; return formatter.string(from: Date())
    }
}

struct KnowledgeAnswer: Decodable, Identifiable {
    var id: String; var category: String; var title: String; var question: String; var summary: String
    var mechanism: String; var actions: [String]; var verify: [String]; var avoid: [String]
    var evidence: [String]; var completion: [String]; var sourceIds: [String]
    var reviewedAt: String; var expiresAt: String; var current: Bool
    var tags: [String]; var kind: String; var score: Int?; var matchReasons: [String]?
}

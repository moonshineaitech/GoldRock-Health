import Foundation

struct AdvocacyCategory: Decodable, Identifiable { var id: String; var title: String }
struct AdvocacyField: Decodable, Identifiable {
    var id: String; var label: String; var type: String; var required: Bool
    var options: [String]?; var placeholder: String?; var description: String?
    var privacy: String; var inputMode: String?
}
struct AdvocacyTask: Decodable, Identifiable {
    var id: String; var title: String; var category: String; var purpose: String
    var intakeFields: [AdvocacyField]; var prepare: [String]; var evidence: [String]; var limitations: [String]
    var conversationStarter: String; var sourceIds: [String]; var reviewStatus: String; var summaryGoal: MemberGoal
    var current: Bool?; var sourceCoverage: String?
}
struct AdvocacyCatalog: Decodable { var categories: [AdvocacyCategory]; var tasks: [AdvocacyTask] }

enum TaskIntakeValue: Codable, Equatable {
    case text(String), checked(Bool)
    init(from decoder: Decoder) throws {
        let value = try decoder.singleValueContainer()
        if let boolean = try? value.decode(Bool.self) { self = .checked(boolean) }
        else { self = .text(try value.decode(String.self)) }
    }
    func encode(to encoder: Encoder) throws {
        var value = encoder.singleValueContainer()
        switch self { case .text(let text): try value.encode(text); case .checked(let checked): try value.encode(checked) }
    }
    var object: Any { switch self { case .text(let text): text; case .checked(let checked): checked } }
    var text: String { if case .text(let text) = self { return text }; return "" }
    var checked: Bool? { if case .checked(let value) = self { return value }; return nil }
}

/// A local questionnaire, deliberately outside PublicFacts and the cloud conversation.
/// Decoding goes through the same strict validator as the web. Missing on old cases
/// is allowed; present malformed data must fail instead of discarding the record.
struct TaskIntake: Codable, Equatable {
    var version: Int; var taskId: String; var values: [String: TaskIntakeValue]; var completedAt: String?
    enum CodingKeys: String, CodingKey { case version, taskId, values, completedAt }
    private struct Validated: Decodable { var version: Int; var taskId: String; var values: [String: TaskIntakeValue]; var completedAt: String? }
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: TaskIntakeKey.self)
        guard Set(c.allKeys.map(\.stringValue)) == Set(["version", "taskId", "values", "completedAt"]) else { throw AppError.invalid("The local task record has unrecognized fields. It was kept unchanged.") }
        let version = try c.decode(Int.self, forKey: .init("version")), taskId = try c.decode(String.self, forKey: .init("taskId"))
        let values = try c.decode([String: TaskIntakeValue].self, forKey: .init("values"))
        let completedAt = try c.decodeIfPresent(String.self, forKey: .init("completedAt"))
        let input: [String: Any] = ["version": version, "taskId": taskId, "values": values.mapValues(\.object), "completedAt": completedAt as Any? ?? NSNull()]
        let result = try JSONDecoder().decode(Validated.self, from: LocalGuidance.taskIntakeJSON("validateTaskIntake", arguments: [input]))
        self.version = result.version; self.taskId = result.taskId; self.values = result.values; self.completedAt = result.completedAt
    }
    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(version, forKey: .version); try c.encode(taskId, forKey: .taskId); try c.encode(values, forKey: .values); try c.encode(completedAt, forKey: .completedAt)
    }
}
private struct TaskIntakeKey: CodingKey {
    var stringValue: String; var intValue: Int? { nil }
    init(_ value: String) { stringValue = value }
    init?(stringValue: String) { self.stringValue = stringValue }
    init?(intValue: Int) { return nil }
}

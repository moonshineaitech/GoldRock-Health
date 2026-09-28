import Foundation

/// Only this explicitly reviewed conversation envelope can accompany PublicFacts.
struct ConversationInput: Codable, Equatable {
    struct Exchange: Codable, Equatable { var question: String; var answer: String }
    var question: String; var history: [Exchange]; var knowledgeIds: [String]
}
struct ConversationConsent: Codable, Equatable {
    var policyVersion: String; var approvedFields: [String]
    var processor = "openai"; var accepted = true; var conversationReviewed = true
}
struct CaseConversation: Codable, Equatable {
    private let storage: ConversationJSON
    let turns: [ConversationTurn]
    init() { storage = .object(["version": .integer(1), "turns": .array([])]); turns = [] }
    init(from decoder: Decoder) throws {
        let input = try ConversationJSON(from: decoder)
        let data = try LocalGuidance.conversationJSON("validateConversation", arguments: [input.foundationValue])
        storage = try JSONDecoder().decode(ConversationJSON.self, from: data)
        turns = try JSONDecoder().decode(ConversationContainer.self, from: data).turns
    }
    func encode(to encoder: Encoder) throws { try storage.encode(to: encoder) }
    var object: Any { storage.foundationValue }
}
private struct ConversationContainer: Decodable { var version: Int; var turns: [ConversationTurn] }
struct ConversationTurn: Decodable, Equatable, Identifiable {
    var id: String; var createdAt: String; var question: String; var history: [ConversationInput.Exchange]
    var knowledgeIds: [String]; var historyTurnIds: [String]; var facts: PublicFacts; var replyToId: String?; var consent: ConversationConsent?
    var events: [ConversationEvent]
    var input: ConversationInput { ConversationInput(question: question, history: history, knowledgeIds: knowledgeIds) }
    var jobID: String? { events.first { $0.kind == "job" }?.jobId }
    var pending: Bool { !events.contains { ["completed", "failed", "canceled"].contains($0.kind) } }
}
struct ConversationEvent: Decodable, Equatable, Identifiable {
    var id: String; var createdAt: String; var kind: String; var jobId: String?; var answer: String?; var answerKind: String?
    var sourceIds: [String]; var followUpQuestions: [String]; var nextSteps: [ConversationAnswer.NextStep]
    var limitations: [String]; var sourceReceipt: [KnowledgeReview]; var errorCode: String?
}
struct ConversationSummary: Decodable {
    var version: Int; var turns: [ConversationTurnSummary]; var notice: String
}
struct ConversationTurnSummary: Decodable, Identifiable {
    var id: String; var createdAt: String; var replyToId: String?; var question: String; var status: String
    var jobId: String?; var terminalEventId: String?; var errorCode: String?; var answerKind: String?
    var sourceIds: [String]; var sourceReceipt: [KnowledgeReview]; var factsChanged: Bool?; var sourcesCurrent: Bool
    var answerAvailable: Bool; var canUseAsContext: Bool; var contextCurrent: Bool; var answer: String?
    var followUpQuestions: [String]; var nextSteps: [ConversationAnswer.NextStep]; var limitations: [String]
}
struct ConversationCandidate: Decodable {
    var candidate: String; var flags: [String]; var requiresReview: Bool; var limitations: [String]
}
struct ConversationAnswer: Codable, Equatable {
    struct NextStep: Codable, Equatable { var title: String; var steps: [String]; var sourceIds: [String] }
    struct Provenance: Codable, Equatable {
        var provider: String; var requestedModel: String?; var returnedModel: String?
        var sourceReviews: [KnowledgeReview]; var knowledgeIds: [String]; var responseStorageRequested: Bool
    }
    var kind: String; var engine: String; var generatedAt: String; var answer: String; var sourceIds: [String]
    var followUpQuestions: [String]; var nextSteps: [NextStep]; var limitations: [String]
    var provenance: Provenance; var knowledgeReceipt: [KnowledgeReview]
}
struct ConversationRemoteJob: Decodable {
    struct Job: Decodable { var id: String; var status: String; var expiresAt: String?; var result: ConversationAnswer?; var error: RemoteJob.JobError? }
    var job: Job
}

private indirect enum ConversationJSON: Codable, Equatable {
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
        case .null: try c.encodeNil(); case .bool(let v): try c.encode(v); case .integer(let v): try c.encode(v)
        case .number(let v): try c.encode(v); case .string(let v): try c.encode(v); case .array(let v): try c.encode(v); case .object(let v): try c.encode(v)
        }
    }
    var foundationValue: Any {
        switch self { case .null: NSNull(); case .bool(let v): v; case .integer(let v): v; case .number(let v): v; case .string(let v): v; case .array(let v): v.map(\.foundationValue); case .object(let v): v.mapValues(\.foundationValue) }
    }
}

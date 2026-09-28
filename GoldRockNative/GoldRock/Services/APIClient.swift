import Foundation

struct APIUser: Codable, Equatable { var id: String; var email: String; var displayName: String }
struct Benefit: Codable, Identifiable, Equatable { var id: String; var organizationId: String; var name: String; var status: String; var endsAt: String? }
struct OrganizationRole: Codable, Identifiable, Equatable { var id: String; var name: String; var role: String }
struct SessionResponse: Codable { var user: APIUser?; var benefits: [Benefit]; var organizations: [OrganizationRole]; var accessToken: String? }
struct RecoveryCodeResponse: Decodable { var recoveryCode: String; var expiresAt: String }
struct ServerConfig: Codable {
    struct Cloud: Codable { var configured: Bool; var enabled: Bool; var provider: String; var model: String?; var reason: String? }
    struct Privacy: Codable { var jobTtlSeconds: Int; var originalUpload: Bool; var policyVersion: String; var providerRetention: String? }
    var environment: String; var schemaVersion: Int; var cloud: Cloud; var privacy: Privacy
}
struct RemoteJob: Codable {
    struct Job: Codable { var id: String; var status: String; var expiresAt: String?; var result: Guidance?; var error: JobError? }
    struct JobError: Codable { var code: String?; var message: String? }
    var job: Job
}
struct ResearchCatalog: Decodable {
    struct Provider: Decodable, Identifiable { var id: String; var name: String; var stateScope: [String]; var policyUrl: String; var reviewedAt: String; var expiresAt: String }
    var providers: [Provider]
}
struct ResearchResponse: Decodable {
    struct Research: Decodable {
        struct PageLink: Decodable { var title: String; var url: String }
        var providerId: String; var title: String; var url: String; var publisher: String
        var fetchedAt: String; var catalogReviewedAt: String; var contentHash: String; var contentType: String
        var status: String; var text: String; var links: [PageLink]; var truncated: Bool; var applicability: String
        var trustedForInstructions: Bool; var effectiveDate: String?; var limitations: [String]
    }
    var research: Research
}
private struct APIErrorEnvelope: Decodable { struct Detail: Decodable { var code: String; var message: String }; var error: Detail }
private struct Empty: Codable {}
struct HTTPFailure: LocalizedError { var status: Int; var code: String; var message: String; var errorDescription: String? { message } }
private final class NoRedirects: NSObject, URLSessionTaskDelegate {
    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse, newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) { completionHandler(nil) }
}

/// No document upload API, cookie persistence, analytics or provider keys in the app.
@MainActor final class APIClient {
    let baseURL: URL
    private let session: URLSession
    private(set) var token: String?
    private var tokenAccount: String { "session-" + DeviceKeychain.digest(baseURL.absoluteString) }
    init(baseURL: URL, protocolClasses: [AnyClass]? = nil) {
        self.baseURL = baseURL
        let config = URLSessionConfiguration.ephemeral
        config.httpCookieStorage = nil; config.urlCache = nil
        config.requestCachePolicy = .reloadIgnoringLocalAndRemoteCacheData
        config.timeoutIntervalForRequest = 35; config.timeoutIntervalForResource = 60
        if let protocolClasses { config.protocolClasses = protocolClasses }
        session = URLSession(configuration: config, delegate: NoRedirects(), delegateQueue: nil)
    }
    func restoreToken() throws { token = try DeviceKeychain.read(tokenAccount).flatMap { String(data: $0, encoding: .utf8) } }
    func forgetToken() throws { token = nil; try DeviceKeychain.delete(tokenAccount) }
    static func checkedBaseURL(_ string: String) throws -> URL {
        guard let url = URL(string: string), let host = url.host, url.user == nil, url.password == nil, url.query == nil, url.fragment == nil else { throw AppError.invalid("Enter the HTTPS address of your GoldRock service.") }
        if url.scheme == "https" { return url }
        #if DEBUG
        if url.scheme == "http", ["localhost", "127.0.0.1", "::1"].contains(host) { return url }
        #endif
        throw AppError.invalid("A secure HTTPS server is required. Only a simulator's loopback address is permitted in Debug.")
    }
    private func request<Response: Decodable>(_ method: String, _ path: String, body: Data? = nil, idempotency: String? = nil, authenticated: Bool = true) async throws -> Response {
        var req = URLRequest(url: baseURL.appendingPathComponent(path))
        req.httpMethod = method
        req.httpBody = body ?? (["POST", "PUT", "PATCH", "DELETE"].contains(method) ? Data("{}".utf8) : nil)
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("native", forHTTPHeaderField: "X-GoldRock-Client")
        if authenticated, let token { req.setValue("Bearer " + token, forHTTPHeaderField: "Authorization") }
        if let idempotency { req.setValue(idempotency, forHTTPHeaderField: "Idempotency-Key") }
        let (data, response) = try await session.data(for: req)
        guard let http = response as? HTTPURLResponse else { throw AppError.service("The service returned an unreadable response.") }
        guard (200...299).contains(http.statusCode) else {
            let detail = try? JSONDecoder().decode(APIErrorEnvelope.self, from: data)
            throw HTTPFailure(status: http.statusCode, code: detail?.error.code ?? "http_error", message: detail?.error.message ?? "The service could not complete this request. Please try again.")
        }
        if Response.self == Empty.self, data.isEmpty { return Empty() as! Response }
        return try JSONDecoder().decode(Response.self, from: data)
    }
    func config() async throws -> ServerConfig { try await request("GET", "api/config") }
    func currentSession() async throws -> SessionResponse { try await request("GET", "api/session") }
    func authenticate(email: String, password: String, name: String, register: Bool) async throws -> SessionResponse {
        var fields = ["email": email, "password": password]
        if register { fields["displayName"] = name }
        let result: SessionResponse = try await request("POST", register ? "api/auth/register" : "api/auth/login", body: JSONEncoder().encode(fields))
        try acceptSession(result)
        return result
    }
    private func acceptSession(_ result: SessionResponse) throws {
        guard let access = result.accessToken, result.user != nil else { throw AppError.service("The service did not issue a native session. Check the server configuration.") }
        try DeviceKeychain.write(Data(access.utf8), account: tokenAccount); token = access
    }
    func createRecoveryCode(password: String) async throws -> RecoveryCodeResponse { try await request("POST", "api/account/recovery-code", body: JSONEncoder().encode(["password": password])) }
    func revokeRecoveryCode(password: String) async throws { let _: Empty = try await request("DELETE", "api/account/recovery-code", body: JSONEncoder().encode(["password": password])) }
    func changePassword(current: String, new: String) async throws -> SessionResponse {
        let result: SessionResponse = try await request("POST", "api/account/password", body: JSONEncoder().encode(["currentPassword": current, "newPassword": new]))
        try acceptSession(result); return result
    }
    func recoverAccount(email: String, code: String, password: String) async throws -> SessionResponse {
        let result: SessionResponse = try await request("POST", "api/auth/recover", body: JSONEncoder().encode(["email": email, "recoveryCode": code, "newPassword": password]), authenticated: false)
        try acceptSession(result); return result
    }
    func logout() async throws { let _: Empty = try await request("POST", "api/auth/logout", body: Data("{}".utf8)); try forgetToken() }
    func deleteAccount(password: String) async throws { let _: Empty = try await request("DELETE", "api/account", body: JSONEncoder().encode(["password": password])); try forgetToken() }
    func redeem(_ invite: String) async throws { let _: Empty = try await request("POST", "api/benefits/redeem", body: JSONEncoder().encode(["token": invite])) }
    func unlink(_ id: String) async throws { let _: Empty = try await request("DELETE", "api/benefits/" + id) }
    func createJob(facts: PublicFacts, operationID: String, policyVersion: String) async throws -> RemoteJob {
        struct Consent: Encodable { var policyVersion: String; var approvedFields: [String]; var processor = "openai"; var accepted = true }
        struct Payload: Encodable { var clientOperationId: String; var facts: PublicFacts; var consent: Consent }
        let approved = try facts.validated()
        return try await request("POST", "api/jobs", body: JSONEncoder().encode(Payload(clientOperationId: operationID, facts: approved, consent: Consent(policyVersion: policyVersion, approvedFields: approved.approvedFields))), idempotency: operationID)
    }
    func job(_ id: String) async throws -> RemoteJob { try await request("GET", "api/jobs/" + id) }
    func createConversation(facts: PublicFacts, conversation: ConversationInput, operationID: String, consent: ConversationConsent) async throws -> ConversationRemoteJob {
        struct Payload: Encodable { var clientOperationId: String; var facts: PublicFacts; var conversation: ConversationInput; var consent: ConversationConsent }
        let approved = try facts.validated()
        let reviewed = try LocalGuidance.validateConversationInput(conversation)
        return try await request("POST", "api/conversations", body: JSONEncoder().encode(Payload(clientOperationId: operationID, facts: approved, conversation: reviewed, consent: consent)), idempotency: operationID)
    }
    func conversationJob(_ id: String) async throws -> ConversationRemoteJob { try await request("GET", "api/jobs/" + id) }
    func conversationByOperation(_ id: String) async throws -> ConversationRemoteJob { try await request("GET", "api/jobs/by-operation/" + id) }
    func deleteConversationOperation(_ id: String) async throws { let _: Empty = try await request("DELETE", "api/jobs/by-operation/" + id) }
    func cancelJob(_ id: String) async throws {
        do { let _: Empty = try await request("DELETE", "api/jobs/" + id) }
        catch let failure as HTTPFailure where failure.status == 404 { return } // Already absent for this authenticated owner.
    }
    func researchCatalog() async throws -> ResearchCatalog { try await request("GET", "api/research/catalog", authenticated: false) }
    func publicPolicy(_ providerID: String) async throws -> ResearchResponse {
        struct Consent: Encodable { var publicLookup = true }
        struct Lookup: Encodable { var providerId: String; var consent = Consent() }
        return try await request("POST", "api/research/lookup", body: JSONEncoder().encode(Lookup(providerId: providerID)), authenticated: false)
    }
}

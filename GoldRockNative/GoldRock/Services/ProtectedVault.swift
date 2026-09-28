import Foundation
import CryptoKit
import Security
import LocalAuthentication

enum DeviceKeychain {
    private static let service = "com.goldrockhealth.local.v1"
    static func read(_ account: String) throws -> Data? {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: account, kSecReturnData as String: true, kSecMatchLimit as String: kSecMatchLimitOne]
        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        if status == errSecItemNotFound { return nil }
        guard status == errSecSuccess else { throw AppError.locked }
        return item as? Data
    }
    static func write(_ data: Data, account: String) throws {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: account]
        let status = SecItemUpdate(query as CFDictionary, [kSecValueData as String: data] as CFDictionary)
        if status == errSecItemNotFound {
            var item = query
            item[kSecValueData as String] = data
            item[kSecAttrAccessible as String] = kSecAttrAccessibleWhenUnlockedThisDeviceOnly
            item[kSecAttrSynchronizable as String] = false
            guard SecItemAdd(item as CFDictionary, nil) == errSecSuccess else { throw AppError.locked }
        } else if status != errSecSuccess { throw AppError.locked }
    }
    static func delete(_ account: String) throws {
        let status = SecItemDelete([kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: service, kSecAttrAccount as String: account] as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else { throw AppError.locked }
    }
    static func digest(_ value: String) -> String { SHA256.hash(data: Data(value.utf8)).map { String(format: "%02x", $0) }.joined() }
}

/// Small local case records only; no original documents, OCR, image bytes or detector maps.
/// The encryption key is device-only. Losing this iPhone loses unsynced cases.
final class ProtectedVault {
    private let fm = FileManager.default
    private func location(_ scope: String) throws -> URL {
        var directory = try fm.url(for: .applicationSupportDirectory, in: .userDomainMask, appropriateFor: nil, create: true).appendingPathComponent("PrivateCases", isDirectory: true)
        try fm.createDirectory(at: directory, withIntermediateDirectories: true, attributes: [.protectionKey: FileProtectionType.complete])
        var values = URLResourceValues(); values.isExcludedFromBackup = true
        try directory.setResourceValues(values)
        return directory.appendingPathComponent(DeviceKeychain.digest(scope) + ".vault")
    }
    private func key(_ scope: String, create: Bool) throws -> SymmetricKey {
        let account = "vault-" + DeviceKeychain.digest(scope)
        if let bytes = try DeviceKeychain.read(account) { return SymmetricKey(data: bytes) }
        guard create else { throw AppError.service("This vault's device key is missing. Its encrypted contents cannot be recovered.") }
        let key = SymmetricKey(size: .bits256)
        try key.withUnsafeBytes { try DeviceKeychain.write(Data($0), account: account) }
        return key
    }
    func load(scope: String) throws -> [MemberCase] {
        let file = try location(scope)
        guard fm.fileExists(atPath: file.path) else { return [] }
        let data = try Data(contentsOf: file)
        let plain = try AES.GCM.open(AES.GCM.SealedBox(combined: data), using: key(scope, create: false), authenticating: Data(scope.utf8))
        return try JSONDecoder().decode([MemberCase].self, from: plain)
    }
    func save(_ cases: [MemberCase], scope: String) throws {
        let saved = cases.filter { $0.saveMode == .device }
        guard saved.count <= 100 else { throw AppError.invalid("Export and remove a case before keeping more than 100 on this device.") }
        let file = try location(scope)
        let data = try JSONEncoder().encode(saved)
        guard let sealed = try AES.GCM.seal(data, using: key(scope, create: true), authenticating: Data(scope.utf8)).combined else { throw AppError.service("The case could not be encrypted.") }
        try sealed.write(to: file, options: [.atomic, .completeFileProtection])
        var resource = file; var values = URLResourceValues(); values.isExcludedFromBackup = true
        try resource.setResourceValues(values)
    }
    func erase(scope: String) throws {
        let file = try location(scope)
        if fm.fileExists(atPath: file.path) { try fm.removeItem(at: file) }
        try DeviceKeychain.delete("vault-" + DeviceKeychain.digest(scope))
    }
    @MainActor static func authenticate() async throws {
        let context = LAContext()
        var issue: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &issue) else { throw AppError.service("Set an iPhone passcode to keep a protected local case vault. You can still use a one-time session.") }
        guard try await context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: "Open your private GoldRock cases") else { throw AppError.locked }
    }
    @MainActor static var canAuthenticate: Bool { LAContext().canEvaluatePolicy(.deviceOwnerAuthentication, error: nil) }
}

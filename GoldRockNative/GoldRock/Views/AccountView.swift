import SwiftUI

struct AccountView: View {
    @Environment(AppStore.self) private var store
    @State private var signIn = false
    @State private var deletion = false
    @State private var erase = false
    @State private var invitation = ""
    @State private var address = ""
    var body: some View {
        NavigationStack {
            List {
                Section { EditorialListHeader(eyebrow: "Your account. Your choices.", title: "Useful help.\nA private place for it.", detail: "Manage your account, benefit and the information you keep on this iPhone.", artwork: .clarity) }
                if let notice = store.notice { Section { Label(notice, systemImage: "info.circle"); Button("Dismiss message") { store.notice = nil } } }
                Section("Your personal account") {
                    if let user = store.user {
                        EditorialFeatureRow(title: user.displayName, detail: user.email, symbol: "person.crop.circle", showsChevron: false)
                        NavigationLink("Password and recovery") { AccountSecurityView() }
                        Button("Sign out") { Task { await store.logout() } }.disabled(store.busy)
                        Button("Delete my account", role: .destructive) { deletion = true }
                    } else {
                        Text("Local checks work without an account. Sign in to link your employer benefit and use an enabled AI service.")
                        ChromeAction(title: "Sign in or create an account", symbol: "person") { signIn = true }
                    }
                    Text("Your personal identity is separate from who sponsors your benefit. Kept cases are separated by account on this iPhone; signing in does not silently move guest cases.").font(.footnote).foregroundStyle(.secondary)
                }
                if store.user != nil {
                    Section("Your benefit") {
                        EditorialIllustration(artwork: .work, height: 138).listRowInsets(EdgeInsets()).listRowBackground(Color.clear)
                        if store.benefits.isEmpty { EditorialFeatureRow(title: "A benefit that belongs to you.", detail: "Use your invitation code to link employer-sponsored access.", symbol: "gift", showsChevron: false) }
                        ForEach(store.benefits) { benefit in
                            VStack(alignment: .leading, spacing: 6) { Text(benefit.name).font(.headline); Text(benefit.status.capitalized); if let ends = benefit.endsAt { Text("Ends: \(String(ends.prefix(10)))").font(.footnote) }; Button("Unlink \(benefit.name)", role: .destructive) { Task { await store.unlink(benefit.id) } }
                        }
                        TextField("Invitation code", text: $invitation).textInputAutocapitalization(.never).autocorrectionDisabled().privacySensitive()
                        Button("Link employer benefit") { Task { await store.redeem(invitation); invitation = "" } }.disabled(invitation.isEmpty || store.busy)
                        Text("An invitation grants access to the benefit. Your employer gets no access to your cases, documents, questions or individual analysis.").font(.footnote).foregroundStyle(.secondary)
                    }
                }
                Section("Privacy on this iPhone") {
                    StatusPill(title: store.sessionOnly ? "One-time session" : "Protected device vault", symbol: store.sessionOnly ? "clock" : "lock.iphone")
                    DisclosureGroup("How your local saving works") {
                        Text("Original documents are read temporarily. Saved cases contain reviewed facts, guidance, drafts and approved conversation history, encrypted with a device-only key. They are excluded from backups and are not synced to iCloud.")
                        Text("App switches hide your workspace but preserve one-time cases in process memory. Resume uses device authentication when available. Ending the session, changing accounts or process termination clears them. Cloud jobs have their own retention period.").foregroundStyle(.secondary)
                    }
                    Button("End session and lock", systemImage: "lock") { store.lock() }
                    Button("Erase this local vault", role: .destructive) { erase = true }
                    Text("Exports and files you originally imported remain in their own apps. GoldRock cannot delete them.").font(.footnote).foregroundStyle(.secondary)
                }
                Section("On-device intelligence") {
                    LabeledContent("OCR", value: "Apple Vision")
                    LabeledContent("Sensitive-detail checks", value: "Local rules + language tags")
                    Text(OnDeviceAssistant.availability)
                    Text("The optional local model helps classify documents and flag exact identifying spans. It never replaces your review. Document analysis sends approved typed facts. Conversation requests additionally send the exact question and selected history you separately approve. If unavailable, use local OCR and manual correction; no cloud fallback runs.").font(.footnote).foregroundStyle(.secondary)
                }
                Section { DisclosureGroup("Service connection") {
                    Text(store.serverAddress).font(.footnote.monospaced()).textSelection(.enabled)
                    if let config = store.config {
                        LabeledContent("Environment", value: config.environment)
                        LabeledContent("Cloud AI", value: config.cloud.enabled && config.cloud.configured ? "Enabled" : "Unavailable")
                        if let reason = config.cloud.reason { Text(reason).font(.footnote).foregroundStyle(.secondary) }
                    }
                    Button("Check connection") { Task { await store.refreshConnection() } }.disabled(store.busy)
                    #if DEBUG
                    DisclosureGroup("Development server") {
                        TextField("HTTPS server or simulator loopback", text: $address).keyboardType(.URL).textInputAutocapitalization(.never).autocorrectionDisabled()
                        Button("Use server and lock workspace") { Task { await store.changeServer(address) } }.disabled(store.user != nil)
                        Text("A physical phone needs an HTTPS server it can reach. Simulator localhost refers to the Mac running the simulator.").font(.footnote).foregroundStyle(.secondary)
                    }
                    #endif
                } }
                Section("About GoldRock") {
                    Text("GoldRock helps you advocate for yourself. It does not contact providers, submit appeals, negotiate bills or make payments on your behalf.")
                    Text("Your personal account uses a password and optional recovery code. Kept cases stay on this device; account recovery does not restore a lost device vault.").font(.footnote).foregroundStyle(.secondary)
                    NavigationLink("Source library") { SourceLibraryView() }
                }
            }.goldRockScreen().navigationTitle("You").navigationBarTitleDisplayMode(.inline)
                .sheet(isPresented: $signIn) { AuthenticationView() }
                .sheet(isPresented: $deletion) { DeleteAccountView() }
                .confirmationDialog("Erase the current local vault?", isPresented: $erase, titleVisibility: .visible) { Button("Erase local vault", role: .destructive) { do { try store.eraseLocalVault() } catch { store.error = error.localizedDescription } } } message: { Text("This removes kept case data and its device key for this profile. There is no cloud backup to restore it. Delete cloud-linked cases first.") }
                .onAppear { address = store.serverAddress }
        }
    }
}
struct AuthenticationView: View {
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var register = false
    @State private var email = ""
    @State private var password = ""
    @State private var name = ""
    @State private var recovery = false
    @State private var bringGuestCases = false
    var body: some View {
        NavigationStack {
            Form {
                Section { EditorialListHeader(eyebrow: "A personal account", title: "Your benefit.\nYour own workspace.", detail: "Sign in to connect sponsored access. Your employer cannot see your private cases.") }
                Section { Picker("Account", selection: $register) { Text("Sign in").tag(false); Text("Create account").tag(true) }.pickerStyle(.segmented) }
                Section {
                    TextField("Personal email", text: $email).textContentType(.emailAddress).keyboardType(.emailAddress).textInputAutocapitalization(.never).autocorrectionDisabled()
                    if register { TextField("Preferred name", text: $name).textContentType(.givenName) }
                    SecureField("Password", text: $password).textContentType(register ? .newPassword : .password)
                    if register { Text("Use at least 12 characters. After signing in, create an optional recovery code. There is no verified email reset service in this build.").font(.footnote).foregroundStyle(.secondary) }
                    ChromeAction(title: register ? "Create personal account" : "Sign in", symbol: "arrow.right") {
                        Task { let success = await store.authenticate(email: email, password: password, name: name, register: register, bringGuestCases: bringGuestCases); password = ""; if success { dismiss() } }
                    }.disabled(store.busy || email.isEmpty || password.isEmpty || (register && (name.isEmpty || password.count < 12)))
                    if !register { Button("Use a recovery code") { recovery = true } }
                }
                if store.user == nil && !store.cases.isEmpty {
                    Section("Your current work") {
                        Toggle("Bring a copy of my \(store.cases.count) guest case(s) into this account on this iPhone", isOn: $bringGuestCases)
                        Text("Optional and unchecked by default. Copies get new IDs and remain one-time until you explicitly save them. Existing account cases and the original guest vault are not overwritten. Without this choice, one-time guest work ends when you sign in.").font(.footnote).foregroundStyle(.secondary)
                    }
                }
                Section { Text("Your employer sponsorship is linked after sign-in. Changing accounts locks the current local workspace and opens the other account's separate vault.").font(.footnote).foregroundStyle(.secondary) }
            }.goldRockScreen().navigationTitle("Your account").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { password = ""; dismiss() } } }
                .onDisappear { password = "" }
                .sheet(isPresented: $recovery) { RecoverAccountView() }
        }
    }
}
struct AccountSecurityView: View {
    @Environment(AppStore.self) private var store
    @State private var currentPassword = ""
    @State private var newPassword = ""
    @State private var confirmation = ""
    @State private var code: RecoveryCodeResponse?
    @State private var busy = false
    @State private var revoke = false
    @State private var problem: String?
    var body: some View {
        Form {
            Section { EditorialListHeader(eyebrow: "Account security", title: "Keep your way\nback in.", detail: "Update your password and keep a recovery code somewhere private.") }
            Section("Confirm it's you") { SecureField("Current password", text: $currentPassword).textContentType(.password); Text("Credentials and codes are never stored in case records.").font(.footnote).foregroundStyle(.secondary) }
            Section("Change password") {
                SecureField("New password", text: $newPassword).textContentType(.newPassword)
                SecureField("Repeat new password", text: $confirmation).textContentType(.newPassword)
                Button("Change password and sign out other sessions") { perform { try await store.changePassword(current: currentPassword, new: newPassword); newPassword = ""; confirmation = ""; code = nil } }.disabled(busy || currentPassword.isEmpty || newPassword.count < 12 || newPassword != confirmation)
                Text("A password change also revokes any saved recovery code. Generate a new code afterward if you want one.").font(.footnote).foregroundStyle(.secondary)
            }
            Section("One-time recovery code") {
                Text("Create a code to recover this personal account if you forget its password. It expires after one year, can be used once, and is replaced whenever you generate another.")
                Text("A code cannot decrypt a lost iPhone vault or restore unsynced cases. Your employer cannot recover those records.").font(.footnote).foregroundStyle(.secondary)
                Button("Generate or replace recovery code") { perform { code = try await store.createRecoveryCode(password: currentPassword) } }.disabled(busy || currentPassword.isEmpty)
                Button("Revoke recovery code", role: .destructive) { revoke = true }.disabled(busy || currentPassword.isEmpty)
                if let code {
                    Text("Shown once. Save it somewhere private before leaving this screen.").font(.headline)
                    Text(code.recoveryCode).font(.body.monospaced()).textSelection(.enabled).privacySensitive()
                    Text("Expires \(String(code.expiresAt.prefix(10)))").font(.caption)
                    ShareLink(item: "GoldRock account recovery code\n\(code.recoveryCode)\nExpires \(code.expiresAt)\nKeep private. This does not recover a local device vault.") { Label("Choose where to save this code", systemImage: "square.and.arrow.up") }
                    Text("Sharing makes a copy in the destination you choose. Anyone with this code and your account email may recover the account.").font(.footnote).foregroundStyle(.secondary)
                }
            }
            if let problem { Section { Text(problem).foregroundStyle(.red) } }
            if busy { ProgressView("Updating account security…") }
        }.goldRockScreen().navigationTitle("Account security").navigationBarTitleDisplayMode(.inline)
            .confirmationDialog("Revoke the current recovery code?", isPresented: $revoke, titleVisibility: .visible) { Button("Revoke code", role: .destructive) { perform { try await store.revokeRecoveryCode(password: currentPassword); code = nil } } }
            .onDisappear { currentPassword = ""; newPassword = ""; confirmation = ""; code = nil }
    }
    private func perform(_ operation: @escaping () async throws -> Void) { busy = true; problem = nil; Task { do { try await operation() } catch { problem = error.localizedDescription }; currentPassword = ""; busy = false } }
}
struct RecoverAccountView: View {
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var email = ""
    @State private var code = ""
    @State private var password = ""
    @State private var repeated = ""
    @State private var bringGuestCases = false
    var body: some View {
        NavigationStack {
            Form {
                Section { Text("Use the code you previously saved. Recovery consumes it, changes your password and invalidates other sessions. Local device cases are not synced or recovered by this action.") }
                Section {
                    TextField("Account email", text: $email).textContentType(.emailAddress).keyboardType(.emailAddress).textInputAutocapitalization(.never).autocorrectionDisabled()
                    SecureField("One-time recovery code", text: $code).textInputAutocapitalization(.never).autocorrectionDisabled()
                    SecureField("New password", text: $password).textContentType(.newPassword)
                    SecureField("Repeat new password", text: $repeated).textContentType(.newPassword)
                    if store.user == nil && !store.cases.isEmpty { Toggle("Bring a one-time copy of my current guest cases into this account on this iPhone", isOn: $bringGuestCases); Text("Copies get fresh IDs. Existing account and guest vaults are not overwritten.").font(.footnote).foregroundStyle(.secondary) }
                    Button("Recover account") { Task { let success = await store.recoverAccount(email: email, code: code.trimmingCharacters(in: .whitespacesAndNewlines), password: password, bringGuestCases: bringGuestCases); code = ""; password = ""; repeated = ""; if success { dismiss() } } }.disabled(store.busy || email.isEmpty || code.isEmpty || password.count < 12 || password != repeated)
                }
            }.goldRockScreen().navigationTitle("Recover account").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { dismiss() } } }
                .onDisappear { code = ""; password = ""; repeated = "" }
        }
    }
}
struct DeleteAccountView: View {
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var password = ""
    @State private var confirmed = false
    var body: some View {
        NavigationStack {
            Form {
                Section { Text("Delete your account").font(.title2); Text("This invalidates your sessions and pending analyses. This account's local vault will be erased after the server confirms deletion. Other devices and exported copies must be handled separately.") }
                Section { SecureField("Confirm your password", text: $password).textContentType(.password); Toggle("I understand this cannot be undone", isOn: $confirmed); Button("Delete account and local vault", role: .destructive) { Task { if await store.deleteAccount(password: password) { password = ""; dismiss() } } }.disabled(!confirmed || password.isEmpty || store.busy) }
            }.goldRockScreen().navigationTitle("Account deletion").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { password = ""; dismiss() } } }
                .onDisappear { password = "" }
        }
    }
}
struct SourceLibraryView: View {
    @State private var search = ""
    @State private var sources: [PolicySource] = []
    var body: some View {
        List {
            Section { EditorialListHeader(eyebrow: "Go to the source", title: "Clear guidance has\na paper trail.", detail: "Explore the official sources behind the library. Always check which policy or plan applies to your situation.") }
            ForEach(sources.filter { search.isEmpty || $0.title.localizedCaseInsensitiveContains(search) || $0.publisher.localizedCaseInsensitiveContains(search) }) { source in
                Section(source.publisher) {
                    if let url = URL(string: source.url) { Link(source.title, destination: url) }
                    Text(source.summary); Text(source.applicability).font(.footnote).foregroundStyle(.secondary)
                    Text("Reviewed \(String(source.reviewedAt.prefix(10))) · review expires \(String(source.expiresAt.prefix(10)))").font(.caption).foregroundStyle(.secondary)
                }
            }
        }.goldRockScreen().navigationTitle("Source library").navigationBarTitleDisplayMode(.inline).searchable(text: $search, prompt: "Search sources and publishers")
            .onAppear { sources = (try? LocalGuidance.sources()) ?? [] }
    }
}

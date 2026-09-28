import SwiftUI
import VisionKit
import UniformTypeIdentifiers

struct IntakeView: View {
    let goal: MemberGoal
    var taskIntake: TaskIntake? = nil
    var suggestedTitle: String? = nil
    var questionDraft: Binding<String>? = nil
    var onCreate: (UUID) -> Void
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var phase
    @State private var facts = PublicFacts()
    @State private var title = "My bill review"
    @State private var mode: SaveMode = .device
    @State private var imported: IntakeResult?
    @State private var importing = false
    @State private var scanning = false
    @State private var replacingPreparation = false
    @State private var replaceWithScan = false
    @State private var busy = false
    @State private var message: String?
    @State private var problem: String?
    @State private var fieldErrors: Set<String> = []
    @State private var editVersion = UUID()
    @State private var confirmed = false
    @State private var checkedImportedFacts = false
    @State private var modelSuggestion: DeviceAssistance?
    @State private var task: Task<Void, Never>?
    @State private var workspace: UUID?
    @State private var preparationID = UUID()
    @State private var showFacts = true
    init(goal: MemberGoal, taskIntake: TaskIntake? = nil, suggestedTitle: String? = nil, questionDraft: Binding<String>? = nil, onCreate: @escaping (UUID) -> Void) {
        self.goal = goal; self.taskIntake = taskIntake; self.suggestedTitle = suggestedTitle; self.questionDraft = questionDraft; self.onCreate = onCreate
    }
    var body: some View {
        NavigationStack {
            Form {
                Section {
                    EditorialListHeader(eyebrow: "Your bill advocate", title: "What do you need\nhelp with?", detail: "Bring a bill, a denial or a question. Start with what you know.")
                    if let questionDraft {
                        TextField("For example: My claim was denied. Help me plan the appeal and draft what to say.", text: questionDraft, axis: .vertical).lineLimit(4...8)
                        Text("This question stays in memory until you review exactly what to share. Names, IDs and document text are not needed.").font(.footnote).foregroundStyle(.secondary)
                    }
                    IntakeJourney(step: imported == nil ? 1 : 2).listRowBackground(Color.clear)
                }
                Section {
                    if VNDocumentCameraViewController.isSupported { Button { chooseInput(scan: true) } label: { EditorialFeatureRow(title: "Scan your pages", detail: "Use your iPhone camera to read a paper bill.", symbol: "doc.viewfinder") }.buttonStyle(.plain).disabled(busy) }
                    Button { chooseInput(scan: false) } label: { EditorialFeatureRow(title: "Choose a document", detail: "Open a PDF or image from your files.", symbol: "folder") }.buttonStyle(.plain).disabled(busy)
                    Label("Read on this iPhone. Original files are not uploaded.", systemImage: "iphone.gen3").font(.footnote).foregroundStyle(.secondary)
                    Text("Up to 20 pages or 20 MB. You can enter everything below without importing a file.").font(.footnote).foregroundStyle(.secondary)
                }
                if busy { Section { ProgressView("Preparing on this iPhone…"); Button("Cancel preparation") { task?.cancel(); task = nil; busy = false } } }
                if let problem { Section { Label(problem, systemImage: "exclamationmark.circle").foregroundStyle(.red) } }
                if let result = imported {
                    Section("Local privacy check") {
                        StatusPill(title: "\(result.pages) page(s) read on iPhone", symbol: "checkmark.shield")
                        Text("\(result.identifiers.count) possible identifying details flagged. Detection can miss things.")
                        ForEach(Array(Set(result.identifiers.map(\.category))).sorted(), id: \.self) { category in
                            HStack { Text(category); Spacer(); Text("\(result.identifiers.filter { $0.category == category }.count)").foregroundStyle(.secondary) }
                        }
                        DisclosureGroup("Review local text with detected spans masked") {
                            Text(IdentifierDetector.preview(result.text, candidates: result.identifiers)).font(.footnote.monospaced()).textSelection(.enabled).privacySensitive()
                            Text("This preview can still contain sensitive details. It is never used as the cloud payload.").font(.footnote).foregroundStyle(.secondary)
                        }
                        DisclosureGroup("Candidate facts from this reading") {
                            ForEach(Array(result.facts.reviewedRows.enumerated()), id: \.offset) { _, row in
                                LabeledContent(PublicFacts.label(for: row.key), value: row.value).privacySensitive()
                            }
                            Text("These are OCR candidates, not verified facts. Compare every amount, code and document type against the original before saving.").font(.footnote).foregroundStyle(.secondary)
                        }
                        Toggle("I compared the extracted facts with the original", isOn: $checkedImportedFacts)
                        Text("This check is local. GoldRock keeps your reviewed typed facts, never the original or raw reading.").font(.footnote).foregroundStyle(.secondary)
                        ForEach(result.warnings, id: \.self) { Text($0).font(.footnote).foregroundStyle(.secondary) }
                        DisclosureGroup("An extra check, on this iPhone") {
                            Button("Ask the on-device model to check", systemImage: "sparkles") { inspectLocally() }.disabled(busy || !OnDeviceAssistant.isAvailable)
                            Text(OnDeviceAssistant.availability).font(.footnote).foregroundStyle(.secondary)
                        }
                        if let suggestion = modelSuggestion {
                            Text(suggestion.notice).font(.footnote)
                            Button("Use suggested type: \(suggestion.kind.title)") { facts.documentType = suggestion.kind; confirmed = false }
                        }
                        Button("Clear imported text", role: .destructive) { imported = nil; modelSuggestion = nil; checkedImportedFacts = false }
                    }
                }
                if let message { Section { Text(message).font(.footnote) } }
                Section("Name it. Choose how to keep it.") {
                    TextField("Case name", text: $title)
                    Text("This name stays local and is excluded from the analysis payload.").font(.footnote).foregroundStyle(.secondary)
                    Picker("Saving", selection: $mode) { ForEach(SaveMode.allCases) { Text($0.title).tag($0) } }.disabled(store.sessionOnly)
                    Text(mode == .device && !store.sessionOnly ? "Facts, guidance and drafts are encrypted on this iPhone, excluded from backups and separated by account. Original documents are not kept by GoldRock. Device loss can mean case loss." : "This case stays only in process memory, including during brief app switches. Ending the session, switching accounts, deleting it or the app process closing clears it. No recovery is available after process termination. Cloud processing requires a separate approval.").font(.footnote).foregroundStyle(.secondary)
                }
                if questionDraft != nil {
                    Section {
                        Toggle("Add or review bill and claim details", isOn: $showFacts)
                        if !showFacts { Text("You can start with a question alone. Leave unknown details blank. You will see the exact case facts again before any cloud question is sent.").font(.footnote).foregroundStyle(.secondary) }
                    }
                }
                if showFacts || questionDraft == nil { FactsForm(facts: $facts, errors: $fieldErrors).id(editVersion) }
                Section {
                    Toggle("I reviewed these facts and left unknown details blank", isOn: $confirmed)
                    ChromeAction(title: questionDraft == nil ? "Find my next step" : "Prepare my AI conversation") { save() }
                        .disabled(!confirmed || (imported != nil && !checkedImportedFacts) || !fieldErrors.isEmpty || busy)
                    Text("No cloud request is made by this button. You can review and approve AI analysis later inside the case.").font(.footnote).foregroundStyle(.secondary)
                }
            }
            .goldRockScreen()
            .navigationTitle("A new case").navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { task?.cancel(); imported = nil; dismiss() } } }
            .confirmationDialog("Replace this local preparation?", isPresented: $replacingPreparation, titleVisibility: .visible) {
                Button(replaceWithScan ? "Scan new pages" : "Choose another file") { launchInput() }
                Button("Keep current preparation", role: .cancel) {}
            } message: {
                Text("A successful new reading replaces the candidate facts and edits in this form. Finish and save this case first if you need to compare documents later. Your original file remains in its source app.")
            }
            .fileImporter(isPresented: $importing, allowedContentTypes: [.pdf, .jpeg, .png, .heic], allowsMultipleSelection: false) { result in
                switch result { case .success(let urls): if let url = urls.first { prepare { try await DocumentIntake.importFile(url) } }; case .failure: problem = "The file could not be opened. Choose it again or enter the key facts." }
            }
            .fullScreenCover(isPresented: $scanning) {
                ScannerView { images in scanning = false; prepare { try await DocumentIntake.scan(images) } } onCancel: { scanning = false } onError: { _ in scanning = false; problem = "Scanning is unavailable. Check camera access in Settings or choose a file instead." }
                    .ignoresSafeArea()
            }
            .onAppear { facts.goal = goal; if workspace == nil { workspace = store.workspaceIdentity; showFacts = questionDraft == nil; if let suggestedTitle { title = suggestedTitle } }; if store.sessionOnly { mode = .session } }
            .onDisappear { preparationID = UUID(); task?.cancel(); imported = nil; modelSuggestion = nil }
            .onChange(of: store.workspaceIdentity) { _, _ in resetPreparation(); problem = "The workspace changed. Close this form and start again." }
            .onChange(of: facts) { _, _ in confirmed = false }
            .onChange(of: phase) { _, value in if value == .background { resetPreparation(); questionDraft?.wrappedValue = "" } }
        }
    }
    private func prepare(_ operation: @escaping () async throws -> IntakeResult) {
        task?.cancel(); busy = true; problem = nil; confirmed = false
        let requestID = UUID(); preparationID = requestID; let owner = store.workspaceIdentity
        task = Task {
            do {
                let result = try await operation(); try Task.checkCancellation()
                guard preparationID == requestID, workspace == owner, store.workspaceIdentity == owner, store.workspaceActive else { return }
                imported = result; facts = result.facts; facts.goal = goal; showFacts = true; fieldErrors.removeAll(); editVersion = UUID(); modelSuggestion = nil; checkedImportedFacts = false
            } catch is CancellationError { return }
            catch { guard preparationID == requestID, store.workspaceIdentity == owner else { return }; problem = error.localizedDescription }
            busy = false
        }
    }
    private func inspectLocally() {
        guard let text = imported?.text else { return }
        busy = true; problem = nil
        let requestID = UUID(); preparationID = requestID; let owner = store.workspaceIdentity
        task = Task {
            do {
                let suggestion = try await OnDeviceAssistant.inspect(text); try Task.checkCancellation()
                guard preparationID == requestID, workspace == owner, store.workspaceIdentity == owner, store.workspaceActive else { return }
                modelSuggestion = suggestion
                if var result = imported {
                    let existing = Set(result.identifiers.map(\.value))
                    result.identifiers += suggestion.candidates.filter { !existing.contains($0.value) }
                    imported = result
                }
            } catch is CancellationError { return }
            catch { guard preparationID == requestID, store.workspaceIdentity == owner else { return }; problem = "The on-device model could not finish. Local extraction and manual review remain available. No cloud fallback was used." }
            busy = false
        }
    }
    private func save() {
        do { guard workspace == store.workspaceIdentity, store.workspaceActive, confirmed else { throw AppError.locked }; guard imported == nil || checkedImportedFacts else { throw AppError.invalid("Compare the extracted facts with the original before saving.") }; let id = try store.createCase(title: title, facts: facts, mode: mode, taskIntake: taskIntake); imported = nil; modelSuggestion = nil; onCreate(id) }
        catch { problem = error.localizedDescription }
    }
    private func chooseInput(scan: Bool) {
        replaceWithScan = scan
        var empty = PublicFacts(); empty.goal = goal
        if imported != nil || facts != empty { replacingPreparation = true }
        else { launchInput() }
    }
    private func launchInput() { if replaceWithScan { scanning = true } else { importing = true } }
    private func resetPreparation() { preparationID = UUID(); task?.cancel(); task = nil; imported = nil; modelSuggestion = nil; busy = false; confirmed = false; checkedImportedFacts = false }
}

struct ScannerView: UIViewControllerRepresentable {
    var onComplete: ([UIImage]) -> Void; var onCancel: () -> Void; var onError: (Error) -> Void
    func makeCoordinator() -> Coordinator { Coordinator(parent: self) }
    func makeUIViewController(context: Context) -> VNDocumentCameraViewController { let controller = VNDocumentCameraViewController(); controller.delegate = context.coordinator; return controller }
    func updateUIViewController(_ uiViewController: VNDocumentCameraViewController, context: Context) {}
    final class Coordinator: NSObject, VNDocumentCameraViewControllerDelegate {
        let parent: ScannerView; init(parent: ScannerView) { self.parent = parent }
        func documentCameraViewController(_ controller: VNDocumentCameraViewController, didFinishWith scan: VNDocumentCameraScan) {
            guard (1...DocumentIntake.maximumPages).contains(scan.pageCount) else { parent.onError(AppError.invalid("Scan between 1 and 20 pages at a time.")); return }
            do {
                var images: [UIImage] = []; var pixels = 0
                for index in 0..<scan.pageCount {
                    let image = try autoreleasepool { try DocumentIntake.boundedScanImage(scan.imageOfPage(at: index)) }
                    pixels += Int(image.size.width * image.size.height)
                    guard pixels <= DocumentIntake.maximumScanPixels else { throw AppError.invalid("Scan fewer pages at a time or enter the figures manually.") }
                    images.append(image)
                }
                parent.onComplete(images)
            } catch { parent.onError(error) }
        }
        func documentCameraViewControllerDidCancel(_ controller: VNDocumentCameraViewController) { parent.onCancel() }
        func documentCameraViewController(_ controller: VNDocumentCameraViewController, didFailWithError error: Error) { parent.onError(error) }
    }
}

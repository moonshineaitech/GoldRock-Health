import SwiftUI

struct NativeToolsView: View {
    var body: some View { NavigationStack { AdvocacyTasksView() } }
}

/// Restores task-specific preparation. Only explicitly selected details enter a local
/// draft; all cloud conversation still traverses its separate privacy review screen.
struct AdvocacyTasksView: View {
    @State private var catalog: AdvocacyCatalog?
    @State private var query = ""
    @State private var category = "all"
    @State private var problem: String?
    var body: some View {
        List {
            Section {
                Text("What do you want to do?").font(.system(.title2, design: .serif))
                Text("Choose a task. Get the questions, strategy and writing to move it forward.").font(.subheadline).foregroundStyle(.secondary)
                if let catalog {
                    Picker("Topic", selection: $category) { Text("All topics").tag("all"); ForEach(catalog.categories) { Text($0.title).tag($0.id) } }
                    Text("\(catalog.tasks.count) workflows. Your answers stay on this iPhone. Nothing is submitted for you.").font(.footnote).foregroundStyle(.secondary)
                }
            }
            if let problem { Section { NoticeCard(title: "Library unavailable", text: problem, symbol: "exclamationmark.circle"); Button("Try again") { load() } } }
            if let catalog {
                let matches = catalog.tasks.filter { (category == "all" || $0.category == category) && (query.isEmpty || ($0.title + " " + $0.purpose + " " + $0.category).localizedCaseInsensitiveContains(query)) }
                if matches.isEmpty { ContentUnavailableView.search(text: query) }
                ForEach(matches) { task in
                    NavigationLink { AdvocacyTaskView(taskID: task.id) } label: {
                        VStack(alignment: .leading, spacing: 8) {
                            Eyebrow(text: catalog.categories.first(where: { $0.id == task.category })?.title ?? task.category)
                            Text(task.title).font(.headline)
                            Text(task.purpose).font(.subheadline).foregroundStyle(.secondary)
                        }.padding(.vertical, 6)
                    }
                }
            }
            Section("Reference and research") {
                NavigationLink { KnowledgeSearchView() } label: { Label("Search the knowledge library", systemImage: "text.book.closed") }
                NavigationLink { PublicPlaybooksView() } label: { Label("Scripts and public hospital policies", systemImage: "arrow.triangle.branch") }
            }
        }.goldRockScreen().navigationTitle("Tools").navigationBarTitleDisplayMode(.inline)
            .searchable(text: $query, prompt: "Appeal, assistance, price, collections…")
            .onChange(of: query) { _, value in if value.count > 300 { query = String(value.prefix(300)) } }
            .task { load() }
    }
    private func load() { do { catalog = try LocalGuidance.advocacyCatalog(); problem = nil } catch { catalog = nil; problem = error.localizedDescription } }
}

struct AdvocacyTaskView: View {
    let taskID: String
    var caseID: UUID? = nil
    @Environment(AppStore.self) private var store
    @Environment(\.scenePhase) private var phase
    @State private var task: AdvocacyTask?
    @State private var values: [String: TaskIntakeValue] = [:]
    @State private var workspace: UUID?
    @State private var problem: String?
    @State private var saved = false
    @State private var reviewed = false
    @State private var preparedIntake: TaskIntake?
    @State private var intake = false
    @State private var createdCase: UUID?
    @State private var showCase = false
    @State private var chooseAIDetails = false
    private var active: Bool { workspace == store.workspaceIdentity && store.workspaceActive && (caseID == nil || store.item(caseID!) != nil) }
    var body: some View {
        Form {
            if let task {
                Section {
                    Text(task.title).font(.system(.title2, design: .serif)).fixedSize(horizontal: false, vertical: true)
                    Text(task.purpose).font(.subheadline).foregroundStyle(.secondary)
                }
                if let problem { Section { Label(problem, systemImage: "exclamationmark.circle").foregroundStyle(.red) } }
                Section("Your private preparation") {
                    ForEach(task.intakeFields) { field in TaskQuestionField(field: field, value: Binding(get: { values[field.id] }, set: { value in values[field.id] = value; reviewed = false; saved = false })) }
                    Text("Leave anything unknown blank. Avoid entering full names, account numbers or identifiers unless you need them for your own local notes.").font(.footnote).foregroundStyle(.secondary)
                }
                Section {
                    Toggle("I reviewed these local notes", isOn: $reviewed)
                    if caseID != nil {
                        ChromeAction(title: "Save my preparation", symbol: "checkmark") { saveLocal() }.disabled(!reviewed || !active)
                        if saved { Label("Saved with this case, on this iPhone", systemImage: "checkmark.circle").font(.footnote) }
                    } else {
                        ChromeAction(title: "Start this case") { continueToFacts() }.disabled(!reviewed || !active)
                        Text("Next, choose saving and review the few facts used for guidance. Nothing has been sent to cloud AI.").font(.footnote).foregroundStyle(.secondary)
                    }
                }
                if let caseID, store.item(caseID) != nil {
                    Section("Put your preparation to work") {
                        ChromeAction(title: "Use selected details for AI help", symbol: "sparkles") { chooseAIDetails = true }.disabled(!active)
                        NavigationLink { CaseConversationView(caseID: caseID, starterTaskID: taskID) } label: { Label("Ask about this workflow", systemImage: "bubble.left.and.bubble.right") }
                        NavigationLink { CaseWorkbookView(caseID: caseID) } label: { Label("Track requests, evidence and deadlines", systemImage: "list.bullet.clipboard") }
                        Text("Choose details to prepare tailored AI strategy or writing. You edit the draft, check the local privacy review, and approve the exact wording before cloud processing.").font(.footnote).foregroundStyle(.secondary)
                    }
                }
                Section("Guidance and evidence") {
                    StatusPill(title: task.current != true ? "Source review needed" : task.sourceCoverage == "general-process-only" ? "General preparation guidance" : "Reviewed process guidance", symbol: task.current == true ? "text.book.closed" : "clock")
                    if task.current == true {
                        DisclosureGroup("Prepare your next move") { ForEach(Array(task.prepare.enumerated()), id: \.offset) { _, text in Text(text) } }
                        DisclosureGroup("Records to have nearby") { ForEach(Array(task.evidence.enumerated()), id: \.offset) { _, text in Text(text) } }
                    } else { Text("Keep organizing your records. The public guidance needs a fresh source review before use.").font(.footnote).foregroundStyle(.secondary) }
                    if task.sourceCoverage == "general-process-only" { Text("These sources support the general request process. They do not verify specialized tax, legal, clinical, coding or coverage conclusions.").font(.footnote).foregroundStyle(.secondary) }
                }
                Section("Sources and limits") {
                    ForEach(Array(task.limitations.enumerated()), id: \.offset) { _, text in Text(text).font(.footnote).foregroundStyle(.secondary) }
                    SourceLinks(ids: task.sourceIds)
                }
            } else if let problem { Section { Text(problem); Button("Try again") { load() } } }
            else { ProgressView("Opening this workflow…") }
        }.goldRockScreen().navigationTitle("Your next move").navigationBarTitleDisplayMode(.inline)
            .task { load() }
            .navigationDestination(isPresented: $showCase) { if let createdCase { AdvocacyTaskView(taskID: taskID, caseID: createdCase) } }
            .sheet(isPresented: $intake) { if let task, let preparedIntake { IntakeView(goal: task.summaryGoal, taskIntake: preparedIntake, suggestedTitle: task.title) { id in createdCase = id; intake = false; showCase = true } } }
            .sheet(isPresented: $chooseAIDetails) { if let caseID, let task { TaskAISelectionView(caseID: caseID, taskID: task.id, fields: task.intakeFields, values: values) } }
            .onChange(of: store.workspaceIdentity) { _, _ in values = [:]; preparedIntake = nil; reviewed = false; task = nil; intake = false; problem = "The workspace changed. Return to Tools to start again." }
            .onChange(of: phase) { _, newPhase in if newPhase == .active { refreshGuidance() } }
    }
    private func load() {
        guard store.workspaceActive else { return }
        do {
            task = try LocalGuidance.advocacyTask(taskID); workspace = store.workspaceIdentity
            if let caseID, let existing = store.item(caseID)?.taskIntake, existing.taskId == taskID { values = existing.values }
            problem = nil
        } catch { problem = error.localizedDescription }
    }
    private func refreshGuidance() { guard active else { return }; do { task = try LocalGuidance.advocacyTask(taskID) } catch { problem = error.localizedDescription; task = nil } }
    private func reviewedSnapshot() throws -> TaskIntake {
        guard active, reviewed else { throw AppError.locked }
        return try LocalGuidance.createTaskIntake(taskID, values: values)
    }
    private func continueToFacts() { do { preparedIntake = try reviewedSnapshot(); intake = true; problem = nil } catch { problem = error.localizedDescription } }
    private func saveLocal() {
        do { guard let caseID else { return }; let snapshot = try reviewedSnapshot(); try store.update(caseID) { $0.taskIntake = snapshot }; saved = true; problem = nil }
        catch { problem = error.localizedDescription }
    }
}

private struct TaskAISelectionView: View {
    let caseID: UUID; let taskID: String; let fields: [AdvocacyField]; let values: [String: TaskIntakeValue]
    @Environment(AppStore.self) private var store
    @Environment(\.scenePhase) private var phase
    @Environment(\.dismiss) private var dismiss
    @State private var selected: Set<String> = []
    @State private var draft = ""
    @State private var problem: String?
    @State private var workspace: UUID?
    @State private var review = false
    @State private var turnsBeforeReview = 0
    @State private var showConversation = false
    private var active: Bool { workspace == store.workspaceIdentity && store.workspaceActive && store.item(caseID) != nil }
    var body: some View {
        NavigationStack {
            Form {
                Section {
                    EditorialListHeader(eyebrow: "Choose what helps", title: "A useful question.\nOnly the details you choose.", detail: "Select relevant notes to prepare a draft on this iPhone. Nothing is sent by building the draft.")
                    Text("Leave out names, addresses, member or account numbers, exact dates, and unnecessary medical details. No original documents are attached.").font(.footnote).foregroundStyle(.secondary)
                }
                Section("Choose details · none selected by default") {
                    ForEach(fields.filter { values[$0.id] != nil && values[$0.id] != .text("") }) { field in
                        Toggle(isOn: Binding(get: { selected.contains(field.id) }, set: { if $0 { selected.insert(field.id) } else { selected.remove(field.id) } })) {
                            VStack(alignment: .leading, spacing: 4) { Text(field.label).font(.headline); Text(display(values[field.id])).font(.subheadline).foregroundStyle(.secondary) }
                        }
                    }
                    Button("Build a local draft from my selection") { buildDraft() }.frame(minHeight: 44).disabled(!active)
                }
                Section("Edit your draft question") {
                    TextField("Ask for a strategy, letter, appeal outline or call script…", text: $draft, axis: .vertical).lineLimit(6...14)
                    Text("\(draft.count) / 2,000 characters. Building again replaces this editor; saved task notes stay unchanged.").font(.footnote).foregroundStyle(draft.count > 2000 ? .red : .secondary)
                    if let problem { Label(problem, systemImage: "exclamationmark.circle").foregroundStyle(.red) }
                    ChromeAction(title: "Check privacy and review sharing", symbol: "checkmark.shield") { turnsBeforeReview = store.item(caseID)?.conversation?.turns.count ?? 0; review = true }.disabled(!active || draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || draft.count > 2000)
                    Text("Next: device-local privacy preparation, editable question/history/facts, then your separate approval for cloud AI. No selected field bypasses that review.").font(.footnote).foregroundStyle(.secondary)
                }
            }.goldRockScreen().navigationTitle("Prepare AI help").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { draft = ""; dismiss() } } }
                .sheet(isPresented: $review, onDismiss: {
                    if active, (store.item(caseID)?.conversation?.turns.count ?? 0) > turnsBeforeReview { draft = ""; showConversation = true }
                }) { if let item = store.item(caseID) { ConversationComposerView(caseID: caseID, facts: item.facts, initialQuestion: draft, replyToID: nil) } }
                .navigationDestination(isPresented: $showConversation) { CaseConversationView(caseID: caseID) }
        }
        .onAppear { workspace = store.workspaceIdentity }
        .onChange(of: store.workspaceIdentity) { _, _ in selected = []; draft = ""; review = false; dismiss() }
        .onChange(of: phase) { _, value in if value == .background { selected = []; draft = ""; review = false; dismiss() } }
        .onDisappear { draft = "" }
    }
    private func display(_ value: TaskIntakeValue?) -> String { switch value { case .text(let text): text; case .checked(let checked): checked ? "Yes" : "No"; case nil: "Not entered" } }
    private func buildDraft() {
        do {
            guard active else { throw AppError.locked }
            let task = try LocalGuidance.advocacyTask(taskID)
            let details = fields.filter { selected.contains($0.id) }.map { "\($0.label): \(display(values[$0.id]))" }
            draft = task.conversationStarter + (details.isEmpty ? "" : "\n\nDetails I chose for this question (user-recorded, not verified):\n" + details.joined(separator: "\n"))
            problem = draft.count > 2000 ? "Choose fewer details or shorten the draft before the privacy review." : nil
        } catch { problem = error.localizedDescription }
    }
}

private struct TaskQuestionField: View {
    let field: AdvocacyField
    @Binding var value: TaskIntakeValue?
    private var text: Binding<String> { Binding(get: { value?.text ?? "" }, set: { value = $0.isEmpty ? nil : .text($0) }) }
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(field.label).font(.headline)
            if field.type == "checkbox" {
                Picker("Your answer", selection: Binding(get: { value?.checked.map { $0 ? "yes" : "no" } ?? "" }, set: { value = $0.isEmpty ? nil : .checked($0 == "yes") })) { Text("Not sure").tag(""); Text("Yes").tag("yes"); Text("No").tag("no") }
            } else if field.type == "select" {
                Picker("Your answer", selection: text) { Text("Not entered").tag(""); ForEach(field.options ?? [], id: \.self) { Text($0).tag($0) } }
            } else if field.type == "textarea" {
                TextField(field.placeholder ?? "Your local notes", text: text, axis: .vertical).lineLimit(3...8)
            } else {
                TextField(field.type == "file" ? "Where you keep this record" : field.placeholder ?? (field.type == "date" ? "YYYY-MM-DD" : "Leave blank if unknown"), text: text)
                    .keyboardType(field.type == "number" ? .decimalPad : field.type == "date" ? .numbersAndPunctuation : .default)
            }
            if let detail = field.description, !detail.isEmpty { Text(detail).font(.footnote).foregroundStyle(.secondary) }
            if field.type == "file" { Text("Private reference only—for example, the folder or portal where you keep your copy. No file upload.").font(.footnote).foregroundStyle(.secondary) }
        }.padding(.vertical, 7)
    }
}

struct BillAdvocateView: View {
    var goal: MemberGoal = .understand
    var initialQuestion: String = ""
    var onComplete: (UUID) -> Void
    @Environment(AppStore.self) private var store
    @Environment(\.scenePhase) private var phase
    @State private var question = ""
    @State private var createdCase: UUID?
    @State private var initialized = false
    var body: some View {
        Group {
            if let createdCase {
                NavigationStack {
                    CaseConversationView(caseID: createdCase, initialQuestion: question)
                        .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Open case") { question = ""; onComplete(createdCase) } } }
                }
            } else {
                IntakeView(goal: goal, questionDraft: $question) { createdCase = $0 }
            }
        }
        .onAppear { if !initialized { question = String(initialQuestion.prefix(2000)); initialized = true } }
        .onChange(of: question) { _, value in if value.count > 2000 { question = String(value.prefix(2000)) } }
        .onChange(of: phase) { _, value in if value == .background { question = "" } }
        .onChange(of: store.workspaceIdentity) { _, _ in question = ""; createdCase = nil }
        .onDisappear { question = "" }
    }
}

import SwiftUI
import UserNotifications

struct CaseDetailView: View {
    let caseID: UUID
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var editing = false
    @State private var consent = false
    @State private var record = false
    @State private var delete = false
    @State private var busy = false
    @State private var sheetAction: ActionStep?
    var body: some View {
        Group {
            if let item = store.item(caseID) {
                let currentGuidance = try? LocalGuidance.display(for: item)
                List {
                    Section {
                        VStack(alignment: .leading, spacing: 14) {
                            StatusPill(title: item.resolved ? "Outcome you recorded" : "Your reviewed facts", symbol: item.resolved ? "checkmark.circle" : "doc.text.magnifyingglass")
                            Text(currentGuidance?.summary ?? "Review your facts to get started.").font(.system(.title2, design: .serif)).fixedSize(horizontal: false, vertical: true)
                            if item.facts.documentType != .eob { VStack(alignment: .leading, spacing: 5) { Text("Current balance you entered").font(.footnote).foregroundStyle(.secondary); Text(Money.display(item.facts.balanceCents)).font(.system(.title, design: .serif)).monospacedDigit() } }
                            Text(currentGuidance?.engine == "openai" ? "Calculated checks with supplementary AI wording" : "Calculated checks and researched guidance · on this iPhone").font(.footnote).foregroundStyle(.secondary)
                        }.padding(.vertical, 8)
                    }
                    Section("Your AI advocate") {
                        NavigationLink { CaseConversationView(caseID: caseID, initialQuestion: "Help me choose a practical strategy for this bill. Explain what to verify, what to ask for first, and what to do if they say no.") } label: { EditorialFeatureRow(title: "Ask GoldRock", detail: "Get AI help with your strategy and next move.", symbol: "bubble.left.and.bubble.right", showsChevron: false) }
                        NavigationLink { CaseConversationView(caseID: caseID, initialQuestion: "Help me draft a clear letter or call script for this case. Ask me which request I want to make; use placeholders for personal details and do not assume any unverified rights or deadlines.") } label: { EditorialFeatureRow(title: "Write a letter or call script", detail: "Review the question and facts before using cloud AI.", symbol: "square.and.pencil", showsChevron: false) }
                        if let task = item.taskIntake {
                            NavigationLink { AdvocacyTaskView(taskID: task.taskId, caseID: caseID) } label: { Label("Continue my task preparation", systemImage: "list.bullet.rectangle") }
                        }
                        NavigationLink { CaseReconciliationView(caseID: caseID) } label: { Label("Compare bills, EOBs and payments", systemImage: "doc.on.doc") }
                        NavigationLink { CaseWorkbookView(caseID: caseID) } label: { Label("Track the request and response", systemImage: "list.bullet.clipboard") }
                    }
                    if let status = item.jobStatus {
                        Section("Cloud analysis") {
                            Label(status.replacingOccurrences(of: "_", with: " ").capitalized, systemImage: status == "succeeded" ? "checkmark.circle" : "arrow.triangle.2.circlepath")
                            if let job = item.jobID, !job.isEmpty {
                                Button("Refresh status") { store.resumeJobs() }
                                Button("Delete cloud analysis", role: .destructive) { run { try await store.cancelAnalysis(caseID) } }
                            }
                            if status == "submission_failed" { Text("The request could not be confirmed. A new attempt reuses the same operation ID to avoid duplicate processing.").font(.footnote).foregroundStyle(.secondary) }
                        }
                    }
                    if let guidance = currentGuidance {
                        if let assistance = guidance.aiAssistance {
                            Section { DisclosureGroup("An optional AI perspective") { Text(assistance.summary); Text("The model's explanation is supplementary. Calculations and policy conditions below remain the basis of this guidance.").font(.footnote).foregroundStyle(.secondary) } }
                        }
                        Section("What to check") {
                            if guidance.findings.isEmpty { Text("No specific issue was established from these facts. That does not confirm the bill is correct.") }
                            ForEach(guidance.findings) { finding in
                                VStack(alignment: .leading, spacing: 10) {
                                    StatusPill(title: finding.severity == "info" ? "Good to know" : finding.severity == "important" ? "Important to review" : "Worth checking")
                                    Label(finding.title, systemImage: finding.severity == "info" ? "info.circle" : "questionmark.circle").font(.headline)
                                    Text(finding.detail)
                                    if let wording = guidance.aiAssistance?.findings.first(where: { $0.id == finding.id }) { DisclosureGroup("AI explanation") { Text(wording.explanation); Text("AI wording can be wrong; compare with the evidence and sources.").font(.footnote).foregroundStyle(.secondary) } }
                                    DisclosureGroup("Evidence and sources") {
                                        if !finding.evidenceIds.isEmpty { Text("Based on: " + finding.evidenceIds.map { PublicFacts.label(for: $0) }.joined(separator: ", ")).font(.footnote).foregroundStyle(.secondary) }
                                        SourceLinks(ids: finding.sourceIds)
                                    }
                                }.padding(.vertical, 8)
                            }
                        }
                        Section("Your next moves") {
                            ForEach(guidance.actions) { action in
                                Button { sheetAction = action } label: {
                                    EditorialFeatureRow(title: action.title, detail: action.reason, symbol: "arrow.up.right")
                                }.buttonStyle(.plain)
                            }
                        }
                        if !guidance.questions.isEmpty {
                            Section("Still worth finding out") { ForEach(guidance.questions, id: \.self) { Text($0) }; Button("Update my facts") { editing = true } }
                        }
                        Section { DisclosureGroup("Limits to keep in mind") { ForEach(guidance.limitations, id: \.self) { Text($0).font(.footnote).foregroundStyle(.secondary) } } }
                    }
                    Section("Handle the response") {
                        NavigationLink { CaseConversationView(caseID: caseID) } label: { EditorialFeatureRow(title: "Talk through your next move.", detail: "Ask a question with a separate privacy review, then keep the reply with this case.", symbol: "bubble.left.and.bubble.right", showsChevron: false) }
                        NavigationLink { KnowledgeSearchView(facts: item.facts, caseID: caseID) } label: { Label("Find an answer for this situation", systemImage: "magnifyingglass") }
                        NavigationLink { CountermeasuresView(facts: item.facts) } label: {
                            Label("Find a researched next request", systemImage: "arrow.triangle.branch")
                        }
                        Text("Choose the situation and the reply you received. No collector contact, entitlement or deadline is inferred from the amount.").font(.footnote).foregroundStyle(.secondary)
                    }
                    Section("Progress you record") {
                        NavigationLink { CaseMoneyRecoveryView(caseID: caseID) } label: { EditorialFeatureRow(title: "Follow the money back.", detail: "Track provider refunds and insurer reimbursements, from request to actual receipt.", symbol: "arrow.uturn.backward.circle", showsChevron: false) }
                        NavigationLink { CaseReconciliationView(caseID: caseID) } label: { EditorialFeatureRow(title: "Make sense of every version.", detail: "Compare bills, EOBs, payments and refunds by biller and service.", symbol: "doc.on.doc", showsChevron: false) }
                        NavigationLink { CaseWorkbookView(caseID: caseID) } label: { EditorialFeatureRow(title: "Keep the next step moving.", detail: "Track each process, the evidence it needs and what actually happened.", symbol: "list.bullet.clipboard", showsChevron: false) }
                        Button("Record an action or outcome", systemImage: "pencil.and.list.clipboard") { record = true }
                        if let date = item.followUp {
                            Label("Follow up \(date.formatted(date: .abbreviated, time: .shortened))", systemImage: "calendar")
                            Button("Clear my follow-up", systemImage: "calendar.badge.minus") {
                                do { try store.clearFollowUp(caseID) } catch { store.error = error.localizedDescription }
                            }
                        }
                        if let reduction = item.confirmedReductionCents { LabeledContent("Reduction you recorded", value: Money.display(reduction)) }
                        ForEach(item.events.reversed()) { event in VStack(alignment: .leading, spacing: 5) { Text(event.kind).font(.headline); Text(event.note); Text(event.at.formatted(date: .abbreviated, time: .shortened)).font(.caption).foregroundStyle(.secondary) } }
                    }
                    Section("Privacy and saving") {
                        Label(item.saveMode.title, systemImage: item.saveMode == .device ? "lock.iphone" : "clock")
                        if item.saveMode == .session { Button("Keep this case on my iPhone", systemImage: "lock.iphone") { run { try await store.keepCaseOnDevice(caseID) } } }
                        Text("Original files and raw extracted text are not kept in this case. Facts and drafts may still be sensitive.").font(.footnote).foregroundStyle(.secondary)
                        DisclosureGroup("Exact facts available for analysis") { Text((try? item.facts.jsonString()) ?? "Invalid facts").font(.footnote.monospaced()).textSelection(.enabled) }
                        if let receipt = item.consentReceipt { DisclosureGroup("Cloud sharing receipt") { Text(receipt).font(.footnote) } }
                        Button("Review cloud AI sharing", systemImage: "sparkles") { consent = true }
                        ShareLink(item: CurrentCaseExport(item: item), preview: SharePreview("GoldRock case summary", image: Image(systemName: "doc.text"))) { Label("Export case summary", systemImage: "square.and.arrow.up") }
                        Text("Export creates a copy in the destination you choose. GoldRock cannot remove that copy.").font(.footnote).foregroundStyle(.secondary)
                        Button("Delete this case", role: .destructive) { delete = true }
                    }
                }
                .goldRockScreen().navigationTitle(item.title).navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .topBarTrailing) { Button("Edit facts", systemImage: "slider.horizontal.3") { editing = true } } }
                .sheet(isPresented: $editing) { EditFactsView(caseID: caseID, initial: item.facts) }
                .sheet(isPresented: $consent) { AnalysisConsentView(caseID: caseID) }
                .sheet(isPresented: $record) { RecordProgressView(caseID: caseID) }
                .sheet(item: $sheetAction) { action in DraftView(caseID: caseID, action: action) }
                .confirmationDialog("Delete the local case and its cloud job?", isPresented: $delete, titleVisibility: .visible) { Button("Delete case", role: .destructive) { run { try await store.remove(caseID); dismiss() } } } message: { Text("Your original file and copies you exported elsewhere are not deleted. If the cloud service cannot be reached, the case reference is kept so deletion can be retried.") }
            } else { ContentUnavailableView("Case unavailable", systemImage: "folder", description: Text("It may have been deleted or cleared at the end of a one-time session.")) }
        }.overlay { if busy { ProgressView().padding().background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16)) } }
    }
    private func run(_ action: @escaping () async throws -> Void) { busy = true; Task { do { try await action() } catch { store.error = error.localizedDescription }; busy = false } }
}

struct SourceLinks: View {
    let ids: [String]
    var body: some View {
        ForEach((try? LocalGuidance.sources().filter { ids.contains($0.id) }) ?? []) { source in
            if let url = URL(string: source.url) { Link(destination: url) { Label(source.title, systemImage: "arrow.up.right.square").font(.footnote) } }
            Text("\(source.publisher) · reviewed \(String(source.reviewedAt.prefix(10)))\n\(source.applicability)").font(.caption).foregroundStyle(.secondary)
        }
    }
}

struct EditFactsView: View {
    let caseID: UUID
    @State var facts: PublicFacts
    @State private var errors: Set<String> = []
    @State private var busy = false
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    init(caseID: UUID, initial: PublicFacts) { self.caseID = caseID; _facts = State(initialValue: initial) }
    var body: some View {
        NavigationStack {
            Form { Section { EditorialListHeader(eyebrow: "Check the details", title: "Good next steps start\nwith the right facts.", detail: "Changing facts recalculates guidance and clears edited action drafts. Your recorded history stays."); Text("Any existing cloud job is canceled before the facts change.").font(.footnote).foregroundStyle(.secondary) }; FactsForm(facts: $facts, errors: $errors) }
                .goldRockScreen()
                .navigationTitle("Review facts").navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { dismiss() } }
                    ToolbarItem(placement: .confirmationAction) { Button("Save facts", systemImage: "checkmark") { busy = true; Task { do { try await store.editFacts(caseID, facts: facts); dismiss() } catch { store.error = error.localizedDescription }; busy = false } }.disabled(!errors.isEmpty || busy) }
                }
        }
    }
}

struct AnalysisConsentView: View {
    let caseID: UUID
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var agreed = false
    @State private var busy = false
    var body: some View {
        NavigationStack {
            Form {
                if let item = store.item(caseID) {
                    Section {
                        EditorialListHeader(eyebrow: "A separate choice", title: "You decide what\nleaves your iPhone.", detail: "Review the exact facts below before choosing cloud AI. Minimized health facts can still be sensitive.")
                        NoticeCard(title: "The original stays here", text: "Your document, case name, raw text and local notes are excluded from this request.", symbol: "iphone.gen3")
                    }
                    Section("The facts you are sharing") {
                        ForEach(item.facts.reviewedRows, id: \.key) { row in LabeledContent(PublicFacts.label(for: row.key), value: row.value) }
                        ForEach(item.facts.lines) { line in Text("\(PublicFacts.label(for: line.id)): \(line.code ?? "No code"), \(Money.display(line.amountCents)), \(line.units) unit(s)").font(.footnote) }
                        DisclosureGroup("View the exact technical payload") { Text((try? item.facts.jsonString()) ?? "Fix the facts before continuing.").font(.footnote.monospaced()).textSelection(.enabled) }
                        Text("To remove or correct a fact, close this review and choose Edit facts. Missing amounts are not sent as zero.").font(.footnote).foregroundStyle(.secondary)
                    }
                    Section("Processing and retention") {
                        if let config = store.config {
                            LabeledContent("Processor", value: "OpenAI")
                            LabeledContent("GoldRock job retention", value: "\(config.privacy.jobTtlSeconds / 60) minutes maximum")
                            LabeledContent("Policy", value: config.privacy.policyVersion)
                            if let retention = config.privacy.providerRetention { Text(retention).font(.footnote) }
                            Text("Provider retention is governed separately by the deployment's provider terms and configuration. Local saving and one-time mode do not change cloud retention.").font(.footnote).foregroundStyle(.secondary)
                            if config.environment != "production" { Label("Development service: use synthetic information only", systemImage: "hammer").font(.footnote) }
                            if !config.cloud.enabled || !config.cloud.configured { Text(config.cloud.reason ?? "The cloud provider is not enabled for this service.").foregroundStyle(.secondary) }
                        } else { Text("Cloud configuration has not been verified. Connect to the service in You first.") }
                        if store.user == nil { Text("Sign in through You to use your employer benefit for cloud analysis. Local checks remain available.") }
                    }
                    Section {
                        Toggle("I approve these fields being processed by GoldRock and OpenAI", isOn: $agreed)
                        ChromeAction(title: "Request AI guidance", symbol: "sparkles") { busy = true; Task { do { try await store.analyzeCloud(caseID); dismiss() } catch { store.error = error.localizedDescription }; busy = false } }.disabled(!agreed || !store.canAnalyze || busy)
                        Text("Your employer cannot access your case or analysis. You can cancel the job from this case.").font(.footnote).foregroundStyle(.secondary)
                    }
                }
            }.goldRockScreen().navigationTitle("Review sharing").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { dismiss() } } }
        }
    }
}

struct DraftView: View {
    let caseID: UUID; let action: ActionStep
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var draft = ""
    @State private var reviewedDraft = false
    var body: some View {
        let current = store.item(caseID).flatMap { try? LocalGuidance.display(for: $0) }
        let currentAction = current?.actions.first(where: { $0.id == action.id })
        NavigationStack {
            Form {
                Section { EditorialListHeader(eyebrow: "Words for the next step", title: "Make the request\nyour own.", detail: "Check the facts, add what is needed and choose where to share. You stay in control of sending it.") }
                if let currentAction {
                    Section { Text(currentAction.reason).font(.headline); ForEach(Array(currentAction.steps.enumerated()), id: \.offset) { index, step in Label(step, systemImage: "\(index + 1).circle") } }
                    Section("Review before sharing") {
                        Text("Compare these words with your records and the current steps. Saved personal wording may be historical even when the source review is current.")
                        Toggle("I reviewed this draft against the current steps", isOn: $reviewedDraft)
                        Button("Use the current reviewed template") { draft = currentAction.draft; reviewedDraft = false }
                    }
                } else { Section { Text("This generated route is no longer current. Any saved personal draft below is preserved for your records; sharing is disabled until the route can be reviewed.") } }
                if let wording = current?.aiAssistance?.actions.first(where: { $0.id == action.id }) {
                    Section("Optional AI wording") { Text(wording.explanation); Button("Use AI draft for my review") { draft = wording.draft; reviewedDraft = false }; Text("Review its accuracy and replace every placeholder before sharing.").font(.footnote).foregroundStyle(.secondary) }
                }
                Section { TextEditor(text: $draft).frame(minHeight: 240).font(.body).accessibilityLabel("Editable draft") } header: { Text("Make the words yours") } footer: { Text("Personal references you add here stay in the local draft. Review the recipient and facts before sharing. This is not sent or submitted by GoldRock.") }
                Section {
                    Button("Save draft locally") { save() }
                    ShareLink(item: ReviewedDraftExport(text: draft, sourceIds: currentAction?.sourceIds ?? action.sourceIds), preview: SharePreview("GoldRock draft", image: Image(systemName: "doc.text"))) { Label("Review share options", systemImage: "square.and.arrow.up") }.disabled(currentAction == nil || !reviewedDraft || draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    Text("A share creates a copy outside GoldRock. Saving a draft does not record a submitted appeal or a payment hold.").font(.footnote).foregroundStyle(.secondary)
                }
                Section("Why this route") { SourceLinks(ids: action.sourceIds) }
            }.goldRockScreen().navigationTitle(action.title).navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { dismiss() } } }
                .onAppear {
                    let saved = store.item(caseID)
                    draft = saved?.editedDrafts[action.id] ?? currentAction?.draft ?? ""
                    reviewedDraft = false
                }
                .onChange(of: draft) { _, value in
                    reviewedDraft = false
                    if value.count > 20000 { draft = String(value.prefix(20000)) }
                }
        }
    }
    private func save() { do { try store.update(caseID) { $0.editedDrafts[action.id] = draft }; store.notice = "Draft saved to this case."; dismiss() } catch { store.error = error.localizedDescription } }
}

struct RecordProgressView: View {
    let caseID: UUID
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var kind = "I contacted the billing office"
    @State private var note = ""
    @State private var resolved = false
    @State private var reduction: Int?
    @State private var errors: Set<String> = []
    @State private var followUp = false
    @State private var reminder = false
    @State private var date = Date().addingTimeInterval(7 * 86400)
    @State private var busy = false
    var body: some View {
        NavigationStack {
            Form {
                Section { EditorialListHeader(eyebrow: "One step at a time", title: "What happened next?", detail: "Keep the response, reference and next step together. This is your record of what happened.") }
                Section("What happened?") {
                    Picker("Action", selection: $kind) { ForEach(["I contacted the billing office", "I contacted my insurer", "I submitted an assistance application", "I submitted an appeal", "I received a written response", "I confirmed a billing hold", "I recorded an outcome"], id: \.self) { Text($0) } }
                    TextEditor(text: $note).frame(minHeight: 120).accessibilityLabel("Private action notes")
                    Text("Keep the reference, response and next step here. These notes stay local. A hold should include its confirmed scope and end date.").font(.footnote).foregroundStyle(.secondary)
                    Toggle("I consider this case resolved", isOn: $resolved)
                    if resolved { AmountField(label: "Confirmed reduction (optional)", key: "reduction", value: $reduction, errors: $errors); Text("Only enter a reduction confirmed by a corrected statement or written decision. This is your record, not a verified savings claim by GoldRock.").font(.footnote).foregroundStyle(.secondary) }
                }
                Section("Next step") {
                    Toggle("Set a follow-up", isOn: $followUp)
                    if followUp {
                        DatePicker("Follow up", selection: $date)
                        Toggle("Send a private device reminder", isOn: $reminder).disabled(store.item(caseID)?.saveMode != .device || date <= Date())
                        if date <= Date() { Text("This date has passed. Choose a future date to schedule a device reminder, or clear the follow-up.").font(.footnote).foregroundStyle(.secondary) }
                        Text("The reminder says only to open your GoldRock workspace. No case name, amount or health information appears on the lock screen. Saving with this option off removes any prior device reminder.").font(.footnote).foregroundStyle(.secondary)
                    }
                }
            }.goldRockScreen().navigationTitle("Record progress").navigationBarTitleDisplayMode(.inline)
                .onAppear {
                    if let item = store.item(caseID) {
                        resolved = item.resolved
                        reduction = item.confirmedReductionCents
                        followUp = item.followUp != nil
                        date = item.followUp ?? Date().addingTimeInterval(7 * 86400)
                    }
                }
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { dismiss() } }
                    ToolbarItem(placement: .confirmationAction) { Button("Save progress", systemImage: "checkmark") { save() }.disabled(busy || !errors.isEmpty) }
                }
        }
    }
    private func save() {
        busy = true
        Task {
            do {
                try store.update(caseID) { item in
                    item.events.append(CaseEvent(kind: kind, note: String(note.prefix(5000))))
                    item.resolved = resolved
                    item.confirmedReductionCents = resolved ? reduction : nil
                    item.followUp = followUp ? date : nil
                }
                if followUp && reminder {
                    do { try await store.remind(caseID, at: date) }
                    catch { store.notice = "Progress was saved, but a device reminder could not be scheduled. " + error.localizedDescription }
                } else {
                    UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [caseID.uuidString])
                }
                dismiss()
            } catch { store.error = error.localizedDescription }
            busy = false
        }
    }
}

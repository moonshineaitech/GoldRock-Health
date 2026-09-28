import SwiftUI

import Combine



private struct ConversationComposerRoute: Identifiable {

    let id = UUID(); var question: String = ""; var replyToID: String?

}



struct CaseConversationView: View {

    let caseID: UUID
    var starterTaskID: String? = nil
    var initialQuestion: String = ""
    @Environment(AppStore.self) private var store

    @Environment(\.scenePhase) private var phase

    @State private var composer: ConversationComposerRoute?

    @State private var summary: ConversationSummary?

    @State private var loadError: String?

    @State private var busy = false
    @State private var draftQuestion = ""
    @State private var initializedQuestion = false
    @State private var operation: Task<Void, Never>?

    private let refresh = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    var body: some View {

        Group {

            if let item = store.item(caseID) {

                List {

                    Section {

                        Text("Ask GoldRock").font(.system(.title2, design: .serif))
                        Text("Your AI partner for a strategy, a clear explanation, or the words to make your request.").font(.subheadline).foregroundStyle(.secondary)

                        Text("AI wording can be wrong. It does not update your case facts, submit a request, confirm a hold or change a deadline.").font(.footnote).foregroundStyle(.secondary)

                    }

                    Section("Your question") {
                        TextField("Ask for a plan, letter, appeal outline or call script…", text: $draftQuestion, axis: .vertical)
                            .lineLimit(4...8).accessibilityLabel("Ask GoldRock about this case")
                        ChromeAction(title: "Review & ask GoldRock", symbol: "sparkles") {
                            composer = .init(question: draftQuestion)
                        }.disabled(busy || hasPending || !store.workspaceActive || draftQuestion.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || draftQuestion.count > 2000)
                        Text(store.canAnalyze ? "Uses OpenAI after your local privacy check and exact sharing approval." : "Cloud AI is currently unavailable. You can prepare a question and use the local playbook; sign in and check your connection in You for OpenAI.").font(.footnote).foregroundStyle(.secondary)
                    }

                    if let loadError { Section { NoticeCard(title: "History could not be checked", text: loadError, symbol: "exclamationmark.shield"); Button("Try reading history again") { reload() } } }
                    if let summary {

                        if summary.turns.isEmpty {

                            Section {

                                NoticeCard(title: "Start with the part that is unclear", text: "For example: What should I ask for if the hospital says insurance is still processing? Keep names, dates, IDs and identifying circumstances out of your question.", symbol: "bubble.left")

                            }

                        }

                        ForEach(summary.turns) { turn in

                            Section {

                                VStack(alignment: .leading, spacing: 10) {

                                    StatusPill(title: turn.status.capitalized, symbol: turn.status == "pending" ? "clock" : "bubble.left")

                                    Text(turn.question).font(.headline).textSelection(.enabled)

                                    if turn.replyToId != nil { Text("A follow-up or correction. Earlier history was preserved.").font(.caption).foregroundStyle(.secondary) }

                                    Text(String(turn.createdAt.prefix(10))).font(.caption).foregroundStyle(.secondary)

                                }.padding(.vertical, 6)

                                if let answer = turn.answer, turn.answerAvailable {

                                    Text(turn.answerKind == "cloud" ? "AI perspective · check against your records" : "Reviewed library response · not AI").font(.footnote).foregroundStyle(.secondary)

                                    Text(answer).textSelection(.enabled)

                                    ForEach(Array(turn.nextSteps.enumerated()), id: \.offset) { _, step in

                                        DisclosureGroup(step.title) { ForEach(Array(step.steps.enumerated()), id: \.offset) { _, text in Text(text) }; SourceLinks(ids: step.sourceIds) }

                                    }

                                    DisclosureGroup("Sources used for this reply") { SourceLinks(ids: turn.sourceIds) }

                                    ForEach(Array(turn.followUpQuestions.enumerated()), id: \.offset) { _, question in Button(question) { composer = .init(question: question, replyToID: turn.id) }.disabled(busy || hasPending) }

                                }

                                ForEach(Array(turn.limitations.enumerated()), id: \.offset) { _, text in Text(text).font(.footnote).foregroundStyle(.secondary) }

                                if turn.status == "pending" {

                                    Text("This is the exact approved turn. Checking first looks up its existing operation. If no operation exists, the unchanged approval may be sent; a changed policy or expired context requires a new review.").font(.footnote).foregroundStyle(.secondary)

                                    Button("Check or send this approved turn", systemImage: "arrow.clockwise") { run { try await store.sendConversation(caseID, turnID: turn.id) } }.disabled(busy)

                                    Button("Cancel this turn and delete cloud work", role: .destructive) { run { try await store.cancelConversation(caseID, turnID: turn.id) } }.disabled(busy)

                                } else {

                                    Button("Ask a follow-up or make a correction", systemImage: "arrow.turn.down.right") { composer = .init(replyToID: turn.id) }.disabled(busy || hasPending)

                                    if turn.jobId != nil { Button("Delete this reply's cloud job", role: .destructive) { run { try await store.cancelConversation(caseID, turnID: turn.id) } }.disabled(busy) }

                                }

                                if let original = item.conversation?.turns.first(where: { $0.id == turn.id }) {

                                    DisclosureGroup("Exact sharing receipt") {

                                        Text("Question and selected history were reviewed before sending. This receipt does not prove their accuracy or removal of every identifier.").font(.footnote)

                                        Text((try? original.facts.jsonString()) ?? "Facts unavailable").font(.caption.monospaced()).textSelection(.enabled)

                                        if turn.contextCurrent { ForEach(Array(original.history.enumerated()), id: \.offset) { index, pair in Text("Historical sharing receipt · context \(index + 1)").font(.headline); Text(pair.question); Text(pair.answer) } } else if !original.history.isEmpty { Text("Historical context is preserved locally but withheld because its facts or original source reviews changed.").font(.footnote) }

                                        if let consent = original.consent { Text("Policy: \(consent.policyVersion) · processor: \(consent.processor)").font(.caption) }

                                        if !original.knowledgeIds.isEmpty { Text("Chosen knowledge: " + original.knowledgeIds.joined(separator: ", ")).font(.caption) }

                                    }

                                }

                            }

                        }

                        Section {

                            ChromeAction(title: "Ask about this case", symbol: "bubble.left.and.bubble.right") { composer = .init() }.disabled(hasPending || busy)

                            Text(hasPending ? "Check or cancel the pending turn before asking another question." : "The raw question editor stays in memory. Only the text and facts you approve become part of this case.").font(.footnote).foregroundStyle(.secondary)

                        }

                    }

                    Section("Available on this iPhone") {

                        NavigationLink { KnowledgeSearchView(facts: item.facts, caseID: caseID) } label: { EditorialFeatureRow(title: "Browse researched answers", detail: "A local reference library, available without a cloud conversation.", symbol: "books.vertical", showsChevron: false) }

                        if !store.canAnalyze { Text(store.user == nil ? "Sign in from You for cloud conversation. No question is sent by opening this screen." : "Cloud conversation is unavailable with the current connection or benefit. Reconnect from You; local research remains available.").font(.footnote).foregroundStyle(.secondary) }

                        Text("\(item.saveMode.title). Your employer cannot access this conversation. Cloud job retention is separate from local saving.").font(.footnote).foregroundStyle(.secondary)

                    }

                }.goldRockScreen()

                .task(id: item.updatedAt) { reload() }

                .sheet(item: $composer, onDismiss: reload) { route in ConversationComposerView(caseID: caseID, facts: item.facts, initialQuestion: route.question, replyToID: route.replyToID) }

            } else { ContentUnavailableView("Case unavailable", systemImage: "folder", description: Text("This workspace may have closed or the case may have been deleted.")) }

        }

        .navigationTitle("Ask GoldRock").navigationBarTitleDisplayMode(.inline)

        .onAppear {
            guard !initializedQuestion else { return }
            initializedQuestion = true
            if let starterTaskID { do { draftQuestion = try LocalGuidance.advocacyTask(starterTaskID).conversationStarter } catch { loadError = error.localizedDescription } }
            else { draftQuestion = initialQuestion }
        }
        .onChange(of: draftQuestion) { _, value in if value.count > 2000 { draftQuestion = String(value.prefix(2000)) } }
        .onReceive(refresh) { _ in if store.workspaceActive { reload() } }

        .onChange(of: phase) { _, value in if value == .background { operation?.cancel(); composer = nil; summary = nil; draftQuestion = "" } }
        .onChange(of: store.workspaceIdentity) { _, _ in operation?.cancel(); composer = nil; summary = nil; draftQuestion = "" }

        .onDisappear { operation?.cancel(); draftQuestion = "" }

        .overlay { if busy { ProgressView("Checking the approved turn").padding().background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16)) } }

    }

    private var hasPending: Bool { store.item(caseID)?.conversation?.turns.contains(where: \.pending) ?? false }

    private func reload() {

        guard store.workspaceActive, let item = store.item(caseID) else { summary = nil; return }

        do { summary = try LocalGuidance.conversationSummary(item.conversation ?? CaseConversation(), facts: item.facts); loadError = nil }

        catch { summary = nil; loadError = "Existing history was kept. Its facts or sources could not be checked, so replies are not displayed as current guidance." }

    }

    private func run(_ action: @escaping () async throws -> Void) {

        busy = true; operation = Task { do { try await action() } catch is CancellationError { } catch { store.error = error.localizedDescription }; busy = false; reload() }

    }

}



private struct ReviewedHistoryPair: Identifiable, Equatable {

    var id: String; var question: String; var answer: String

    var exchange: ConversationInput.Exchange { .init(question: question, answer: answer) }

}



struct ConversationComposerView: View {
    let caseID: UUID; let facts: PublicFacts; let initialQuestion: String; let replyToID: String?

    @Environment(AppStore.self) private var store

    @Environment(\.dismiss) private var dismiss

    @Environment(\.scenePhase) private var phase

    @State private var rawQuestion = ""

    @State private var question = ""

    @State private var history: [ReviewedHistoryPair] = []

    @State private var availableHistory: [ReviewedHistoryPair] = []

    @State private var knowledge: [KnowledgeAnswer] = []

    @State private var knowledgeIDs: [String] = []

    @State private var privacyNotes: [String] = []

    @State private var review = false

    @State private var approved = false

    @State private var policy = ""

    @State private var workspace: UUID?

    @State private var epoch = UUID()

    @State private var operation: Task<Void, Never>?

    @State private var busy = false

    @State private var submittedTurn: String?

    @State private var error: String?

    var body: some View {

        NavigationStack {

            Form {

                Section { EditorialListHeader(eyebrow: review ? "Your exact sharing review" : "Your words, your control", title: review ? "Choose what\nleaves this iPhone." : "What would you\nlike to understand?", detail: "This asks cloud AI about your case. It does not contact a hospital, insurer or collector.") }

                if let error { Section { NoticeCard(title: "Before continuing", text: error, symbol: "exclamationmark.circle") } }

                if let submittedTurn {

                    Section { Text("Your exact approved question is saved with this case. Check the same turn from the conversation to resolve an unconfirmed connection; it will not create a different question."); Button("Return to the saved turn") { dismiss() }; Text(submittedTurn).font(.caption.monospaced()) }

                } else if !review {

                    Section("Question — kept only in this editor until review") {

                        TextEditor(text: $rawQuestion).frame(minHeight: 170).accessibilityLabel("Question before local privacy review").autocorrectionDisabled()

                        Text("\(rawQuestion.count) / 20,000 characters. Describe the situation without names, exact dates, contact details or account numbers.").font(.footnote).foregroundStyle(.secondary)

                    }

                    Section {

                        ChromeAction(title: "Prepare a local privacy review", symbol: "eye") { prepare(useModel: false) }.disabled(busy || rawQuestion.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || rawQuestion.count > 20_000)

                        Button("Also check with Apple's on-device model", systemImage: "iphone.gen3") { prepare(useModel: true) }.disabled(busy || !OnDeviceAssistant.isAvailable || rawQuestion.isEmpty || rawQuestion.count > 20_000)

                        Text(OnDeviceAssistant.availability).font(.footnote).foregroundStyle(.secondary)

                        Text("Pattern checks and the optional local model can miss identifiers. The model reviews at most 6,500 characters and never falls back to cloud processing. You must inspect the final text.").font(.footnote).foregroundStyle(.secondary)

                    }

                } else {

                    Section("1. Edit the question that will be sent") {

                        TextEditor(text: $question).frame(minHeight: 150).accessibilityLabel("Exact question to send").autocorrectionDisabled()

                        Text("\(question.count) / 2,000 characters").font(.footnote).foregroundStyle(.secondary)

                        ForEach(Array(privacyNotes.enumerated()), id: \.offset) { _, note in Text(note).font(.footnote).foregroundStyle(.secondary) }

                    }

                    historySection

                    Section("3. Optional reference topics") {

                        Text("The service searches its reviewed library from your approved question. You may also choose up to six topics. No private workbook, document history or local notes are included.").font(.footnote).foregroundStyle(.secondary)

                        DisclosureGroup("Choose from the local library (\(knowledgeIDs.count) selected)") {

                            ForEach(knowledge.filter(\.current)) { entry in

                                Toggle(entry.title, isOn: Binding(get: { knowledgeIDs.contains(entry.id) }, set: { selected in if selected { if knowledgeIDs.count < 6 { knowledgeIDs.append(entry.id) } } else { knowledgeIDs.removeAll { $0 == entry.id } } })).disabled(!knowledgeIDs.contains(entry.id) && knowledgeIDs.count >= 6)

                            }

                        }

                    }

                    Section("4. Case facts included with this question") {

                        ForEach(facts.reviewedRows, id: \.key) { row in LabeledContent(PublicFacts.label(for: row.key), value: row.value) }

                        DisclosureGroup("Exact facts, including service lines") { Text((try? facts.jsonString()) ?? "Invalid facts").font(.caption.monospaced()).textSelection(.enabled) }

                        Text("To change these facts, close this review and edit the case. Missing amounts remain unknown. Ledger choices and recorded reimbursements do not change these facts automatically.").font(.footnote).foregroundStyle(.secondary)

                    }

                    Section("Processing and retention") {

                        if let config = store.config {

                            LabeledContent("Processor", value: "OpenAI"); LabeledContent("Policy", value: policy)

                            LabeledContent("GoldRock job retention", value: "\(config.privacy.jobTtlSeconds / 60) minutes maximum")

                            if let retention = config.privacy.providerRetention { Text(retention).font(.footnote) }

                            Text("Provider retention is separate from GoldRock job retention. One-time mode does not change cloud retention. Health-related text and facts can still be sensitive.").font(.footnote).foregroundStyle(.secondary)

                            if config.environment != "production" { Label("Development service: use synthetic information only", systemImage: "hammer").font(.footnote) }

                        } else { Text("Connect and verify the service from You before sharing.") }

                        Text("Original files, raw OCR, the raw question editor, case names and private progress records are excluded. The exact edited question and selected question/answer pairs above are additional text disclosures.").font(.footnote).foregroundStyle(.secondary)

                    }

                    Section {

                        Toggle("I reviewed and approve this exact question, selected history and facts for GoldRock and OpenAI", isOn: $approved)

                        ChromeAction(title: "Send this reviewed question", symbol: "arrow.up") { send() }.disabled(!approved || !store.canAnalyze || busy || !isCurrent || question.isEmpty || question.count > 2_000)

                        Button("Start the privacy review again") { clearReview(); rawQuestion = "" }.disabled(busy)

                        if !store.canAnalyze { Text("Cloud conversation needs a signed-in account and enabled service. Close this sheet to browse the local reference library.").font(.footnote).foregroundStyle(.secondary) }

                    }

                }

            }.goldRockScreen().navigationTitle(review ? "Review sharing" : "Ask a question").navigationBarTitleDisplayMode(.inline)

            .disabled(busy)

            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { invalidate(); dismiss() } } }

            .overlay { if busy { ProgressView(review ? "Checking this operation" : "Preparing on this iPhone").padding().background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16)) } }

        }

        .onAppear { workspace = store.workspaceIdentity; rawQuestion = initialQuestion }

        .onChange(of: question) { _, _ in approved = false }

        .onChange(of: history) { _, _ in approved = false }

        .onChange(of: knowledgeIDs) { _, _ in approved = false }

        .onChange(of: store.config?.privacy.policyVersion) { _, _ in approved = false; policy = store.config?.privacy.policyVersion ?? "" }

        .onChange(of: store.item(caseID)?.facts) { _, _ in invalidate(); dismiss() }

        .onChange(of: store.workspaceIdentity) { _, _ in invalidate(); dismiss() }

        .onChange(of: phase) { _, next in if next == .background { invalidate(); dismiss() } }

        .onDisappear { invalidate() }

    }

    private var historySection: some View {

        Section("2. Choose and review earlier context") {

            Text("No history is included by default. Only current replies with matching facts can be selected. Editing a pair does not bypass its original source review.").font(.footnote).foregroundStyle(.secondary)

            ForEach(availableHistory) { pair in

                Toggle(pair.question, isOn: Binding(get: { history.contains { $0.id == pair.id } }, set: { selected in if selected { if history.count < 4 { history.append(pair) } } else { history.removeAll { $0.id == pair.id } } })).disabled(history.count >= 4 && !history.contains { $0.id == pair.id })

            }

            if availableHistory.isEmpty { Text("No eligible earlier reply is available to include.").foregroundStyle(.secondary) }

            ForEach($history) { $pair in

                VStack(alignment: .leading, spacing: 8) {

                    Text("Exact earlier question").font(.headline)

                    TextEditor(text: $pair.question).frame(minHeight: 90).accessibilityLabel("Earlier question to share").autocorrectionDisabled()

                    Text("Exact earlier answer").font(.headline)

                    TextEditor(text: $pair.answer).frame(minHeight: 140).accessibilityLabel("Earlier answer to share").autocorrectionDisabled()

                    Text("Remove any identifying details. Question limit 2,000; answer limit 6,000 characters.").font(.footnote).foregroundStyle(.secondary)

                }

            }

        }

    }

    private var isCurrent: Bool { workspace == store.workspaceIdentity && store.workspaceActive && store.item(caseID)?.facts == facts }

    private func prepare(useModel: Bool) {

        guard isCurrent else { return }; busy = true; error = nil

        epoch = UUID(); let run = epoch; let raw = rawQuestion

        operation = Task {

            do {

                // Classify the original locally before masking, since masking can erase
                // the bill/statement structure that should block a pasted document.
                let original = try LocalGuidance.conversationCandidate(raw)

                try Task.checkCancellation()

                guard epoch == run, isCurrent else { return }

                if original.flags.contains("document_like_text") {
                    error = "This looks like pasted bill or statement text. It stays in this editor on your iPhone. Remove the document text and ask a short question in your own words; use the case form for reviewed facts. Nothing was sent."
                    busy = false
                    return
                }

                var spans = IdentifierDetector.detect(raw), notes: [String] = []

                if useModel { let assistance = try await OnDeviceAssistant.inspect(raw); spans += assistance.candidates; notes.append(assistance.notice) }

                try Task.checkCancellation()

                let preview = IdentifierDetector.preview(raw, candidates: spans)

                let proposal = try LocalGuidance.conversationCandidate(preview)

                guard epoch == run, isCurrent else { return }

                guard !proposal.flags.contains("document_like_text"), !proposal.candidate.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
                    error = "The local privacy check could not make a safe question from that text. Your draft is still here. Remove pasted records and identifiers, then ask a short question in your own words. Nothing was sent."
                    busy = false
                    return
                }

                let state = store.item(caseID)?.conversation ?? CaseConversation()

                let current = try LocalGuidance.conversationSummary(state, facts: facts)

                availableHistory = current.turns.filter(\.canUseAsContext).compactMap { turn in guard let answer = turn.answer else { return nil }; return .init(id: turn.id, question: turn.question, answer: answer) }

                knowledge = try LocalGuidance.knowledge("", facts: facts)

                question = proposal.candidate; history = []; knowledgeIDs = []

                privacyNotes = notes + proposal.limitations + (spans.isEmpty && proposal.flags.isEmpty ? [] : ["Potential identifying details were flagged or replaced. Review every word; detection is incomplete."])

                rawQuestion = ""; approved = false; policy = store.config?.privacy.policyVersion ?? ""; review = true; busy = false

            } catch is CancellationError { if epoch == run { busy = false } }

            catch { if epoch == run, isCurrent { error = "The local review could not be prepared. Shorten the question or use pattern checks alone; nothing was sent."; busy = false } }

        }

    }

    private func send() {

        guard isCurrent, approved, policy == store.config?.privacy.policyVersion else { approved = false; return }

        error = nil; busy = true

        do {

            let input = ConversationInput(question: question, history: history.map(\.exchange), knowledgeIds: knowledgeIDs)

            let turnID = try store.approveConversation(caseID, input: input, facts: facts, historyTurnIDs: history.map(\.id), replyToID: replyToID, accepted: approved)

            submittedTurn = turnID; rawQuestion = ""; approved = false

            operation = Task {

                do { try await store.sendConversation(caseID, turnID: turnID); if isCurrent { dismiss() } }

                catch is CancellationError { }

                catch { if isCurrent { error = "The service did not confirm this turn. Its exact approval is preserved; return to the conversation to check or cancel the same operation." } }

                busy = false

            }

        } catch { self.error = error.localizedDescription; approved = false; busy = false }

    }

    private func clearReview() { question = ""; history = []; availableHistory = []; knowledge = []; knowledgeIDs = []; privacyNotes = []; approved = false; review = false }

    private func invalidate() { epoch = UUID(); operation?.cancel(); operation = nil; rawQuestion = ""; clearReview(); busy = false }

}


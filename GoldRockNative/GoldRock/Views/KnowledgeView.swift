import SwiftUI

struct KnowledgeSearchView: View {
    var facts: PublicFacts? = nil
    var caseID: UUID? = nil
    @State private var query = ""
    @State private var category = "all"
    @State private var answers: [KnowledgeAnswer] = []
    @State private var problem: String?
    private let categories = ["all", "bill", "coverage", "assistance", "payment", "collections", "before-care"]
    var body: some View {
        List {
            Section {
                EditorialListHeader(eyebrow: "The small print, made clearer", title: "There’s a better\nquestion to ask.", detail: "Specific answers for the situation in front of you. Search stays on this iPhone.", artwork: query.isEmpty ? .clarity : nil)
                Picker("Topic", selection: $category) { ForEach(categories, id: \.self) { Text(WorkbookLabels.title($0)).tag($0) } }
                Text("These answers help you check what applies. They do not determine your rights or eligibility.").font(.footnote).foregroundStyle(.secondary)
                if facts != nil { Text("These results also match your selected document, coverage and goal categories. Missing facts remain unknown.").font(.footnote).foregroundStyle(.secondary) }
            }
            if let problem { Section { Text(problem); Button("Try again") { search() } } }
            if answers.filter({ category == "all" || $0.category == category }).isEmpty && problem == nil {
                Section { ContentUnavailableView("No match yet", systemImage: "magnifyingglass", description: Text("Try a specific term such as itemized bill, medical necessity, charity care or QMB.")) }
            }
            ForEach(answers.filter { category == "all" || $0.category == category }) { answer in
                NavigationLink { KnowledgeDetailView(answerID: answer.id, caseID: caseID) } label: {
                    VStack(alignment: .leading, spacing: 8) {
                        Eyebrow(text: WorkbookLabels.title(answer.category))
                        Text(answer.title).font(.headline)
                        Text(answer.question).font(.body).foregroundStyle(.secondary)
                        if !answer.current { Label("Source review needed", systemImage: "clock").font(.footnote) }
                    }.padding(.vertical, 6)
                }
            }
            if facts != nil { Section { NavigationLink("Search the full library") { KnowledgeSearchView(caseID: caseID) } } }
        }.goldRockScreen()
            .navigationTitle("Find an answer").navigationBarTitleDisplayMode(.inline)
            .searchable(text: $query, prompt: "What are you trying to understand?")
            .onChange(of: query) { _, text in if text.count > 400 { query = String(text.prefix(400)) } }
            .task(id: query) {
                do { if !query.isEmpty { try await Task.sleep(for: .milliseconds(180)) }; try Task.checkCancellation(); search() }
                catch { /* A newer query or leaving the screen cancels the pending local search. */ }
            }
    }
    private func search() { do { answers = try LocalGuidance.knowledge(query, facts: facts); problem = nil } catch { answers = []; problem = error.localizedDescription } }
}

struct KnowledgeDetailView: View {
    let answerID: String
    var caseID: UUID? = nil
    var body: some View {
        // Re-evaluate expiry while a saved screen remains open. There is no network request.
        TimelineView(.periodic(from: .now, by: 60)) { timeline in
            if let answer = try? LocalGuidance.knowledgeItem(answerID, now: timeline.date) {
                List {
                    Section { EditorialListHeader(eyebrow: WorkbookLabels.title(answer.category), title: answer.question, detail: answer.summary); StatusPill(title: answer.current ? "Reviewed public guidance" : "Source review needed", symbol: answer.current ? "text.book.closed" : "clock") }
                    if answer.current {
                        Section("Why this happens") { Text(answer.mechanism) }
                        knowledgeRows("Confirm the situation", answer.verify)
                        knowledgeRows("Practical next moves", answer.actions)
                        knowledgeRows("Evidence to look for", answer.evidence)
                        knowledgeRows("What would show progress", answer.completion)
                        knowledgeRows("Mistakes to avoid", answer.avoid)
                        if let caseID {
                            Section { NavigationLink { CaseWorkbookView(caseID: caseID) } label: { Label("Track the process and evidence", systemImage: "list.bullet.clipboard") }; Text("You choose what to record. Reading an answer does not start an appeal, stop a deadline or confirm a hold.").font(.footnote).foregroundStyle(.secondary) }
                        }
                    } else { Section { Label("This answer needs a fresh source review before use.", systemImage: "clock") } }
                    Section("Sources and limits") {
                        Text("Reviewed \(String(answer.reviewedAt.prefix(10))) · review due \(String(answer.expiresAt.prefix(10)))").font(.footnote)
                        SourceLinks(ids: answer.sourceIds)
                    }
                }.goldRockScreen().navigationTitle(answer.title).navigationBarTitleDisplayMode(.inline)
            } else { ContentUnavailableView("Answer unavailable", systemImage: "book.closed", description: Text("The local library could not load this answer. Return to the search and try again.")) }
        }
    }
    @ViewBuilder private func knowledgeRows(_ title: String, _ rows: [String]) -> some View {
        if !rows.isEmpty { Section(title) { ForEach(Array(rows.enumerated()), id: \.offset) { _, text in Text(text).padding(.vertical, 4) } } }
    }
}

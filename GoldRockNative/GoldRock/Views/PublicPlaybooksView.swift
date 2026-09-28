import SwiftUI

struct PublicPlaybooksView: View {
    var body: some View {
        List {
            Section { EditorialListHeader(eyebrow: "Know the next move", title: "Clear questions.\nUseful requests.", detail: "Understand the process, prepare your words and know what to check when a reply comes back.", artwork: .clarity) }
            NavigationLink { KnowledgeSearchView() } label: { EditorialFeatureRow(title: "Find a specific answer", detail: "Bills, insurance, assistance and collections.", symbol: "magnifyingglass", showsChevron: false) }
            NavigationLink { HospitalResearchView() } label: { EditorialFeatureRow(title: "Go to the hospital’s policy", detail: "Find official requirements and covered providers.", symbol: "building.2", showsChevron: false) }
            Section("Handle a specific issue") {
                NavigationLink { CountermeasuresView() } label: {
                    VStack(alignment: .leading, spacing: 8) {
                        Label("Choose your next request", systemImage: "arrow.triangle.branch").font(.headline)
                        Text("Billing mismatches, assistance, coverage decisions, financing and collection notices — with a next step for each reply.").font(.body).foregroundStyle(.secondary)
                    }.padding(.vertical, 6)
                }
            }
            ForEach((try? LocalGuidance.playbooks()) ?? []) { playbook in
                NavigationLink { PublicPlaybookDetail(playbook: playbook) } label: { VStack(alignment: .leading, spacing: 8) { Text(playbook.title).font(.headline); Text(playbook.summary).font(.subheadline).foregroundStyle(.secondary); if !playbook.current { Label("Source review needed", systemImage: "clock").font(.caption) } }.padding(.vertical, 6) }
            }
        }.goldRockScreen().navigationTitle("The playbook").navigationBarTitleDisplayMode(.inline)
    }
}
struct CountermeasuresView: View {
    var facts: PublicFacts? = nil
    @State private var routes: [CountermeasureRoute] = []
    @State private var problem: String?
    @State private var query = ""
    private var matches: [CountermeasureRoute] { routes.filter { query.isEmpty || ($0.title + " " + $0.summary + " " + $0.pattern).localizedCaseInsensitiveContains(query) } }
    var body: some View {
        List {
            Section {
                EditorialListHeader(eyebrow: "Prepare, then follow through", title: facts == nil ? "Find the route\nfor your situation." : "A few routes\nworth checking.", detail: "Start with the checks. Choose the response you received. Prepare what to ask next.")
                Text("A route does not establish an error, eligibility or a payment hold.").font(.footnote).foregroundStyle(.secondary)
            }
            if let problem { Section { Text(problem); Button("Try again") { load() } } }
            if routes.isEmpty && problem == nil {
                Section { Text("No current route matches these selections. You can still browse the full playbook and read its sources.") }
            }
            if !routes.isEmpty && matches.isEmpty { ContentUnavailableView.search(text: query) }
            ForEach(matches) { route in
                NavigationLink { CountermeasureDetail(route: route) } label: {
                    VStack(alignment: .leading, spacing: 8) {
                        Eyebrow(text: WorkbookLabels.title(route.category))
                        Text(route.title).font(.headline)
                        Text(route.summary).font(.body).foregroundStyle(.secondary)
                        if !route.current { Label("Source review needed", systemImage: "clock").font(.footnote) }
                    }.padding(.vertical, 6)
                }
            }
            if facts != nil { Section { NavigationLink("Browse all researched routes") { CountermeasuresView() } } }
        }.goldRockScreen()
            .navigationTitle("Your next request").navigationBarTitleDisplayMode(.inline)
            .searchable(text: $query, prompt: "Itemized bill, payment, collector…")
            .onChange(of: query) { _, value in if value.count > 300 { query = String(value.prefix(300)) } }
            .onAppear { load() }
    }
    private func load() {
        do {
            if let facts { routes = try LocalGuidance.recommendations(for: facts) }
            else { routes = try LocalGuidance.countermeasures() }
            problem = nil
        }
        catch { routes = []; problem = error.localizedDescription }
    }
}
struct CountermeasureDetail: View {
    let route: CountermeasureRoute
    @State private var response: CountermeasureResponse = .prepare
    @State private var drafts: [CountermeasureResponse: String] = [:]
    private var move: CountermeasureMove? { route.move(response) }
    private var draft: Binding<String> {
        Binding(get: { drafts[response] ?? move?.draft ?? "" }, set: { drafts[response] = String($0.prefix(20000)) })
    }
    var body: some View {
        List {
            Section {
                EditorialListHeader(eyebrow: WorkbookLabels.title(route.category), title: route.title, detail: route.summary)
                Text(route.appliesWhen)
                Text(route.pattern).foregroundStyle(.secondary)
            }
            if let reasons = route.matchReasons { Section("Why this may help") { ForEach(reasons, id: \.self) { Text($0) } } }
            if route.isActionable() {
                Section("Check before using this route") { ForEach(route.verify, id: \.self) { Text($0) } }
                if let evidence = route.evidence, !evidence.isEmpty {
                    Section("Records to have nearby") { ForEach(evidence, id: \.self) { Label($0, systemImage: "doc.text") } }
                }
                if let questions = route.counterQuestions, !questions.isEmpty {
                    Section("If you hear this") {
                        ForEach(Array(questions.enumerated()), id: \.offset) { _, question in
                            DisclosureGroup(question.statementToCheck) {
                                Text(question.response).textSelection(.enabled)
                                ForEach(question.evidence, id: \.self) { Text($0).font(.footnote).foregroundStyle(.secondary) }
                            }
                        }
                    }
                }
                Section {
                    Picker("Where are you now?", selection: $response) { ForEach(CountermeasureResponse.allCases) { Text($0.title).tag($0) } }
                }
                if let move {
                    Section(move.title) { ForEach(Array(move.steps.enumerated()), id: \.offset) { index, step in Label(step, systemImage: "\(index + 1).circle").padding(.vertical, 4) } }
                    Section {
                        TextEditor(text: draft).frame(minHeight: 240).font(.body).accessibilityLabel("Editable request for \(response.title)")
                        ShareLink(item: ReviewedDraftExport(text: draft.wrappedValue, sourceIds: route.sourceIds), preview: SharePreview("GoldRock request", image: Image(systemName: "doc.text"))) { Label("Review sharing options", systemImage: "square.and.arrow.up") }.disabled(draft.wrappedValue.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        Text("Replace every placeholder and check the recipient. Each edited draft stays in this screen’s memory. Sharing creates an outside copy; GoldRock does not submit the request or record it as sent.").font(.footnote).foregroundStyle(.secondary)
                    } header: { Text("Make the request yours") }
                }
            } else { Section { Label("This route needs a new source review before use.", systemImage: "clock") } }
            if let taskIds = route.taskIds, !taskIds.isEmpty {
                Section("Prepare your own case") {
                    ForEach(taskIds, id: \.self) { taskID in
                        if let task = try? LocalGuidance.advocacyTask(taskID) {
                            NavigationLink { AdvocacyTaskView(taskID: taskID) } label: { Label(task.title, systemImage: "square.and.pencil") }
                        }
                    }
                    Text("These forms keep your answers local. Choose details and review sharing separately when you want tailored AI help.").font(.footnote).foregroundStyle(.secondary)
                }
            }
            Section("Keep in mind") {
                if route.isActionable() { ForEach(route.watchouts, id: \.self) { Text($0) } }
                else { Text("Open the official sources for a new review before using this route.") }
            }
            Section("Sources and applicability") {
                Text("Reviewed \(String(route.reviewedAt.prefix(10))) · review due \(String(route.expiresAt.prefix(10)))").font(.footnote).foregroundStyle(.secondary)
                SourceLinks(ids: route.sourceIds)
            }
        }.goldRockScreen()
            .navigationTitle(route.title).navigationBarTitleDisplayMode(.inline)
    }
}
struct HospitalResearchView: View {
    @Environment(AppStore.self) private var store
    @State private var providers: [ResearchCatalog.Provider] = []
    @State private var selected: ResearchCatalog.Provider?
    @State private var result: ResearchResponse.Research?
    @State private var problem: String?
    @State private var busy = false
    @State private var consent = false
    var body: some View {
        List {
            Section {
                EditorialListHeader(eyebrow: "Official hospital policies", title: "Start with the\nactual requirements.", detail: "Choose a hospital from the reviewed directory. Your case facts and documents are not part of this lookup.")
                Text("A retrieved policy is a source to inspect. It does not establish your eligibility or which separately billing clinicians it covers.").font(.footnote).foregroundStyle(.secondary)
            }
            if busy { ProgressView("Reading the official public page…") }
            if let problem { Section { Text(problem); Button("Reload directory") { Task { await load() } } } }
            Section("Reviewed directory") {
                ForEach(providers) { provider in Button { selected = provider; consent = true } label: { EditorialFeatureRow(title: provider.name, detail: provider.stateScope.joined(separator: ", "), symbol: "building.2") }.buttonStyle(.plain).disabled(busy) }
            }
            if let result {
                Section(result.title) {
                    if let url = URL(string: result.url), url.scheme == "https" { Link("Open the official policy page", destination: url) }
                    Text("Retrieved \(String(result.fetchedAt.prefix(10))) · applicability not yet established").font(.caption).foregroundStyle(.secondary)
                    if result.status == "document_only" { Text("This source is a document. Open the official link to review it.") }
                    if !result.text.isEmpty { DisclosureGroup("Read extracted public text") { Text(result.text).textSelection(.enabled) } }
                    ForEach(result.limitations, id: \.self) { Text($0).font(.footnote).foregroundStyle(.secondary) }
                    ForEach(Array(result.links.enumerated()), id: \.offset) { _, link in if let url = URL(string: link.url), url.scheme == "https" { Link(link.title, destination: url) } }
                }
            }
        }.goldRockScreen().navigationTitle("Hospital policies").navigationBarTitleDisplayMode(.inline)
            .task { await load() }
            .confirmationDialog("Look up \(selected?.name ?? "this hospital")?", isPresented: $consent, titleVisibility: .visible) {
                Button("Look up public policy") { guard let selected else { return }; busy = true; problem = nil; Task { do { result = try await store.publicPolicy(selected.id).research } catch { problem = error.localizedDescription }; busy = false } }
            } message: { Text("Only the public hospital ID will be sent to GoldRock's policy lookup. No private case data or account token accompanies it.") }
    }
    private func load() async { busy = true; problem = nil; do { providers = try await store.publicResearchCatalog().providers } catch { problem = "The policy directory could not be loaded. Local playbooks remain available. " + error.localizedDescription }; busy = false }
}
struct PublicPlaybookDetail: View {
    let playbook: PublicPlaybook
    @State private var draft = ""
    var body: some View {
        let current = playbook.current && (try? LocalGuidance.sourcesAreCurrent(playbook.sourceIds)) == true
        List {
            Section { EditorialListHeader(eyebrow: "A practical starting point", title: playbook.title, detail: playbook.summary); Text(playbook.applicability).foregroundStyle(.secondary) }
            if current {
                Section("What to do") { ForEach(Array(playbook.steps.enumerated()), id: \.offset) { number, step in Label(step, systemImage: "\(number + 1).circle").padding(.vertical, 4) } }
                Section { TextEditor(text: $draft).frame(minHeight: 220).accessibilityLabel("Editable playbook draft"); ShareLink(item: ReviewedDraftExport(text: draft, sourceIds: playbook.sourceIds), preview: SharePreview("GoldRock draft", image: Image(systemName: "doc.text"))) { Label("Review sharing options", systemImage: "square.and.arrow.up") }; Text("This draft stays in memory. GoldRock does not send it. Anything you share creates a copy outside the app.").font(.footnote).foregroundStyle(.secondary) } header: { Text("Words to start with") }
            }
            Section("Keep in mind") {
                if current { ForEach(playbook.limitations, id: \.self) { Text($0) } }
                else { Text("This playbook needs a new source review before its steps or template can be used.") }
            }
            Section("Official sources") { SourceLinks(ids: playbook.sourceIds) }
        }.goldRockScreen().navigationTitle(playbook.title).navigationBarTitleDisplayMode(.inline).onAppear { draft = playbook.draft }
    }
}

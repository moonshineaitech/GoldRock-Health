import SwiftUI

struct RootView: View {
    @Environment(AppStore.self) private var store
    var body: some View {
        @Bindable var store = store
        Group {
            if store.locked { LockedView() }
            else {
                TabView(selection: $store.selectedTab) {
                    Tab("Today", systemImage: "sun.max", value: 0) { HomeView() }
                    Tab("Tools", systemImage: "square.grid.2x2", value: 3) { NativeToolsView() }
                    Tab("Cases", systemImage: "folder", value: 1) { CasesView() }
                    Tab("Playbook", systemImage: "book.closed", value: 4) { NavigationStack { NativePlaybookHomeView() } }
                    Tab("You", systemImage: "person.crop.circle", value: 2) { AccountView() }
                }
            }
        }
        .alert("Please review", isPresented: Binding(get: { store.error != nil }, set: { if !$0 { store.error = nil } })) { Button("OK") { store.error = nil } } message: { Text(store.error ?? "") }
    }
}
struct LockedView: View {
    @Environment(AppStore.self) private var store
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                HStack { GoldRockWordmark(); Spacer(); Image(systemName: "lock.shield").foregroundStyle(GoldRockTheme.accent) }
                EditorialHeader(eyebrow: "Your AI medical bill advocate", title: "They have their playbook.\nWe have ours.", detail: "Expert AI guidance to help you fight medical bills—with a strategy, the right questions, and the words to take action.")
                EditorialIllustration(artwork: .life, height: 142)
                ChromeAction(title: store.hasSuspendedWorkspace ? "Resume my private workspace" : "Open my private workspace", symbol: "lock.open") { Task { await store.unlock() } }.disabled(store.busy)
                if store.hasSuspendedWorkspace {
                    Text("Your session is still in this app's memory. Resume after unlocking, or deliberately end it below.").font(.footnote).foregroundStyle(.secondary)
                    Button("End this session", role: .destructive) { store.lock() }.frame(maxWidth: .infinity, minHeight: 44)
                } else { Button("Start a one-time session") { store.startSessionOnly() }.frame(maxWidth: .infinity, minHeight: 44) }
                HStack(alignment: .top, spacing: 16) {
                    Image(systemName: "sparkles").foregroundStyle(GoldRockTheme.accent)
                    VStack(alignment: .leading, spacing: 6) { Text("Advice. Strategy. Writing.").font(.headline); Text("Check a bill, prepare an appeal, find financial assistance, or plan a billing call.").font(.subheadline).foregroundStyle(.secondary) }
                }.padding(.vertical, 8)
                NoticeCard(title: "A private place to start", text: "Your document is read on your iPhone. You choose whether to keep your case and whether to share reviewed facts with cloud AI.")
                Text("Kept cases require your device passcode. One-time cases stay only in process memory through brief app switches; ending the session, switching accounts or the app process closing clears them. No account is needed for local checks.").font(.footnote).foregroundStyle(.secondary)
            }.padding(24)
        }.background(GoldRockTheme.canvas).overlay { if store.busy { ProgressView().padding().background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16)) } }
    }
}
struct HomeView: View {
    @Environment(AppStore.self) private var store
    @Environment(\.scenePhase) private var phase
    @State private var intake = false
    @State private var path: [UUID] = []
    @State private var goal: MemberGoal = .understand
    @State private var question = ""
    @FocusState private var composing: Bool
    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    HStack { GoldRockWordmark(); Spacer(); Image(systemName: store.sessionOnly ? "clock" : "lock.iphone").foregroundStyle(GoldRockTheme.accent).accessibilityLabel(store.sessionOnly ? "One-time session" : "Kept on this iPhone") }
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Good to have someone in your corner.").font(.subheadline).foregroundStyle(.secondary)
                        Text("Let’s make room\nfor peace of mind.").font(.system(size: 34, weight: .medium)).fixedSize(horizontal: false, vertical: true)
                        Label("Expert AI for medical bills, appeals and next steps.", systemImage: "checkmark.seal").font(.caption).foregroundStyle(.secondary)
                        Text("They have their playbook. We have ours.").font(.system(.subheadline, design: .serif)).foregroundStyle(GoldRockTheme.accent)
                    }
                    EditorialCard {
                        VStack(alignment: .leading, spacing: 14) {
                            Eyebrow(text: "A good place to start")
                            Text("A medical bill.\nA little help making sense of it.").font(.title3.weight(.semibold)).fixedSize(horizontal: false, vertical: true)
                            Text("What are you dealing with?").font(.subheadline.weight(.medium))
                            TextField("A bill I don’t understand, a denied claim, a call I need to make…", text: $question, axis: .vertical)
                                .lineLimit(3...6).focused($composing).padding(14)
                                .background(GoldRockTheme.canvas, in: RoundedRectangle(cornerRadius: 14))
                                .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(GoldRockTheme.line))
                                .accessibilityLabel("Describe your billing question")
                                .onChange(of: question) { _, value in if value.count > 2000 { question = String(value.prefix(2000)) } }
                            ChromeAction(title: "Build my plan") { goal = .understand; composing = false; intake = true }
                            Label("You review what’s shared first", systemImage: "lock.shield").font(.caption).foregroundStyle(.secondary)
                        }
                    }
                    EditorialIllustration(artwork: .family, height: 126)
                    if let benefit = store.benefits.first(where: { $0.status == "active" }) {
                        Label("Brought to you by \(benefit.name)", systemImage: "checkmark.seal").font(.subheadline).foregroundStyle(.secondary)
                    } else { Text("Start locally, with no account required.").font(.subheadline).foregroundStyle(.secondary) }
                    VStack(alignment: .leading, spacing: 14) {
                        HStack { Text("Start with a tool").font(.title2.weight(.medium)); Spacer(); Button("See all") { store.selectedTab = 3 }.font(.subheadline) }
                        LazyVGrid(columns: [GridItem(.adaptive(minimum: 145), spacing: 12)], spacing: 12) {
                            ForEach([MemberGoal.check, .appeal, .afford, .plan]) { item in
                                Button { goal = item; composing = false; intake = true } label: {
                                    NativeTaskTile(title: goalTitle(item), detail: goalDetail(item), symbol: item.symbol)
                                }.buttonStyle(.plain)
                            }
                        }
                        Button { store.selectedTab = 3 } label: { EditorialCard { EditorialFeatureRow(title: "Collections, letters & more", detail: "Find the workflow for your exact situation.", symbol: "square.grid.2x2") } }.buttonStyle(.plain)
                    }
                    CaseNextStepsView()
                    RecoveryFollowUpQueueView(compact: true)
                    if let item = store.cases.first(where: { !$0.resolved }) {
                        VStack(alignment: .leading, spacing: 12) {
                            Eyebrow(text: "Pick up where you left off")
                            NavigationLink(value: item.id) { EditorialCard { CaseRow(item: item) } }.buttonStyle(.plain)
                        }
                    }
                    Button { store.selectedTab = 4 } label: { EditorialCard { EditorialFeatureRow(title: "Know their playbook.", detail: "Understand billing tactics and prepare a response with evidence, sources and scripts.", symbol: "text.book.closed") } }.buttonStyle(.plain)
                    NoticeCard(title: "You stay in control", text: "You make the calls and send the requests. GoldRock helps you prepare.", symbol: "hand.raised")
                }.padding(22)
            }
            .background(GoldRockTheme.canvas)
            .navigationTitle("Today").navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .topBarTrailing) { Button("End session and lock", systemImage: "lock") { store.lock() }.labelStyle(.iconOnly) } }
            .navigationDestination(for: UUID.self) { CaseDetailView(caseID: $0) }
            .sheet(isPresented: $intake) { BillAdvocateView(goal: goal, initialQuestion: question) { id in intake = false; question = ""; path.append(id) } }
            .scrollDismissesKeyboard(.interactively)
            .onChange(of: phase) { _, value in if value != .active { question = ""; composing = false } }
            .onChange(of: store.workspaceIdentity) { _, _ in question = ""; composing = false }
            .onChange(of: intake) { _, open in if !open { question = ""; composing = false } }
        }
    }
    private func goalTitle(_ goal: MemberGoal) -> String { switch goal { case .check: "Check a bill"; case .afford: "Find financial help"; case .appeal: "Appeal a denial"; case .plan: "Plan for care"; case .understand: "Understand a bill" } }
    private func goalDetail(_ goal: MemberGoal) -> String { switch goal { case .check: "Review charges and what you owe."; case .afford: "Prepare an assistance request."; case .appeal: "Build your case and response."; case .plan: "Ask about coverage and cost."; case .understand: "Find a useful next step." } }
}
struct CasesView: View {
    @Environment(AppStore.self) private var store
    @State private var search = ""
    @State private var intake = false
    @State private var path: [UUID] = []
    @State private var caseToDelete: MemberCase?
    var filtered: [MemberCase] { store.cases.filter { search.isEmpty || $0.title.localizedCaseInsensitiveContains(search) } }
    var body: some View {
        NavigationStack(path: $path) {
            List {
                Section { EditorialListHeader(eyebrow: "Your private workspace", title: "One place for\nevery next step.", detail: "Bills, questions and progress—organized on this iPhone.") }
                if store.cases.isEmpty {
                    Section { EditorialIllustration(artwork: .clarity, height: 180).listRowInsets(EdgeInsets()).listRowBackground(Color.clear); Text("Start with what you have.").font(.system(.title2, design: .serif)); Text("A bill, EOB, denial, estimate—or simply a question."); ChromeAction(title: "Start a case") { intake = true } }
                } else if filtered.isEmpty { ContentUnavailableView.search(text: search) }
                else {
                    ForEach(filtered) { item in
                        NavigationLink(value: item.id) { CaseRow(item: item) }
                            .swipeActions { Button("Delete", role: .destructive) { caseToDelete = item } }
                    }
                }
            }
            .goldRockScreen().navigationTitle("Your cases").navigationBarTitleDisplayMode(.inline)
            .searchable(text: $search, prompt: "Search local case names")
            .toolbar { ToolbarItem(placement: .topBarTrailing) { Button("New case", systemImage: "plus") { intake = true } } }
            .navigationDestination(for: UUID.self) { CaseDetailView(caseID: $0) }
            .sheet(isPresented: $intake) { BillAdvocateView(goal: .understand) { id in intake = false; path.append(id) } }
            .confirmationDialog("Delete this case?", isPresented: Binding(get: { caseToDelete != nil }, set: { if !$0 { caseToDelete = nil } }), titleVisibility: .visible) {
                Button("Delete case", role: .destructive) {
                    guard let id = caseToDelete?.id else { return }
                    caseToDelete = nil
                    Task { do { try await store.remove(id) } catch { store.error = error.localizedDescription } }
                }
            } message: { Text("This removes the case from this iPhone and requests deletion of its cloud job. Exported copies remain where you saved them.") }
        }
    }
}

struct NativePlaybookHomeView: View {
    @Environment(AppStore.self) private var store
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                EditorialHeader(eyebrow: "Know the system. Build your response.", title: "Their playbook.\nYour next move.", detail: "Practical guidance for billing errors, denials, assistance, collections and the reply that comes next.")
                NavigationLink { KnowledgeSearchView() } label: {
                    HStack { Image(systemName: "magnifyingglass"); Text("Search bills, insurance, collections…").font(.subheadline); Spacer(); Image(systemName: "chevron.right").font(.caption) }
                        .padding(18).foregroundStyle(.secondary).background(GoldRockTheme.surface, in: RoundedRectangle(cornerRadius: 17))
                        .overlay(RoundedRectangle(cornerRadius: 17).strokeBorder(GoldRockTheme.line))
                }.buttonStyle(.plain).accessibilityLabel("Search the playbook")
                NavigationLink { CountermeasuresView() } label: { EditorialCard { EditorialFeatureRow(title: "When the answer is no", detail: "Prepare for a refusal, a missing record, a deadline or a request for more evidence.", symbol: "arrow.triangle.branch") } }.buttonStyle(.plain)
                NavigationLink { PublicPlaybooksView() } label: { EditorialCard { EditorialFeatureRow(title: "Requests & response scripts", detail: "What to ask first, how to follow up, and what to keep in writing.", symbol: "text.bubble") } }.buttonStyle(.plain)
                NavigationLink { KnowledgeSearchView() } label: { EditorialCard { EditorialFeatureRow(title: "Bills, denials & financial help", detail: "Source-linked guides with evidence checklists, specific next steps and mistakes to avoid.", symbol: "books.vertical") } }.buttonStyle(.plain)
                Button { store.selectedTab = 3 } label: { EditorialCard { EditorialFeatureRow(title: "Put the advice to work", detail: "Open a task-specific form and build your own case.", symbol: "square.and.pencil") } }.buttonStyle(.plain)
                EditorialIllustration(artwork: .clarity, height: 150)
                NoticeCard(title: "Use the evidence", text: "Check which rules apply to your plan, bill and location. Each guide links its sources and shows when it was reviewed.", symbol: "checkmark.seal")
            }.padding(22)
        }.background(GoldRockTheme.canvas).navigationTitle("Playbook").navigationBarTitleDisplayMode(.inline)
    }
}
struct CaseRow: View {
    let item: MemberCase
    var body: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack(alignment: .firstTextBaseline) { Text(item.title).font(.headline); Spacer(); Image(systemName: item.resolved ? "checkmark.circle" : "doc.text").foregroundStyle(GoldRockTheme.accent) }
            Text((try? LocalGuidance.analyze(item.facts).summary) ?? "Ready for review").font(.subheadline).foregroundStyle(.secondary).lineLimit(3)
            ViewThatFits(in: .horizontal) {
                HStack { StatusPill(title: item.facts.documentType.title, symbol: "doc.text"); Spacer(); Text(item.saveMode == .device ? "Kept on iPhone" : "One-time").font(.footnote).foregroundStyle(.secondary) }
                VStack(alignment: .leading, spacing: 6) { StatusPill(title: item.facts.documentType.title, symbol: "doc.text"); Text(item.saveMode == .device ? "Kept on iPhone" : "One-time").font(.footnote).foregroundStyle(.secondary) }
            }
            if let date = item.followUp { Label(date.formatted(date: .abbreviated, time: .omitted), systemImage: "calendar").font(.caption).foregroundStyle(GoldRockTheme.accent) }
        }.padding(.vertical, 6).accessibilityElement(children: .combine)
    }
}

import SwiftUI

struct MoneyRecoveryGuideView: View {
    let kind: String
    var onUse: ((MoneyRecoveryGuide) -> Void)?
    @Environment(\.dismiss) private var dismiss
    @State private var guide: MoneyRecoveryGuide?
    @State private var problem: String?
    private let clock = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    var body: some View {
        NavigationStack {
            List {
                Section { EditorialListHeader(eyebrow: "Before you ask", title: MoneyRecoveryLabels.title(kind), detail: "Prepare a request you can review and send yourself through the recipient's verified channel.") }
                if let guide {
                    Section(guide.title) {
                        if guide.current {
                            ForEach(Array(guide.checklist.enumerated()), id: \.offset) { index, item in Label(item, systemImage: "\(index + 1).circle") }
                        } else { Text("This guide needs a fresh source review. Check the official sources below; generated steps and wording are withheld.").font(.headline) }
                    }
                    if guide.current {
                        Section("A starting draft") {
                            Text(guide.draft).textSelection(.enabled)
                            if onUse != nil { Button("Use a copy in my local preparation", systemImage: "doc.on.doc") { use() } }
                            ShareLink(item: MoneyRecoveryTemplateExport(kind: kind, text: guide.draft, receipts: guide.receipts), preview: SharePreview("Request starting draft", image: Image(systemName: "doc.text"))) { Label("Share this current template", systemImage: "square.and.arrow.up") }
                            Text("Sharing creates a copy you control; it does not send a request, file a claim or mark anything submitted in GoldRock.").font(.footnote).foregroundStyle(.secondary)
                        }
                    }
                    Section("Check applicability") { ForEach(guide.limitations, id: \.self) { Text($0).font(.footnote) } }
                    Section("Official sources") {
                        ForEach(guide.sources) { source in
                            if let url = URL(string: source.url) { Link(source.title, destination: url) }
                            Text("\(source.publisher) · reviewed \(String(source.reviewedAt.prefix(10)))\n\(source.applicability)").font(.footnote).foregroundStyle(.secondary)
                        }
                    }
                }
                if let problem { Section { Text(problem).foregroundStyle(.red); Button("Try loading the guide again") { refresh() } } }
            }.goldRockScreen().navigationTitle("Prepare a request").navigationBarTitleDisplayMode(.inline)
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close", systemImage: "xmark") { dismiss() } } }
                .onAppear { refresh() }.onReceive(clock) { _ in refresh() }
        }
    }
    private func refresh() {
        do { guide = try LocalGuidance.moneyRecoveryGuide(kind); problem = nil }
        catch { guide = nil; problem = error.localizedDescription }
    }
    private func use() {
        do {
            let fresh = try LocalGuidance.moneyRecoveryGuide(kind)
            guard fresh.current, let displayed = guide, fresh.receipts == displayed.receipts else { guide = fresh; throw AppError.service("The source review changed or expired. Review the current guide before using its wording.") }
            onUse?(fresh); dismiss()
        } catch { problem = error.localizedDescription }
    }
}

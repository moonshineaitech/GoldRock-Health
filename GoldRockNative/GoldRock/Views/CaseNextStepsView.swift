import SwiftUI

/// Sits inside Today's existing NavigationStack, so each row opens the real case.
struct CaseNextStepsView: View {
    @Environment(AppStore.self) private var store
    @State private var showAll = false

    var body: some View {
        let steps = CaseNextSteps.build(from: store.cases)
        if !steps.isEmpty {
            VStack(alignment: .leading, spacing: 12) {
                Eyebrow(text: "Your recorded dates")
                Text("Keep the next step in view.").font(.title2.weight(.medium))
                Text("From your cases and workbooks. Check every date against the actual notice or response; a billing hold does not pause another clock.")
                    .font(.subheadline).foregroundStyle(.secondary)
                ForEach(showAll ? steps : Array(steps.prefix(3))) { step in
                    NavigationLink(value: step.caseID) {
                        EditorialCard {
                            HStack(alignment: .top, spacing: 12) {
                                Image(systemName: step.needsVerification ? "calendar.badge.exclamationmark" : "calendar")
                                    .foregroundStyle(GoldRockTheme.accent).frame(width: 26)
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(step.title).font(.headline).foregroundStyle(.primary)
                                    Text(step.caseTitle).font(.subheadline).foregroundStyle(.secondary)
                                    Text(step.sourceLabel).font(.caption).foregroundStyle(.secondary)
                                    HStack(spacing: 7) {
                                        Text(step.date.formatted(date: .abbreviated, time: .omitted))
                                        Text("·")
                                        Text(CaseNextSteps.status(for: step))
                                    }.font(.caption.weight(.semibold)).foregroundStyle(GoldRockTheme.accent)
                                }
                                Spacer(minLength: 0)
                                Image(systemName: "chevron.right").font(.caption.weight(.semibold)).foregroundStyle(.secondary)
                            }
                        }
                    }.buttonStyle(.plain)
                }
                if steps.count > 3 {
                    Button(showAll ? "Show fewer dates" : "Show all \(steps.count) recorded dates") { showAll.toggle() }
                        .font(.subheadline.weight(.semibold)).frame(minHeight: 44)
                }
            }
        }
    }
}

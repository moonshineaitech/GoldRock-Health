import SwiftUI
import Metal

enum GoldRockTheme {
    static let canvas = Color(uiColor: UIColor { $0.userInterfaceStyle == .dark ? UIColor(red: 0.085, green: 0.09, blue: 0.085, alpha: 1) : UIColor(red: 0.969, green: 0.957, blue: 0.925, alpha: 1) })
    static let accent = Color(uiColor: UIColor { $0.userInterfaceStyle == .dark ? UIColor(red: 0.86, green: 0.79, blue: 0.65, alpha: 1) : UIColor(red: 0.34, green: 0.28, blue: 0.16, alpha: 1) })
    static let champagne = Color(red: 0.81, green: 0.75, blue: 0.62)
    static let surface = Color(uiColor: UIColor { $0.userInterfaceStyle == .dark ? .secondarySystemGroupedBackground : UIColor(red: 1, green: 0.992, blue: 0.973, alpha: 1) })
    static let softGold = Color(uiColor: UIColor { $0.userInterfaceStyle == .dark ? UIColor(red: 0.21, green: 0.20, blue: 0.16, alpha: 1) : UIColor(red: 0.914, green: 0.871, blue: 0.769, alpha: 1) })
    static let line = Color(uiColor: .separator).opacity(0.28)
}

/// Restored from the first GoldRock iPhone concept: overlapping gold g/r mark.
struct GoldRockWordmark: View {
    var body: some View {
        HStack(spacing: 11) {
            ZStack(alignment: .leading) {
                Text("g").font(.system(size: 37, weight: .regular, design: .serif))
                Text("r").font(.system(size: 29, weight: .regular, design: .serif).italic()).offset(x: 17, y: 3)
            }.foregroundStyle(Color(red: 0.573, green: 0.455, blue: 0.271)).frame(width: 34, height: 37, alignment: .leading).accessibilityHidden(true)
            Text("GoldRock").font(.system(.title3, design: .serif).weight(.medium))
            Text("Health").font(.system(.subheadline, design: .serif)).foregroundStyle(.secondary)
        }.accessibilityElement(children: .ignore).accessibilityLabel("GoldRock Health")
    }
}

struct NativeTaskTile: View {
    let title: String
    let detail: String
    let symbol: String
    var body: some View {
        VStack(alignment: .leading, spacing: 13) {
            Image(systemName: symbol).font(.title2).foregroundStyle(GoldRockTheme.accent)
                .frame(width: 40, height: 40).background(GoldRockTheme.softGold, in: RoundedRectangle(cornerRadius: 12)).accessibilityHidden(true)
            Text(title).font(.headline).foregroundStyle(.primary).fixedSize(horizontal: false, vertical: true)
            Text(detail).font(.subheadline).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
            Spacer(minLength: 0)
        }.frame(maxWidth: .infinity, minHeight: 156, alignment: .topLeading).padding(17)
            .background(GoldRockTheme.surface, in: RoundedRectangle(cornerRadius: 22))
            .overlay(RoundedRectangle(cornerRadius: 22).strokeBorder(GoldRockTheme.line, lineWidth: 0.5))
            .accessibilityElement(children: .combine)
    }
}

/// Native material translation of the supplied AskChat Champagne chrome/lens.
/// Decorative only: all text stays outside the ornament and remains accessible.
struct ChromeLens: View {
    var size: CGFloat = 40
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.scenePhase) private var scenePhase
    @State private var started = Date()
    var body: some View {
        Group {
            if MTLCreateSystemDefaultDevice() != nil {
                TimelineView(.animation(minimumInterval: 1.0 / 30.0, paused: reduceMotion || scenePhase != .active)) { timeline in
                    let seconds = reduceMotion ? 0 : timeline.date.timeIntervalSince(started)
                    Circle().fill(.white)
                        .colorEffect(ShaderLibrary.goldrockChrome(.float2(Float(size), Float(size)), .float(Float(seconds / 32.0 * .pi * 2)), .float(size <= 40 ? 1.04 : 1.45)))
                }
            } else {
                Circle().fill(AngularGradient(colors: [.black, Color(red: 0.95, green: 0.90, blue: 0.82), .gray, .black, GoldRockTheme.champagne, .white, .black], center: .center, angle: .degrees(150)))
            }
        }
            .overlay(Circle().fill(RadialGradient(colors: [.white.opacity(0.7), .clear, .black.opacity(0.25)], center: .topLeading, startRadius: 0, endRadius: size)))
            .overlay(Circle().strokeBorder(.white.opacity(0.55), lineWidth: 0.7))
            .frame(width: size, height: size)
            .accessibilityHidden(true)
    }
}
struct ChromeAction: View {
    let title: String
    var symbol = "arrow.right"
    var action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack(spacing: 14) { ChromeLens(); Text(title).font(.headline); Spacer(minLength: 8); Image(systemName: symbol) }
                .foregroundStyle(.white).padding(.leading, 10).padding(.trailing, 20).padding(.vertical, 9)
                .frame(minHeight: 60)
                .background {
                    Capsule().fill(LinearGradient(colors: [Color(red: 0.15, green: 0.18, blue: 0.17), Color(red: 0.25, green: 0.27, blue: 0.25)], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .overlay(Capsule().strokeBorder(AngularGradient(colors: [GoldRockTheme.champagne, .white.opacity(0.9), Color(red: 0.44, green: 0.69, blue: 0.73), GoldRockTheme.champagne], center: .center), lineWidth: 1.2))
                        .shadow(color: .black.opacity(0.17), radius: 12, y: 6)
                }
        }
        .buttonStyle(.plain)
        .contentShape(Capsule())
        .accessibilityLabel(title)
    }
}
struct Eyebrow: View {
    let text: String
    var body: some View { Text(text.uppercased()).font(.caption.weight(.semibold)).tracking(1.5).foregroundStyle(GoldRockTheme.accent) }
}
struct NoticeCard: View {
    let title: String; let text: String; var symbol = "lock.shield"
    var body: some View {
        Label { VStack(alignment: .leading, spacing: 5) { Text(title).font(.headline); Text(text).font(.subheadline).foregroundStyle(.secondary) } } icon: { Image(systemName: symbol).foregroundStyle(GoldRockTheme.accent) }
            .padding(18).frame(maxWidth: .infinity, alignment: .leading)
            .background(GoldRockTheme.surface, in: RoundedRectangle(cornerRadius: 22))
            .overlay(RoundedRectangle(cornerRadius: 22).strokeBorder(GoldRockTheme.line, lineWidth: 0.5))
    }
}

/// Images are decorative editorial illustrations; content never relies on them.
enum EditorialArtwork: String { case clarity = "GoldRockClarity", life = "GoldRockLife", family = "GoldRockFamily", work = "GoldRockWork" }
struct EditorialIllustration: View {
    let artwork: EditorialArtwork
    var height: CGFloat = 190
    @Environment(\.colorScheme) private var colorScheme
    var body: some View {
        Image(artwork.rawValue).resizable().scaledToFill()
            .frame(maxWidth: .infinity).frame(height: height).clipped()
            .overlay { if colorScheme == .dark { Color.black.opacity(0.10) } }
            .clipShape(RoundedRectangle(cornerRadius: 22))
            .accessibilityHidden(true)
    }
}
struct EditorialHeader: View {
    let eyebrow: String; let title: String; let detail: String
    var artwork: EditorialArtwork? = nil
    var compact = false
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Eyebrow(text: eyebrow)
            Text(title).font(.system(compact ? .title2 : .largeTitle, design: .serif).weight(.regular)).fixedSize(horizontal: false, vertical: true).foregroundStyle(.primary)
            if !detail.isEmpty { Text(detail).font(.body).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true).lineSpacing(3) }
            if let artwork { EditorialIllustration(artwork: artwork, height: compact ? 138 : 186).padding(.top, 4) }
        }.padding(.vertical, 8).accessibilityElement(children: .contain)
    }
}
struct EditorialListHeader: View {
    let eyebrow: String; let title: String; let detail: String
    var artwork: EditorialArtwork? = nil
    var body: some View {
        EditorialHeader(eyebrow: eyebrow, title: title, detail: detail, artwork: artwork, compact: true)
            .listRowBackground(Color.clear).listRowSeparator(.hidden)
    }
}
struct StatusPill: View {
    let title: String
    var symbol: String? = nil
    var body: some View {
        HStack(spacing: 5) { if let symbol { Image(systemName: symbol) }; Text(title) }
            .font(.footnote.weight(.medium)).foregroundStyle(GoldRockTheme.accent)
            .padding(.horizontal, 11).padding(.vertical, 7)
            .background(GoldRockTheme.softGold, in: Capsule()).fixedSize(horizontal: false, vertical: true)
    }
}
struct EditorialFeatureRow: View {
    let title: String; let detail: String; let symbol: String
    var showsChevron = true
    var body: some View {
        HStack(alignment: .center, spacing: 14) {
            Image(systemName: symbol).font(.title3).foregroundStyle(GoldRockTheme.accent)
                .frame(width: 44, height: 48).background(GoldRockTheme.softGold, in: RoundedRectangle(cornerRadius: 14)).accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 5) { Text(title).font(.headline).foregroundStyle(.primary); if !detail.isEmpty { Text(detail).font(.subheadline).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true) } }
            Spacer(minLength: 0)
            if showsChevron { Image(systemName: "chevron.right").font(.footnote.weight(.medium)).foregroundStyle(.tertiary).accessibilityHidden(true) }
        }.frame(minHeight: 60).padding(.vertical, 5).accessibilityElement(children: .combine)
    }
}
struct EditorialCard<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }
    var body: some View { content.padding(18).frame(maxWidth: .infinity, alignment: .leading).background(GoldRockTheme.surface, in: RoundedRectangle(cornerRadius: 24)).overlay(RoundedRectangle(cornerRadius: 24).strokeBorder(GoldRockTheme.line, lineWidth: 0.5)) }
}
/// A recorded figure with its meaning attached; never a decorative savings badge.
struct RecordedAmount: View {
    let title: String
    let value: String
    var detail = ""
    var body: some View {
        VStack(alignment: .leading, spacing: 9) {
            Text(title).font(.subheadline).foregroundStyle(.secondary)
            Text(value).font(.system(.title2, design: .serif)).monospacedDigit().fixedSize(horizontal: false, vertical: true)
            if !detail.isEmpty { Text(detail).font(.footnote).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true) }
        }.padding(.vertical, 10).frame(maxWidth: .infinity, alignment: .leading).accessibilityElement(children: .combine)
    }
}
struct OperationalAction: View {
    let title: String; let detail: String; let symbol: String
    var action: () -> Void
    var body: some View {
        Button(action: action) { EditorialFeatureRow(title: title, detail: detail, symbol: symbol, showsChevron: false) }
            .buttonStyle(.plain)
    }
}
struct IntakeJourney: View {
    let step: Int
    private let titles = ["Read locally", "Review facts", "Find next steps"]
    var body: some View {
        ViewThatFits(in: .horizontal) {
            HStack(alignment: .top, spacing: 12) { ForEach(Array(titles.enumerated()), id: \.offset) { index, title in stage(index, title) } }
            VStack(alignment: .leading, spacing: 12) { ForEach(Array(titles.enumerated()), id: \.offset) { index, title in stage(index, title) } }
        }.accessibilityElement(children: .combine).accessibilityLabel("Step \(step) of 3. \(titles[max(0, min(2, step - 1))])")
    }
    private func stage(_ index: Int, _ title: String) -> some View {
        HStack(alignment: .top, spacing: 7) { Text(String(format: "%02d", index + 1)).font(.caption.monospacedDigit().weight(.semibold)); Text(title).font(.footnote.weight(index + 1 == step ? .semibold : .regular)) }
            .foregroundStyle(index + 1 == step ? GoldRockTheme.accent : Color.secondary).fixedSize(horizontal: true, vertical: false)
    }
}
private struct GoldRockScreenStyle: ViewModifier {
    func body(content: Content) -> some View {
        content.scrollContentBackground(.hidden).background(GoldRockTheme.canvas)
            .listSectionSpacing(.custom(22)).environment(\.defaultMinListRowHeight, 50)
            .tint(GoldRockTheme.accent)
    }
}
extension View {
    func goldRockScreen() -> some View { modifier(GoldRockScreenStyle()) }
}

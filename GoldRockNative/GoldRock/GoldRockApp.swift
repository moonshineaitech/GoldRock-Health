import SwiftUI

@main @MainActor struct GoldRockApp: App {
    @State private var store = AppStore()
    @Environment(\.scenePhase) private var scenePhase
    var body: some Scene {
        WindowGroup {
            RootView().environment(store).tint(GoldRockTheme.accent)
                .background(PrivacyShield().frame(width: 0, height: 0))
                .overlay {
                    if scenePhase != .active {
                        ZStack { GoldRockTheme.canvas.ignoresSafeArea(); VStack(spacing: 20) { ChromeLens(size: 64); Text("Your private workspace").font(.title2.weight(.medium)) } }
                            .accessibilityHidden(true)
                    }
                }
                .task { await store.bootstrap() }
                .onChange(of: scenePhase) { _, phase in if phase == .background { store.suspend() }; if phase == .active { store.becameActive() } }
        }
    }
}

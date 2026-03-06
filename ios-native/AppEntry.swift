import SwiftUI

@main
struct GoldRockHealthApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onAppear {
                    setupAppearance()
                }
        }
    }
    
    private func setupAppearance() {
        let navAppearance = UINavigationBarAppearance()
        navAppearance.configureWithOpaqueBackground()
        navAppearance.backgroundColor = .white
        UINavigationBar.appearance().standardAppearance = navAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navAppearance
    }
}

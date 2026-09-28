import SwiftUI
import UIKit

/// A scene-level window covers presented SwiftUI sheets and the UIKit scanner too.
/// The root SwiftUI overlay alone cannot guarantee it sits above a presented sheet.
struct PrivacyShield: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: .zero)
        view.isUserInteractionEnabled = false
        context.coordinator.host = view
        return view
    }
    func updateUIView(_ uiView: UIView, context: Context) {}
    static func dismantleUIView(_ uiView: UIView, coordinator: Coordinator) { coordinator.stop() }

    @MainActor final class Coordinator: NSObject {
        weak var host: UIView?
        private var shield: UIWindow?
        override init() {
            super.init()
            NotificationCenter.default.addObserver(self, selector: #selector(cover), name: UIApplication.willResignActiveNotification, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(reveal), name: UIApplication.didBecomeActiveNotification, object: nil)
        }
        @objc private func cover() {
            guard shield == nil, let scene = host?.window?.windowScene else { return }
            let window = UIWindow(windowScene: scene)
            window.frame = scene.coordinateSpace.bounds
            window.windowLevel = UIWindow.Level(rawValue: UIWindow.Level.alert.rawValue + 1)
            window.isUserInteractionEnabled = false
            window.rootViewController = UIHostingController(rootView:
                ZStack {
                    GoldRockTheme.canvas.ignoresSafeArea()
                    VStack(spacing: 16) { Image(systemName: "lock.shield").font(.largeTitle); Text("GoldRock").font(.title2.weight(.medium)); Text("Your private workspace").font(.subheadline) }.foregroundStyle(GoldRockTheme.accent)
                }.accessibilityHidden(true)
            )
            window.isHidden = false
            shield = window
        }
        @objc private func reveal() { shield?.isHidden = true; shield = nil }
        func stop() { NotificationCenter.default.removeObserver(self); reveal() }
    }
}

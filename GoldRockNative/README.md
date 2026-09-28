# GoldRock Health — native iPhone app

This is the SwiftUI iPhone application, not the existing Capacitor app in `ios/` or the earlier WebView reference in `ios-native/`. Those original projects are preserved. The app has native Today, Tools, Cases, Playbook and You tabs, local document reading and protected cases, plus a separately reviewed path to optional cloud AI.

Open `GoldRock.xcodeproj` in Xcode, choose an iPhone simulator, and run the **GoldRock** scheme. The matching local API is in `../GoldRockNativeService/`; `bash run-simulator.sh` starts it, builds the native app with ad hoc simulator signing, installs it, and launches the simulator. The service needs Node.js 24+. It does not include credentials or enable cloud AI by default. A physical iPhone needs Apple developer signing and an HTTPS service address configured inside the app.

The Xcode project contains an XCTest target and packaged synthetic fixtures. GitHub Actions builds and tests it on macOS. This repository branch is for review and verification; a green CI build and simulator run should be required before calling the native app working.

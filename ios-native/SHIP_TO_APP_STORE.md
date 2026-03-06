# Ship GoldRock Health to iOS App Store (Native Swift — No Capacitor)

This guide gets your web app into the App Store using a native Swift WKWebView wrapper. Total time: ~1-2 hours if you have an Apple Developer account ready.

## What This Does

Creates a lightweight native iOS app that loads your published GoldRock Health web app inside a WKWebView. The web app runs exactly as it does in Safari, but packaged as a native app with its own icon on the home screen.

---

## Prerequisites

On your Mac mini:
1. **Xcode 16+** — Download from the Mac App Store (free)
2. **Apple Developer Account** — $99/year at https://developer.apple.com/programs/
3. **Your web app published** — Deploy on Replit first so you have a live URL

---

## Step 1: Publish Your Web App on Replit

Before building the iOS wrapper, your web app needs to be live at a public URL.

1. In Replit, click **Deploy** (or publish)
2. Note your production URL (e.g., `https://goldrock-health.replit.app` or your custom domain)
3. This URL is what the iOS app will load

---

## Step 2: Create the Xcode Project (5 minutes)

1. Open **Xcode** on your Mac mini
2. **File → New → Project**
3. Choose **App** under iOS
4. Fill in:
   - **Product Name**: `GoldRock Health`
   - **Team**: Your Apple Developer account
   - **Organization Identifier**: `com.goldrockhealth`
   - **Bundle Identifier**: `com.goldrockhealth.app`
   - **Interface**: **SwiftUI**
   - **Language**: **Swift**
   - Uncheck "Include Tests"
5. Click **Create** and save it somewhere on your Mac

---

## Step 3: Replace the Code (5 minutes)

### Delete the default ContentView.swift content and replace it entirely:

Open `ContentView.swift` and replace ALL the code with the contents of `ContentView.swift` from this folder.

### Open `GoldRock_HealthApp.swift` (or whatever your app file is named) and replace it with the contents of `AppEntry.swift` from this folder.

### Summary of what these files do:
- Loads your published web app URL in a full-screen WKWebView
- Shows a native launch/splash screen while loading
- Handles navigation (back, forward, refresh) natively
- Handles camera access for bill uploads
- Handles file downloads
- Shows a native error screen if the network is down
- Supports pull-to-refresh
- Handles external links (opens Safari for non-app URLs)

---

## Step 4: Configure Info.plist (3 minutes)

In Xcode, click your project → Target → **Info** tab. Add these keys:

| Key | Value |
|-----|-------|
| `NSCameraUsageDescription` | GoldRock Health uses your camera to photograph medical bills for AI analysis |
| `NSPhotoLibraryUsageDescription` | GoldRock Health accesses your photos to upload medical bill images |
| `NSMicrophoneUsageDescription` | GoldRock Health uses your microphone for voice-guided enrollment |

Also under **URL Types**, add:
- Identifier: `com.goldrockhealth.app`
- URL Schemes: `goldrockhealth`

---

## Step 5: Add PrivacyInfo.xcprivacy (3 minutes)

1. In Xcode: **File → New → File → App Privacy**
2. Name it `PrivacyInfo`
3. Open it and add these Required Reason APIs (Xcode has a visual editor):

| API Category | Reason Code |
|-------------|-------------|
| File Timestamp | C617.1 |
| User Defaults | CA92.1 |
| System Boot Time | 35F9.1 |
| Disk Space | E174.1 |

---

## Step 6: Add App Icons (10 minutes)

1. In the project navigator, open **Assets.xcassets → AppIcon**
2. You need ONE icon: **1024x1024 PNG** (no alpha/transparency, no rounded corners)
3. Drag your 1024x1024 icon onto the AppIcon slot
4. Xcode 16 auto-generates all other sizes from the single 1024px icon

If you don't have an icon yet, use any square PNG as a placeholder — you can update it before final submission.

---

## Step 7: Set Deployment Target

1. Click your project in the navigator
2. Under **General → Minimum Deployments**, set iOS to **16.0**
3. Under **Signing & Capabilities**:
   - Check **Automatically manage signing**
   - Select your **Team**
   - Verify Bundle ID is `com.goldrockhealth.app`

---

## Step 8: Test on Simulator (5 minutes)

1. Select an iPhone simulator (iPhone 15 Pro recommended) from the toolbar
2. Press **Cmd+R** to build and run
3. Your web app should load in the simulator
4. Test: login, bill upload, navigation, settings

---

## Step 9: Test on a Real iPhone (Optional but Recommended)

1. Connect your iPhone to the Mac mini via USB
2. Select your iPhone from the device list in Xcode
3. Press **Cmd+R**
4. On your iPhone: Settings → General → VPN & Device Management → Trust your developer certificate
5. Test camera, file upload, and all features

---

## Step 10: Archive and Upload (10 minutes)

1. In Xcode, select **Any iOS Device (arm64)** as build destination
2. **Product → Archive** (wait for it to build)
3. When the Organizer window opens, select your archive
4. Click **Distribute App → App Store Connect → Upload**
5. Keep defaults and click through to upload

---

## Step 11: Configure App Store Connect (20 minutes)

1. Go to https://appstoreconnect.apple.com
2. **My Apps → +** (or select existing app)
3. Fill in:

| Field | Value |
|-------|-------|
| App Name | GoldRock Health |
| Subtitle | AI Medical Bill Advocate |
| Primary Category | Health & Fitness |
| Age Rating | 12+ |
| Price | Free |

4. **Description** — Copy from `docs/app-store-metadata.md`
5. **Keywords** — Copy from `docs/app-store-metadata.md`
6. **Screenshots** — Take from the simulator: Window → Screenshot (Cmd+S)
   - Need: iPhone 6.7" (15 Pro Max), iPhone 6.5" (11 Pro Max), iPad Pro 12.9"
   - Take 3-5 screenshots of key screens (landing, bill analysis, command center)
7. **Privacy Policy URL**: Your deployed URL + `/privacy-policy`
8. **Support URL**: Your deployed URL + `/support`

### In-App Purchases (if using):
- Monthly: $24.99 auto-renewable
- Annual: $249.99 auto-renewable
- Subscription Group: "GoldRock Health Premium"

### App Review Information:
- **Demo Account**: `appreviewer@goldrockhealth.com`
- **Demo Password**: `GoldRock2026!`
- **Review Notes**: "Use the email/password login form on the landing page. Demo account has Premium access with sample bills pre-loaded. The app analyzes medical bills using AI — no real patient data is used in the demo."

---

## Step 12: Submit for Review

1. Click **Submit for Review**
2. Apple typically reviews within 24-48 hours
3. You'll get an email when it's approved or if they need changes

---

## Common Rejection Reasons & Fixes

### "Minimum functionality" (Guideline 4.2)
Apple may reject pure WebView wrappers. To avoid this:
- The included Swift code adds native navigation controls, pull-to-refresh, and offline handling
- Add at least one native feature (the code includes camera access and share functionality)
- If rejected, add a native settings screen or onboarding flow

### "App Privacy" issues
- Make sure PrivacyInfo.xcprivacy is included
- All NS*UsageDescription strings must be present in Info.plist

### "Login issues"
- Make sure the demo login works from the deployed URL
- Test it yourself before submitting

### "Broken functionality"
- Ensure your Replit deployment is stable and not sleeping
- If using Replit's free tier, the app may go to sleep — you need a paid deployment

---

## Timeline

| Step | Time |
|------|------|
| Publish web app on Replit | 5 min |
| Create Xcode project | 5 min |
| Add Swift code | 5 min |
| Configure Info.plist and privacy | 5 min |
| Add app icon | 10 min |
| Test on simulator | 5 min |
| Archive and upload | 10 min |
| Fill App Store Connect | 20 min |
| Submit | 2 min |
| **Total** | **~1 hour** |

Then wait 24-48 hours for Apple's review.

---

## Important Notes

- Your Replit deployment MUST be on a paid plan (or custom domain) so it stays online 24/7. A sleeping app = instant rejection.
- The WKWebView approach is Apple-approved. Safari itself is a WKWebView. Many successful apps use this pattern.
- If Apple asks you to add more native functionality, you can always add native screens later without rebuilding the web app.
- Keep your web app fast — Apple tests on older devices. Optimize your landing page load time.

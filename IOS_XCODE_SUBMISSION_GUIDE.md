# GoldRock Health — iOS App Store Submission Guide (Xcode)

This guide walks you through building, signing, and submitting GoldRock Health to the iOS App Store using Xcode. It assumes you have a Mac, an active Apple Developer account, and basic familiarity with Xcode.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Build the Web App](#2-build-the-web-app)
3. [Sync Capacitor](#3-sync-capacitor)
4. [Open in Xcode](#4-open-in-xcode)
5. [Configure Signing & Capabilities](#5-configure-signing--capabilities)
6. [Set Deployment Target](#6-set-deployment-target)
7. [Configure App Icons](#7-configure-app-icons)
8. [Archive & Upload](#8-archive--upload)
9. [App Store Connect Setup](#9-app-store-connect-setup)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Before you begin, ensure the following are in place:

| Requirement | Details |
|---|---|
| **Mac** | macOS Ventura 13.0 or later recommended |
| **Xcode 15+** | Install from the Mac App Store or [developer.apple.com](https://developer.apple.com/xcode/) |
| **Apple Developer Program** | Active enrollment ($99/year) at [developer.apple.com/programs](https://developer.apple.com/programs/) |
| **CocoaPods** | Install via `sudo gem install cocoapods` if not already installed |
| **Node.js 18+** | Required to build the web app and run Capacitor CLI |
| **Capacitor CLI** | Included in the project's `devDependencies` — no separate install needed |

Verify your environment:

```bash
xcodebuild -version        # Should show Xcode 15.x or later
pod --version               # Should show 1.14+ 
node --version              # Should show v18+ or v20+
```

---

## 2. Build the Web App

From the project root, build the production web assets that Capacitor will bundle into the iOS app:

```bash
npm run build
```

This compiles the React frontend into `dist/public/`, which is the directory configured in `capacitor.config.ts` as the `webDir`.

Verify the build completed successfully by checking that `dist/public/index.html` exists.

---

## 3. Sync Capacitor

Sync the built web assets and native plugin configurations into the iOS project:

```bash
npx cap sync ios
```

This command:
- Copies `dist/public/` into `ios/App/App/public/`
- Installs and updates native Capacitor plugins
- Runs `pod install` automatically in `ios/App/`

If this is your first time running sync or you encounter pod issues, you can manually install pods:

```bash
cd ios/App && pod install && cd ../..
```

---

## 4. Open in Xcode

Launch the Xcode workspace:

```bash
npx cap open ios
```

This opens `ios/App/App.xcworkspace`. Always use the `.xcworkspace` file (not `.xcodeproj`) to ensure CocoaPods dependencies are included.

---

## 5. Configure Signing & Capabilities

In Xcode, select the **App** target in the project navigator, then go to the **Signing & Capabilities** tab.

### 5.1 Signing

1. Check **Automatically manage signing**
2. **Team**: Select your Apple Developer team from the dropdown
3. **Bundle Identifier**: Confirm it is set to `com.goldrockhealth.app`
4. Xcode will automatically create a provisioning profile if one doesn't exist

### 5.2 Add Capabilities

Click **+ Capability** in the top-left of the Signing & Capabilities tab and add:

- **In-App Purchase** — Required for the Premium subscription (Monthly $24.99 / Annual $249.99)
- **Push Notifications** — Required for bill analysis notifications and engagement alerts

Both capabilities must also be enabled in your App ID on the [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list):

1. Go to **Certificates, Identifiers & Profiles** > **Identifiers**
2. Select (or create) the App ID for `com.goldrockhealth.app`
3. Enable **In-App Purchase** and **Push Notifications** checkboxes
4. Save

---

## 6. Set Deployment Target

1. Select the **App** project (blue icon) in the navigator
2. Under the **General** tab, set **Minimum Deployments** > **iOS** to **14.0**

This ensures compatibility with iPhone 6s and later, covering the vast majority of active iOS devices.

---

## 7. Configure App Icons

The app icon is already configured in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.

Verify:
1. In Xcode, open **Assets.xcassets** in the project navigator
2. Select **AppIcon**
3. Confirm the 1024×1024 icon (`AppIcon-512@2x.png`) is present in the **App Store** slot
4. Xcode 15+ uses a single 1024×1024 icon and auto-generates all required sizes

If the icon is missing or needs replacing, drag your 1024×1024 PNG into the App Store icon slot.

---

## 8. Archive & Upload

### 8.1 Select the Correct Scheme

1. In the Xcode toolbar, click the scheme/device selector (next to the play button)
2. Set the destination to **Any iOS Device (arm64)** — not a simulator
3. If "Archive" is grayed out in the menu, this is the most common cause

### 8.2 Create an Archive

1. Go to **Product** > **Archive** (or press `Cmd+Shift+B` to build first, then archive)
2. Wait for the build and archive process to complete
3. When finished, the **Organizer** window opens automatically showing your archive

### 8.3 Upload to App Store Connect

1. In the Organizer, select your archive and click **Distribute App**
2. Select **App Store Connect** as the distribution method
3. Select **Upload** (not Export)
4. Leave the default options:
   - ✅ Include bitcode (if prompted)
   - ✅ Upload your app's symbols
   - ✅ Manage version and build number automatically
5. Click **Upload**
6. Wait for the upload and processing to complete (usually 5–15 minutes)

You'll receive an email from Apple when processing is finished and the build is available in App Store Connect.

---

## 9. App Store Connect Setup

Go to [App Store Connect](https://appstoreconnect.apple.com) and complete the following.

### 9.1 Create the App

1. Click **My Apps** > **+** > **New App**
2. Fill in:
   - **Platform**: iOS
   - **Name**: GoldRock Health
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: `com.goldrockhealth.app`
   - **SKU**: `GOLDROCK-HEALTH-001`
3. Click **Create**

### 9.2 Fill In App Metadata

Refer to [`docs/app-store-metadata.md`](docs/app-store-metadata.md) for the complete, approved copy. Key fields:

| Field | Value |
|---|---|
| **Subtitle** | AI Medical Bill Reduction |
| **Category** | Medical (Primary), Finance (Secondary) |
| **Age Rating** | 17+ (Medical/Treatment Information) |
| **Privacy Policy URL** | https://goldrock.ai/privacy-policy |
| **Support URL** | https://goldrock.ai/support |
| **Marketing URL** | https://goldrock.ai |

Paste the full description, promotional text, and "What's New" text from the metadata doc.

### 9.3 Add Keywords

```
medical bills,healthcare costs,hospital bill,reduce medical debt,billing errors,insurance,health finance,medical debt,bill negotiation,AI health
```

### 9.4 Upload Screenshots

Required screenshot sizes:

| Device | Resolution |
|---|---|
| iPhone 6.7" (iPhone 15 Pro Max) | 1290 × 2796 px |
| iPhone 6.5" (iPhone 14 Plus) | 1284 × 2778 px |
| iPhone 5.5" (iPhone 8 Plus) | 1242 × 2208 px |
| iPad Pro 12.9" | 2048 × 2732 px |

Upload 3–10 screenshots per device size. See `docs/app-store-assets-guide.md` for screenshot guidelines.

### 9.5 Set Up In-App Purchases

Navigate to **Monetization** > **Subscriptions**:

1. Create a **Subscription Group** named "Premium"
2. Add two subscriptions:

| Product ID | Type | Price | Duration |
|---|---|---|---|
| `com.goldrockhealth.premium.monthly` | Auto-Renewable | $24.99 | 1 Month |
| `com.goldrockhealth.premium.annual` | Auto-Renewable | $249.99 | 1 Year |

3. For each subscription, fill in:
   - **Display Name**: Premium Monthly / Premium Annual
   - **Description**: Full access to AI bill analysis, negotiation coaching, and dispute templates
   - **Review Screenshot**: A screenshot of the paywall/subscription screen
4. Submit the subscriptions for review (they are reviewed alongside the app)

### 9.6 Add Demo Account for App Review

Under **App Review Information**:

- **Sign-in required**: Yes
- **Demo Account Email**: `appreviewer@goldrock.com`
- **Demo Account Password**: `TestReview2025!`
- **Notes for Reviewer**: Copy the reviewer notes from [`docs/app-store-metadata.md`](docs/app-store-metadata.md) (see the "App Review Information" section)

The demo account has Premium access pre-activated, sample medical bills loaded, and full feature access.

### 9.7 Complete the Privacy Questionnaire

In **App Privacy**:

1. Click **Get Started** (or **Edit** if previously started)
2. Indicate the app collects the following data types:

| Data Type | Purpose | Linked to User |
|---|---|---|
| Health & Fitness | App Functionality | Yes |
| Sensitive Info | App Functionality | Yes |
| Financial Info | App Functionality | Yes |
| Other User Content | App Functionality | Yes |
| Contact Info (Email, Name) | App Functionality | Yes |
| Photos | App Functionality | No |

3. **Data Used for Tracking**: No
4. Save and publish

### 9.8 Submit for Review

1. Select your uploaded build in the **Build** section
2. Confirm all metadata, screenshots, and pricing are complete
3. Click **Submit for Review**
4. Answer any compliance questions (encryption: No, IDFA: No)

Typical review time is 24–48 hours. Monitor status in App Store Connect.

---

## 10. Troubleshooting

### Pod Install Failures

**Symptom**: `npx cap sync ios` fails with CocoaPods errors.

**Fix**:
```bash
cd ios/App
pod install --repo-update
cd ../..
```

If that doesn't work:
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
```

### Signing Issues

**Symptom**: "No signing certificate" or "Provisioning profile" errors.

**Fix**:
1. In Xcode, go to **Signing & Capabilities** and ensure **Automatically manage signing** is checked
2. Confirm your Apple Developer team is selected
3. If certificates are missing, go to **Xcode** > **Settings** > **Accounts** > select your Apple ID > **Manage Certificates** > click **+** to create a new distribution certificate

### Build Failures After Web Changes

**Symptom**: App shows old content or build fails after editing the web app.

**Fix**:
1. Rebuild the web app: `npm run build`
2. Re-sync: `npx cap sync ios`
3. In Xcode, clean the build folder: **Product** > **Clean Build Folder** (or `Cmd+Shift+K`)
4. Build again: `Cmd+B`

### Archive Menu Item Is Disabled

**Symptom**: **Product** > **Archive** is grayed out.

**Fix**: Change the build destination from a simulator to **Any iOS Device (arm64)** in the scheme/device selector in the Xcode toolbar. Archive is only available when targeting a real device.

### Build Succeeds but App Crashes on Launch

**Symptom**: App installs but immediately crashes.

**Fix**:
1. Check the Xcode console for crash logs
2. Ensure `dist/public/index.html` exists (rebuild if missing)
3. Verify `capacitor.config.ts` has `webDir: 'dist/public'`
4. Run `npx cap sync ios` again

### Upload Rejected by App Store Connect

**Symptom**: Upload succeeds but you receive an email about issues.

**Common causes**:
- Missing required icon sizes — ensure the 1024×1024 icon is in Assets.xcassets
- Missing privacy manifest — `ios/App/App/PrivacyInfo.xcprivacy` must be included
- Invalid `Info.plist` entries — check for missing usage description strings (camera, photo library)

---

## Quick Reference: Complete Submission Workflow

```bash
# 1. Build web assets
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

Then in Xcode:

1. **Signing & Capabilities** → Set team, verify bundle ID, add In-App Purchase + Push Notifications
2. **General** → Set deployment target to iOS 14.0
3. **Assets.xcassets** → Verify 1024×1024 app icon
4. Set destination to **Any iOS Device (arm64)**
5. **Product** → **Archive**
6. **Distribute App** → **App Store Connect** → **Upload**
7. Complete metadata, screenshots, IAP, and privacy in App Store Connect
8. Submit for review

---

## Support

For questions about the App Store submission process, contact: **CONTACT@GOLDROCK.ai**

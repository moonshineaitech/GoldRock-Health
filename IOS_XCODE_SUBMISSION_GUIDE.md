# GoldRock Health — iOS Xcode Submission Guide

## Prerequisites

Before starting, ensure you have:

1. **Mac computer** running macOS 14 (Sonoma) or later
2. **Xcode 16+** installed from the Mac App Store
3. **Apple Developer account** ($99/year) — enroll at [developer.apple.com](https://developer.apple.com/programs/)
4. **Node.js 18+** and **npm** installed
5. **CocoaPods** installed (`sudo gem install cocoapods`)
6. **App Store Connect** access with your Apple Developer account

## Step 1: Build the Web Application

```bash
# From the project root
npm run build
```

This compiles the React/TypeScript frontend into the `dist/public` directory that Capacitor will bundle into the native app.

## Step 2: Sync Capacitor

```bash
npx cap sync ios
```

This copies the built web assets into the iOS project directory (`ios/App/App/public/`) and syncs native plugin configurations.

If this is your first time, you may need to install pods:

```bash
cd ios/App && pod install && cd ../..
```

## Step 3: Open in Xcode

```bash
npx cap open ios
```

This opens the `ios/App/App.xcworkspace` in Xcode. Always open the `.xcworkspace` file (not `.xcodeproj`) to include CocoaPods dependencies.

## Step 4: Configure Code Signing

1. In Xcode, select the **App** target in the project navigator
2. Go to the **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** (your Apple Developer account)
5. Set **Bundle Identifier** to: `com.goldrockhealth.app`
6. Xcode will automatically create/download provisioning profiles

If you see signing errors:
- Ensure your Apple Developer account is added in Xcode → Settings → Accounts
- Check that your membership is active at [developer.apple.com](https://developer.apple.com/account)

## Step 5: Set Deployment Target

1. Select the **App** project (blue icon) in the navigator
2. Under **General** → **Minimum Deployments**, set **iOS** to `14.0`
3. Under **Build Settings**, search for "iOS Deployment Target" and confirm it's `14.0`

## Step 6: Configure App Icons and Launch Screen

### App Icons
1. Open `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Replace the placeholder icons with your GoldRock Health app icons
3. Required sizes (all PNG, no alpha channel):
   - 1024x1024 (App Store)
   - 180x180 (iPhone @3x)
   - 120x120 (iPhone @2x)
   - 167x167 (iPad Pro @2x)
   - 152x152 (iPad @2x)
   - 76x76 (iPad @1x)
4. Update `Contents.json` if adding icons manually

### Launch Screen
1. Edit `ios/App/App/Base.lproj/LaunchScreen.storyboard` in Xcode
2. Set background color to white (#FFFFFF)
3. Add the GoldRock Health logo centered on screen
4. Ensure it works in both portrait and landscape

## Step 7: Configure Privacy Descriptions

In `ios/App/App/Info.plist`, ensure these privacy descriptions are set:

- `NSCameraUsageDescription`: "GoldRock Health uses your camera to photograph medical bills for AI analysis"
- `NSPhotoLibraryUsageDescription`: "GoldRock Health accesses your photo library to upload medical bill images"
- `NSMicrophoneUsageDescription`: "GoldRock Health uses your microphone for voice-guided enrollment assistance"

## Step 8: Verify PrivacyInfo.xcprivacy

Ensure `ios/App/App/PrivacyInfo.xcprivacy` is included in the project and contains all Required Reason API declarations:

- FileTimestamp (C617.1)
- UserDefaults (CA92.1)
- SystemBootTime (35F9.1)
- DiskSpace (E174.1)
- ActiveKeyboards (54BD.1)

## Step 9: Test on Simulator and Device

### Simulator Testing
1. Select an iPhone simulator (e.g., iPhone 15 Pro) from the scheme selector
2. Press **Cmd+R** to build and run
3. Test all core flows: login, bill analysis, document vault, settings

### Device Testing
1. Connect your iPhone via USB
2. Select your device from the scheme selector
3. Press **Cmd+R** — you may need to trust the developer certificate on the device:
   - On iPhone: Settings → General → VPN & Device Management → Trust your certificate

## Step 10: Archive and Upload

1. Select **Any iOS Device (arm64)** as the build destination
2. Go to **Product → Archive**
3. Wait for the archive to complete (this may take several minutes)
4. When the Organizer window opens, select your archive
5. Click **Distribute App**
6. Choose **App Store Connect** → **Upload**
7. Follow the prompts to upload (keep default options for symbol stripping and bitcode)

If upload fails:
- Check your internet connection
- Ensure your Apple Developer membership is active
- Verify all signing certificates are valid
- Try: Product → Clean Build Folder, then Archive again

## Step 11: Configure App Store Connect Listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app (or create a new one with Bundle ID `com.goldrockhealth.app`)
3. Fill in all metadata using `docs/app-store-metadata.md` as reference:
   - **App Name**: GoldRock Health
   - **Subtitle**: AI Medical Bill Advocate
   - **Category**: Health & Fitness
   - **Age Rating**: 12+
   - **Price**: Free (with In-App Purchases)
   - **Description**: Use the full description from `docs/app-store-metadata.md`
   - **Keywords**: Use keywords from `docs/app-store-metadata.md`
   - **Screenshots**: Upload screenshots for all required device sizes
   - **Privacy Policy URL**: https://www.goldrockhealth.com/privacy-policy
   - **Support URL**: https://www.goldrockhealth.com/support

4. Under **In-App Purchases**, configure:
   - Monthly Premium: $24.99/month (auto-renewable subscription)
   - Annual Premium: $249.99/year (auto-renewable subscription)
   - Subscription Group: "GoldRock Health Premium"

## Step 12: Submit for Review

1. In App Store Connect, go to your app → the current version
2. Under **App Review Information**, provide:
   - **Demo Account**: `appreviewer@goldrockhealth.com`
   - **Demo Password**: `GoldRock2026!`
   - **Review Notes**: "Demo account has Premium access with sample bills pre-loaded. Use the email/password login form on the landing page (scroll to 'App Store Reviewer Login' section). The app uses AI to analyze medical bills — no real patient data is used in the demo."
3. Under **Version Release**, select your preference (Manual or Automatic)
4. Click **Submit for Review**

## Troubleshooting

### Build Errors

**"No signing certificate"**
- Open Xcode → Settings → Accounts → Manage Certificates
- Click "+" to create a new Apple Distribution certificate

**"Module not found" for Capacitor plugins**
```bash
cd ios/App && pod install && cd ../..
npx cap sync ios
```

**"Deployment target too low"**
- Set all targets (App, Pods) to iOS 14.0 minimum

### Upload Errors

**"ITMS-90717: Invalid App Store Icon"**
- App Store icon must be 1024x1024 PNG with no alpha channel and no rounded corners

**"ITMS-91053: Missing API declaration"**
- Ensure `PrivacyInfo.xcprivacy` is included and has all required reason APIs declared

**"ITMS-90683: Missing Purpose String"**
- Add all required `NS*UsageDescription` strings to Info.plist

### Runtime Issues

**White screen after launch**
- Check that `npm run build` completed successfully
- Run `npx cap sync ios` again
- Verify `ios/App/App/public/index.html` exists

**API calls failing**
- The production server URL must be configured in the app's server configuration
- Check `capacitor.config.ts` for the correct server URL

**Camera not working**
- Ensure `NSCameraUsageDescription` is in Info.plist
- Test on a real device (camera doesn't work in simulator)

## Post-Submission Checklist

- [ ] App submitted with correct Bundle ID (`com.goldrockhealth.app`)
- [ ] Demo account credentials provided to App Review
- [ ] All privacy descriptions present in Info.plist
- [ ] PrivacyInfo.xcprivacy included with all Required Reason APIs
- [ ] App icons for all required sizes
- [ ] Screenshots for all required device sizes
- [ ] Privacy Policy URL accessible
- [ ] In-App Purchase products configured and approved
- [ ] Age rating set to 12+
- [ ] Category set to Health & Fitness

## Contact

For questions about the submission process, contact the development team at CONTACT@GOLDROCK.ai.

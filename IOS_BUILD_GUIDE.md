# GoldRock Health iOS App - Build & App Store Submission Guide

## Overview
GoldRock Health uses **Capacitor** to wrap the React web app in a native iOS shell, achieving ~90% code reuse while providing native iOS features like camera access, Face ID, push notifications, and share functionality.

## Prerequisites

### Required Software
- **macOS** (Monterey 12.0 or later recommended)
- **Xcode 15.0+** (download from Mac App Store)
- **Node.js 18+** (already installed)
- **CocoaPods** (install via: `sudo gem install cocoapods`)
- **Apple Developer Account** (required for App Store submission)

### Environment Variables
Ensure these are set in your Replit environment:
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key for payments
- Other API keys as needed for your integrations

## Build Process

### Step 1: Build Web Assets
```bash
npm run build
```
This compiles the React frontend and Express backend into `dist/public/`.

### Step 2: Sync Assets to iOS Project
```bash
npx cap sync ios
```
This command:
- Copies web assets from `dist/public/` to `ios/App/App/public/`
- Installs/updates Capacitor plugins
- Syncs configuration from `capacitor.config.ts`

### Step 3: Open Xcode
```bash
npx cap open ios
```
This opens the iOS project in Xcode.

## App Icons & Assets

### App Icon (Required)
**Location:** `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

iOS now uses a **single 1024x1024px icon** that automatically generates all sizes.

**Requirements:**
- Size: 1024x1024 pixels
- Format: PNG (no transparency)
- Color space: sRGB or P3
- File name: `AppIcon-512@2x.png` (already configured)

**Design Guidelines:**
- Medical theme with GoldRock Health branding
- Use brand colors: Gold/Amber (#F59E0B) and Emerald (#10B981)
- Include medical cross or health icon
- Keep design simple and recognizable at small sizes

**How to Add:**
1. Create/obtain a 1024x1024px PNG icon
2. Replace `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
3. Or drag-and-drop into Xcode Assets catalog

### Splash Screens
**Location:** `ios/App/App/Assets.xcassets/Splash.imageset/`

Capacitor automatically generates adaptive splash screens. Current configuration uses a 2732x2732px universal splash image.

**To Customize:**
1. Create a 2732x2732px splash screen image
2. Replace files in `Splash.imageset/`
3. Or configure in Xcode storyboard for more control

## Xcode Configuration

### 1. Signing & Capabilities
In Xcode, select the **App** target:

1. **Signing & Capabilities** tab:
   - **Team:** Select your Apple Developer team
   - **Bundle Identifier:** `com.goldrockhealth.app` (from capacitor.config.ts)
   - **Signing Certificate:** Automatic signing (recommended) or manual

2. **Add Capabilities** (if needed):
   - ✅ Push Notifications (already added)
   - ✅ Face ID (NSFaceIDUsageDescription in Info.plist)
   - ✅ Camera (NSCameraUsageDescription in Info.plist)

### 2. Version & Build Number
In **General** tab:
- **Version:** 1.0.0 (matches capacitor.config.ts)
- **Build:** 1 (increment for each submission)

### 3. Deployment Target
- **Minimum iOS Version:** 13.0 (configured in capacitor.config.ts)

## Info.plist Permissions (Already Configured)

The following permissions are already added to `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>GoldRock Health needs camera access to scan and photograph your medical bills for AI analysis</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>GoldRock Health needs access to your photo library to import medical bills and receipts for analysis</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>GoldRock Health can save analyzed bills and dispute letters to your photo library</string>

<key>NSFaceIDUsageDescription</key>
<string>GoldRock Health uses Face ID or Touch ID to securely protect your medical and financial information</string>

<key>NSUserNotificationsUsageDescription</key>
<string>GoldRock Health sends notifications when your bill analysis is complete or when you receive important updates about your medical bills</string>

<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

## Privacy Manifest (Already Configured)

**Location:** `ios/App/App/PrivacyInfo.xcprivacy`

This manifest declares:
- **Data Collection:** Health info, financial info, email, name, photos
- **Purpose:** App functionality only (no tracking)
- **API Usage:** File timestamps, UserDefaults (for app preferences)

Apple requires this for App Store approval.

## Building for App Store

### 1. Archive the App
In Xcode:
1. Select **Any iOS Device** as build destination (not simulator)
2. **Product → Archive**
3. Wait for build to complete (may take 5-10 minutes first time)

### 2. Validate Archive
1. Xcode Organizer opens automatically after archive
2. Select the archive → **Validate App**
3. Choose distribution method: **App Store Connect**
4. Follow prompts (signing, etc.)
5. Fix any validation errors before proceeding

### 3. Upload to App Store Connect
1. In Organizer, select archive → **Distribute App**
2. Choose **App Store Connect**
3. Upload method: **Upload** (not Export)
4. Select signing options (automatic recommended)
5. Review summary → **Upload**
6. Wait for upload (progress shown in Xcode)

### 4. Processing Time
- Apple processes uploaded builds (typically 10-60 minutes)
- You'll receive email when build is ready for TestFlight/submission
- Check status in App Store Connect → TestFlight → iOS Builds

## App Store Connect Setup

### 1. Create App Record
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps** → **+** → **New App**
3. Fill in:
   - **Platform:** iOS
   - **Name:** GoldRock Health
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** com.goldrockhealth.app
   - **SKU:** GOLDROCK-HEALTH-001 (unique identifier)

### 2. App Information
**Category:** Medical  
**Subcategory:** Health & Fitness

**App Privacy Policy URL:**  
`https://goldrockhealth.com/privacy-policy`

**Support URL:**  
`https://goldrockhealth.com/support` (or your support page)

### 3. Age Rating
- Medical/Treatment Information: Yes
- Requires medical disclaimer

### 4. App Description

**Subtitle (30 chars):**  
"Save $1000s on Medical Bills"

**Description (4000 chars max):**
```
GoldRock Health uses advanced AI to help you reduce medical bills by $2,000-$35,000+. Our platform analyzes your bills, identifies overcharges, and provides expert guidance to dispute unfair charges.

KEY FEATURES:
• AI Bill Analysis - Upload bills via camera or photo library
• Expert Coaching - Get personalized reduction strategies
• Dispute Letters - AI-generated professional dispute templates
• Bill Negotiation - Step-by-step guidance for provider calls
• Progress Tracking - Monitor your savings over time

HOW IT WORKS:
1. Scan or upload your medical bill
2. AI analyzes for errors, overcharges, and reduction opportunities
3. Receive detailed savings report with actionable strategies
4. Access dispute letter templates and negotiation scripts
5. Track results and cumulative savings

SUBSCRIPTION OPTIONS:
• Free: Basic bill analysis, limited features
• Premium: Unlimited bills, expert coaching, priority support

SECURITY & PRIVACY:
• Bank-level encryption for all medical data
• HIPAA-compliant data handling
• Face ID/Touch ID protection
• No data sold to third parties

Perfect for patients, families, and anyone facing high medical costs. Join thousands saving on healthcare expenses.

Download GoldRock Health and start reducing your medical bills today!
```

**Keywords (100 chars):**
```
medical bills,healthcare,bill negotiation,savings,insurance,hospital bills,debt,dispute,AI,analysis
```

**Promotional Text (170 chars):**
```
New: AI-powered bill analysis with camera scanning! Upload bills instantly and get savings recommendations in seconds. Save thousands on medical expenses.
```

### 5. Screenshots (Required)

**iPhone 6.7" Display** (1290 x 2796 px) - **Required**
Minimum 3 screenshots, recommended 5-8:
1. Home screen with "Scan Bill" CTA
2. Camera scanning a medical bill
3. AI analysis results showing savings
4. Detailed breakdown with overcharges highlighted
5. Dispute letter generation
6. Premium subscription benefits
7. Progress dashboard with savings stats
8. (Optional) Testimonial or success story

**iPhone 6.5" Display** (1242 x 2688 px) - **Required**
Same screenshots as above, resized

**iPhone 5.5" Display** (1242 x 2208 px) - Optional but recommended

**iPad Pro (12.9")** (2048 x 2732 px) - Optional
If supporting iPad (currently iPhone-only in capacitor.config.ts)

**Design Tips:**
- Include device frames for professional look
- Use real (anonymized) data examples
- Highlight key features with text overlays
- Show before/after savings comparisons
- Ensure text is readable at thumbnail size

### 6. App Preview Video (Optional, Recommended)

**Specifications:**
- Resolution: 1080p (1920x1080) minimum
- Duration: 15-30 seconds
- Format: .mov, .m4v, or .mp4
- Orientation: Portrait preferred

**Content Ideas:**
- Show bill scanning process
- Display AI analysis in action
- Highlight key features
- End with download CTA

### 7. App Review Information

**Demo Account Credentials:**
```
Email: appreviewer@goldrock.com
Password: AppReview2025!
```
⚠️ **IMPORTANT:** Create this demo account with Premium access for reviewers to test all features

**Notes for Reviewer:**
```
GoldRock Health is a medical bill reduction platform using AI analysis.

To test the app:
1. Log in with provided credentials (has Premium access)
2. Tap "Scan Bill" or "Upload Bill"
3. Grant camera/photo permissions when prompted
4. Upload sample medical bill (provided in demo account)
5. Review AI analysis and savings recommendations
6. Test dispute letter generation

The app uses:
- Capacitor Camera plugin for bill scanning
- Stripe for subscription payments (not Apple IAP)*
- Face ID for biometric authentication
- Push notifications for bill analysis completion

*Note: We use Stripe for subscription payments as our service includes expert human coaching and external dispute resolution, qualifying as "services consumed outside the app" per App Store Review Guidelines 3.1.1. Premium subscriptions provide access to AI analysis tools plus ongoing human expert support.

All medical data is encrypted and HIPAA-compliant.
```

### 8. Pricing & Availability

**Price:** Free (with in-app subscription)

**In-App Purchases** (configure in App Store Connect):
- Premium Monthly: $29.99/month
- Premium Annual: $299.99/year (17% savings)

⚠️ **Stripe vs Apple IAP:**  
Current implementation uses Stripe for subscriptions. Apple may require StoreKit (IAP) if they consider Premium a "digital service consumed in-app." 

**Strategy:**
1. Submit with Stripe first (cite external expert coaching)
2. If rejected, implement StoreKit IAP as fallback
3. Stripe integration code is at `client/src/pages/premium.tsx`

**Availability:**
- All territories (or select specific countries)
- Pre-order: No

### 9. Version Information

**Version:** 1.0.0  
**Copyright:** 2025 Eldest AI LLC dba GoldRock AI  
**Trade Representative Contact Information:**  
(Required for paid apps/IAP)

## Submission Checklist

### Pre-Submission
- [ ] App icon uploaded (1024x1024px)
- [ ] All screenshots uploaded (3+ per device size)
- [ ] App description written and reviewed
- [ ] Keywords optimized for App Store search
- [ ] Privacy policy URL accessible
- [ ] Support URL accessible
- [ ] Demo account created and tested
- [ ] App Review notes completed

### Build Validation
- [ ] Build uploaded to App Store Connect
- [ ] Build processed successfully (no errors)
- [ ] TestFlight testing completed
- [ ] All native features tested (camera, Face ID, notifications)
- [ ] Stripe payments tested on device
- [ ] No crashes or critical bugs

### Compliance
- [ ] Privacy manifest included (PrivacyInfo.xcprivacy)
- [ ] All Info.plist permissions documented
- [ ] Export compliance answered (ITSAppUsesNonExemptEncryption: false)
- [ ] Age rating completed
- [ ] HIPAA compliance confirmed (medical data)

### Submit for Review
1. Go to App Store Connect → Your App → Version
2. Select uploaded build from TestFlight
3. Fill in "What's New in This Version"
4. Review all metadata
5. Click **Submit for Review**
6. Answer additional questions (export compliance, etc.)
7. Wait for review (typically 24-48 hours)

## Common Issues & Solutions

### Issue: "App Store Connect Operation Error"
**Solution:** Ensure bundle ID matches exactly (com.goldrockhealth.app)

### Issue: "Missing Compliance"
**Solution:** Info.plist already has `ITSAppUsesNonExemptEncryption` set to false

### Issue: "Invalid Provisioning Profile"
**Solution:** Use automatic signing in Xcode, regenerate profiles if needed

### Issue: "Icon has transparency"
**Solution:** App icons cannot have transparent pixels, ensure solid background

### Issue: "Rejected for IAP"
**Solution:** If Apple requires IAP, implement StoreKit alongside Stripe:
1. Keep Stripe for web version
2. Use StoreKit for iOS native
3. Code path: Detect platform with `Capacitor.isNativePlatform()`

### Issue: "Missing Permission Description"
**Solution:** All required descriptions already in Info.plist (see above)

## Post-Submission

### Review Timeline
- **Initial Review:** 24-48 hours typically
- **Metadata Rejected:** Usually <24 hours to address and resubmit
- **Binary Rejected:** May need new build, 24-48 hours for re-review

### If Approved
- App goes live on App Store within hours
- Set up release date or make available immediately
- Monitor reviews and crash reports in App Store Connect

### If Rejected
- Review rejection reasons carefully
- Common reasons: Privacy issues, IAP requirements, misleading metadata
- Address each issue completely before resubmission
- Respond to reviewer notes if clarification needed

## Testing on Physical Device

### Via Xcode (Development)
1. Connect iPhone via USB
2. Select device in Xcode
3. **Product → Run**
4. Trust developer certificate on device (Settings → General → Device Management)

### Via TestFlight (Beta Testing)
1. Upload build to App Store Connect
2. Wait for processing
3. Add internal testers (up to 100)
4. Or add external testers (submit for beta review)
5. Testers install TestFlight app and download build

## Updating the App

### For Future Releases
1. Increment version in `capacitor.config.ts`:
   ```typescript
   version: '1.0.1', // or 1.1.0 for features
   ```

2. Update build number in Xcode (must be unique for each submission)

3. Rebuild and sync:
   ```bash
   npm run build
   npx cap sync ios
   ```

4. Archive and upload new version

5. Create new version in App Store Connect:
   - **My Apps → Versions → + Version**
   - Enter version number
   - Upload build
   - Fill "What's New" section
   - Submit for review

## Support Resources

### Documentation
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)

### Tools
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com/account)
- [TestFlight](https://developer.apple.com/testflight/)

### Community
- [Capacitor Community](https://capacitorjs.com/community)
- [Ionic Forum](https://forum.ionicframework.com/)

---

## Quick Reference Commands

```bash
# Build web assets
npm run build

# Sync to iOS (after build)
npx cap sync ios

# Open in Xcode
npx cap open ios

# Update Capacitor
npm install @capacitor/core@latest @capacitor/ios@latest

# Update iOS project
npx cap update ios

# Copy web assets only (no plugin sync)
npx cap copy ios
```

## Next Steps

1. ✅ Build web assets: `npm run build`
2. ✅ Sync to iOS: `npx cap sync ios`
3. 📱 Open Xcode: `npx cap open ios`
4. 🎨 Add app icon (1024x1024px)
5. 📸 Create screenshots for App Store
6. 🔐 Configure signing in Xcode
7. 📦 Archive and upload to App Store Connect
8. 📝 Complete App Store Connect metadata
9. 🚀 Submit for review

**Estimated time to submission:** 4-8 hours (after all assets prepared)

---

**Questions or Issues?**  
Contact: [your-email@goldrockhealth.com]  
Last Updated: January 2025

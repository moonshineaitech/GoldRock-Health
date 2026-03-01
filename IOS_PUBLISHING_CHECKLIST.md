# GoldRock Health - iOS App Store Publishing Checklist

## Current Status: Ready for Build

The web application is ready to be wrapped as an iOS native app using Capacitor.

---

## Pre-Requisites (External Setup Required)

### 1. Apple Developer Account
- [ ] Active Apple Developer Program membership ($99/year)
- [ ] App Store Connect access configured
- [ ] Certificates and provisioning profiles created
- [ ] Enable In-App Purchase capability in App ID

### 2. App Store Connect Privacy Setup
Apple requires detailed privacy disclosures before app submission:

- [ ] **App Privacy Questionnaire** - Complete in App Store Connect:
  - Data Types Collected: Health & Fitness, Sensitive Info, Financial Info, Other User Content, Contact Info (Email, Name), Photos
  - Data Linked to User: Yes (for personalization)
  - Data Used for Tracking: No
  
- [x] **Privacy Manifest** - `PrivacyInfo.xcprivacy` updated for 2026 in `ios/App/App/`:
  - NSPrivacyTracking: false
  - NSPrivacyTrackingDomains: empty (no tracking domains)
  - Health & Fitness data — app functionality
  - Sensitive Info (medical billing) — app functionality
  - Financial Info — bill analysis
  - Other User Content (chat/bill text) — app functionality
  - Email/Name — account management
  - Photos — bill scanning
  - Required Reason APIs: FileTimestamp (C617.1), UserDefaults (CA92.1), SystemBootTime (35F9.1), DiskSpace (E174.1), ActiveKeyboards (54BD.1)

- [ ] **App Tracking Transparency (ATT)** - Not required (app does not track users)

### 3. RevenueCat Configuration
- [ ] Create RevenueCat account at https://app.revenuecat.com
- [ ] Add new project for "GoldRock Health"
- [ ] Configure iOS App:
  - App Bundle ID: `com.goldrockhealth.app`
  - App Store Connect App ID
- [ ] Create Products in App Store Connect:
  - **Monthly**: `com.goldrockhealth.premium.monthly` - $24.99/month
  - **Annual**: `com.goldrockhealth.premium.annual` - $249.99/year
- [ ] Create Entitlement: `premium`
- [ ] Create Offering: `default` with Monthly and Annual packages
- [ ] Copy iOS API Key to Replit secrets as `REVENUECAT_IOS_API_KEY`

### 3. App Store Connect Setup
- [ ] Create new app in App Store Connect
- [ ] Configure In-App Purchases (subscriptions)
- [ ] Submit for Apple Review

---

## Technical Configuration (Completed)

### Capacitor Configuration
- [x] `capacitor.config.ts` configured with iOS settings
- [x] App ID: `com.goldrockhealth.app`
- [x] App Name: `GoldRock Health`
- [x] iOS scheme and content settings configured
- [x] Splash screen and push notifications configured

### Native Plugins Installed
- [x] @capacitor/ios (v7.4.3)
- [x] @capacitor/app
- [x] @capacitor/camera
- [x] @capacitor/haptics
- [x] @capacitor/local-notifications
- [x] @capacitor/push-notifications
- [x] @capacitor/share
- [x] @capacitor/splash-screen
- [x] @capacitor/status-bar
- [x] @capacitor/preferences
- [x] @capacitor/network

### Payment Integration
- [x] RevenueCat service (`client/src/lib/revenuecat-service.ts`)
- [x] Platform-aware payment routing (`client/src/lib/payment-service.ts`)
- [x] iOS uses StoreKit via RevenueCat (Apple requirement)
- [x] Web uses Stripe for subscriptions
- [x] Lifetime plan available on web only (Apple policy)

---

## App Store Review Requirements

### Demo Account
- [x] Email: `appreviewer@goldrockhealth.com`
- [x] Premium subscription pre-activated (never expires)
- [x] 3 sample medical bills with AI analysis
- [x] Full access to all premium features

### Required App Metadata

#### App Information
- **App Name**: GoldRock Health
- **Subtitle**: AI Medical Bill Reduction
- **Category**: Health & Fitness (Primary), Finance (Secondary)
- **Privacy Policy URL**: https://[your-domain]/privacy-policy
- **Support URL**: CONTACT@GOLDROCK.ai

#### Description (4,000 char max)
```
GoldRock Health helps you reduce medical bills using AI-powered analysis and expert negotiation coaching.

FEATURES:
- AI Bill Analysis: Scan and analyze medical bills to identify errors, overcharges, and potential savings
- Negotiation Coaching: Step-by-step scripts and strategies proven to reduce bills by 30-50%
- Dispute Templates: 50+ professional letter templates for billing disputes
- Collections Defense: Comprehensive guide for bills in collections
- Hospital Bill Playbook: Strategies for reducing bills before collections

PREMIUM SUBSCRIPTION:
- Monthly: $24.99/month
- Annual: $249.99/year (save 17%)

Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions in your Account Settings on the App Store after purchase.

Privacy Policy: [URL]
Terms of Service: [URL]
```

#### Keywords (100 char max)
```
medical bills, bill reduction, healthcare savings, negotiate medical, insurance claims, billing errors
```

### Screenshots Required
- 6.7" (iPhone 15 Pro Max): 1290 x 2796 px
- 6.5" (iPhone 14 Plus): 1284 x 2778 px
- 5.5" (iPhone 8 Plus): 1242 x 2208 px
- iPad Pro 12.9": 2048 x 2732 px

### App Preview Video (Optional)
- 15-30 seconds showing key features
- Dimensions match screenshot sizes

---

## Building the iOS App

### Step 1: Build Web Assets
```bash
npm run build
```

### Step 2: Sync Capacitor (on Mac)
```bash
npx cap sync ios
```

### Step 3: Open in Xcode
```bash
npx cap open ios
```

### Step 4: Configure Signing
- Select your Development Team
- Update Bundle Identifier if needed
- Configure capabilities (Push Notifications, In-App Purchase)

### Step 5: Archive and Upload
- Product > Archive
- Distribute App > App Store Connect

---

## Environment Variables

### Required for iOS
| Variable | Description | Status |
|----------|-------------|--------|
| `REVENUECAT_IOS_API_KEY` | RevenueCat iOS API key | Secret configured |
| `VITE_REVENUECAT_IOS_API_KEY` | Frontend access to RevenueCat | Set via env |

---

## Apple Review Guidelines Compliance

### 3.1.1 - In-App Purchase
- [x] Digital content uses StoreKit/RevenueCat
- [x] No external payment links for subscriptions
- [x] Lifetime purchase only available on web

### 3.1.2 - Subscriptions
- [x] Auto-renewable subscriptions configured
- [x] Subscription terms in app description
- [x] Manage Subscriptions link available

### 4.2 - Minimum Functionality
- [x] App provides significant value beyond website
- [x] Native features: Camera, Notifications, Haptics

### 5.1 - Data Collection
- [x] Privacy policy accessible in-app
- [x] No undisclosed data collection

---

## Pre-Submission Testing

### RevenueCat Smoke Test (Required)
Before submitting to App Store, verify StoreKit integration works:

1. **Build on physical iOS device** (simulator doesn't support StoreKit)
2. **Login with test Apple ID** (sandbox tester configured in App Store Connect)
3. **Navigate to Premium page** - verify Monthly/Annual options appear
4. **Tap "Subscribe"** - verify Apple Pay sheet appears (not Stripe checkout)
5. **Complete sandbox purchase** - verify subscription activates
6. **Check "Restore Purchases"** - verify previous purchases restore correctly

### Payment Routing Verification
- [ ] iOS native app shows StoreKit/Apple Pay UI (NOT Stripe)
- [ ] Lifetime plan is NOT visible on iOS (Apple policy)
- [ ] Web browser shows Stripe checkout
- [ ] Lifetime plan IS visible on web

---

## Post-Submission Checklist

- [ ] Monitor App Store Connect for review status
- [ ] Respond promptly to any reviewer questions
- [ ] Prepare responses for common rejection reasons
- [ ] Test production app after approval
- [ ] Set up App Analytics monitoring

---

## Common Rejection Reasons & Responses

### 3.1.1 - In-App Purchase Required
**Issue**: App attempts to use external payment link
**Response**: Verified - iOS uses StoreKit via RevenueCat exclusively. Stripe checkout only available on web.

### 2.1 - App Completeness
**Issue**: App crashes or has bugs
**Response**: Tested extensively; demo account (appreviewer@goldrockhealth.com) provides full access.

### 5.1.1 - Data Collection
**Issue**: Privacy policy or data disclosures insufficient
**Response**: PrivacyInfo.xcprivacy updated for 2026 with all Required Reason APIs and Sensitive Info data type. AI Usage Agreement v2.0 includes explicit healthcare billing data consent. Healthcare PHI Consent Modal shown before any bill data entry. App Privacy questionnaire must be updated to include Sensitive Info and Other User Content.

---

## 2026 iOS Compliance Checklist

New requirements effective for February 2026 App Store submissions:

- [x] **Privacy Manifest updated** — Added SystemBootTime, DiskSpace, ActiveKeyboards Required Reason APIs; added SensitiveInfo and OtherUserContent data types
- [x] **AI Usage Agreement v2.0** — Explicit healthcare billing data section, AES-256/TLS 1.3 security details, named AI providers (OpenAI, Google) with DPA disclosures, third consent checkbox for health data
- [x] **Healthcare PHI Consent Modal** — Shown before bill data entry (Bill Advocate Step 3) and Document Vault upload; uses localStorage to show only once; plain-English explanation of data handling
- [x] **Data Security Hub** — `/data-security` page accessible from Settings > Data Security; shows encryption standards, retention policy, AI processor disclosures, export/delete controls, biometric lock toggle
- [x] **Data Security in Settings** — Added "Data Security" entry to Settings > Privacy & Legal section
- [x] **App Store metadata updated** — Health Data Handling section added to App Review Notes in docs/app-store-metadata.md
- [ ] **App Store Connect Privacy Questionnaire** — Must update to add: Sensitive Info, Other User Content data types during App Store Connect submission
- [x] **Account deletion flow** — In-app account deletion (required by Apple) already implemented at DELETE /api/account
- [x] **No tracking domains** — NSPrivacyTrackingDomains is empty, NSPrivacyTracking is false
- [x] **Contact email** — All user-facing contact references use CONTACT@GOLDROCK.ai

---

## Contact

For App Store review questions: CONTACT@GOLDROCK.ai

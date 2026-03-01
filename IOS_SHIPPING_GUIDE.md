# GoldRock Health - Ship to iOS App Store (Step-by-Step)

Everything in the code is already set up and ready. This guide walks you through what you need to do on **your Mac** to get the app into the App Store.

---

## What You'll Need Before Starting

1. **A Mac computer** with macOS Sonoma or later
2. **Xcode 16+** installed from the Mac App Store (free)
3. **Apple Developer Account** ($99/year) - enroll at https://developer.apple.com/programs/
4. **Node.js 20+** installed on your Mac - download from https://nodejs.org
5. **CocoaPods** installed - we'll cover this below

**Time estimate**: About 2-3 hours for first-time setup, 30 minutes once you've done it before.

---

## PHASE 1: Set Up Your Mac (One-Time Setup)

### Step 1: Install Xcode

1. Open the **Mac App Store** on your Mac
2. Search for **"Xcode"**
3. Click **"Get"** then **"Install"** (it's about 12 GB, so it takes a while)
4. Once installed, open Xcode and accept the license agreement
5. It will install additional components - let it finish

### Step 2: Install Xcode Command Line Tools

Open **Terminal** on your Mac and run:

```bash
xcode-select --install
```

A popup will appear - click **"Install"** and wait for it to finish.

### Step 3: Install CocoaPods

In Terminal, run:

```bash
sudo gem install cocoapods
```

Enter your Mac password when asked. If that doesn't work, try:

```bash
brew install cocoapods
```

(If you don't have Homebrew, install it first: https://brew.sh)

### Step 4: Install Node.js

If you don't already have Node.js on your Mac:

1. Go to https://nodejs.org
2. Download the **LTS** version
3. Run the installer

Verify it's installed by running in Terminal:

```bash
node --version
npm --version
```

---

## PHASE 2: Apple Developer Account Setup

### Step 5: Enroll in Apple Developer Program

1. Go to https://developer.apple.com/programs/
2. Click **"Enroll"**
3. Sign in with your Apple ID (or create one)
4. Pay the $99/year fee
5. Wait for approval (usually instant for individuals, can take 48 hours for organizations)

### Step 6: Create an App ID

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click the **"+"** button
3. Select **"App IDs"** → Continue
4. Select **"App"** → Continue
5. Fill in:
   - **Description**: `GoldRock Health`
   - **Bundle ID**: Select "Explicit" and enter: `com.goldrockhealth.app`
6. Under **Capabilities**, check these boxes:
   - ✅ **In-App Purchase**
   - ✅ **Push Notifications**
7. Click **"Continue"** → **"Register"**

### Step 7: Create a Provisioning Profile

1. Go to https://developer.apple.com/account/resources/profiles/list
2. Click the **"+"** button
3. Under **Distribution**, select **"App Store Connect"** → Continue
4. Select the App ID you just created (`com.goldrockhealth.app`) → Continue
5. Select your Distribution Certificate (create one if you don't have one - Xcode can do this automatically)
6. Name it: `GoldRock Health Distribution`
7. Click **"Generate"** then **"Download"**
8. Double-click the downloaded file to install it

---

## PHASE 3: App Store Connect Setup

### Step 8: Create Your App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in:
   - **Platforms**: iOS
   - **Name**: `GoldRock Health`
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Select `com.goldrockhealth.app`
   - **SKU**: `goldrockhealth001`
   - **User Access**: Full Access
4. Click **"Create"**

### Step 9: Fill in App Information

In your new app's page:

**App Information tab:**
- **Subtitle**: `AI Medical Bill Reduction`
- **Category**: Primary = `Health & Fitness`, Secondary = `Finance`
- **Content Rights**: Does not contain third-party content
- **Age Rating**: Complete the questionnaire (select "None" for most - no violence, gambling, etc.)

**Pricing and Availability tab:**
- **Price**: Free (the app is free to download, revenue comes from subscriptions)
- **Availability**: Select all countries you want

**App Privacy tab:**
- Click **"Get Started"**
- **Data Types Collected**: Select:
  - Health & Fitness (for medical bill data)
  - Financial Info (for billing amounts)  
  - Contact Info → Email Address, Name
  - Photos or Videos (for bill scanning)
- **Data Linked to User**: Yes
- **Data Used for Tracking**: No

### Step 10: Create In-App Subscriptions

1. In your app's page, go to the **"Subscriptions"** section in the left sidebar
2. Click **"+"** to create a Subscription Group
3. Name it: `Premium`
4. Create two subscriptions:

**Monthly Subscription:**
- Reference Name: `Premium Monthly`
- Product ID: `com.goldrockhealth.premium.monthly`
- Subscription Duration: 1 Month
- Price: $24.99 (Tier 50 or closest)
- Display Name: `Premium Monthly`
- Description: `Full access to AI bill analysis, negotiation coaching, and all premium features`

**Annual Subscription:**
- Reference Name: `Premium Annual`
- Product ID: `com.goldrockhealth.premium.annual`
- Subscription Duration: 1 Year  
- Price: $249.99 (Tier 510 or closest)
- Display Name: `Premium Annual`
- Description: `Full access to all premium features - save 17% vs monthly`

### Step 11: Set Up a Sandbox Tester

1. Go to https://appstoreconnect.apple.com/access/users/sandbox
2. Click **"+"**
3. Create a test account:
   - First Name: `Test`
   - Last Name: `User`
   - Email: Use any email (doesn't need to be real, but must be unique)
   - Password: Something you'll remember
   - Territory: United States
4. Save this - you'll use it to test purchases on your device

### Step 12: Set Up Demo Account for Apple Review

Apple's review team will need to test your app. A demo account is already configured:

- **Email**: `appreviewer@goldrockhealth.com`
- **Password**: Set this up in your app's backend (it's already pre-configured with Premium access that never expires)

When submitting, you'll enter these credentials in the "App Review Information" section.

---

## PHASE 4: RevenueCat Setup (For In-App Purchases)

### Step 13: Create RevenueCat Account

1. Go to https://app.revenuecat.com and sign up
2. Create a new Project: `GoldRock Health`
3. Add an App:
   - Platform: **Apple App Store**
   - App name: `GoldRock Health`
   - App Bundle ID: `com.goldrockhealth.app`

### Step 14: Connect App Store Connect to RevenueCat

1. In RevenueCat, go to your app → **App Settings**
2. Under **App Store Connect**, you need your **App-Specific Shared Secret**:
   - Go to App Store Connect → Your App → Subscriptions
   - Click **"App-Specific Shared Secret"** → **"Manage"** → **"Generate"**
   - Copy the secret and paste it into RevenueCat

### Step 15: Configure RevenueCat Products

1. In RevenueCat → **Products**, add:
   - Product ID: `com.goldrockhealth.premium.monthly`
   - Product ID: `com.goldrockhealth.premium.annual`
2. Create an **Entitlement**: Name it `premium`
   - Attach both products to this entitlement
3. Create an **Offering**: Name it `default`
   - Add a **Monthly** package → link to the monthly product
   - Add an **Annual** package → link to the annual product

### Step 16: Get Your RevenueCat API Key

1. In RevenueCat → Your App → **API Keys**
2. Copy the **Public iOS API key** (starts with `appl_`)
3. In your Replit project, add this as a secret:
   - Key: `REVENUECAT_IOS_API_KEY`  
   - Value: `appl_xxxxxxxxxxxx` (your actual key)
4. Also add it as an environment variable:
   - Key: `VITE_REVENUECAT_IOS_API_KEY`
   - Value: same key

---

## PHASE 5: Build and Deploy the App

### Step 17: Download the Project to Your Mac

On your Mac, open Terminal and run:

```bash
# Create a folder for the project
mkdir -p ~/Projects
cd ~/Projects

# Clone from your Replit (or download as ZIP)
# Option A: If you have git configured with Replit
git clone https://replit.com/@YourUsername/YourReplName.git goldrock-health

# Option B: Download ZIP from Replit
# In Replit, click the three dots menu → Download as ZIP
# Then unzip it to ~/Projects/goldrock-health
```

### Step 18: Install Dependencies

```bash
cd ~/Projects/goldrock-health

# Install Node.js dependencies
npm install

# Install iOS dependencies (CocoaPods)
cd ios/App
pod install
cd ../..
```

If `pod install` fails, try:

```bash
cd ios/App
pod install --repo-update
cd ../..
```

### Step 19: Build the Web Assets

```bash
# This compiles your React app into static files the iOS app will use
npm run build
```

You should see a success message. The built files go into `dist/public/`.

### Step 20: Update the Capacitor Config for Production

Before syncing, you need to tell the iOS app where your live server is. 

Open `capacitor.config.ts` in a text editor and update the `server` section:

```typescript
server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Point to your live Replit deployment URL
    url: 'https://your-app-name.replit.app',
    cleartext: false
}
```

**Important**: Replace `https://your-app-name.replit.app` with your actual published Replit URL. This is the URL your iOS app will load when users open it.

**Alternative (Fully Offline/Embedded)**: If you want the app to work without internet (loading the built-in web files), remove the `url` line entirely. The app will load the local files from `dist/public/` instead. Note: API calls for AI analysis, login, etc. will still need internet.

### Step 21: Sync Capacitor with iOS

```bash
# This copies the built web files into the iOS project
npx cap sync ios
```

This command:
- Copies `dist/public/` into the iOS project
- Updates native plugins
- Updates the iOS configuration

### Step 22: Open in Xcode

```bash
npx cap open ios
```

This opens the Xcode project. The first time, it may take a minute to index.

---

## PHASE 6: Configure Xcode

### Step 23: Set Your Development Team

1. In Xcode, click on **"App"** in the left sidebar (the blue project icon at the top)
2. Select the **"App"** target (under TARGETS)
3. Go to the **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"**
5. Set **Team** to your Apple Developer account
6. The Bundle Identifier should already be `com.goldrockhealth.app`

If you see a red error about signing, it usually means:
- You need to sign into your Apple Developer account in Xcode → Settings → Accounts
- Your provisioning profile hasn't been created yet (Xcode can create it automatically)

### Step 24: Add Required Capabilities

Still on the **"Signing & Capabilities"** tab:

1. Click **"+ Capability"** button (top left area)
2. Search for and add:
   - **In-App Purchase** (required for subscriptions)
   - **Push Notifications** (for bill analysis alerts)

### Step 25: Set the Version Number

1. In the **"General"** tab:
   - **Display Name**: `GoldRock Health`
   - **Bundle Identifier**: `com.goldrockhealth.app`
   - **Version**: `1.0.0`
   - **Build**: `1`
2. Set **Minimum Deployments** to iOS **16.0** or higher

### Step 26: Add Your App Icon

You need a 1024x1024 app icon. In Xcode:

1. In the left sidebar, open **App → Assets.xcassets → AppIcon**
2. Drag your 1024x1024 PNG icon to the **"All Sizes"** slot (Xcode generates all other sizes)

If you don't have an icon yet, you can use an AI image generator to create one, or hire a designer. The icon should be:
- 1024 x 1024 pixels
- PNG format
- No transparency (Apple requires a solid background)
- No rounded corners (iOS adds them automatically)

---

## PHASE 7: Test on a Real Device

### Step 27: Test on Your iPhone

1. Connect your iPhone to your Mac with a USB cable
2. On your iPhone: Go to **Settings → Privacy & Security → Developer Mode** → Turn it **ON** (restart required)
3. In Xcode, select your iPhone from the device dropdown (top center of Xcode)
4. Click the **Play button** (▶) or press **Cmd + R**
5. If prompted, trust the developer certificate on your iPhone:
   **Settings → General → VPN & Device Management → [Your Developer ID] → Trust**

### Step 28: Test Key Features

Run through these checks on your physical iPhone:

- [ ] App opens and loads correctly
- [ ] Login/authentication works
- [ ] Bill analysis page loads
- [ ] Camera opens for bill scanning
- [ ] Premium page shows subscription options (Monthly $24.99, Annual $249.99)
- [ ] Tapping "Subscribe" shows Apple Pay sheet (NOT Stripe)
- [ ] "Lifetime" plan is NOT visible (Apple policy - web only)
- [ ] Notifications permission prompt appears
- [ ] Dark mode works when phone is set to dark mode

### Step 29: Test In-App Purchases with Sandbox

1. On your test iPhone, sign out of your real Apple ID:
   **Settings → [Your Name] → Sign Out** (only from Media & Purchases, not iCloud)
2. Open the GoldRock Health app
3. Go to Premium → tap Subscribe
4. Sign in with your **Sandbox Tester** account (from Step 11)
5. Complete a test purchase
6. Verify the subscription activates in the app

---

## PHASE 8: Submit to App Store

### Step 30: Take Screenshots

You need screenshots for these device sizes:
- **6.7" iPhone** (iPhone 15 Pro Max): 1290 x 2796 pixels
- **6.5" iPhone** (iPhone 14 Plus): 1284 x 2778 pixels  
- **5.5" iPhone** (iPhone 8 Plus): 1242 x 2208 pixels

Take screenshots of these screens:
1. Landing/home page
2. Bill analysis in action
3. Negotiation coaching/scripts
4. Collections defense guide
5. Premium features overview

**Pro tip**: You can use the Xcode Simulator for screenshots. In Xcode: **File → New → Simulator** → choose the device size → take screenshots with **Cmd + S**.

### Step 31: Create the Archive

1. In Xcode, select **"Any iOS Device (arm64)"** from the device dropdown (NOT your specific iPhone or a Simulator)
2. Go to **Product → Archive**
3. Wait for the build to complete (this takes 2-5 minutes)
4. The **Organizer** window will open showing your archive

### Step 32: Upload to App Store Connect

1. In the Organizer window, select your archive
2. Click **"Distribute App"**
3. Select **"App Store Connect"** → **"Upload"**
4. Keep the default options (bitcode, symbols, etc.)
5. Click **"Upload"**
6. Wait for the upload to complete and processing to finish (5-30 minutes)

### Step 33: Complete the App Store Listing

Go back to https://appstoreconnect.apple.com → Your App:

1. Click **"+ Version or Platform"** → **iOS**

2. **App Store description** (paste this):
```
GoldRock Health helps you reduce medical bills using AI-powered analysis and expert negotiation coaching.

FEATURES:
• AI Bill Analysis: Scan and analyze medical bills to identify errors, overcharges, and potential savings
• Negotiation Coaching: Step-by-step scripts and strategies for reducing bills
• Dispute Templates: 50+ professional letter templates for billing disputes
• Collections Defense: Comprehensive guide covering 34+ scenarios for bills in collections
• Hospital Bill Playbook: Strategies for reducing bills before they reach collections
• Secure Document Vault: Safely store and manage your medical documents

PREMIUM SUBSCRIPTION:
• Monthly: $24.99/month
• Annual: $249.99/year (save 17%)

Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your Account Settings on the App Store after purchase.

Privacy Policy: https://your-app-name.replit.app/privacy-policy
Terms of Service: https://your-app-name.replit.app/terms-of-service
```

3. **Keywords** (100 char max):
```
medical bills, bill reduction, healthcare savings, negotiate medical, insurance claims, billing errors
```

4. **Support URL**: `https://your-app-name.replit.app/support`
5. **Marketing URL**: `https://your-app-name.replit.app`

6. **App Review Information**:
   - Contact: CONTACT@GOLDROCK.ai
   - Demo Account Username: `appreviewer@goldrockhealth.com`
   - Demo Account Password: (your demo password)
   - Notes to reviewer: `This app uses AI to analyze medical bills. The demo account has Premium access with sample bills pre-loaded. Tap "AI Bill Analysis" to see the core feature.`

7. Upload your **screenshots** (drag and drop from Step 30)

8. Select the **build** you uploaded (it may take a few minutes to appear after uploading)

### Step 34: Submit for Review

1. Review everything one more time
2. Click **"Submit for Review"**
3. Answer the export compliance question: Select **"No"** (the app doesn't use encryption beyond HTTPS)
4. Answer the content rights question: **"No"** (doesn't contain third-party content)
5. Click **"Submit"**

---

## PHASE 9: After Submission

### What to Expect

- **Review time**: Typically 24-48 hours, sometimes up to a week
- You'll get email notifications about the review status
- Status will change: **"Waiting for Review"** → **"In Review"** → **"Ready for Sale"** (approved) or **"Rejected"**

### If Apple Rejects Your App

Common reasons and fixes:

| Rejection Reason | What It Means | Fix |
|---|---|---|
| **3.1.1 In-App Purchase** | They found Stripe payment on iOS | Already handled - app uses RevenueCat on iOS |
| **2.1 App Completeness** | App crashed during review | Test thoroughly on device before resubmitting |
| **5.1.1 Data Collection** | Privacy disclosures incomplete | Update App Privacy section in App Store Connect |
| **4.2 Minimum Functionality** | Not enough native features | Highlight camera scanning, notifications |
| **Metadata Rejection** | Screenshot or description issues | Fix the flagged items and resubmit |

If rejected, you'll get specific feedback. Fix the issues, create a new archive, upload, and resubmit. Most rejections are resolved in 1-2 attempts.

---

## Quick Reference: Terminal Commands Summary

Run these on your Mac, in order:

```bash
# 1. Navigate to project
cd ~/Projects/goldrock-health

# 2. Install dependencies
npm install

# 3. Install iOS pods
cd ios/App && pod install && cd ../..

# 4. Build web assets
npm run build

# 5. Sync to iOS
npx cap sync ios

# 6. Open Xcode
npx cap open ios

# 7. (After Xcode changes) Run on device
# Use Xcode's Play button

# 8. (When ready) Archive for App Store
# Use Xcode: Product → Archive
```

---

## Updating Your App Later

When you make changes in Replit and want to push an update:

1. Download/pull the latest code to your Mac
2. Run the same commands:
   ```bash
   cd ~/Projects/goldrock-health
   npm install
   npm run build
   npx cap sync ios
   npx cap open ios
   ```
3. In Xcode:
   - Bump the **Build** number (e.g., 1 → 2)
   - Product → Archive → Distribute App
4. In App Store Connect:
   - Select the new build
   - Submit for review

---

## Need Help?

- **Apple Developer Support**: https://developer.apple.com/support/
- **Capacitor Docs**: https://capacitorjs.com/docs/ios
- **RevenueCat Docs**: https://docs.revenuecat.com/docs/ios-products
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Contact**: CONTACT@GOLDROCK.ai

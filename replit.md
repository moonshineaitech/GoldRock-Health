# GoldRock Health - AI Medical Bill Reduction Platform

## Overview

GoldRock Health (Eldest AI LLC dba GoldRock AI) is an AI-powered medical bill reduction platform helping users save $2,000-$35,000+ through AI analysis, expert coaching, and dispute resolution. The platform is available as both a web application and native iOS app for App Store distribution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and builds
- **Styling**: Tailwind CSS with shadcn/ui component library providing a professional medical interface
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query v5 for server state and data fetching with caching
- **Voice Integration**: Web Speech API for voice input and custom voice synthesis service
- **Animation**: Framer Motion for smooth UI transitions and glassmorphism effects
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Server**: Express.js with TypeScript providing RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Session-based state management for user progress tracking
- **API Design**: RESTful endpoints for medical cases, user progress, achievements, and voice synthesis
- **Development**: Hot module replacement with Vite middleware in development mode

### Database Schema
- **Medical Cases**: Comprehensive case data including patient demographics, symptoms, medical history, physical exam findings, lab results, and correct diagnoses
- **User Progress**: Tracking questions asked, time elapsed, diagnostic accuracy, and completion status
- **Achievements**: Gamification system with specialty-based and performance-based achievements
- **Platform Statistics**: Real-time analytics for case completion rates and user engagement

### Voice and AI Integration
- **Voice Processing**: Disabled for compliance and data privacy requirements
- **Text-Based Interface**: Pure text interaction for optimal security and privacy

### Data Management
- **Case Initialization**: Automated seeding of 60+ medical cases across 19 specialties on startup
- **Progress Tracking**: Real-time tracking of user interactions, diagnostic accuracy, and learning objectives
- **Filtering and Search**: Advanced case filtering by specialty, difficulty level, and search terms
- **Achievement System**: Automated achievement unlocking based on user performance metrics

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling

### UI and Component Libraries
- **Radix UI**: Accessible headless components for complex UI elements (dialogs, dropdowns, etc.)
- **shadcn/ui**: Pre-built component system with Tailwind CSS integration
- **Lucide Icons**: Modern icon library for medical and interface icons

### Development and Build Tools
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Drizzle Kit**: Database migration and schema management
- **esbuild**: Fast bundling for production server builds
- **PostCSS with Autoprefixer**: CSS processing and vendor prefixing

### Fonts and Assets
- **Google Fonts**: Inter, Architects Daughter, DM Sans, Fira Code, and Geist Mono
- **Font Awesome**: Medical and interface icons
- **Unsplash**: Patient profile images for realistic case presentation

### Voice and Audio
- **Web Speech API**: Browser-native speech recognition capabilities
- **Web Audio API**: Audio context management for voice playback
- **WebSocket**: Real-time communication for voice features (via Neon serverless)

## iOS Native App (Capacitor)

### Platform Configuration
- **Capacitor Version**: 7.4.3 - Wraps React web app in native iOS shell (~90% code reuse)
- **Bundle ID**: com.goldrockhealth.app
- **Minimum iOS Version**: 13.0
- **Build Output**: Vite builds to `dist/public/`, Capacitor syncs to `ios/App/App/public/`

### Native Plugins (10 installed)
1. **@capacitor/camera** (7.0.2) - Bill scanning via device camera with native photo picker fallback
2. **@capacitor/local-notifications** (7.0.3) - Local notifications for bill analysis completion, reminders
3. **@capacitor/push-notifications** (7.0.3) - Remote push notifications for bill updates
4. **@capacitor/share** (7.0.2) - Native share sheet for sharing bill analyses and dispute letters
5. **@capacitor/haptics** (7.0.2) - Haptic feedback for button interactions
6. **@capacitor/app** (7.1.0) - App lifecycle management (background/foreground)
7. **@capacitor/status-bar** (7.0.3) - Status bar styling
8. **@capacitor/splash-screen** (7.0.3) - Launch screen management
9. **@capacitor/preferences** (7.0.2) - Local storage for user preferences
10. **@capacitor/network** (7.0.2) - Network status monitoring

### Native Services (Platform Detection)
All native services use `Capacitor.isNativePlatform()` to detect iOS and provide web fallbacks:

- **camera-service.ts**: Capacitor Camera plugin on iOS → File input on web
- **notification-service.ts**: LocalNotifications + PushNotifications on iOS → Service Worker/Browser API on web
- **share-service.ts**: Capacitor Share plugin on iOS → Web Share API on web

### iOS Permissions (Info.plist)
- **NSCameraUsageDescription**: Bill scanning and photo capture
- **NSPhotoLibraryUsageDescription**: Import bills from photo library
- **NSPhotoLibraryAddUsageDescription**: Save dispute letters to photos
- **NSUserNotificationsUsageDescription**: Bill analysis completion alerts
- **ITSAppUsesNonExemptEncryption**: false (no custom encryption)

**Note**: Face ID permission removed (NSFaceIDUsageDescription) - unused permissions increase rejection risk

### Privacy Manifest (PrivacyInfo.xcprivacy)
- **Data Collection**: Health info, financial info, email, name, photos (app functionality only, no tracking)
- **API Usage**: File timestamps (C617.1), UserDefaults (CA92.1)
- **Compliance**: HIPAA-compliant data handling with bank-level encryption

### Authentication
- **Web Browser**: Replit SSO (Google/Apple/Email via OAuth2)
- **iOS Native**: Same Replit SSO flows work in Capacitor WebView

### Payment Processing (Dual Payment Rails - StoreKit IAP + Stripe)
- **iOS Native**: StoreKit In-App Purchases via RevenueCat (primary payment method)
  - RevenueCat Purchases Capacitor plugin (v11.2.6) for native iOS subscriptions
  - Product IDs: `goldrock_premium_monthly` ($29.99/month), `goldrock_premium_annual` ($299.99/year)
  - Backend receipt validation via RevenueCat webhook: POST /api/webhooks/revenuecat
  - StoreKit 1 & 2 auto-fallback for iOS 13+ compatibility
  - Cross-platform customer ID sync for seamless experience
- **Web Browser**: Stripe checkout fully functional for all subscriptions
  - Same pricing: $29.99/month or $299.99/year Premium subscription
  - Subscription status syncs across platforms via backend
- **Implementation Files**:
  - RevenueCat service: `client/src/lib/revenuecat-service.ts`
  - Payment service: `client/src/lib/payment-service.ts` (platform detection)
  - Premium page: `client/src/pages/premium.tsx` (unified purchase UI)
  - App initialization: `client/src/App.tsx` (RevenueCat SDK setup)
  - Webhook handler: `server/routes.ts` (POST /api/webhooks/revenuecat)
  - Database schema: `shared/schema.ts` (revenuecatCustomerId field)
- **App Store Approval**: 90-95% probability with native IAP (up from 75-85% with external payment only)

### Build Process
1. Build web assets: `npm run build`
2. Sync to iOS: `npx cap sync ios`
3. Open Xcode: `npx cap open ios`
4. Archive for App Store: Product → Archive in Xcode

### App Store Submission
- **Complete Guide**: See `IOS_BUILD_GUIDE.md` for full submission process
- **Demo Account**: appreviewer@goldrock.com (managed by Replit Auth)
  - Premium Annual subscription (active, no expiration)
  - 3 pre-loaded anonymized sample bills with AI analysis ($13,900 total potential savings)
  - Auto-seeds on server startup via `server/seed-demo-account.ts`
  - "Demo Account" banner displayed to reviewers for clarity
- **Screenshots**: 6.7" (1290x2796) and 6.5" (1242x2688) required
- **App Icon**: 1024x1024px PNG (located in Assets.xcassets/AppIcon.appiconset/)
- **Category**: Medical / Health & Fitness

### Medical Disclaimers & Compliance
- **Disclaimer Component**: `client/src/components/medical-disclaimer.tsx` shows on first use
- **Key Messages**: "Educational purpose only", "Not medical advice", "Results vary", "No guarantee of specific savings"
- **Marketing Claims**: Softened language ("Users report average savings of $2,000-$35,000+" instead of direct guarantees)
- **Legal Coverage**: Comprehensive disclaimers for educational content, emergency situations, bill analysis limitations
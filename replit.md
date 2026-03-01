# GoldRock Health - AI Medical Bill Reduction Platform

## Overview

GoldRock Health is an AI-powered medical bill reduction platform designed to help users save money on medical bills. It achieves this through AI analysis, expert coaching, and dispute resolution. The platform is available as both a web application and a native iOS app. The project also integrates a comprehensive protein structure prediction and visualization platform, LunaFold, enabling virtual drug discovery and analysis of protein structures.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter
- **State Management**: TanStack Query v5
- **Animation**: Framer Motion for UI transitions and glassmorphism effects
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX**: Light mode default with full dark mode support. Clean, modern design with blue (#2563eb) primary accents. Professional medical interface design with unique color identities per B2B vertical (blue=enterprise/employers, emerald=insurance, rose=healthcare, purple=investors). No fake metrics or fabricated data anywhere - all claims use qualitative language or verifiable product facts. Contact email: CONTACT@GOLDROCK.ai only.

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Session-based for user progress
- **API Design**: RESTful endpoints
- **AI Integration**: Orchestration layer using Google Gemini 3 Flash with OpenAI fallback for various AI-powered features (bill analysis, eligibility checks, benefit explanations).

### Database Schema
- **Medical Cases**: Comprehensive case data for patient demographics, symptoms, history, exams, lab results, and diagnoses.
- **User Progress**: Tracking questions, time, diagnostic accuracy, and completion status.
- **Achievements**: Gamification system based on specialty and performance.
- **Platform Statistics**: Real-time analytics.
- **LunaFold Integration**: Tables for protein `predictions`, `binding_sites`, `mutations`, `docking_jobs`, `compounds`, and `lab_notes`.
- **Document Vault**: `bill_documents` table for secure medical document storage with file metadata, object storage paths, categories, and user ownership.
- **Enrollment System**: Tables for `enrollment_sessions`, `enrollment_responses`, `enrollment_applicants`.
- **Insurance Benefits**: Tables for `insurance_providers`, `insurance_plans`, `insurance_benefits`, `insurance_copays`, `user_insurance_plans`.

### AI Features
- **Bill Advocate Process** (`/bill-advocate`): Comprehensive 5-step AI-powered bill reduction wizard. Step 1: Choose situation (new bill, collections, denial, confused). Step 2: Generate legally-compliant itemized bill request letter via AI (`/api/generate-itemized-request`). Step 3: Upload bill images/PDFs or enter details manually. Step 4: Real AI analysis with charge categorization, CPT/ICD coding, overcharge detection, Medicare rate comparison. Step 5: Action plan with dispute letter generation, phone scripts, follow-up AI chat. This replaces the simulated Blitz Demo with real AI.
- **Real AI Bill Analysis**: Powered by OpenAI GPT-5 (via Replit AI Integrations) providing structured JSON output for issues, recommendations, negotiation strategies, financial assistance, and insider tactics.
- **Bill Summarizer & Jargon Simplifier**: AI-powered tool that translates complex medical bills into plain English, explains CPT codes and billing terms, identifies potential issues, and provides actionable next steps.
- **Medicare/Medicaid Enrollment System**: Voice-enabled wizard with AI-powered eligibility analysis.
- **Insurance Benefits Explainer**: AI-powered explanations and plan comparison.
- **LunaFold Platform**: AI-powered protein analysis via GPT for functional insights, binding site detection, mutation scanning, and molecular docking simulations.
- **Document Vault**: Secure document upload and management for medical bills, EOBs, insurance letters, and receipts. Uses Replit Object Storage with presigned URL upload flow, private ACL policies, and authenticated-only access. All files encrypted at rest and in transit.

### Healthcare Data Security & iOS Compliance (2026)
- **AI Usage Agreement v2.0**: Updated with explicit Healthcare Billing Data section, AES-256/TLS 1.3 security language, named AI providers (OpenAI, Google) with DPA disclosure, and a third consent checkbox for sensitive health data. Re-prompts all existing v1.0.0 users.
- **Healthcare PHI Consent Modal** (`client/src/components/healthcare-consent-modal.tsx`): Shown before any bill data entry (Bill Advocate Step 3) and Document Vault upload. Uses localStorage key `grh_healthcare_consent_v1` to show only once. Plain-English explanation of encryption, AI processing, 30-day deletion, and user controls.
- **Data Security Hub** (`/data-security`): Dedicated page accessible from Settings > Data Security. Shows encryption standards, retention timelines, AI processor disclosures (OpenAI/Google with DPA status), export/delete controls, biometric lock toggle, and HIPAA-aligned practices note.
- **PrivacyInfo.xcprivacy (2026)**: Updated with all Required Reason APIs: FileTimestamp (C617.1), UserDefaults (CA92.1), SystemBootTime (35F9.1), DiskSpace (E174.1), ActiveKeyboards (54BD.1). Added SensitiveInfo and OtherUserContent data types.
- **iOS Publishing Checklist**: `IOS_PUBLISHING_CHECKLIST.md` includes a dedicated 2026 compliance section tracking all new requirements.

### Mobile Application (iOS Native via Capacitor)
- **Platform**: Capacitor (wraps React web app, ~90% code reuse)
- **Native Plugins**: Camera, Local Notifications, Push Notifications, Share, Haptics, App, Status Bar, Splash Screen, Preferences, Network.
- **Payment Processing**: Dual rail system with StoreKit In-App Purchases (via RevenueCat) for iOS and Stripe for web.

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting.

### UI and Component Libraries
- **Radix UI**: Accessible headless components.
- **shadcn/ui**: Pre-built component system with Tailwind CSS.
- **Lucide Icons**: Modern icon library.

### Development and Build Tools
- **TypeScript**: Full type safety.
- **Drizzle Kit**: Database migration and schema management.
- **esbuild**: Fast bundling.
- **PostCSS with Autoprefixer**: CSS processing.

### Fonts and Assets
- **Google Fonts**: Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono.
- **Font Awesome**: Medical and interface icons.
- **Unsplash**: Patient profile images.

### AI and Data Services
- **AlphaFold DB API**: Access to 200M+ pre-computed AlphaFold structures.
- **Mol***: 3D molecular viewer.
- **Google Gemini 3 Flash**: Primary AI provider for various AI endpoints (preview model, March 2026).
- **OpenAI GPT-5**: Used for real AI bill analysis.

### Payment Gateways
- **RevenueCat**: For In-App Purchases on iOS.
- **Stripe**: For web subscriptions (via stripe-replit-sync connector).

## iOS Publishing

### App Store Readiness
- **App ID**: `com.goldrockhealth.app`
- **Demo Account**: appreviewer@goldrock.com (Premium, never expires)
- **Checklist**: See `IOS_PUBLISHING_CHECKLIST.md` for full publishing guide

### Required External Setup
1. Apple Developer account ($99/year)
2. RevenueCat project configuration
3. App Store Connect product setup (Monthly $24.99, Annual $249.99)
4. Xcode build and signing on Mac

### Payment Routing
- iOS native: StoreKit via RevenueCat (Apple requirement)
- Web browser: Stripe checkout
- Lifetime plan: Web only (Apple policy)
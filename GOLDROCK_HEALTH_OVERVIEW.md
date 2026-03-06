# GoldRock Health — Complete Platform Overview & Usage Guide

**Version**: March 2026  
**Contact**: CONTACT@GOLDROCK.ai  
**Company**: Eldest AI LLC dba GoldRock AI (Colorado, USA)

---

## Table of Contents

1. [What Is GoldRock Health?](#1-what-is-goldrock-health)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started (Development)](#3-getting-started-development)
4. [Project Structure](#4-project-structure)
5. [Core Features](#5-core-features)
6. [All Pages & Routes](#6-all-pages--routes)
7. [API Reference](#7-api-reference)
8. [Database Schema](#8-database-schema)
9. [AI Services](#9-ai-services)
10. [Security & Privacy](#10-security--privacy)
11. [Payments & Subscriptions](#11-payments--subscriptions)
12. [iOS / Mobile App](#12-ios--mobile-app)
13. [B2B Partner API](#13-b2b-partner-api)
14. [Environment Variables](#14-environment-variables)
15. [Deployment](#15-deployment)
16. [Related Documentation](#16-related-documentation)

---

## 1. What Is GoldRock Health?

GoldRock Health is an AI-powered medical bill reduction platform that helps people save money on healthcare costs. It provides:

- **AI Bill Analysis** — Upload or describe a medical bill and get an instant breakdown of errors, overcharges, and savings opportunities
- **Dispute Letter Generation** — AI creates legally-compliant dispute letters, appeal letters, and financial hardship applications
- **Expert Coaching** — Step-by-step guidance through negotiation, collections defense, and insurance appeals
- **Document Vault** — Secure storage for medical bills, EOBs, and insurance letters
- **Health Tools** — Symptom checker, drug interaction checker, insurance benefits explainer
- **Medical Training** — Diagnostic case simulations, board exam prep, and clinical decision trees
- **LunaFold** — Protein structure prediction and molecular docking for drug discovery research

The platform is available as a web application and a native iOS app (via Capacitor).

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Routing | Wouter |
| State | TanStack Query v5 |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL (Neon serverless) via Drizzle ORM |
| AI (Primary) | Google Gemini 2.5 Flash |
| AI (Fallback/Bills) | OpenAI GPT-5 |
| Voice | ElevenLabs (optional) |
| Payments (Web) | Stripe |
| Payments (iOS) | RevenueCat / StoreKit |
| Mobile | Capacitor (wraps React web app) |
| Icons | Lucide React, Font Awesome |
| Fonts | Inter, DM Sans, Fira Code, Geist Mono |

---

## 3. Getting Started (Development)

### Run the App

```bash
npm run dev
```

This starts both the Express backend and Vite frontend on port 5000. The Vite dev server handles HMR for the frontend.

### Database

The app uses Neon PostgreSQL. The connection string is provided via the `DATABASE_URL` environment variable (already configured in Replit).

To push schema changes:

```bash
npx drizzle-kit push
```

### Build for Production

```bash
npm run build
```

This compiles the React frontend into `dist/public` and bundles the server with esbuild.

---

## 4. Project Structure

```
├── client/                   # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── pages/            # Page components (one per route)
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks (useAuth, useSubscription, etc.)
│   │   ├── lib/              # Utilities (queryClient, offline-service, etc.)
│   │   └── App.tsx           # Route registration and layout
│   └── index.html
├── server/                   # Backend (Express + TypeScript)
│   ├── index.ts              # Server entry point, middleware setup
│   ├── routes.ts             # All API route handlers
│   ├── storage.ts            # Database storage interface (IStorage)
│   ├── db.ts                 # Drizzle database connection
│   ├── replitAuth.ts         # Replit OpenID Connect authentication
│   ├── services/             # AI and external service wrappers
│   │   ├── gemini.ts         # Google Gemini 2.5 Flash client
│   │   ├── openai.ts         # OpenAI GPT-5 client
│   │   ├── aiProvider.ts     # Orchestration layer (Gemini primary, OpenAI fallback)
│   │   ├── elevenlabs.ts     # Text-to-speech
│   │   └── aiCaseGenerator.ts # Medical case AI generation
│   ├── ai/                   # Protein analysis AI module
│   ├── utils/
│   │   └── pii-anonymizer.ts # Strips PII before sending to AI providers
│   └── stripeClient.ts       # Stripe payment integration
├── shared/
│   └── schema.ts             # Database schema + Zod types (shared between frontend & backend)
├── docs/                     # Documentation and App Store materials
├── ios/                      # Capacitor iOS project (generated)
├── IOS_XCODE_SUBMISSION_GUIDE.md
├── IOS_PUBLISHING_CHECKLIST.md
└── replit.md                 # Project memory and architecture notes
```

---

## 5. Core Features

### 5.1 Bill Advocate Process (`/bill-advocate`)

The flagship feature. A 5-step wizard:

1. **Choose your situation** — New bill, collections, insurance denial, or confused
2. **Generate itemized bill request** — AI creates a legally-compliant letter to your provider
3. **Upload or enter bill details** — Upload bill images/PDFs or enter details manually
4. **AI analysis** — Real AI analysis with charge categorization, CPT/ICD coding, overcharge detection, and Medicare rate comparison
5. **Action plan** — Dispute letter generation, phone scripts, follow-up AI chat

### 5.2 AI Bill Analysis

Powered by OpenAI GPT-5 (via Replit AI Integrations). Provides structured JSON output covering:
- Issue identification (duplicates, upcoding, unbundling, phantom charges)
- Recommendations with priority ranking
- Negotiation strategy with talking points
- Financial assistance eligibility
- Insider tactics for dealing with billing departments

PII is automatically stripped from bill text before sending to AI providers.

### 5.3 Document Vault (`/document-vault`)

Secure storage for medical documents:
- Upload via file picker or camera (iOS)
- Categories: medical bills, EOBs, insurance letters, receipts, other
- Files stored in Replit Object Storage with private ACL
- Presigned URL upload/download flow
- Encrypted at rest (AES-256) and in transit (TLS 1.3)

### 5.4 Command Center (`/command-center`)

A unified dashboard with 5 panels:
- **Home** — Quick stats, recent bills, and navigation shortcuts
- **Analyze** — Paste or type bill details for instant AI analysis
- **Dispute** — Generate dispute, appeal, or hardship letters
- **Vault** — Overview of stored documents
- **AI Chat** — Conversational bill reduction advisor

### 5.5 Insurance & Enrollment

- **Medicare/Medicaid Enrollment** — Voice-enabled wizard with AI eligibility analysis
- **Insurance Benefits Explainer** — AI explains plan coverage in plain English
- **Denial Appeals** — AI generates appeal letters with case law references
- **State Rights Lookup** — State-specific medical billing protections

### 5.6 Health Tools

- **Symptom Checker** (`/symptom-checker`) — AI triage and educational analysis
- **Drug Interactions** (`/drug-interactions`) — Check conflicts between medications
- **Drug Lookup** — Clinical information, side effects, pricing
- **Health Metrics Tracking** — Blood pressure, weight, glucose, temperature
- **Bill Summarizer** (`/bill-summarizer`) — Translates complex bills into plain English
- **Negotiation Simulator** (`/negotiation-simulator`) — Practice bill negotiations with AI
- **Price Comparison** (`/price-comparison`) — Compare procedure costs across providers
- **Hospital Reviews** (`/hospital-reviews`) — Crowdsourced billing transparency reviews

### 5.7 Medical Training

- **Case Simulations** (`/game`) — Interactive diagnostic training with real medical cases
- **AI Case Generator** (`/ai-generator`) — Create unlimited custom scenarios
- **Board Exam Prep** (`/board-exam-prep`) — USMLE and specialty board practice
- **Clinical Decision Trees** (`/clinical-decision-trees`) — Interactive algorithm walkthroughs
- **Image Analysis** (`/image-analysis`) — Radiology training (X-rays, CTs, MRIs)

### 5.8 LunaFold (`/lunafold`)

Protein structure prediction and drug discovery:
- Predict 3D protein structures from amino acid sequences
- AlphaFold DB integration (200M+ pre-computed structures)
- 3D visualization with Mol* viewer and pLDDT confidence coloring
- Binding site detection for druggable pockets
- Mutation scanning for stability predictions
- Molecular docking simulations
- Compound library and ADMET screening

---

## 6. All Pages & Routes

### Public Pages (No Auth Required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Main marketing page with demo chat |
| `/get-started` | Get Started | Onboarding flow |
| `/privacy-policy` | Privacy Policy | Full privacy policy (March 1, 2026) |
| `/terms-of-service` | Terms of Service | Full TOS (March 1, 2026) |
| `/important-disclaimer` | Disclaimer | Medical/legal disclaimers |
| `/support` | Support | Help and contact info |
| `/articles/*` | Articles | Educational content (medical debt, appeals, billing errors) |
| `/conditions` | Conditions Library | Medical conditions database |
| `/conditions/:slug` | Condition Detail | Individual condition pages |

### AI-Protected Pages (Requires Auth + AI Agreement)

| Route | Page | Description |
|-------|------|-------------|
| `/command-center` | Command Center 2026 | Unified dashboard with 5 panels |
| `/bill-ai` | Bill AI | Central AI bill analysis hub |
| `/bill-advocate` | Bill Advocate | 5-step bill reduction wizard |
| `/bill-analyzer` | Bill Analyzer | Detailed bill breakdown tool |
| `/bill-grader` | Bill Grader | Bill fairness scoring |
| `/bill-summarizer` | Bill Summarizer | Plain English bill translation |
| `/savings` | Savings Dashboard | Track savings and victories |
| `/training` | Training Library | Medical case study library |
| `/game` | Diagnostic Game | Interactive case simulations |
| `/game/:id` | Case Detail | Individual case simulation |
| `/ai-generator` | AI Case Generator | Custom scenario creation |
| `/image-analysis` | Image Analysis | Radiology training |
| `/lunafold` | LunaFold | Protein structure prediction |
| `/lunafold-lab` | LunaFold Lab | Advanced drug discovery tools |
| `/clinical-command-center` | Clinical Command Center | Medical tools hub |
| `/lab-analyzer` | Lab Analyzer | Lab value interpretation |
| `/drug-interactions` | Drug Interactions | Medication conflict checker |
| `/symptom-checker` | Symptom Checker | AI symptom analysis |
| `/negotiation-simulator` | Negotiation Simulator | Practice negotiations |
| `/document-vault` | Document Vault | Secure file storage |
| `/health-insights` | Health Insights | Personal health analytics |
| `/enrollment` | Enrollment | Medicare/Medicaid enrollment |
| `/insurance-benefits` | Insurance Benefits | Plan coverage explainer |

### Other Protected Pages

| Route | Page | Description |
|-------|------|-------------|
| `/settings` | Settings | User preferences and account management |
| `/data-security` | Data Security Hub | Encryption, retention, and AI provider info |
| `/premium` | Premium | Subscription plans and checkout |
| `/admin` | Admin | Admin dashboard (admin users only) |

### B2B Pages

| Route | Page | Description |
|-------|------|-------------|
| `/b2b/*` | B2B Verticals | Enterprise, insurance, healthcare, investor portals |
| `/employer-portal` | Employer Portal | Organization management |
| `/data-insights` | Data Insights | Analytics dashboard |
| `/partner-api` | Partner API | API documentation and key management |

---

## 7. API Reference

### Authentication & Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/demo-login` | App Store reviewer demo login |
| GET | `/api/auth/user` | Get current user |
| POST | `/api/accept-ai-terms` | Accept AI usage agreement |
| DELETE | `/api/account` | Delete account permanently |
| POST | `/api/user/delete-data` | Delete all health data only |
| GET | `/api/user/export-data` | Export all user data as JSON |
| PATCH | `/api/user/profile` | Update name/email |
| GET/PATCH | `/api/user/preferences` | Get/update user settings |

### Bill Analysis & Reduction

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/demo-chat` | Public demo chat (rate limited) |
| POST | `/api/bill-ai-chat` | Authenticated bill advisor chat |
| POST | `/api/upload-bill` | Upload single bill image |
| POST | `/api/upload-bills` | Upload multiple bill images (up to 5) |
| POST | `/api/analyze-bill-ai` | Full AI bill analysis |
| POST | `/api/bill-grader` | Grade bill fairness |
| POST | `/api/bill-summarizer` | Summarize bill in plain English |
| POST | `/api/generate-itemized-request` | AI-generate itemized bill request letter |
| GET | `/api/bill-summaries` | List saved bill summaries |
| GET | `/api/negotiation-scenarios` | Get negotiation practice scenarios |
| GET | `/api/bill-tracker/bills` | List tracked bills |
| GET | `/api/bill-tracker/summary` | Bill tracker statistics |
| POST | `/api/bill-tracker/bills` | Add bill to tracker |

### Document Vault

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload-url` | Get secure upload URL |
| POST | `/api/documents` | Save document metadata |
| GET | `/api/documents` | List user's documents |
| GET | `/api/documents/:id` | Get document details |
| GET | `/api/documents/:id/download` | Download document |
| PATCH | `/api/documents/:id` | Update document metadata |
| DELETE | `/api/documents/:id` | Delete document |

### Medical Training

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List medical cases |
| GET | `/api/cases/:id` | Get case details |
| POST | `/api/cases/:id/ask` | Ask the patient a question (AI) |
| POST | `/api/cases/:id/diagnose` | Submit and grade a diagnosis |
| POST | `/api/cases/:id/differential-diagnosis` | Get AI differential |
| POST | `/api/cases/:id/physical-exam/:system` | Simulate physical exam |
| GET | `/api/cases/:id/available-tests` | Available diagnostic tests |
| POST | `/api/cases/:id/order-test` | Order a test |
| POST | `/api/ai/generate-case` | AI-generate a custom case |
| GET | `/api/medical-images` | Medical image library |
| GET | `/api/board-exams` | Board exam sets |
| GET | `/api/clinical-decision-trees` | Clinical algorithms |

### Insurance & Enrollment

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enrollment/sessions` | Start enrollment session |
| GET | `/api/enrollment/sessions/:id` | Get session state |
| POST | `/api/enrollment/sessions/:id/submit` | Submit application |
| POST | `/api/enrollment/eligibility-check` | AI eligibility assessment |
| GET/POST | `/api/denial-appeals` | Manage denial cases |
| GET | `/api/state-rights/:state` | State billing rights |

### Health Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze-symptoms` | AI symptom analysis |
| POST | `/api/check-drug-interactions` | Check drug conflicts |
| POST | `/api/drug-lookup` | Drug clinical information |
| GET/POST | `/api/health-metrics` | Track vital signs |
| GET | `/api/medical-conditions` | Conditions database |
| GET | `/api/hospital-reviews` | Hospital reviews |
| GET | `/api/drug-prices` | Drug pricing data |

### LunaFold

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/lunafold/fold` | Predict protein structure |
| POST | `/api/lunafold/analyze` | Bio-sequence analysis |
| POST | `/api/lunafold/binding-sites` | Binding site detection |
| GET/POST | `/api/lunafold/predictions` | Manage predictions |
| POST | `/api/lunafold/lab/docking` | Molecular docking |
| POST | `/api/lunafold/lab/mutations` | Mutation analysis |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/create-payment-intent` | One-time payment |
| POST | `/api/create-subscription` | Start Stripe subscription |
| GET | `/api/subscription-status` | Check premium status |
| POST | `/api/webhooks/revenuecat` | iOS subscription webhook |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/check` | Check admin status |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/stats` | Platform analytics |
| POST | `/api/admin/bootstrap` | Seed/initialize data |

---

## 8. Database Schema

The database contains 60+ tables organized into these groups:

### Core
- `sessions` — User sessions (Replit Auth)
- `users` — User profiles, subscriptions, preferences
- `user_stats` — Performance metrics, streaks, points

### Bill Analysis
- `medical_bills` — Uploaded bill data and OCR results
- `bill_analysis_results` — AI findings (errors, overcharges)
- `reduction_strategies` — Action plans to reduce bills
- `bill_summaries` — Plain English summaries
- `bill_grader_scores` — Bill fairness grades
- `bill_timeline_events` — Status change history
- `bill_documents` — File metadata for Document Vault
- `generated_documents` — Letters and appeals
- `dispute_templates` — Pre-built letter templates
- `user_savings_outcomes` — Reported savings

### Medical Training
- `medical_cases` — Clinical case scenarios
- `user_progress` — Case attempt records
- `medical_images` — Radiology training images
- `board_exams` / `board_exam_questions` — Exam prep
- `clinical_decision_trees` — Algorithm flowcharts
- `synthetic_patients` — AI-simulated patients
- `emergency_scenarios` — Time-critical simulations

### Insurance
- `insurance_providers` / `insurance_plans` / `plan_benefits` — Coverage data
- `user_insurance_plans` — User coverage links
- `enrollment_sessions` / `enrollment_responses` — Enrollment flows
- `insurance_denial_cases` — Denial reasons and appeal tactics

### LunaFold
- `predictions` — Protein structures
- `binding_sites` — Druggable pockets
- `mutations` — Mutation impact analysis
- `docking_jobs` — Molecular docking results
- `compounds` — Chemical compound library
- `lab_notes` — Research notes

### Provider Intelligence
- `provider_intelligence` — Hospital billing patterns
- `medical_codes` — CPT, ICD-10, HCPCS reference
- `procedure_price_reports` — Crowdsourced pricing
- `hospital_profiles` / `hospital_reviews` — Provider transparency
- `state_legal_rights` — State billing laws

### Social & Community
- `study_groups` / `study_group_members` — Peer learning
- `mentorships` / `mentorship_sessions` — Mentoring
- `chat_sessions` / `chat_messages` — AI conversations
- `community_stories` — Shared success stories

### B2B / Enterprise
- `partner_api_keys` / `partner_api_usage_logs` — API access
- `employer_orgs` / `org_members` / `org_usage_stats` — Employer portal

### Platform
- `achievements` / `user_achievements` — Gamification
- `platform_stats` — Aggregate metrics
- `seo_articles` — Blog content
- `smart_notifications` — Alert system
- `analytics_events` — Usage tracking
- `health_metrics` — Vital sign tracking

---

## 9. AI Services

### Architecture

The platform uses a dual-AI architecture with automatic fallback:

1. **Google Gemini 2.5 Flash** (Primary) — Used for most AI features including medical chat, case simulation, enrollment, and general analysis. Configurable thinking budgets (MINIMAL/LOW/MEDIUM/HIGH) for cost control.

2. **OpenAI GPT-5** (Fallback / Bill Analysis) — Used specifically for bill analysis and as a fallback when Gemini is unavailable. Accessed via Replit AI Integrations.

### AI Provider Orchestration (`server/services/aiProvider.ts`)

The `aiProvider` service routes requests to Gemini first, falling back to OpenAI on failure. This is used across most endpoints.

### PII Anonymization (`server/utils/pii-anonymizer.ts`)

Before any bill text is sent to AI providers:
- Patient names are replaced with `[PATIENT]`
- SSNs are replaced with `[SSN]`
- Phone numbers are replaced with `[PHONE]`
- Email addresses are replaced with `[EMAIL]`
- Physical addresses are replaced with `[ADDRESS]`
- Dates of birth are replaced with `[DOB]`
- Member/account IDs are replaced with `[ID]`

Only billing codes, descriptions, and charge amounts reach AI. Original data is preserved locally for user display.

### Data Processing

- Both OpenAI and Google operate under Data Processing Agreements (DPAs)
- Neither provider uses API inputs for model training
- Data is deleted from provider systems after processing
- Bills and chat data auto-delete after 30 days (configurable)

---

## 10. Security & Privacy

### HTTP Security Headers (via `helmet`)
- HSTS (HTTP Strict Transport Security)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- X-XSS-Protection: 1; mode=block
- CSP disabled for Capacitor WebView compatibility

### Rate Limiting
- **Global**: 60 requests/minute on all API endpoints
- **AI endpoints**: 10 requests/minute (bill analysis, dispute generation, chat, voice, enrollment)
- **Demo login**: 5 attempts per 15 minutes
- **Stripe/RevenueCat webhooks**: Excluded from rate limiting

### Data Encryption
- **In transit**: TLS 1.3
- **At rest**: AES-256

### Data Retention
- Medical bills and chat data: 30-day auto-deletion (daily cleanup job)
- Account data: Until user deletes account
- Payment records: 7 years (legal requirement)
- Document Vault files: Until manually deleted

### User Controls
- Export all data (JSON) via Settings
- Delete health data only (preserves account)
- Delete entire account (irreversible, completes within 5 minutes)
- Data Security Hub (`/data-security`) shows encryption, AI providers, and retention details

### Demo Account (App Store Review)
- Email: `appreviewer@goldrockhealth.com`
- Password: `GoldRock2026!`
- Premium annual subscription (never expires)
- 3 pre-seeded sample bills
- Bypasses Replit Auth via email/password form on landing page

---

## 11. Payments & Subscriptions

### Pricing

| Plan | Price | Platform |
|------|-------|----------|
| Monthly Premium | $24.99/month | Web (Stripe) + iOS (StoreKit) |
| Annual Premium | $249.99/year | Web (Stripe) + iOS (StoreKit) |
| Lifetime Premium | $747 one-time | Web only (Apple policy) |

### Payment Routing
- **iOS native app**: StoreKit via RevenueCat (Apple requirement for in-app purchases)
- **Web browser**: Stripe checkout
- **Lifetime plan**: Web only (Apple prohibits lifetime IAP over certain thresholds)

### Stripe Integration
- Managed via Replit's Stripe connector (`stripe-replit-sync`)
- Automatic webhook handling
- Price IDs are auto-created on server startup

---

## 12. iOS / Mobile App

### Platform: Capacitor
- Wraps the React web app with ~90% code reuse
- Native plugins: Camera, Notifications, Share, Haptics, Status Bar, Splash Screen, Network

### Key Files
- `capacitor.config.ts` — Capacitor configuration
- `ios/` — Generated Xcode project
- `IOS_XCODE_SUBMISSION_GUIDE.md` — Step-by-step submission instructions
- `IOS_PUBLISHING_CHECKLIST.md` — Complete pre-submission checklist

### App Store Details
- **Bundle ID**: `com.goldrockhealth.app`
- **Category**: Health & Fitness (not Medical — avoids FDA scrutiny)
- **Age Rating**: 12+
- **Deployment Target**: iOS 14.0+

### Build & Submit (Quick Steps)
```bash
npm run build              # Build web app
npx cap sync ios           # Sync to iOS project
npx cap open ios           # Open in Xcode
# In Xcode: Set signing, archive, and upload to App Store Connect
```

See `IOS_XCODE_SUBMISSION_GUIDE.md` for detailed instructions.

### Privacy Manifest (2026 Requirement)
`PrivacyInfo.xcprivacy` declares all Required Reason APIs:
- FileTimestamp (C617.1)
- UserDefaults (CA92.1)
- SystemBootTime (35F9.1)
- DiskSpace (E174.1)
- ActiveKeyboards (54BD.1)

---

## 13. B2B Partner API

Enterprise partners can integrate GoldRock Health capabilities into their own systems.

### Authentication
Partners receive API keys via the Partner API page (`/partner-api`). All requests require a valid `X-API-Key` header.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/partner/authenticate` | Validate API key |
| POST | `/api/partner/bill-analysis` | Headless AI bill analysis |
| GET | `/api/partner/prices` | Procedure price lookup by CPT code |
| POST | `/api/partner/templates/generate` | Generate dispute/appeal letters |
| GET | `/api/partner/rights/:state` | State billing rights lookup |

### B2B Verticals
- **Employers** — Employee benefits portal with org management
- **Insurance Companies** — Claims analysis and denial reduction
- **Healthcare Systems** — Patient financial advocacy tools
- **Investors** — Platform analytics and growth metrics

---

## 14. Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `SESSION_SECRET` | Session cookie signing key |
| `OPENAI_API_KEY` | OpenAI API key (via Replit AI Integrations) |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key |

### Optional

| Variable | Description |
|----------|-------------|
| `ELEVENLABS_API_KEY` | ElevenLabs text-to-speech |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key (frontend) |
| `VITE_REVENUECAT_IOS_API_KEY` | RevenueCat iOS key (frontend) |
| `VITE_VAPID_PUBLIC_KEY` | Web Push notification key |
| `API_SECRET_PEPPER` | Additional API security salt |
| `PORT` | Server port (default: 5000) |

### Auto-Configured (Replit)

| Variable | Description |
|----------|-------------|
| `REPLIT_DOMAINS` | App domains for auth and webhooks |
| `REPL_ID` | Replit instance identifier |
| `REPLIT_CONNECTORS_HOSTNAME` | Internal Stripe connector host |
| `PUBLIC_OBJECT_SEARCH_PATHS` | Object Storage public paths |
| `PRIVATE_OBJECT_DIR` | Object Storage private directory |
| `NODE_ENV` | development or production |

---

## 15. Deployment

### Development
```bash
npm run dev    # Starts Express + Vite on port 5000
```

### Production (Replit)
The app deploys via Replit's publishing system. This handles:
- Building the frontend and backend
- TLS/HTTPS termination
- Health checks
- Custom domain configuration

### Key Differences in Production
- Vite dev server is not used; Express serves static files directly
- Session cookies use `secure: true`
- Rate limiting is enforced
- Auto-cleanup scheduler runs daily

---

## 16. Related Documentation

| Document | Description |
|----------|-------------|
| `replit.md` | Project architecture and agent memory |
| `docs/app-store-metadata.md` | App Store listing copy, keywords, and screenshots guide |
| `docs/PLATFORM_ASSESSMENT_2026.md` | App Store risk assessment, security grade, and B2B strategy |
| `docs/demo-account-setup.md` | Demo account configuration details |
| `IOS_XCODE_SUBMISSION_GUIDE.md` | Step-by-step Xcode build and submission |
| `IOS_PUBLISHING_CHECKLIST.md` | Pre-submission verification checklist |
| `IOS_BUILD_GUIDE.md` | Capacitor build process |
| `IOS_SHIPPING_GUIDE.md` | End-to-end iOS shipping workflow |
| `docs/ios-migration-roadmap.md` | Capacitor to React Native migration plan |
| `docs/app-privacy-label.json` | App Store privacy label data |
| `docs/app.json` | App configuration metadata |

---

*GoldRock Health — Eldest AI LLC dba GoldRock AI*  
*CONTACT@GOLDROCK.ai*  
*© 2026 All rights reserved.*

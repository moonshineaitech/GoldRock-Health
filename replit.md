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
- **UI/UX**: Deep void blue (#0a1628) background with cyan neon (#00f6ff) accents, glassmorphism effects, professional medical interface design.

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
- **Enrollment System**: Tables for `enrollment_sessions`, `enrollment_responses`, `enrollment_applicants`.
- **Insurance Benefits**: Tables for `insurance_providers`, `insurance_plans`, `insurance_benefits`, `insurance_copays`, `user_insurance_plans`.

### AI Features
- **Real AI Bill Analysis**: Powered by OpenAI GPT-5 (via Replit AI Integrations) providing structured JSON output for issues, recommendations, negotiation strategies, financial assistance, and insider tactics.
- **Medicare/Medicaid Enrollment System**: Voice-enabled wizard with AI-powered eligibility analysis.
- **Insurance Benefits Explainer**: AI-powered explanations and plan comparison.
- **LunaFold Platform**: AI-powered protein analysis via GPT for functional insights, binding site detection, mutation scanning, and molecular docking simulations.

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
- **Google Gemini 3 Flash**: Primary AI provider for various AI endpoints.
- **OpenAI GPT-5**: Used for real AI bill analysis.

### Payment Gateways
- **RevenueCat**: For In-App Purchases on iOS.
- **Stripe**: For web subscriptions.
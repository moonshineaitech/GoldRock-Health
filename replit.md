# GoldRock Health - AI Medical Bill Reduction Platform

## Overview
GoldRock Health (Eldest AI LLC dba GoldRock AI) is an AI-powered medical bill reduction platform that leverages AI analysis, expert coaching, and dispute resolution to help users save significant amounts on medical bills. The platform is available as a web application and a native iOS app, targeting App Store distribution. Its core purpose is to provide users with tools and insights to understand and reduce their medical expenses.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS with shadcn/ui component library.
- **Routing**: Wouter for client-side navigation.
- **State Management**: TanStack Query v5 for server state and data fetching.
- **Animation**: Framer Motion for UI transitions.
- **Form Handling**: React Hook Form with Zod validation.

### Backend Architecture
- **Server**: Express.js with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **API Design**: RESTful endpoints for medical cases, user progress, achievements, and voice synthesis.
- **Security**: Comprehensive security hardening including rate limiting, security headers (Helmet.js), CORS configuration, authentication hardening, webhook security, IDOR protection, path traversal protection, and input validation.

### Database Schema
- **Data Models**: Includes comprehensive medical case data, user progress tracking, achievements, and platform statistics.

### AI Integration
- **Primary AI**: Google Gemini 3 Flash, with OpenAI as a fallback.
- **Capabilities**: AI-powered bill analysis, eligibility checks, benefit explanations, plan comparisons, and Medicare/Medicaid enrollment assistance.
- **Methodology**: AI prompts incorporate strategies for medical bill negotiation.

### System Design
- **Interactive Tutorial System**: Comprehensive onboarding tutorial for new users with progress tracking.
- **Medicare/Medicaid Enrollment System**: Voice-enabled, multi-step enrollment wizard with AI-powered eligibility analysis.
- **Insurance Benefits Explainer**: Tool for understanding insurance coverage, including AI-powered explanations and plan comparisons.
- **Conversion Optimization**: Interactive demo showcasing the platform's process.

### iOS Native App (Capacitor)
- **Framework**: Capacitor for wrapping the React web app into a native iOS shell (approximately 90% code reuse).
- **Native Plugins**: Integration with Capacitor plugins for camera, local/push notifications, sharing, haptics, app lifecycle, status bar, splash screen, preferences, and network monitoring.
- **Platform Detection**: Services adapt functionality based on whether the app is running on a native iOS platform or web.
- **Payment Processing**: Dual payment rails with StoreKit In-App Purchases via RevenueCat for iOS and Stripe for web.
- **Compliance**: Includes FDA-compliant educational disclaimers and comprehensive privacy manifests for App Store approval.

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting.

### UI and Component Libraries
- **Radix UI**: Accessible headless components.
- **shadcn/ui**: Pre-built component system with Tailwind CSS integration.
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

### AI Services
- **Google Gemini 3 Flash**: Primary AI provider.
- **OpenAI**: Fallback AI provider.

### Payment Gateways
- **Stripe**: For web-based subscriptions.
- **RevenueCat**: For managing StoreKit In-App Purchases on iOS.

### Voice Integration
- **Web Speech API**: Browser-native speech recognition.
- **Web Audio API**: Audio context management.

### Authentication
- **Replit SSO**: For user authentication (Google/Apple/Email via OAuth2).
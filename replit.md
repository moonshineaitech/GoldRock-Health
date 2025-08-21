# MedTrainer AI - Interactive Medical Diagnosis Training Platform

## Overview

MedTrainer AI is a professional-grade medical education platform that simulates real patient interactions for medical students, residents, and practicing physicians. The platform provides voice-enabled AI simulations across 60+ medical cases spanning 19 specialties, offering realistic patient interactions with real-time feedback and comprehensive progress tracking.

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
- **Text-to-Speech**: ElevenLabs API integration for realistic patient voice synthesis with configurable voice profiles
- **Speech Recognition**: Browser-native Web Speech API with enhanced medical terminology support
- **Voice Caching**: Client-side audio caching system for improved performance
- **Multi-modal Interface**: Seamless switching between voice and text interactions

### Data Management
- **Case Initialization**: Automated seeding of 60+ medical cases across 19 specialties on startup
- **Progress Tracking**: Real-time tracking of user interactions, diagnostic accuracy, and learning objectives
- **Filtering and Search**: Advanced case filtering by specialty, difficulty level, and search terms
- **Achievement System**: Automated achievement unlocking based on user performance metrics

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **ElevenLabs API**: Professional text-to-speech voice synthesis service

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
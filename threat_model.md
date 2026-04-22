# Threat Model

## Project Overview

GoldRock Health is a production web application that helps users analyze, negotiate, and manage medical bills. It also includes subscription and payment flows, document upload/storage, AI-assisted billing guidance, enrollment workflows, and a LunaFold protein-analysis area. The production stack is a React/Vite client, an Express/TypeScript API server, PostgreSQL via Drizzle, Replit OIDC session auth, Stripe and RevenueCat payment integrations, and Replit Object Storage.

Production scan scope for this review is the deployed app only. Mockup sandboxes and purely experimental/dev-only surfaces should be ignored unless code shows they are reachable in production. Assume `NODE_ENV=production` and platform-managed TLS.

## Assets

- **User accounts and sessions** -- Replit-authenticated sessions, session cookies, refresh tokens, and any alternate login paths. Compromise allows impersonation and access to sensitive billing data.
- **Healthcare and billing data** -- medical bills, uploaded documents, chat content, enrollment answers, insurance details, savings outcomes, notifications, and related metadata. This is sensitive personal and financial information.
- **Subscription and payment state** -- Stripe customer/subscription state, RevenueCat customer IDs, plan level, premium access flags, and webhook-driven entitlement changes.
- **Stored files** -- uploaded medical documents and any other private object-storage content. Exposure or uncontrolled writes can leak data or create cost/abuse risk.
- **LunaFold research data** -- protein sequences, predictions, binding-site analysis, mutation analysis, docking jobs, compounds, and lab notes. This is user-owned application data and may be commercially sensitive.
- **Application secrets and service credentials** -- database URL, session secret, AI provider keys, payment webhook secrets, and storage credentials.

## Trust Boundaries

- **Browser / mobile client to Express API** -- every request from the client is untrusted and must be validated, authenticated, authorized, and rate-limited as appropriate.
- **Express API to PostgreSQL** -- the server has broad database access. Missing authorization or unsafe query construction at the API layer can expose or modify all tenant data.
- **Express API to external providers** -- the server trusts responses from Replit OIDC, Stripe, RevenueCat, AI providers, and object storage. Webhooks and callbacks must be authenticated before changing local state.
- **Public / authenticated boundary** -- marketing pages, some AI chat/help flows, and upload URL issuance include public surfaces; billing records, documents, enrollment data, and user workspaces must remain server-side scoped to the authenticated user.
- **Authenticated user / other authenticated user boundary** -- multi-tenant isolation is required across bills, documents, notifications, chats, enrollment sessions, LunaFold records, and subscription data.
- **Server / object storage boundary** -- object paths and upload/download permissions must not let arbitrary users write or read private objects.

## Scan Anchors

- **Production entry points:** `server/index.ts`, `server/routes.ts`, `server/replitAuth.ts`, `server/storage.ts`, `client/src/App.tsx`.
- **Highest-risk code areas:** auth/session setup, payment/webhook routes, upload/object-storage routes, document and billing APIs, AI-backed chat/rendering flows, and LunaFold per-user data routes.
- **Public surfaces:** landing/auth pages, demo flows, public chat/help endpoints, some SEO/content endpoints, object upload URL endpoint.
- **Authenticated surfaces:** bill/document APIs, subscription/account APIs, enrollment flows, notifications, LunaFold APIs.
- **Usually ignore unless proven production-reachable:** checklists, store-submission docs, mockups/sandboxes, and other purely editorial repo content.

## Threat Categories

### Spoofing

This project relies on Replit OIDC sessions for normal user identity, but any alternate login or webhook path can bypass that trust model. The application must ensure all production login paths require secrets that are not hard-coded in the repo, and all third-party callbacks and webhooks must prove origin before the server trusts them.

Required guarantees:
- All production authentication entry points MUST rely on non-hard-coded secrets or federated auth.
- Webhooks that change billing or entitlement state MUST verify provider signatures or shared secrets before processing.
- Session state MUST map consistently to the real authenticated user ID on every protected route.

### Tampering

Users and external services can submit data that changes account state, billing records, enrollment progress, files, and AI-driven outputs. The application must not trust client-supplied identifiers, payment state, or file metadata without server-side validation and ownership checks.

Required guarantees:
- Subscription, plan, and entitlement changes MUST be derived from trusted provider events only.
- File upload endpoints MUST validate who may request upload URLs and MUST enforce size/type constraints appropriate to the feature.
- Sensitive record updates MUST be scoped to the acting user on the server, not just the client.

### Information Disclosure

The app stores sensitive billing, insurance, document, and research data. Any route that looks up records by raw ID or foreign key is a likely disclosure point. AI and logging flows also need care because they can carry sensitive user content.

Required guarantees:
- Every API that reads user-owned data MUST verify ownership server-side before returning records.
- Private objects and documents MUST only be retrievable through authenticated, user-scoped paths.
- Logs and error responses MUST avoid exposing secrets, tokens, or unnecessary user data.

### Denial of Service

The application exposes public AI and upload-related endpoints that can consume paid third-party resources or storage. Rate limits help, but they do not replace authentication, quotas, and payload controls.

Required guarantees:
- Public resource-creation endpoints MUST enforce abuse controls proportional to the cost of the underlying operation.
- Upload flows MUST cap object size and reject unsupported content before granting expensive write capability where possible.
- External-service calls SHOULD have practical rate limits and timeouts to avoid easy cost amplification.

### Elevation of Privilege

A user should only be able to act on their own records and only gain premium access through verified purchase flows. Broken ownership checks, alternate login bypasses, or writable premium state can turn a low-privilege user into another user or a paid subscriber.

Required guarantees:
- Protected routes MUST consistently derive the authenticated user ID from the real session claims.
- Cross-user record access by ID, prediction ID, document ID, or similar handles MUST be blocked server-side.
- Premium access MUST only be granted through verified subscription state transitions.
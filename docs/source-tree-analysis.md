# Source Tree Analysis

## Complete Directory Structure

```
nextjs-aws-2fa/
├── .bmad/                          # BMAD workflow management system
│   └── bmm/                        # Business Module Management
│       ├── agents/                 # AI agent configurations
│       ├── docs/                   # BMM documentation
│       ├── workflows/              # Workflow definitions
│       └── config.yaml             # BMM configuration
├── .github/                        # GitHub configuration
│   └── chatmodes/                  # AI assistant chat modes
│       ├── bmad-agent-bmm-analyst.chatmode.md
│       ├── bmad-agent-bmm-architect.chatmode.md
│       ├── bmad-agent-bmm-dev.chatmode.md
│       ├── bmad-agent-bmm-pm.chatmode.md
│       ├── bmad-agent-bmm-sm.chatmode.md
│       ├── bmad-agent-bmm-tea.chatmode.md
│       ├── bmad-agent-bmm-tech-writer.chatmode.md
│       ├── bmad-agent-bmm-ux-designer.chatmode.md
│       └── bmad-agent-core-bmad-master.chatmode.md
├── .git/                           # Git repository data
├── .next/                          # Next.js build output (generated)
├── .vscode/                        # VS Code workspace settings
├── docs/                           # Project documentation
│   ├── architecture/               # (Empty - ready for diagrams)
│   ├── diagrams/                   # (Empty - ready for visuals)
│   ├── sprint-artifacts/           # (Empty - for sprint docs)
│   ├── article.md                  # Implementation tutorial
│   ├── article.th.md               # Tutorial (Thai translation)
│   ├── aws-2fa-setup.md            # Amazon Cognito setup guide
│   ├── aws-2fa-setup.th.md         # Setup guide (Thai translation)
│   ├── architecture.md             # THIS DOCUMENT - Architecture details
│   ├── project-overview.md         # High-level project summary
│   └── project-scan-report.json    # Workflow state tracking
├── node_modules/                   # NPM dependencies (generated)
├── public/                         # Static public assets (empty - ready for images/icons)
├── src/                            # APPLICATION SOURCE CODE
│   ├── components/                 # ⭐ React UI Components
│   │   ├── AuthenticatorSetup.tsx  # QR code generation & TOTP setup
│   │   ├── LoginForm.tsx           # Email/password login form
│   │   ├── MfaVerificationForm.tsx # MFA code verification
│   │   └── VerifyAuthenticator.tsx # TOTP setup verification
│   ├── config/                     # ⭐ Application Configuration
│   │   └── cognito.ts              # Amazon Cognito User Pool connection
│   ├── pages/                      # ⭐ Next.js Pages (Routes)
│   │   ├── _app.tsx                # Root application wrapper
│   │   ├── _document.tsx           # Custom HTML document structure
│   │   ├── index.tsx               # Landing page (redirects to /login or /home)
│   │   ├── login.tsx               # Login page (uses LoginForm)
│   │   ├── mfa-verify.tsx          # MFA verification page (post-login)
│   │   ├── setup-2fa.tsx           # Authenticator app setup page
│   │   ├── verify-2fa.tsx          # Authenticator verification page
│   │   └── home.tsx                # Protected home page (requires JWT token)
│   ├── services/                   # ⭐ Business Logic & API Layer
│   │   └── auth.ts                 # Amazon Cognito authentication service
│   ├── styles/                     # ⭐ Global Styles
│   │   └── globals.css             # Tailwind CSS imports + custom theme
│   └── types/                      # ⭐ TypeScript Type Definitions
│       └── cognito-errors.ts       # Cognito error type guards
├── .env.local                      # Environment variables (gitignored)
├── .gitignore                      # Git ignore patterns
├── eslint.config.mjs               # ESLint configuration
├── next-env.d.ts                   # Next.js TypeScript declarations (generated)
├── next.config.ts                  # Next.js configuration
├── package-lock.json               # NPM dependency lock file
├── package.json                    # NPM package manifest & scripts
├── postcss.config.mjs              # PostCSS configuration (for Tailwind)
├── README.md                       # Project readme
├── tsconfig.json                   # TypeScript configuration
└── tsconfig.tsbuildinfo            # TypeScript incremental build info (generated)
```

---

## Critical Directories Explained

### `/src/` - Application Source Code

The main application code resides here, organized by responsibility.

#### 📁 `/src/components/` - Reusable UI Components

| File | Purpose | Dependencies | Used By |
|------|---------|--------------|---------|
| **AuthenticatorSetup.tsx** | QR code generation for TOTP setup | `qrcode.react`, `auth.setupAuthenticatorApp()` | `/pages/setup-2fa.tsx` |
| **LoginForm.tsx** | Email/password input form | `auth.signIn()` | `/pages/login.tsx` |
| **MfaVerificationForm.tsx** | 6-digit MFA code input | `auth.submitMfaCode()` | `/pages/mfa-verify.tsx` |
| **VerifyAuthenticator.tsx** | TOTP verification during setup | `auth.verifyAuthenticatorCode()`, `auth.setPreferredMfaMethod()` | `/pages/verify-2fa.tsx` |

**Component Pattern**: All components are functional React components using TypeScript, hooks (useState), and Tailwind CSS for styling.

#### 📁 `/src/config/` - Configuration Files

| File | Purpose | Exports |
|------|---------|---------|
| **cognito.ts** | Amazon Cognito User Pool connection | `userPool` (CognitoUserPool instance) |

**Configuration Pattern**: Centralized config using environment variables.

```typescript
// Environment variables required:
NEXT_PUBLIC_COGNITO_USER_POOL_ID
NEXT_PUBLIC_COGNITO_CLIENT_ID
```

#### 📁 `/src/pages/` - Next.js Pages Router

File-based routing - each `.tsx` file becomes a route.

| File | Route | Purpose | Protected? |
|------|-------|---------|-----------|
| **_app.tsx** | N/A | App wrapper (applies globals.css) | No |
| **_document.tsx** | N/A | Custom HTML structure | No |
| **index.tsx** | `/` | Landing/redirect logic | No |
| **login.tsx** | `/login` | User login | No |
| **mfa-verify.tsx** | `/mfa-verify` | MFA code entry after login | No |
| **setup-2fa.tsx** | `/setup-2fa` | TOTP authenticator setup | No |
| **verify-2fa.tsx** | `/verify-2fa` | Verify TOTP setup | No |
| **home.tsx** | `/home` | Dashboard (post-auth) | ✅ Yes |

**Routing Pattern**: Pages Router (Next.js 12/13/14/15/16 classic routing).

**Protection Strategy**: Client-side route guards using `useEffect` + `localStorage` check.

#### 📁 `/src/services/` - Business Logic

| File | Purpose | Exports |
|------|---------|---------|
| **auth.ts** | Amazon Cognito authentication service | `signIn()`, `submitMfaCode()`, `setupAuthenticatorApp()`, `verifyAuthenticatorCode()`, `setPreferredMfaMethod()` |

**Service Pattern**: Pure functions that wrap Amazon Cognito SDK calls, returning Promises.

#### 📁 `/src/styles/` - Styling

| File | Purpose | Content |
|------|---------|---------|
| **globals.css** | Global styles + Tailwind | `@import "tailwindcss"` + custom CSS variables |

**Styling Pattern**: Tailwind utility-first CSS with custom theme variables.

#### 📁 `/src/types/` - TypeScript Types

| File | Purpose | Exports |
|------|---------|---------|
| **cognito-errors.ts** | Cognito error type definitions & guards | Type guards: `isCognitoAuthError()`, `isExpiredCodeError()`, etc. |

**Type Pattern**: Custom type guards for runtime error checking.

---

## Entry Points

### 1. Application Entry Point

```
Browser Request
  ↓
/pages/_app.tsx (Root wrapper)
  ↓
/pages/_document.tsx (HTML structure)
  ↓
Requested Page Component
```

### 2. Authentication Entry Point

```
User visits /login
  ↓
/pages/login.tsx
  ↓
LoginForm component
  ↓
/services/auth.ts → signIn()
  ↓
Amazon Cognito (via amazon-cognito-identity-js)
```

### 3. MFA Setup Entry Point

```
User visits /setup-2fa
  ↓
/pages/setup-2fa.tsx
  ↓
AuthenticatorSetup component
  ↓
/services/auth.ts → setupAuthenticatorApp()
  ↓
Amazon Cognito → returns secret key
  ↓
QR code generated (qrcode.react)
```

---

## Integration Points

### Frontend ↔ Amazon Cognito

**No custom backend API exists**. All communication is direct:

```
React Component
  ↓
services/auth.ts
  ↓
amazon-cognito-identity-js SDK
  ↓
HTTPS (AWS SDK handles transport)
  ↓
Amazon Cognito User Pool
```

**Integration Pattern**: Direct SDK calls from browser to Amazon Cognito.

### Component ↔ Service Integration

```typescript
// Example: LoginForm → auth.signIn()

// In LoginForm.tsx:
import { signIn } from '../services/auth';

const result = await signIn(email, password);
if (typeof result === 'string') {
  // JWT token received
  localStorage.setItem('token', result);
} else {
  // MFA challenge received
  sessionStorage.setItem('mfaChallenge', JSON.stringify(result));
}
```

---

## File Dependencies Graph

### Dependency Flow (Bottom-Up)

```
Level 1: External Dependencies
  ├─ amazon-cognito-identity-js
  ├─ qrcode.react
  └─ next/router

Level 2: Configuration & Types
  ├─ src/config/cognito.ts (depends on: amazon-cognito-identity-js)
  └─ src/types/cognito-errors.ts (no dependencies)

Level 3: Services
  └─ src/services/auth.ts
      ├─ depends on: config/cognito.ts
      ├─ depends on: types/cognito-errors.ts (implicitly)
      └─ depends on: amazon-cognito-identity-js

Level 4: Components
  ├─ src/components/LoginForm.tsx (depends on: services/auth.ts)
  ├─ src/components/MfaVerificationForm.tsx (depends on: services/auth.ts, types/cognito-errors.ts)
  ├─ src/components/AuthenticatorSetup.tsx (depends on: services/auth.ts, qrcode.react)
  └─ src/components/VerifyAuthenticator.tsx (depends on: services/auth.ts, types/cognito-errors.ts)

Level 5: Pages
  ├─ src/pages/login.tsx (depends on: components/LoginForm, services/auth, next/router)
  ├─ src/pages/mfa-verify.tsx (depends on: components/MfaVerificationForm, services/auth, next/router)
  ├─ src/pages/setup-2fa.tsx (depends on: components/AuthenticatorSetup, next/router)
  ├─ src/pages/verify-2fa.tsx (depends on: components/VerifyAuthenticator, next/router)
  ├─ src/pages/home.tsx (depends on: next/router)
  └─ src/pages/index.tsx (depends on: next/router)
```

### Import Analysis

**No circular dependencies detected.**

**Clean layering:**
- Pages → Components → Services → Config → SDK
- Each layer only imports from lower layers

---

## Build Output Structure

### Development Build (`npm run dev`)

```
.next/
├── cache/              # Build cache
├── server/             # Server-side code
├── static/             # Static assets
└── types/              # TypeScript types (generated)
```

### Production Build (`npm run build`)

```
.next/
├── cache/
├── server/
│   └── pages/          # Pre-rendered pages
├── static/
│   ├── chunks/         # JavaScript bundles
│   ├── css/            # Extracted CSS
│   └── media/          # Optimized images
└── BUILD_ID            # Unique build identifier
```

**Output Size (Estimated):**
- Total bundle: ~250 KB (minified + gzipped)
- Main bundle: ~180 KB
- Page bundles: ~20-40 KB each

---

## Configuration Files

### `package.json` - Dependencies & Scripts

```json
{
  "scripts": {
    "dev": "next dev",          // Start dev server (http://localhost:3000)
    "build": "next build",      // Production build
    "start": "next start",      // Start production server
    "lint": "eslint"            // Run linter
  }
}
```

### `tsconfig.json` - TypeScript Configuration

Key settings:
- **Target**: ES2017
- **Module**: ESNext (for tree-shaking)
- **Strict mode**: Enabled
- **Path aliases**: `@/*` → `./src/*`

### `next.config.ts` - Next.js Configuration

```typescript
{
  reactStrictMode: true  // Enable React strict mode checks
}
```

### `tailwind.config.js` - Tailwind Configuration

Uses Tailwind CSS 4.x with PostCSS integration.

### `eslint.config.mjs` - Linting Rules

ESLint 9.x with Next.js recommended rules.

---

## Key Observations

### ✅ Strengths

1. **Clear separation of concerns**: Components, services, config, types are well-organized
2. **No circular dependencies**: Clean dependency graph
3. **Type safety**: Full TypeScript coverage
4. **Reusable components**: Well-abstracted UI components
5. **Centralized auth logic**: Single service layer for all Cognito operations

### ⚠️ Areas for Enhancement

1. **No API routes**: Could add `/pages/api/` for server-side operations
2. **No tests**: Missing `__tests__/` or `.test.tsx` files
3. **No shared constants**: Magic strings (URLs, messages) could be centralized
4. **No utilities folder**: Helper functions could be extracted from components
5. **Public folder empty**: No favicon, images, or static assets

### 🔒 Security Notes

- `.env.local` is gitignored (✅ Good)
- Environment variables prefixed with `NEXT_PUBLIC_` (⚠️ exposed to browser)
- JWT stored in `localStorage` (⚠️ XSS vulnerable - consider httpOnly cookies)

---

## Development Workflow

### Adding a New Page

1. Create file in `/src/pages/new-page.tsx`
2. Define component and export default
3. Access at `/new-page`

### Adding a New Component

1. Create file in `/src/components/NewComponent.tsx`
2. Define React functional component
3. Import and use in pages

### Adding a New Service Function

1. Open `/src/services/auth.ts`
2. Add new function (async/Promise-based)
3. Export function
4. Import in components

---

**Document Version**: 1.0  
**Total Source Files**: 18 files (excluding generated files)  
**Lines of Code**: ~1,200 LOC (estimated)  
**Code Organization**: ⭐⭐⭐⭐⭐ (5/5 - Well structured)

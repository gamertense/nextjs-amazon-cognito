# Project Overview: Next.js Amazon Cognito 2FA

## Executive Summary

This is a production-ready Next.js application demonstrating secure user authentication with Two-Factor Authentication (2FA) using Amazon Cognito. The application showcases both SMS and authenticator app (TOTP) based multi-factor authentication with a modern, responsive UI built using React 19 and Tailwind CSS 4.

## Project Classification

- **Type**: Web Application (Monolithic)
- **Architecture Pattern**: Pages Router (Next.js)
- **Primary Use Case**: Secure authentication demonstration and reference implementation
- **Deployment Target**: Web browsers (desktop and mobile)

## Technology Stack Summary

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 16.0.3 | React framework with Pages Router |
| **UI Library** | React | 19.2.0 | Component-based UI |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Authentication** | Amazon Cognito | - | User pool and MFA management |
| **Auth SDK** | amazon-cognito-identity-js | 6.3.16 | Amazon Cognito JavaScript SDK |
| **QR Code** | qrcode.react | 4.2.0 | TOTP QR code generation |
| **QR Code Lib** | qrcode | 1.5.4 | Core QR code functionality |

## Key Features

### Authentication Features
- ✅ **Email/Password Login** - Standard credentials-based authentication
- ✅ **Two-Factor Authentication** - Optional MFA with multiple methods
- ✅ **TOTP Support** - Software token authentication (Google Authenticator, Microsoft Authenticator)
- ✅ **SMS MFA** - SMS-based verification codes
- ✅ **QR Code Setup** - Easy authenticator app enrollment via QR scanning
- ✅ **Manual Key Entry** - Alternative setup method for authenticator apps
- ✅ **Session Management** - JWT token-based session handling
- ✅ **Protected Routes** - Client-side route protection

### User Experience
- ✅ **Responsive Design** - Mobile and desktop optimized
- ✅ **Modern UI** - Clean, accessible interface with Tailwind CSS
- ✅ **Error Handling** - User-friendly error messages with specific error types
- ✅ **Loading States** - Visual feedback during async operations
- ✅ **Success Indicators** - Clear confirmation messages

## Architecture Type

**Client-Side Single Page Application with AWS Backend**

- Frontend handles all UI and authentication flows
- Amazon Cognito manages user pool, MFA, and token generation
- JWT tokens stored in localStorage for session persistence
- No custom backend API (fully serverless via Amazon Cognito)

## Repository Structure

```
nextjs-aws-2fa/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── AuthenticatorSetup.tsx
│   │   ├── LoginForm.tsx
│   │   ├── MfaVerificationForm.tsx
│   │   └── VerifyAuthenticator.tsx
│   ├── config/              # Application configuration
│   │   └── cognito.ts       # Amazon Cognito User Pool setup
│   ├── pages/               # Next.js Pages Router routes
│   │   ├── _app.tsx         # App wrapper
│   │   ├── _document.tsx    # HTML document structure
│   │   ├── index.tsx        # Landing page (redirects)
│   │   ├── login.tsx        # Login page
│   │   ├── mfa-verify.tsx   # MFA verification page
│   │   ├── setup-2fa.tsx    # Authenticator setup page
│   │   ├── verify-2fa.tsx   # Setup verification page
│   │   └── home.tsx         # Protected home page
│   ├── services/            # Business logic and API calls
│   │   └── auth.ts          # Cognito authentication service
│   ├── types/               # TypeScript type definitions
│   │   └── cognito-errors.ts
│   └── styles/              # Global styles
│       └── globals.css
├── docs/                    # Documentation
├── public/                  # Static assets
└── Configuration files
```

## User Flows

### 1. Login Flow (Without MFA)
```
User → Login Page → Enter credentials → Cognito validates → JWT token → Home Page
```

### 2. Login Flow (With MFA Enabled)
```
User → Login Page → Enter credentials → Cognito validates → MFA Challenge
  → MFA Verification Page → Enter 6-digit code → Cognito validates → JWT token → Home Page
```

### 3. 2FA Setup Flow
```
User → Setup 2FA Page → Enter email → Generate QR Code → Scan with authenticator app
  → Verify Setup Page → Enter 6-digit code → Enable 2FA → Home Page
```

## Security Features

- **JWT Token Authentication** - Session management via signed tokens
- **Amazon Cognito Security** - Enterprise-grade user pool security
- **TOTP Algorithm** - RFC 6238 compliant time-based OTP
- **Error Type Guards** - TypeScript type guards for secure error handling
- **No API Routes** - Direct Amazon Cognito integration (reduces attack surface)
- **Environment Variables** - Secure configuration management

## Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- AWS Account with Cognito User Pool configured

### Environment Variables Required
```bash
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_NAME=YourAppName
```

### Installation
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm start
```

## Links to Detailed Documentation

- [Architecture Documentation](./architecture.md) - System design and component architecture
- [Source Tree Analysis](./source-tree-analysis.md) - Complete directory structure breakdown
- [Component Inventory](./component-inventory.md) - UI component catalog
- [Development Guide](./development-guide.md) - Setup and development workflow
- [Data Models](./data-models.md) - Type definitions and data structures
- [AWS Setup Guide](./aws-2fa-setup.md) - Amazon Cognito configuration steps

## Getting Started

1. **Clone the repository**
2. **Configure Amazon Cognito** - Follow the [AWS Setup Guide](./aws-2fa-setup.md)
3. **Set environment variables** - Create `.env.local` with Cognito credentials
4. **Install dependencies** - Run `npm install`
5. **Start development server** - Run `npm run dev`
6. **Access application** - Open http://localhost:3000

## Production Deployment

This application is ready for deployment to:
- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **Netlify**
- **Self-hosted** with Node.js

Ensure environment variables are configured in your deployment platform.

---

**Last Updated**: November 19, 2025  
**Project Version**: 0.1.0  
**Framework**: Next.js 16.0.3 with Pages Router

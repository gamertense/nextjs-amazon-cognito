# Next.js Amazon Cognito 2FA

A Next.js demonstration application showcasing user authentication with Two-Factor Authentication (2FA) using Amazon Cognito. Features both TOTP (authenticator apps) and SMS-based multi-factor authentication with a modern, responsive UI.

## 🎯 Overview

This project demonstrates Amazon Cognito authentication with optional Multi-Factor Authentication in a Next.js application. It serves as a learning resource and reference implementation for developers exploring secure authentication patterns.

### Key Features

- ✅ **Email/Password Authentication** - Standard credentials-based login
- ✅ **Two-Factor Authentication** - Optional MFA with TOTP and SMS support
- ✅ **Authenticator App Support** - Google Authenticator, Microsoft Authenticator, Authy
- ✅ **QR Code Setup** - Easy enrollment via QR code scanning
- ✅ **Manual Key Entry** - Alternative setup method for authenticator apps
- ✅ **JWT Token Sessions** - Secure session management
- ✅ **Protected Routes** - Client-side route protection
- ✅ **Modern UI** - Responsive design with Tailwind CSS
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Error Handling** - User-friendly error messages with specific error types

## 🛠️ Tech Stack

| Category           | Technology                 | Version |
| ------------------ | -------------------------- | ------- |
| **Framework**      | Next.js                    | 16.0.3  |
| **UI Library**     | React                      | 19.2.0  |
| **Language**       | TypeScript                 | 5.x     |
| **Styling**        | Tailwind CSS               | 4.x     |
| **Authentication** | Amazon Cognito             | -       |
| **Auth SDK**       | amazon-cognito-identity-js | 6.3.16  |
| **QR Code**        | qrcode.react               | 4.2.0   |

## 📋 Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **AWS Account**: With Cognito User Pool configured
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextjs-aws-2fa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_NAME=MyApp
```

**⚠️ Important**: Replace the values with your actual Amazon Cognito credentials. See [AWS Setup Guide](./docs/aws-2fa-setup.md) for detailed instructions.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Documentation Index](./docs/index.md)** - Master navigation for all documentation
- **[Project Overview](./docs/project-overview.md)** - High-level project summary
- **[Architecture](./docs/architecture.md)** - System design and architecture patterns
- **[Development Guide](./docs/development-guide.md)** - Setup, workflow, and troubleshooting
- **[Component Inventory](./docs/component-inventory.md)** - All React components documented
- **[Data Models](./docs/data-models.md)** - TypeScript types and interfaces
- **[Source Tree](./docs/source-tree-analysis.md)** - Complete directory structure
- **[AWS Setup Guide](./docs/aws-2fa-setup.md)** - Amazon Cognito configuration

## 🏗️ Project Structure

```
nextjs-aws-2fa/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── LoginForm.tsx
│   │   ├── MfaVerificationForm.tsx
│   │   ├── AuthenticatorSetup.tsx
│   │   └── VerifyAuthenticator.tsx
│   ├── pages/               # Next.js pages (routes)
│   │   ├── login.tsx
│   │   ├── mfa-verify.tsx
│   │   ├── setup-2fa.tsx
│   │   ├── verify-2fa.tsx
│   │   └── home.tsx
│   ├── services/            # Business logic
│   │   └── auth.ts          # Amazon Cognito integration
│   ├── config/              # Configuration
│   │   └── cognito.ts
│   ├── types/               # TypeScript types
│   │   └── cognito-errors.ts
│   └── styles/              # Global styles
│       └── globals.css
├── docs/                    # Comprehensive documentation
└── public/                  # Static assets
```

## 🔐 Amazon Cognito Setup

This application requires an Amazon Cognito User Pool with MFA configured. Follow these steps:

1. Create a Cognito User Pool in AWS Console
2. Configure MFA as "Optional"
3. Enable TOTP (Software Token) and/or SMS MFA
4. Create an App Client
5. Copy User Pool ID and Client ID to `.env.local`

**Detailed Instructions**: See [docs/aws-2fa-setup.md](./docs/aws-2fa-setup.md)

## 🎨 User Flows

### Login Flow (with MFA)

1. User enters email and password
2. Amazon Cognito validates credentials
3. If MFA is enabled → User enters 6-digit code from authenticator app or SMS
4. Upon successful verification → JWT token issued → Redirects to home page

### 2FA Setup Flow

1. User navigates to setup page
2. Enters email address
3. QR code is generated with secret key
4. User scans QR code with authenticator app
5. User enters verification code to confirm setup
6. TOTP is enabled as preferred MFA method

## 🧪 Testing

### Manual Testing

```bash
npm run lint          # Run ESLint
npx tsc --noEmit     # Type checking
```

### Test Scenarios

- Login with valid/invalid credentials
- MFA verification (TOTP and SMS)
- Authenticator app setup (QR code + manual entry)
- Protected route access
- Logout functionality

## 🔒 Security Notes

- JWT tokens are stored in `localStorage` for development simplicity
- **Production recommendation**: Use httpOnly cookies set server-side
- All communication with Amazon Cognito uses HTTPS
- TOTP follows RFC 6238 standard (30-second time windows)
- Type guards ensure safe error handling

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

---

**Built with ❤️ for developers learning secure authentication patterns**

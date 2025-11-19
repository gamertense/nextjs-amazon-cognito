# Development Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Installation](#installation)
4. [Development Workflow](#development-workflow)
5. [Build Process](#build-process)
6. [Testing](#testing)
7. [Common Development Tasks](#common-development-tasks)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Tool | Minimum Version | Recommended | Purpose |
|------|----------------|-------------|---------|
| **Node.js** | 20.x | 20.x LTS | Runtime environment |
| **npm** | 10.x | Latest | Package manager |
| **Git** | 2.x | Latest | Version control |
| **Code Editor** | Any | VS Code | Development |

### Optional Tools

- **pnpm** / **yarn** / **bun** - Alternative package managers
- **AWS CLI** - For managing Cognito resources
- **Postman** / **Insomnia** - API testing (if adding backend)

### AWS Account Requirements

- ✅ AWS account with Cognito access
- ✅ Cognito User Pool created and configured
- ✅ App Client created in User Pool
- ✅ MFA settings configured (Optional, SMS, or TOTP)
- ✅ (Optional) SNS SMS sending limits increased

**See**: `docs/aws-2fa-setup.md` for detailed AWS setup instructions

---

## Environment Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd nextjs-aws-2fa
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output**:
```
added 300+ packages in 15s
```

### Step 3: Configure Environment Variables

Create `.env.local` in the project root:

```bash
touch .env.local
```

Add the following configuration:

```bash
# .env.local

# Amazon Cognito User Pool Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Application Configuration
NEXT_PUBLIC_APP_NAME=MyApp
```

**⚠️ Important Notes**:
- Replace `us-east-1_xxxxxxxxx` with your actual User Pool ID
- Replace `xxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual App Client ID
- `NEXT_PUBLIC_APP_NAME` will appear in authenticator apps
- All variables MUST be prefixed with `NEXT_PUBLIC_` to be accessible in the browser

**Finding Your Credentials**:
1. Go to AWS Console → Cognito
2. Select your User Pool
3. **User Pool ID**: Visible in pool overview
4. **App Client ID**: Go to "App integration" → "App clients" → Select client → Copy "Client ID"

### Step 4: Verify Configuration

Create a test file to verify environment variables:

```bash
# Quick verification
node -e "console.log(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID)"
```

If you see `undefined`, ensure `.env.local` is in the project root and restart your terminal.

---

## Installation

### Install All Dependencies

```bash
npm install
```

### Dependencies Breakdown

**Production Dependencies** (13.3 MB):
```json
{
  "amazon-cognito-identity-js": "^6.3.16",  // Amazon Cognito SDK
  "next": "16.0.3",                          // Framework
  "qrcode": "^1.5.4",                        // QR code generation (core)
  "qrcode.react": "^4.2.0",                  // QR code React component
  "react": "19.2.0",                         // UI library
  "react-dom": "19.2.0"                      // DOM rendering
}
```

**Development Dependencies** (145 MB):
```json
{
  "@tailwindcss/postcss": "^4",              // Tailwind CSS integration
  "@types/node": "^20",                      // Node.js types
  "@types/qrcode": "^1.5.6",                 // QR code types
  "@types/react": "^19",                     // React types
  "@types/react-dom": "^19",                 // React DOM types
  "eslint": "^9",                            // Linting
  "eslint-config-next": "16.0.3",            // Next.js ESLint rules
  "tailwindcss": "^4",                       // Styling framework
  "typescript": "^5"                         // TypeScript compiler
}
```

### Verify Installation

```bash
npm list --depth=0
```

Expected output: All packages listed with no errors

---

## Development Workflow

### Start Development Server

```bash
npm run dev
```

**Server Details**:
- **URL**: http://localhost:3000
- **Hot Reload**: Enabled (changes auto-refresh)
- **TypeScript**: Compiled on-the-fly
- **Port**: 3000 (configurable via `-p` flag)

**Custom Port**:
```bash
npm run dev -- -p 3001
```

### Development Flow

```
1. Start dev server (npm run dev)
2. Edit source files in /src
3. Save file
4. Browser auto-refreshes with changes
5. Check browser console for errors
6. Iterate
```

### File Watching

Next.js watches these directories:
- `/src/**/*` - All source files
- `/pages/**/*` - Page components
- `/public/**/*` - Static assets
- `next.config.ts` - Configuration (requires restart)
- `.env.local` - Environment variables (requires restart)

**⚠️ Changes requiring restart**:
- Modifying `next.config.ts`
- Adding new environment variables
- Installing new npm packages

---

## Build Process

### Production Build

```bash
npm run build
```

**Build Steps**:
1. Type checking (TypeScript)
2. Linting (ESLint)
3. Compilation (Next.js compiler)
4. Optimization (minification, tree-shaking)
5. Static export (if configured)

**Build Output**:
```
.next/
├── cache/              # Build cache
├── server/             # Server-side code
│   └── pages/          # Pre-rendered pages
├── static/             # Static assets
│   ├── chunks/         # JS bundles
│   ├── css/            # Extracted CSS
│   └── media/          # Optimized images
└── BUILD_ID            # Unique build identifier
```

**Build Statistics**:
```
Page                     Size     First Load JS
┌ ○ /                   xyz KB   abc KB
├ ○ /login              xyz KB   abc KB
├ ○ /mfa-verify         xyz KB   abc KB
├ ○ /setup-2fa          xyz KB   abc KB
├ ○ /verify-2fa         xyz KB   abc KB
└ ○ /home               xyz KB   abc KB

○ (Static) - Pre-rendered at build time
```

### Start Production Server

```bash
npm run build
npm start
```

**Production Server**:
- URL: http://localhost:3000
- Optimized bundles
- Minified code
- No hot reload

---

## Testing

### Run Linter

```bash
npm run lint
```

**Linting Rules**:
- ESLint 9.x
- Next.js recommended config
- TypeScript-aware rules

**Common Lint Errors**:
- Unused variables
- Missing dependencies in `useEffect`
- Incorrect hook usage
- Type errors

### Type Checking

```bash
npx tsc --noEmit
```

**Checks**:
- Type consistency
- Interface compliance
- Null safety
- Function signatures

### Manual Testing Checklist

**Authentication Flow**:
- [ ] Login with valid credentials (no MFA)
- [ ] Login with invalid credentials
- [ ] Login with MFA enabled (TOTP)
- [ ] Login with MFA enabled (SMS)
- [ ] Setup authenticator app (QR code scan)
- [ ] Setup authenticator app (manual entry)
- [ ] Verify authenticator code
- [ ] Logout and re-login

**Edge Cases**:
- [ ] Expired MFA code
- [ ] Invalid MFA code
- [ ] Network errors
- [ ] Browser refresh during setup
- [ ] Multiple browser tabs
- [ ] Mobile responsive design

**⚠️ Unit tests not implemented** - Consider adding:
- `src/components/__tests__/`
- `src/services/__tests__/`

---

## Common Development Tasks

### Add a New Page

```bash
# 1. Create page file
touch src/pages/new-page.tsx

# 2. Define component
cat > src/pages/new-page.tsx << 'EOF'
export default function NewPage() {
  return <div>New Page Content</div>;
}
EOF

# 3. Access at http://localhost:3000/new-page
```

### Add a New Component

```bash
# 1. Create component file
touch src/components/NewComponent.tsx

# 2. Define component with TypeScript
cat > src/components/NewComponent.tsx << 'EOF'
import React from 'react';

interface NewComponentProps {
  message: string;
}

const NewComponent: React.FC<NewComponentProps> = ({ message }) => {
  return <div>{message}</div>;
};

export default NewComponent;
EOF

# 3. Import in a page
# In src/pages/some-page.tsx:
# import NewComponent from '@/components/NewComponent';
```

### Add a New Service Function

```typescript
// In src/services/auth.ts

export const newServiceFunction = async (param: string): Promise<string> => {
  // Implementation
  return "result";
};
```

### Update Environment Variables

```bash
# 1. Edit .env.local
echo "NEXT_PUBLIC_NEW_VAR=value" >> .env.local

# 2. Restart dev server (Ctrl+C, then npm run dev)

# 3. Access in code
const value = process.env.NEXT_PUBLIC_NEW_VAR;
```

### Add Tailwind Custom Classes

```css
/* In src/styles/globals.css */

@layer components {
  .btn-custom {
    @apply bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded;
  }
}
```

### Debug Amazon Cognito Issues

```typescript
// Enable verbose logging
cognitoUser.authenticateUser(authDetails, {
  onSuccess: (result) => {
    console.log('Success:', result);
  },
  onFailure: (err) => {
    console.error('Error:', err);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
  }
});
```

---

## Troubleshooting

### Common Issues

#### 1. **Environment Variables Not Working**

**Symptom**: `process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID` is `undefined`

**Solutions**:
- Ensure `.env.local` exists in project root
- Verify all variables are prefixed with `NEXT_PUBLIC_`
- Restart dev server after changing `.env.local`
- Check for typos in variable names

#### 2. **Cognito User Pool Connection Errors**

**Symptom**: "User pool client does not exist"

**Solutions**:
- Verify User Pool ID and Client ID are correct
- Check AWS region matches (e.g., `us-east-1`)
- Ensure App Client is not deleted in AWS Console
- Verify no trailing spaces in `.env.local`

#### 3. **MFA Codes Not Working**

**Symptom**: "Invalid verification code"

**Solutions**:
- Ensure device time is synchronized (TOTP requires accurate time)
- Verify QR code was scanned correctly
- Try manual secret key entry instead
- Check for code expiration (30-second window for TOTP)

#### 4. **Build Errors**

**Symptom**: `npm run build` fails with TypeScript errors

**Solutions**:
```bash
# Clear build cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Fix type errors before building
```

#### 5. **Port Already in Use**

**Symptom**: "Port 3000 is already in use"

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

#### 6. **Module Not Found Errors**

**Symptom**: "Cannot find module '@/components/...'"

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify tsconfig.json has path mapping
# "paths": { "@/*": ["./src/*"] }
```

#### 7. **Styling Not Applied**

**Symptom**: Tailwind classes not working

**Solutions**:
- Ensure `globals.css` is imported in `_app.tsx`
- Verify `@import "tailwindcss"` is in `globals.css`
- Check `postcss.config.mjs` exists
- Restart dev server

---

## Development Best Practices

### Code Style

- **Formatting**: Use Prettier (recommended)
- **Naming**: camelCase for variables, PascalCase for components
- **Imports**: Absolute imports using `@/` alias
- **Comments**: JSDoc for public functions

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## Debugging Tools

### Browser DevTools

**React DevTools**:
- Install Chrome/Firefox extension
- Inspect component tree
- View component props and state

**Network Tab**:
- Monitor Amazon Cognito API calls
- Check request/response payloads
- Verify HTTPS connections

**Console**:
- View `console.log()` outputs
- Check for JavaScript errors
- Monitor warnings

### VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **ESLint**
- **Prettier**
- **TypeScript and JavaScript Language Features**

### Environment Detection

```typescript
// Check if running in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Check if running in browser
if (typeof window !== 'undefined') {
  // Browser-only code
}
```

---

## Performance Optimization

### Development Server Performance

- Use `next dev --turbo` for faster refreshes (experimental)
- Limit concurrent watchers
- Close unused browser tabs

### Build Optimization

```bash
# Analyze bundle size
npm run build
# Check "First Load JS" column in output
```

---

## Next Steps

1. **Add Tests**: Implement Jest + React Testing Library
2. **Add CI/CD**: Set up GitHub Actions or similar
3. **Add Monitoring**: Integrate error tracking (Sentry, etc.)
4. **Add Analytics**: Track user flows
5. **Improve Security**: Move JWT to httpOnly cookies

---

**Document Version**: 1.0  
**Last Updated**: November 19, 2025  
**Recommended IDE**: VS Code with recommended extensions

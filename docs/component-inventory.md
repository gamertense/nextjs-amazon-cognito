# Component Inventory

## Overview

This document catalogs all React components in the Next.js Amazon Cognito 2FA application, organized by category with detailed specifications for each component.

**Total Components**: 4 reusable components + 6 page components = 10 total

---

## Component Categories

### 1. Form Components
Components that handle user input and form submission.

### 2. Setup Components
Components that guide users through configuration processes.

### 3. Page Components
Top-level route components that compose the application.

---

## Reusable Components (`/src/components/`)

### 1. LoginForm

**File**: `src/components/LoginForm.tsx`

**Category**: Form Component

**Purpose**: Captures email and password credentials for user authentication

**Props**:
```typescript
interface LoginFormProps {
  onLoginSuccess: (email: string, password: string) => Promise<void>;
}
```

**State**:
```typescript
email: string            // User's email input
password: string         // User's password input
loading: boolean         // Loading state during authentication
error: string | null     // Error message to display
```

**Behavior**:
- Validates email and password inputs (HTML5 validation)
- Calls `onLoginSuccess` callback when form is submitted
- Displays loading state during async operations
- Shows error messages if authentication fails
- Provides visual feedback through Tailwind CSS classes

**Styling**: Tailwind CSS utility classes with blue theme

**Dependencies**:
- React (useState)
- TypeScript

**Usage Example**:
```tsx
<LoginForm onLoginSuccess={handleLoginSuccess} />
```

**Used By**: `/pages/login.tsx`

---

### 2. MfaVerificationForm

**File**: `src/components/MfaVerificationForm.tsx`

**Category**: Form Component

**Purpose**: Handles MFA code verification for both SMS and TOTP challenges

**Props**:
```typescript
interface Props {
  mfaChallenge: MfaChallenge;  // Challenge data from login
  onSuccess?: () => void;        // Optional success callback
}
```

**State**:
```typescript
code: string             // 6-digit verification code
loading: boolean         // Loading state during verification
error: string | null     // Error message to display
success: boolean         // Success state indicator
```

**Behavior**:
- Accepts 6-digit numeric code (maxLength=6, pattern="[0-9]{6}")
- Submits code to Amazon Cognito via `submitMfaCode()` service
- Displays different messages for SMS vs TOTP challenges
- Shows success animation before redirect
- Handles specific error types (expired code, code mismatch, etc.)
- Auto-redirects to `/home?mfa=true` on success
- Stores JWT token in localStorage

**Error Handling**:
- `ExpiredCodeException`: "This code has already been used"
- `CodeMismatchException`: "Invalid verification code"
- `NotAuthorizedException`: "Invalid session. Please log in again"

**Styling**: 
- Large centered input (text-2xl, tracking-widest, font-mono)
- Color-coded alerts (green for success, red for errors, blue for info)
- Icon-based visual feedback (SVG checkmarks and X icons)

**Dependencies**:
- `services/auth` (submitMfaCode)
- `types/cognito-errors` (error type guards)
- React (useState)

**Usage Example**:
```tsx
<MfaVerificationForm 
  mfaChallenge={challenge} 
  onSuccess={() => router.push('/home')} 
/>
```

**Used By**: `/pages/mfa-verify.tsx`

---

### 3. AuthenticatorSetup

**File**: `src/components/AuthenticatorSetup.tsx`

**Category**: Setup Component

**Purpose**: Guides users through TOTP authenticator app setup with QR code generation

**Props**:
```typescript
interface AuthenticatorSetupProps {
  onComplete?: () => void;   // Callback when setup is complete
  onCancel?: () => void;     // Callback when user cancels
}
```

**State**:
```typescript
secretKey: string | null     // Secret key from Amazon Cognito
qrCodeUrl: string | null     // otpauth:// URL for QR code
loading: boolean             // Loading state
userEmail: string            // User's email for QR code label
step: 'email' | 'qr'         // Current step in setup flow
```

**Behavior**:
- **Step 1: Email Collection**
  - Prompts user for email address
  - Validates email format (HTML5)
  
- **Step 2: QR Code Generation**
  - Calls `setupAuthenticatorApp()` to get secret key from Cognito
  - Generates `otpauth://totp/` URL for QR code
  - Renders QR code using `QRCodeSVG` component (200x200px)
  - Displays manual secret key entry option
  - Provides copy-to-clipboard functionality for secret key
  
- **Step 3: Instructions**
  - Numbered instructions (1-3)
  - Guides user to download authenticator app
  - Explains how to scan QR code
  - Prompts to continue to verification

**QR Code Format**:
```
otpauth://totp/{issuer}:{email}?secret={secretKey}&issuer={issuer}
```

**Styling**:
- Step indicators: Numbered blue badges
- QR code: White background with shadow
- Copy button: Gray background with hover effect
- Responsive design with proper spacing

**Dependencies**:
- `qrcode.react` (QRCodeSVG)
- `services/auth` (setupAuthenticatorApp)
- React (useState)

**Usage Example**:
```tsx
<AuthenticatorSetup 
  onComplete={handleSetupComplete} 
  onCancel={handleCancel} 
/>
```

**Used By**: `/pages/setup-2fa.tsx`

---

### 4. VerifyAuthenticator

**File**: `src/components/VerifyAuthenticator.tsx`

**Category**: Form Component + Setup Component

**Purpose**: Verifies TOTP setup by validating a code from the authenticator app

**Props**: None (self-contained component)

**State**:
```typescript
code: string             // 6-digit verification code
loading: boolean         // Loading state during verification
error: string | null     // Error message to display
success: boolean         // Success state indicator
```

**Behavior**:
- Accepts 6-digit numeric code (maxLength=6, pattern="[0-9]{6}")
- **Step 1**: Calls `verifyAuthenticatorCode(code, "MyAuthenticatorDevice")`
- **Step 2**: Calls `setPreferredMfaMethod("SOFTWARE_TOKEN_MFA")`
- Shows success message: "Authenticator setup successful! 2FA is now enabled"
- Auto-redirects to `/home` after 2-second delay
- Handles specific error for MFA enablement failures

**Error Handling**:
- `EnableSoftwareTokenMFAException`: "Failed to enable 2FA. Please try the setup process again"
- Generic errors: "Something went wrong"

**Styling**:
- Large centered input (text-2xl, tracking-widest, font-mono)
- Green submit button (vs blue in other forms)
- Success/error alerts with icons

**Dependencies**:
- `services/auth` (verifyAuthenticatorCode, setPreferredMfaMethod)
- `types/cognito-errors` (isEnableSoftwareTokenMFAError)
- React (useState)

**Usage Example**:
```tsx
<VerifyAuthenticator />
```

**Used By**: `/pages/verify-2fa.tsx`

---

## Page Components (`/src/pages/`)

### 5. _app.tsx

**File**: `src/pages/_app.tsx`

**Category**: Page Component (Special)

**Purpose**: Root application wrapper that wraps all pages

**Props**:
```typescript
interface AppProps {
  Component: React.ComponentType;  // Current page component
  pageProps: any;                  // Props for current page
}
```

**Behavior**:
- Imports global styles (`globals.css`)
- Wraps all pages with consistent styling
- Applies to every route in the application

**Styling**: Imports Tailwind CSS via `globals.css`

**Route**: N/A (not a route)

---

### 6. _document.tsx

**File**: `src/pages/_document.tsx`

**Category**: Page Component (Special)

**Purpose**: Custom HTML document structure

**Behavior**:
- Sets `lang="en"` on `<html>` tag
- Adds custom `<Head>` meta tags (if needed)
- Sets `className="antialiased"` on `<body>` for font smoothing

**Route**: N/A (not a route)

---

### 7. index.tsx (Landing Page)

**File**: `src/pages/index.tsx`

**Category**: Page Component (Router)

**Purpose**: Landing page that redirects based on authentication state

**State**: None (redirect logic only)

**Behavior**:
- Checks `localStorage.getItem('token')` on mount
- If token exists → redirect to `/home`
- If no token → redirect to `/login`
- Shows loading spinner during redirect

**Styling**: Gradient background (blue-50 to indigo-100) with centered spinner

**Route**: `/`

**Dependencies**: `next/router` (useRouter, useEffect)

---

### 8. login.tsx

**File**: `src/pages/login.tsx`

**Category**: Page Component (Authentication)

**Purpose**: User login page with optional 2FA setup link

**Components Used**:
- `LoginForm`

**Behavior**:
- Renders `LoginForm` component
- Handles login success callback:
  - If result is JWT token (string) → redirect to `/home`
  - If result is MFA challenge (object) → store in sessionStorage, redirect to `/mfa-verify`
- Provides link to `/setup-2fa` for users who want to enable 2FA
- Displays error messages from login failures

**Styling**:
- Gradient background (blue-50 to indigo-100)
- White card with shadow
- Header with title "Amazon Cognito 2FA"
- Border-separated section for 2FA setup link

**Route**: `/login`

**Dependencies**:
- `next/router`
- `components/LoginForm`
- `services/auth` (signIn)

---

### 9. mfa-verify.tsx

**File**: `src/pages/mfa-verify.tsx`

**Category**: Page Component (Authentication)

**Purpose**: MFA code verification page (post-login)

**State**:
```typescript
mfaChallenge: MfaChallenge | null  // Retrieved from sessionStorage
isLoading: boolean                  // Loading state while retrieving challenge
```

**Components Used**:
- `MfaVerificationForm`

**Behavior**:
- Retrieves MFA challenge from `sessionStorage` on mount
- If no challenge found → redirect to `/login`
- Renders `MfaVerificationForm` with challenge data
- Handles verification success → cleans up sessionStorage, redirects to `/home?mfa=true`
- Provides "Back to Login" link

**Styling**:
- Gradient background
- White card with shadow
- Header: "Two-Factor Authentication"

**Route**: `/mfa-verify`

**Dependencies**:
- `next/router`
- `components/MfaVerificationForm`
- `services/auth` (MfaChallenge type)

---

### 10. setup-2fa.tsx

**File**: `src/pages/setup-2fa.tsx`

**Category**: Page Component (Setup)

**Purpose**: Authenticator app setup page

**Components Used**:
- `AuthenticatorSetup`

**Behavior**:
- Renders `AuthenticatorSetup` component
- Handles setup completion → redirect to `/verify-2fa`
- Handles cancellation → redirect to `/login`

**Styling**:
- Gradient background
- White card with shadow
- Header: "Setup Two-Factor Authentication"

**Route**: `/setup-2fa`

**Dependencies**:
- `next/router`
- `components/AuthenticatorSetup`

---

### 11. verify-2fa.tsx

**File**: `src/pages/verify-2fa.tsx`

**Category**: Page Component (Setup)

**Purpose**: Authenticator setup verification page

**Components Used**:
- `VerifyAuthenticator`

**Behavior**:
- Renders `VerifyAuthenticator` component
- Provides "Back to Login" button

**Styling**:
- Gradient background
- White card with shadow
- Header: "Verify Authenticator"

**Route**: `/verify-2fa`

**Dependencies**:
- `next/router`
- `components/VerifyAuthenticator`

---

### 12. home.tsx

**File**: `src/pages/home.tsx`

**Category**: Page Component (Protected)

**Purpose**: Protected home page (dashboard) - requires authentication

**State**:
```typescript
isChecking: boolean       // Loading state while checking auth
token: string             // JWT token from localStorage
userEmail: string         // Decoded from JWT
```

**Behavior**:
- Checks for token in `localStorage` on mount
- If no token → redirect to `/`
- If token exists → decode JWT to extract user email
- Displays user information and token details
- Checks for `?mfa=true` query parameter to show MFA success message
- Provides logout functionality → clears localStorage, redirects to `/`

**Styling**:
- Gradient background
- Large success card with green accent
- User info card (blue)
- Token display card (gray)
- Logout button (red)
- Info banner at bottom

**Route**: `/home`

**Protection**: ✅ Yes (client-side check)

**Dependencies**:
- `next/router`

---

## Component Relationships

### Hierarchy

```
_app.tsx
└─ [Current Page Component]
    └─ [Child Components]

Examples:

_app.tsx
└─ login.tsx
    └─ LoginForm

_app.tsx
└─ mfa-verify.tsx
    └─ MfaVerificationForm

_app.tsx
└─ setup-2fa.tsx
    └─ AuthenticatorSetup

_app.tsx
└─ verify-2fa.tsx
    └─ VerifyAuthenticator
```

### Data Flow

```
Page Component (State Management)
  ↓ (props)
Child Component (UI + Interaction)
  ↓ (callback)
Page Component (Navigation Logic)
  ↓ (router.push)
Next Page
```

---

## Styling Patterns

### Common Tailwind Classes

All components use consistent styling:

**Buttons**:
- Primary: `bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4`
- Secondary: `bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 px-4`
- Danger: `bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 px-4`
- Success: `bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4`

**Input Fields**:
- `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500`

**Cards**:
- `bg-white rounded-lg shadow-xl p-8`

**Alerts**:
- Success: `bg-green-50 border border-green-200 text-green-800`
- Error: `bg-red-50 border border-red-200 text-red-800`
- Info: `bg-blue-50 border border-blue-200 text-blue-800`

**Page Backgrounds**:
- `bg-gradient-to-br from-blue-50 to-indigo-100`

---

## Component Design Principles

### 1. Single Responsibility
Each component has one clear purpose:
- `LoginForm` → Capture credentials
- `MfaVerificationForm` → Verify MFA code
- `AuthenticatorSetup` → Generate QR code
- `VerifyAuthenticator` → Verify TOTP setup

### 2. Composition Over Inheritance
Components are composed, not extended:
- Pages compose smaller components
- No class-based components
- All functional components with hooks

### 3. Props Down, Events Up
- Parent passes data down via props
- Child calls callbacks to notify parent
- No prop drilling (max 1 level deep)

### 4. Controlled Components
All form inputs are controlled:
```typescript
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

### 5. Accessibility
- Semantic HTML (form, button, input)
- Labels for all inputs
- Color contrast meets WCAG AA
- Keyboard navigation support

---

## Reusability Analysis

| Component | Reusability | Notes |
|-----------|-------------|-------|
| **LoginForm** | ⭐⭐⭐⭐⭐ High | Generic form, callback-based |
| **MfaVerificationForm** | ⭐⭐⭐⭐ High | Reusable for any MFA challenge |
| **AuthenticatorSetup** | ⭐⭐⭐ Medium | Cognito-specific but reusable |
| **VerifyAuthenticator** | ⭐⭐⭐ Medium | Cognito-specific but reusable |

---

## Testing Recommendations

### Unit Testing (Not Currently Implemented)

Recommended test files:
```
src/components/__tests__/
├── LoginForm.test.tsx
├── MfaVerificationForm.test.tsx
├── AuthenticatorSetup.test.tsx
└── VerifyAuthenticator.test.tsx
```

Test coverage priorities:
1. Form validation
2. Error handling
3. Callback invocation
4. Loading states
5. Success states

---

**Document Version**: 1.0  
**Total Components**: 10 (4 reusable + 6 pages)  
**Styling Framework**: Tailwind CSS  
**Component Type**: Functional (React Hooks)  
**TypeScript Coverage**: 100%

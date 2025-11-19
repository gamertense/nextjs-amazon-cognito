# Data Models & Type Definitions

## Overview

This document catalogs all TypeScript types, interfaces, and data structures used in the Next.js Amazon Cognito 2FA application.

**Type System**: Fully typed with TypeScript (strict mode enabled)

**Type Definition Files**:
- `src/types/cognito-errors.ts` - Error types and type guards
- `src/services/auth.ts` - MFA challenge interface
- Component prop interfaces (defined inline)

---

## Core Data Models

### 1. MfaChallenge

**Location**: `src/services/auth.ts`

**Purpose**: Represents an MFA challenge returned by Amazon Cognito when MFA is required

```typescript
export interface MfaChallenge {
  email: string;                    // User's email (for re-authentication)
  password: string;                 // User's password (for re-authentication)
  challengeName: "SMS_MFA" | "SOFTWARE_TOKEN_MFA";  // Type of MFA challenge
  challengeParameters: {
    CODE_DELIVERY_DELIVERY_MEDIUM?: string;         // e.g., "SMS"
    CODE_DELIVERY_DESTINATION?: string;             // e.g., "+1***5678"
  };
}
```

**Usage**:
- Returned by `signIn()` when MFA is enabled
- Stored in `sessionStorage` temporarily
- Passed to `MfaVerificationForm` component
- Used by `submitMfaCode()` to complete authentication

**Example**:
```typescript
{
  email: "user@example.com",
  password: "userPassword123",
  challengeName: "SOFTWARE_TOKEN_MFA",
  challengeParameters: {}
}
```

---

## Error Types

### 1. CognitoAuthErrorCode

**Location**: `src/types/cognito-errors.ts`

**Purpose**: Union type of all possible Amazon Cognito error codes

```typescript
type CognitoAuthErrorCode =
  | "UserNotConfirmedException"
  | "NotAuthorizedException"
  | "UserNotFoundException"
  | "CodeMismatchException"
  | "InvalidParameterException"
  | "UsernameExistsException"
  | "ExpiredCodeException"
  | "EnableSoftwareTokenMFAException";
```

**Usage**: Type guard for error checking

---

### 2. CognitoAuthError

**Location**: `src/types/cognito-errors.ts`

**Purpose**: Standard structure for Amazon Cognito errors

```typescript
export type CognitoAuthError = {
  message: string;              // Human-readable error message
  code: CognitoAuthErrorCode;   // Error code enum
  name?: string;                // Optional error name
};
```

**Example**:
```typescript
{
  code: "CodeMismatchException",
  message: "Invalid verification code provided, please try again.",
  name: "CodeMismatchException"
}
```

---

## Type Guards

Type guards provide runtime type checking for Cognito errors.

### Generic Type Guard

```typescript
export const isCognitoAuthError = (error: unknown): error is CognitoAuthError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  "message" in error;
```

**Usage**:
```typescript
try {
  await signIn(email, password);
} catch (error) {
  if (isCognitoAuthError(error)) {
    console.log(error.code);  // TypeScript knows error.code exists
  }
}
```

### Specific Error Type Guards

| Function | Checks For | Return Type |
|----------|-----------|-------------|
| `isInvalidCognitoParameterError(error)` | `InvalidParameterException` | `boolean` |
| `isCognitoUserNotConfirmedError(error)` | `UserNotConfirmedException` | `boolean` |
| `isUserDisabledError(error)` | `NotAuthorizedException` + "User is disabled" message | `boolean` |
| `isNotAuthorizedError(error)` | `NotAuthorizedException` | `boolean` |
| `isCognitoUserNotFoundError(error)` | `UserNotFoundException` | `boolean` |
| `isCognitoUsernameExistsError(error)` | `UsernameExistsException` | `boolean` |
| `isCognitoCodeMismatchError(error)` | `CodeMismatchException` | `boolean` |
| `isExpiredCodeError(error)` | `ExpiredCodeException` or "already been used" message | `boolean` |
| `isEnableSoftwareTokenMFAError(error)` | `EnableSoftwareTokenMFAException` | `boolean` |

**Implementation Example**:
```typescript
export const isCognitoCodeMismatchError = (error: unknown) => {
  if (isCognitoAuthError(error)) {
    return error.code === "CodeMismatchException";
  }
  return false;
};
```

---

## Component Prop Interfaces

### LoginFormProps

```typescript
interface LoginFormProps {
  onLoginSuccess: (email: string, password: string) => Promise<void>;
}
```

**Used By**: `LoginForm` component

---

### MfaVerificationFormProps

```typescript
interface Props {
  mfaChallenge: MfaChallenge;
  onSuccess?: () => void;
}
```

**Used By**: `MfaVerificationForm` component

---

### AuthenticatorSetupProps

```typescript
interface AuthenticatorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}
```

**Used By**: `AuthenticatorSetup` component

---

## Amazon Cognito SDK Types

### CognitoUserPool

**From**: `amazon-cognito-identity-js`

```typescript
import { CognitoUserPool } from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: string;
  ClientId: string;
});
```

**Usage**: Configured in `src/config/cognito.ts`

---

### CognitoUser

**From**: `amazon-cognito-identity-js`

```typescript
import { CognitoUser } from "amazon-cognito-identity-js";

const cognitoUser = new CognitoUser({
  Username: string;
  Pool: CognitoUserPool;
});
```

**Usage**: Created in auth service functions

---

### AuthenticationDetails

**From**: `amazon-cognito-identity-js`

```typescript
import { AuthenticationDetails } from "amazon-cognito-identity-js";

const authDetails = new AuthenticationDetails({
  Username: string;
  Password: string;
});
```

**Usage**: Used in `signIn()` and `submitMfaCode()`

---

## State Models (Component State)

### LoginForm State

```typescript
{
  email: string;            // User input
  password: string;         // User input
  loading: boolean;         // Async operation indicator
  error: string | null;     // Error message
}
```

### MfaVerificationForm State

```typescript
{
  code: string;             // 6-digit MFA code
  loading: boolean;         // Verification in progress
  error: string | null;     // Error message
  success: boolean;         // Verification succeeded
}
```

### AuthenticatorSetup State

```typescript
{
  secretKey: string | null;     // Secret from Cognito
  qrCodeUrl: string | null;     // otpauth:// URL
  loading: boolean;             // Loading indicator
  userEmail: string;            // User's email
  step: 'email' | 'qr';         // Current step
}
```

### VerifyAuthenticator State

```typescript
{
  code: string;             // 6-digit TOTP code
  loading: boolean;         // Verification in progress
  error: string | null;     // Error message
  success: boolean;         // Verification succeeded
}
```

### home.tsx State

```typescript
{
  isChecking: boolean;      // Auth check in progress
  token: string;            // JWT token
  userEmail: string;        // Decoded from JWT
}
```

---

## Browser Storage Models

### localStorage Schema

```typescript
{
  "token": string;          // JWT token from Amazon Cognito
}
```

**Example**:
```typescript
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
```

### sessionStorage Schema

```typescript
{
  "mfaChallenge": string;   // JSON.stringify(MfaChallenge)
}
```

**Example**:
```typescript
sessionStorage.setItem('mfaChallenge', JSON.stringify({
  email: "user@example.com",
  password: "password123",
  challengeName: "SOFTWARE_TOKEN_MFA",
  challengeParameters: {}
}));
```

---

## Service Function Signatures

### auth.signIn()

```typescript
export const signIn = (
  email: string,
  password: string
): Promise<string | MfaChallenge>
```

**Returns**:
- `string` - JWT token (if no MFA or MFA completed)
- `MfaChallenge` - MFA challenge object (if MFA required)

---

### auth.submitMfaCode()

```typescript
export const submitMfaCode = (
  email: string,
  password: string,
  code: string,
  mfaType?: "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
): Promise<string>
```

**Returns**: JWT token string

---

### auth.setupAuthenticatorApp()

```typescript
export const setupAuthenticatorApp = (): Promise<string>
```

**Returns**: Secret key string (base32 encoded)

---

### auth.verifyAuthenticatorCode()

```typescript
export const verifyAuthenticatorCode = (
  code: string,
  deviceName: string = "MyDevice"
): Promise<void>
```

**Returns**: void (success or throws error)

---

### auth.setPreferredMfaMethod()

```typescript
export const setPreferredMfaMethod = (
  method: "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
): Promise<void>
```

**Returns**: void (success or throws error)

---

## QR Code Data Format

### OTPAuth URI Scheme

```
otpauth://totp/{issuer}:{accountName}?secret={secret}&issuer={issuer}
```

**Example**:
```
otpauth://totp/MyApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MyApp
```

**Fields**:
- `{issuer}`: App name from `NEXT_PUBLIC_APP_NAME`
- `{accountName}`: User's email
- `{secret}`: Base32-encoded secret key from Cognito
- `issuer` parameter: Repeated for compatibility

**Generated By**: `AuthenticatorSetup` component

---

## Environment Variables

### Schema

```typescript
{
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: string;   // e.g., "us-east-1_abc123"
  NEXT_PUBLIC_COGNITO_CLIENT_ID: string;      // e.g., "abc123def456..."
  NEXT_PUBLIC_APP_NAME: string;               // e.g., "MyApp"
}
```

**Usage**: Loaded via `process.env.NEXT_PUBLIC_*`

**⚠️ Security Note**: All variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

---

## Type Safety Patterns

### 1. Discriminated Unions

```typescript
// signIn() return type is a discriminated union
type SignInResult = string | MfaChallenge;

// Type narrowing
if (typeof result === "string") {
  // result is string (JWT token)
} else {
  // result is MfaChallenge
}
```

### 2. Type Guards

```typescript
// Runtime type checking with compile-time type narrowing
if (isCognitoAuthError(error)) {
  // error is now typed as CognitoAuthError
  console.log(error.code);
}
```

### 3. Optional Properties

```typescript
interface AuthenticatorSetupProps {
  onComplete?: () => void;   // Optional callback
  onCancel?: () => void;     // Optional callback
}
```

### 4. Strict Null Checks

```typescript
// TypeScript strict mode enabled
error: string | null;         // Must explicitly handle null
secretKey: string | null;     // Cannot assume value exists
```

---

## Data Validation

### Input Validation (HTML5)

```tsx
<input 
  type="email"           // Email format validation
  required               // Not empty
  maxLength={6}          // Max 6 characters
  pattern="[0-9]{6}"     // Exactly 6 digits
/>
```

### Runtime Validation

- Error type guards validate error objects
- JWT token format validated via decoding attempt
- Session/localStorage data validated before use

---

## Data Flow Summary

```
User Input (Browser)
  ↓
Component State (useState)
  ↓
Service Function (auth.ts)
  ↓
Amazon Cognito SDK Types
  ↓
HTTPS Request (AWS SDK)
  ↓
Amazon Cognito Response
  ↓
Type Guard Validation
  ↓
Component State Update
  ↓
UI Render / Storage
```

---

**Document Version**: 1.0  
**Type Safety**: Full TypeScript coverage with strict mode  
**Type Definitions**: Inline + dedicated type files  
**Validation**: HTML5 + Runtime type guards

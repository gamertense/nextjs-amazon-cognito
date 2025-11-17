// services/auth.ts
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../config/cognito";

// Define types for MFA challenge
export interface MfaChallenge {
  email: string;
  password: string;
  challengeName: "SMS_MFA" | "SOFTWARE_TOKEN_MFA";
  challengeParameters: {
    CODE_DELIVERY_DELIVERY_MEDIUM?: string;
    CODE_DELIVERY_DESTINATION?: string;
  };
}

// Sign in function that returns either a token or an MFA challenge
export const signIn = (
  email: string,
  password: string
): Promise<string | MfaChallenge> => {
  return new Promise((resolve, reject) => {
    // Create authentication details
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    // Create Cognito user
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    // Attempt authentication
    cognitoUser.authenticateUser(authenticationDetails, {
      // Success: User doesn't have MFA or MFA was already completed
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken();
        resolve(token);
      },

      // MFA Required: SMS code will be sent
      mfaRequired: (challengeName, challengeParameters) => {
        resolve({
          email,
          password,
          challengeName: "SMS_MFA" as const,
          challengeParameters,
        });
      },

      // TOTP Required: User must use authenticator app
      totpRequired: (challengeName, challengeParameters) => {
        resolve({
          email,
          password,
          challengeName: "SOFTWARE_TOKEN_MFA" as const,
          challengeParameters,
        });
      },

      // Failed authentication
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const submitMfaCode = (
  email: string,
  password: string,
  code: string,
  mfaType?: "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Recreate authentication details and user
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    // Restart authentication to get into MFA state
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        // Shouldn't happen, but handle it
        const token = session.getIdToken().getJwtToken();
        resolve(token);
      },
      mfaRequired: () => {
        // Now send the MFA code
        cognitoUser.sendMFACode(
          code,
          {
            onSuccess: (session) => {
              // Verification successful - return JWT token
              const token = session.getIdToken().getJwtToken();
              resolve(token);
            },
            onFailure: (err) => {
              reject(err);
            },
          },
          mfaType
        );
      },
      totpRequired: () => {
        // Now send the MFA code for TOTP
        cognitoUser.sendMFACode(
          code,
          {
            onSuccess: (session) => {
              // Verification successful - return JWT token
              const token = session.getIdToken().getJwtToken();
              resolve(token);
            },
            onFailure: (err) => {
              reject(err);
            },
          },
          mfaType
        );
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

export const setupAuthenticatorApp = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Get the current logged-in user
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error("No user is currently logged in"));
      return;
    }

    // Ensure user session is valid
    cognitoUser.getSession((err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }

      // Request a software token (secret key) from Cognito
      cognitoUser.associateSoftwareToken({
        associateSecretCode: (secretCode) => {
          // This is the secret key that will be used to generate the QR code
          resolve(secretCode);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  });
};

export const verifyAuthenticatorCode = (
  code: string,
  deviceName: string = "MyDevice"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error("No user is currently logged in"));
      return;
    }

    cognitoUser.getSession((err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }

      // Verify the TOTP code
      cognitoUser.verifySoftwareToken(code, deviceName, {
        onSuccess: () => {
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  });
};

// After verification, set authenticator as the preferred MFA method
export const setPreferredMfaMethod = (
  method: "SMS_MFA" | "SOFTWARE_TOKEN_MFA"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error("No user is currently logged in"));
      return;
    }

    cognitoUser.getSession((err: Error | null) => {
      if (err) {
        reject(err);
        return;
      }

      // Configure MFA preferences
      const smsSettings =
        method === "SMS_MFA"
          ? { Enabled: true, PreferredMfa: true }
          : { Enabled: false, PreferredMfa: false };

      const totpSettings =
        method === "SOFTWARE_TOKEN_MFA"
          ? { Enabled: true, PreferredMfa: true }
          : { Enabled: false, PreferredMfa: false };

      cognitoUser.setUserMfaPreference(smsSettings, totpSettings, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
};

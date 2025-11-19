// components/VerifyAuthenticator.tsx
import React, { useState } from "react";
import {
  verifyAuthenticatorCode,
  setPreferredMfaMethod,
} from "../services/auth";
import { isEnableSoftwareTokenMFAError } from "../types/cognito-errors";

const VerifyAuthenticator = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Step 1: Verify the code from authenticator app
      await verifyAuthenticatorCode(code, "MyAuthenticatorDevice");

      // Step 2: Set authenticator as preferred MFA method
      await setPreferredMfaMethod("SOFTWARE_TOKEN_MFA");

      setSuccess(true);

      // Redirect to home page after a brief delay
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } catch (error: unknown) {
      console.error("Verification failed:", error);

      // Extract user-friendly error message
      let errorMessage = "Invalid code. Please try again.";

      if (isEnableSoftwareTokenMFAError(error)) {
        errorMessage =
          "Failed to enable 2FA. Please try the setup process again.";
      } else {
        errorMessage = "Something went wrong";
      }

      setError(errorMessage);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-green-800 font-medium">
              Authenticator setup successful! 2FA is now enabled. Redirecting...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Enter the 6-digit code from your authenticator app to complete setup:
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Verification Code
        </label>
        <input
          type="text"
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          pattern="[0-9]{6}"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-center text-2xl tracking-widest font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={loading || success}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading
          ? "Verifying..."
          : success
          ? "Success!"
          : "Verify and Enable 2FA"}
      </button>
    </form>
  );
};

export default VerifyAuthenticator;

// components/VerifyAuthenticator.tsx
import React, { useState } from "react";
import {
  verifyAuthenticatorCode,
  setPreferredMfaMethod,
} from "../services/auth";

const VerifyAuthenticator = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Verify the code from authenticator app
      await verifyAuthenticatorCode(code, "MyAuthenticatorDevice");

      // Step 2: Set authenticator as preferred MFA method
      await setPreferredMfaMethod("SOFTWARE_TOKEN_MFA");

      alert("Authenticator setup successful! 2FA is now enabled.");

      // Redirect to home page
      window.location.href = "/home";
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Enter the 6-digit code from your authenticator app to complete setup:
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? "Verifying..." : "Verify and Enable 2FA"}
      </button>
    </form>
  );
};

export default VerifyAuthenticator;

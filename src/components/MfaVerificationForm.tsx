// components/MfaVerificationForm.tsx
import React, { useState } from "react";
import { submitMfaCode, MfaChallenge } from "../services/auth";

interface Props {
  mfaChallenge: MfaChallenge;
}

const MfaVerificationForm: React.FC<Props> = ({ mfaChallenge }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await submitMfaCode(
        mfaChallenge.cognitoUser,
        code,
        mfaChallenge.challengeName
      );

      console.log("Verification successful! Token:", token);

      // Save token and redirect
      localStorage.setItem("token", token);
      window.location.href = "/home";
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {mfaChallenge.challengeName === "SMS_MFA"
            ? `We sent a code to ${mfaChallenge.challengeParameters.CODE_DELIVERY_DESTINATION}`
            : "Enter the code from your authenticator app"}
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
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>
    </form>
  );
};

export default MfaVerificationForm;

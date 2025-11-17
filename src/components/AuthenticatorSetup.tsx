// components/AuthenticatorSetup.tsx
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { setupAuthenticatorApp } from "../services/auth";

interface AuthenticatorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const AuthenticatorSetup: React.FC<AuthenticatorSetupProps> = ({
  onComplete,
  onCancel,
}) => {
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [step, setStep] = useState<"email" | "qr">("email");

  const issuer = process.env.NEXT_PUBLIC_APP_NAME || "MyApp";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      alert("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Get secret key from Cognito
      const secret = await setupAuthenticatorApp();
      setSecretKey(secret);

      // Generate QR code URL
      // Format: otpauth://totp/Issuer:Account?secret=SECRET&issuer=Issuer
      const qrUrl = `otpauth://totp/${encodeURIComponent(
        issuer
      )}:${encodeURIComponent(
        userEmail
      )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

      setQrCodeUrl(qrUrl);
      setStep("qr");
    } catch (error) {
      console.error("Failed to setup authenticator:", error);
      alert("Failed to initialize authenticator setup");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      alert("Secret key copied to clipboard!");
    }
  };

  if (step === "email") {
    return (
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Enter your email address to generate your authenticator QR code.
        </p>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
              required
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Generating..." : "Generate QR Code"}
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Email:</strong> {userEmail}
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
            1
          </span>
          Download an Authenticator App
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">
          Download Google Authenticator, Microsoft Authenticator, or any
          TOTP-compatible app.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
            2
          </span>
          Scan the QR Code
        </h3>
        {qrCodeUrl && (
          <div className="ml-8">
            <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
              <QRCodeSVG value={qrCodeUrl} size={200} />
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Or manually enter this secret key:
              </p>
              <div className="flex gap-2">
                <code className="flex-1 bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm break-all">
                  {secretKey}
                </code>
                <button
                  onClick={handleCopySecret}
                  className="bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
            3
          </span>
          Verify Setup
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">
          After scanning, click &quot;Continue to Verification&quot; below to
          complete the setup.
        </p>
      </div>

      {onComplete && (
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue to Verification
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthenticatorSetup;

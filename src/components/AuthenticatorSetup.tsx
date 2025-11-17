// components/AuthenticatorSetup.tsx
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { setupAuthenticatorApp } from "../services/auth";

const AuthenticatorSetup = () => {
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSetup = async () => {
      try {
        // Get secret key from Cognito
        const secret = await setupAuthenticatorApp();
        setSecretKey(secret);

        // Generate QR code URL
        // Format: otpauth://totp/Issuer:Account?secret=SECRET&issuer=Issuer
        const userEmail = "user@example.com"; // Get from your user context
        const issuer = "MyApp";
        const qrUrl = `otpauth://totp/${encodeURIComponent(
          issuer
        )}:${encodeURIComponent(
          userEmail
        )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error("Failed to setup authenticator:", error);
        alert("Failed to initialize authenticator setup");
      } finally {
        setLoading(false);
      }
    };

    initializeSetup();
  }, []);

  const handleCopySecret = () => {
    if (secretKey) {
      navigator.clipboard.writeText(secretKey);
      alert("Secret key copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          After scanning, click &quot;Continue to Verification&quot; to complete
          the setup.
        </p>
      </div>
    </div>
  );
};

export default AuthenticatorSetup;

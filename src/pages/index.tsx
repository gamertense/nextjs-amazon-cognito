import { useState } from "react";
import LoginForm from "../components/LoginForm";
import AuthenticatorSetup from "../components/AuthenticatorSetup";
import VerifyAuthenticator from "../components/VerifyAuthenticator";

type View = "login" | "setup" | "verify";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            AWS Cognito 2FA Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Authentication & Setup
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {currentView === "login" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                Sign In
              </h2>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Need to set up 2FA?
                </p>
                <button
                  onClick={() => setCurrentView("setup")}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Configure Authenticator App
                </button>
              </div>
            </div>
          )}

          {currentView === "setup" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                Setup Authenticator
              </h2>
              <AuthenticatorSetup />
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setCurrentView("verify")}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Verification
                </button>
                <button
                  onClick={() => setCurrentView("login")}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

          {currentView === "verify" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
                Verify Authenticator
              </h2>
              <VerifyAuthenticator />
              <div className="mt-6">
                <button
                  onClick={() => setCurrentView("login")}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Helper */}
        <div className="mt-6 text-center">
          <div className="inline-flex gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md">
            <button
              onClick={() => setCurrentView("login")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentView === "login"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView("setup")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentView === "setup"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Setup
            </button>
            <button
              onClick={() => setCurrentView("verify")}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentView === "verify"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Verify
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">
            Testing Guide:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>
              • <strong>Login:</strong> Sign in with your credentials (redirects
              to /home on success)
            </li>
            <li>
              • <strong>Setup:</strong> Configure authenticator app
              (Google/Microsoft Authenticator)
            </li>
            <li>
              • <strong>Verify:</strong> Complete setup by verifying a TOTP code
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import LoginForm from "../components/LoginForm";
import AuthenticatorSetup from "../components/AuthenticatorSetup";
import VerifyAuthenticator from "../components/VerifyAuthenticator";

type View = "login" | "setup" | "verify";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("login");

  const handleSetupComplete = () => {
    setCurrentView("verify");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleStartSetup = () => {
    setCurrentView("setup");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            AWS Cognito 2FA
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentView === "login" && "Sign in to your account"}
            {currentView === "setup" && "Set up two-factor authentication"}
            {currentView === "verify" && "Verify your authenticator"}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {currentView === "login" && (
            <div>
              <LoginForm />
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
                  Want to enable two-factor authentication?
                </p>
                <button
                  onClick={handleStartSetup}
                  className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 px-4 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  Set Up Authenticator App
                </button>
              </div>
            </div>
          )}

          {currentView === "setup" && (
            <div>
              <AuthenticatorSetup
                onComplete={handleSetupComplete}
                onCancel={handleBackToLogin}
              />
            </div>
          )}

          {currentView === "verify" && (
            <div>
              <VerifyAuthenticator />
              <div className="mt-6">
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        {currentView === "login" && (
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Demo credentials available in the documentation</p>
          </div>
        )}
      </main>
    </div>
  );
}

import { useRouter } from "next/router";
import AuthenticatorSetup from "../components/AuthenticatorSetup";

export default function Setup2FAPage() {
  const router = useRouter();

  const handleSetupComplete = () => {
    // Navigate to verification page
    router.push("/verify-2fa");
  };

  const handleCancel = () => {
    // Go back to login page
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Setup Two-Factor Authentication
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure your account with an authenticator app
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <AuthenticatorSetup
            onComplete={handleSetupComplete}
            onCancel={handleCancel}
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Download an authenticator app like Google Authenticator or Microsoft
            Authenticator
          </p>
        </div>
      </main>
    </div>
  );
}

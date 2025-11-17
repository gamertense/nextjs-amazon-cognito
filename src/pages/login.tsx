import { useRouter } from "next/router";
import { signIn } from "../services/auth";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);

      // Check if result is a token (string) or MFA challenge (object)
      if (typeof result === "string") {
        // Login successful - result is the JWT token
        console.log("Login successful! Token:", result);
        localStorage.setItem("token", result);
        router.push("/home");
      } else {
        // MFA required - redirect to MFA verification page
        // Store challenge data temporarily
        sessionStorage.setItem("mfaChallenge", JSON.stringify(result));
        router.push("/mfa-verify");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleSetup2FA = () => {
    router.push("/setup-2fa");
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
            Sign in to your account
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <LoginForm onLoginSuccess={handleLoginSuccess} />

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
              Want to enable two-factor authentication?
            </p>
            <button
              onClick={handleSetup2FA}
              className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 px-4 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Set Up Authenticator App
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Demo credentials available in the documentation</p>
        </div>
      </main>
    </div>
  );
}

import { useRouter } from "next/router";
import VerifyAuthenticator from "../components/VerifyAuthenticator";

export default function Verify2FAPage() {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Authenticator
          </h1>
          <p className="text-gray-600">Complete your 2FA setup</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <VerifyAuthenticator />

          <div className="mt-6">
            <button
              onClick={handleBackToLogin}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

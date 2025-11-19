import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MfaVerificationForm from "../components/MfaVerificationForm";
import { MfaChallenge } from "../services/auth";

export default function MfaVerifyPage() {
  const router = useRouter();
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve MFA challenge from session storage
    const challengeData = sessionStorage.getItem("mfaChallenge");

    if (!challengeData) {
      // No MFA challenge found, redirect to login
      router.push("/login");
      return;
    }

    try {
      const challenge = JSON.parse(challengeData);
      setMfaChallenge(challenge);
    } catch (error) {
      console.error("Failed to parse MFA challenge:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleVerificationSuccess = () => {
    // Clean up session storage
    sessionStorage.removeItem("mfaChallenge");
    // Redirect to home page
    router.push("/home?mfa=true");
  };

  if (isLoading || !mfaChallenge) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600">Enter your verification code</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <MfaVerificationForm
            mfaChallenge={mfaChallenge}
            onSuccess={handleVerificationSuccess}
          />
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Login
          </button>
        </div>
      </main>
    </div>
  );
}

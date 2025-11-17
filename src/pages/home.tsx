import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [token, setToken] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Check if user is authenticated
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      // No token found, redirect to login
      router.push("/");
      return;
    }

    // Optionally decode JWT to get user info
    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      setUserEmail(payload.email || payload.sub || "User");
      setToken(storedToken);
    } catch (error) {
      console.error("Failed to decode token:", error);
      setToken(storedToken);
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You&apos;ve successfully authenticated with 2FA
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-green-800 dark:text-green-200 font-semibold text-lg">
                  Authentication Successful!
                </p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                  Your account is protected with Two-Factor Authentication
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              User Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Email:
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {userEmail}
                </span>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Status:
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Authenticated
                </span>
              </div>
            </div>
          </div>

          {/* Token Display */}
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              JWT Token
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded p-3 overflow-x-auto">
              <p className="text-xs text-gray-700 dark:text-gray-300 break-all font-mono">
                {token.substring(0, 80)}...
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This token is stored in localStorage and used for API
              authentication
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Protected Page
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            This page is only accessible after successful authentication with
            2FA. Your session is managed via the JWT token stored in
            localStorage.
          </p>
        </div>
      </main>
    </div>
  );
}

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("token");

    if (token) {
      // User is logged in, redirect to home page
      router.push("/home");
    } else {
      // User is not logged in, redirect to login page
      router.push("/login");
    }
  }, [router]);

  // Show loading spinner while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

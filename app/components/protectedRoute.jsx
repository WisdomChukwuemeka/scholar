"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/services/api";
import { SecureStorage } from "@/utils/secureStorage";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = SecureStorage.get("access_token");

        // No token or expired token
        if (!token || isTokenExpired()) {
          SecureStorage.remove("access_token");
          SecureStorage.remove("role");
          setAuthorized(false);
          router.replace("/login"); //  Navigate instead of rendering <Login />
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("ProtectedRoute error:", error);
        setAuthorized(false);
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth changes (login/logout)
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, [router]);

  // Optional: show loading screen while checking
  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Show page only if authorized
  return authorized ? <>{children}</> : null;
}

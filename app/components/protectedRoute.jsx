"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/services/api";
import { SecureStorage } from "@/utils/secureStorage";
import Login from "../login/page";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = SecureStorage.get("access_token");

        // 🔒 No token or expired token — show login immediately
        if (!token || isTokenExpired()) {
          SecureStorage.remove("access_token");
          SecureStorage.remove("role");
          setAuthorized(false);
        } else {
          // ✅ Valid token found
          setAuthorized(true);
        }
      } catch (error) {
        console.error("ProtectedRoute error:", error);
        setAuthorized(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // 🧭 If still checking, show login by default (not null)
  if (checkingAuth) {
    return <Login />;
  }

  // 🚪 If not authorized, show login immediately
  if (!authorized) {
    return <Login />;
  }

  // ✅ Authorized — show protected page
  return <>{children}</>;
}

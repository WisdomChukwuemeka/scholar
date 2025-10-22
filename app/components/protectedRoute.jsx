"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SecureStorage } from "@/utils/secureStorage";
import { isTokenExpired } from "@/app/services/api";
import Login from "../login/page";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = () => {
    try {
      const token = SecureStorage.get("access_token");

      if (!token || isTokenExpired()) {
        SecureStorage.remove("access_token");
        SecureStorage.remove("role");
        setAuthorized(false);
        router.replace("/login");
      } else {
        setAuthorized(true);
      }
    } catch (error) {
      console.error("ProtectedRoute error:", error);
      setAuthorized(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // 👇 Listen for login/logout events
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, [pathname, router]);

  if (checkingAuth) return <Login />;
  if (!authorized) return <Login />;

  return <>{children}</>;
}

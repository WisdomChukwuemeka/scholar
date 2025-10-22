"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isTokenExpired } from "@/app/services/api";
import { SecureStorage } from "@/utils/secureStorage";
import { Yantramanav } from "next/font/google";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ get current route
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const publicRoutes = ["/login", "/register", "/forgot-password"];

  useEffect(() => {
    // ✅ If user is on a public page, don’t check auth
    if (publicRoutes.includes(pathname)) {
      setAuthorized(true);
      setCheckingAuth(false);
      return;
    }

    const checkAuth = () => {
      try {
        const token = SecureStorage.get("access_token");

        if (!token || isTokenExpired()) {
          SecureStorage.remove("access_token");
          SecureStorage.remove("role");
          router.replace("/login");
        } else {
          router.replace("/");
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
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, [router, pathname]);

  return authorized ? <>{children}</> : null;
}

"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Unauthorized from "./unoth";

type Role = "admin" | "doctor" | "receptionist";

interface Props {
  children: ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, router]);


  if (loading) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if (!isAuthenticated) return null;


  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
}

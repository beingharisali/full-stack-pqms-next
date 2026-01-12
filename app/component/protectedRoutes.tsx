"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Unauthorized from "./unoth";

type Role = "admin" | "doctor" | "receptionist";

interface Props {
    children: ReactNode;
    allowedRoles?: Role[]; // roles allowed page
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    // 🔹 Admin can access everything
    if (user?.role === "admin") {
        return <>{children}</>;
    }


    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Unauthorized />;
    }

    return <>{children}</>;
}

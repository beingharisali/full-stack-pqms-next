"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
    children: React.ReactNode;
    role?: "admin" | "doctor" | "receptionist";
};

export default function ProtectedRoute({ children, role }: Props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/");
            } else if (role && user.role !== role) {
                router.replace("/unauthorized");
            }
        }
    }, [user, loading, role]);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}

"use client"

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
    const { session, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !session) {
            router.push('/features/auth/pages/LoginPage');
        }
    }, [session, isLoading, router]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Protected Page</h1>
            {session && <p>Welcome, {session.user.email}</p>}
        </div>
    )
}

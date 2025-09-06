"use client"

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useContext } from "react";

export const useAuth = () => {
    const context = useSessionContext();

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

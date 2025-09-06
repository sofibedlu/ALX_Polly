"use client"

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { ensureUserProfile } from "@/lib/api/profiles";

export const useAuth = () => {
    const context = useSessionContext();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
                
                // Ensure profile exists when user logs in
                if (session?.user && event === 'SIGNED_IN') {
                    try {
                        await ensureUserProfile(session.user.id);
                    } catch (error) {
                        console.error('Failed to ensure user profile:', error);
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return {
        ...context,
        user,
        loading,
    };
}

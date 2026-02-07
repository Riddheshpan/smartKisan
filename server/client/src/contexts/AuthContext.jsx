import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("AuthContext: Initial Session Check", session);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("AuthContext: Auth Change", _event, session);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = (email, password) => {
        return supabase.auth.signUp({ email, password });
    };

    const signIn = (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = () => {
        return supabase.auth.signOut();
    };

    const signInWithGoogle = async () => {
        console.log("AuthContext: signInWithGoogle called");
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    skipBrowserRedirect: true
                }
            });
            console.log("AuthContext: signInWithOAuth result", { data, error });

            if (data?.url) {
                alert("Redirecting to: " + data.url);
                window.location.href = data.url;
            } else if (error) {
                alert("Supabase Error: " + error.message);
            } else {
                alert("No URL returned. Check Console.");
            }

            return { data, error };
        } catch (err) {
            console.error("AuthContext: signInWithOAuth exception", err);
            return { error: err };
        }
    };

    const value = {
        session,
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

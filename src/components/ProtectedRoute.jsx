import React from 'react';
import { Navigate } from 'react-router-dom';

// Placeholder ProtectedRoute - For now, it allows everything.
// In real implementation, check Supabase session.
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children, requireCompleteProfile = true }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

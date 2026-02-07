import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

// Placeholder ProtectedRoute - For now, it allows everything.
// In real implementation, check Supabase session.
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children, requireCompleteProfile = true }) => {
    const { user, loading } = useAuth();
    const [profile, setProfile] = React.useState(null);
    const [profileLoading, setProfileLoading] = React.useState(true);
    const location = useLocation();

    React.useEffect(() => {
        if (user) {
            api.getProfile(user.id).then(({ data }) => {
                setProfile(data);
                setProfileLoading(false);
            });
        } else {
            setProfileLoading(false);
        }
    }, [user]);

    if (loading || profileLoading) {
        return <div className="flex h-screen items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>;
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }



    return children;
};

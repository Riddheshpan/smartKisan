import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import GlobalVoiceAssistant from './GlobalVoiceAssistant';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export const Layout = ({ children }) => {
    const { user } = useAuth();
    const [profileIncomplete, setProfileIncomplete] = React.useState(false);
    const [loadingProfile, setLoadingProfile] = React.useState(true);
    const { t } = useLanguage();

    React.useEffect(() => {
        const checkProfile = async () => {
            if (user) {
                const { data } = await api.getProfile(user.id);
                // Check if location or other critical fields are missing
                if (!data?.location) {
                    setProfileIncomplete(true);
                } else {
                    setProfileIncomplete(false);
                }
            }
            setLoadingProfile(false);
        };
        checkProfile();
    }, [user]);

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
                <Header />

                {/* Red Alert for Incomplete Profile */}
                {profileIncomplete && !loadingProfile && (
                    <div className="bg-red-500 text-white px-4 py-3 flex justify-between items-center shadow-md animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 fill-current text-white" />
                            <span className="font-medium">
                                Attention: Please complete your profile (Location) to get accurate weather updates.
                            </span>
                        </div>
                        <Link to="/profile">
                            <Button variant="secondary" size="sm" className="bg-white text-red-600 hover:bg-gray-100 border-0">
                                Complete Profile
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
                {/* Global Voice Assistant Button */}
                <GlobalVoiceAssistant />
            </main>
        </div>
    );
};

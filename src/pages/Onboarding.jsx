import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Onboarding = () => {
    const { t } = useLanguage();
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Onboarding</h1>
                <p className="text-gray-600">Setup your profile to get started.</p>
            </div>
        </div>
    );
};

export default Onboarding;

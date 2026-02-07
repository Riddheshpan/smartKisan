import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">{t('page_not_found')}</p>
            <Link to="/" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                {t('go_home')}
            </Link>
        </div>
    );
};

export default NotFound;

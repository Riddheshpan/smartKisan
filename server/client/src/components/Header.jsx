import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
    const { user } = useAuth();
    const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 hover:bg-gray-100 rounded-md">
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold md:hidden">Smart Kissan</h1>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link to="/profile" className="cursor-pointer">
                    <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold hover:bg-green-200 transition-colors">
                        {initial}
                    </div>
                </Link>
            </div>
        </header>
    );
};

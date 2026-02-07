import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CloudSun,
    Sprout,
    Store,
    Map,
    MessageCircle,
    FileText,
    User,
    Settings,
    LogOut,
    Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/lib/translations';

export const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    const sidebarItems = [
        { icon: LayoutDashboard, label: t('dashboard'), path: '/' },
        { icon: CloudSun, label: t('weather'), path: '/weather' },
        { icon: Sprout, label: t('crop_health'), path: '/crop-health' },
        { icon: Store, label: t('market'), path: '/market' },
        { icon: Map, label: t('my_plots'), path: '/plots' },
        { icon: MessageCircle, label: t('expert_chat'), path: '/expert-chat' },
        { icon: FileText, label: t('schemes'), path: '/schemes' },
        { icon: User, label: t('profile'), path: '/profile' },
        { icon: Settings, label: t('settings'), path: '/settings' },
    ];

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/auth');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 z-50">
            <div className="p-6 border-b border-sidebar-border/50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Sprout className="w-6 h-6 text-primary-600" />
                    {t('app_name')}
                </h2>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <div key={item.path}>
                            <Link
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
                                )} />
                                {item.label}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />
                                )}
                            </Link>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-sidebar-border space-y-2">
                {/* Language Switcher */}
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 border rounded-lg bg-gray-50">
                    <Languages className="w-4 h-4 text-gray-500" />
                    <select
                        className="bg-transparent border-none outline-none w-full text-sm font-medium cursor-pointer"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.native} ({lang.name})
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
                    {t('logout')}
                </button>
            </div>
        </aside>
    );
};

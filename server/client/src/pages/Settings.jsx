import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

const Settings = () => {
    const { t } = useLanguage();
    const { theme, setTheme } = useTheme();

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('settings')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('app_preferences')}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('preferences')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                                <Moon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{t('appearance')}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('current')}: {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={theme === 'light' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTheme('light')}
                            >
                                {t('light')}
                            </Button>
                            <Button
                                variant={theme === 'dark' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTheme('dark')}
                            >
                                {t('dark')}
                            </Button>
                            <Button
                                variant={theme === 'system' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTheme('system')}
                            >
                                {t('system')}
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{t('notifications')}</p>
                                <p className="text-sm text-gray-500">{t('push_email_alerts')}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">{t('on')}</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{t('privacy_security')}</p>
                                <p className="text-sm text-gray-500">{t('password_data')}</p>
                            </div>
                        </div>
                        <div className="text-gray-400">›</div>
                    </div>
                </CardContent>
            </Card>

            <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" /> {t('sign_out')}
            </Button>
        </div>
    );
};

export default Settings;

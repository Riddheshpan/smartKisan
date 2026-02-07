import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Auth = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (action) => {
        setLoading(true);
        try {
            const { error } = action === 'login'
                ? await signIn(email, password)
                : await signUp(email, password);

            if (error) throw error;

            if (action === 'login') {
                navigate('/');
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-green-700">{t('app_name')}</CardTitle>
                    <CardDescription>{t('login_welcome')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">{t('login_tab')}</TabsTrigger>
                            <TabsTrigger value="signup">{t('signup_tab')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t('email_placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('password_label') || "Password"}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={t('password_placeholder')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleAuth('login')}
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('login_tab')}
                            </Button>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-signup">{t('email')}</Label>
                                <Input
                                    id="email-signup"
                                    type="email"
                                    placeholder={t('email_placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-signup">{t('password_label') || "Password"}</Label>
                                <Input
                                    id="password-signup"
                                    type="password"
                                    placeholder={t('password_create_placeholder')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleAuth('signup')}
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('signup_tab')}
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-xs text-gray-500">
                        {t('terms_agree')}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Auth;

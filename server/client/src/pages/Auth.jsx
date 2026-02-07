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
    const [email, setEmail] = useState('ronak05mishra@gmail.com');
    const [password, setPassword] = useState('123456');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [manualUrl, setManualUrl] = useState(null);

    const handleAuth = async (action) => {
        setLoading(true);
        setManualUrl(null);
        try {
            let error;
            console.log("Auth: handleAuth called with action:", action);
            if (action === 'google') {
                const result = await signInWithGoogle();
                error = result.error;
                if (result.data?.url) {
                    console.log("Redirecting to:", result.data.url);
                    window.location.href = result.data.url;
                    setManualUrl(result.data.url); // Fallback
                    // Don't stop loading, we are redirecting
                    return;
                }
            } else if (action === 'login') {
                const result = await signIn(email, password);
                error = result.error;
            } else {
                const result = await signUp(email, password);
                error = result.error;
            }

            if (error) throw error;

            if (action === 'login') {
                navigate('/');
            } else if (action !== 'google') {
                window.location.href = '/';
            }
        } catch (error) {
            alert(error.message);
            setLoading(false);
        }
        // Note: We don't turn off loading for Google to prevent user clicking again
        if (action !== 'google') {
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
                    <div className="mb-4">
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2"
                            onClick={() => handleAuth('google')}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Redirecting to Google...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </Button>

                        {manualUrl && (
                            <div className="mt-2 text-center">
                                <p className="text-sm text-muted-foreground mb-1">Not redirected?</p>
                                <a
                                    href={manualUrl}
                                    className="text-primary underline text-sm font-medium hover:text-green-700"
                                >
                                    Click here to continue
                                </a>
                            </div>
                        )}

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                    </div>

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

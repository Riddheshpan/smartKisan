import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sprout, Eye, EyeOff, User, MapPin, Tractor } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/lib/translations';
import { cn } from '@/lib/utils';

// Trust points shown on left panel
const TRUST_POINTS = [
    { emoji: '🌾', text: 'AI crop disease detection in seconds' },
    { emoji: '📊', text: 'Live APMC/mandi prices from 500+ markets' },
    { emoji: '☁️', text: 'Hyper-local 7-day weather forecasts' },
    { emoji: '👨‍🌾', text: 'Connect with certified agronomists free' },
    { emoji: '🏛️', text: 'All govt. schemes in one place' },
];

const FARMING_TYPES = [
    'Crop Farming',
    'Organic Farming',
    'Dairy & Livestock',
    'Horticulture',
    'Mixed Farming',
    'Aquaculture',
    'Other',
];

const Auth = () => {
    const { t } = useLanguage();
    const { language, setLanguage } = useLanguage();
    const [activeTab, setActiveTab] = useState('login');

    // Shared fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Signup-only fields
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('');
    const [farmingType, setFarmingType] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [manualUrl, setManualUrl] = useState(null);

    const handleAuth = async (action) => {
        setLoading(true);
        setError('');
        setManualUrl(null);
        try {
            if (action === 'google') {
                const result = await signInWithGoogle();
                if (result.data?.url) {
                    window.location.href = result.data.url;
                    setManualUrl(result.data.url);
                    return;
                }
                if (result.error) throw result.error;
            } else if (action === 'login') {
                const result = await signIn(email, password);
                if (result.error) throw result.error;
                navigate('/');
            } else {
                // Signup — pass metadata so DB trigger sets full_name
                const result = await signUp(email, password, {
                    full_name: fullName,
                    location,
                    farming_type: farmingType,
                });
                if (result.error) throw result.error;
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
        if (action !== 'google') setLoading(false);
    };

    const isSignupDisabled =
        loading || !email || !password || !fullName || !location || !farmingType;
    const isLoginDisabled = loading || !email || !password;

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* ── Left Panel (desktop only) ─────────────────────────────── */}
            <div
                className="hidden md:flex md:w-5/12 xl:w-1/2 flex-col justify-between p-10 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #1B5E20 0%, #2E7D32 50%, #1565C0 100%)' }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 bg-white" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 bg-white transform translate-y-1/2 -translate-x-1/4" />

                {/* Logo */}
                <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Sprout className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">Smart Kissan</h1>
                        <p className="text-green-200/70 text-sm">स्मार्ट किसान</p>
                    </div>
                </div>

                {/* Main headline */}
                <div className="relative">
                    <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-4">
                        Smarter Farming,<br />
                        <span className="text-kissan-amber">Better Harvests</span>
                    </h2>
                    <p className="text-green-100/80 text-lg mb-8">
                        Everything an Indian farmer needs — powered by AI, trusted by 2.5 lakh+ farmers.
                    </p>
                    <div className="space-y-3">
                        {TRUST_POINTS.map(({ emoji, text }) => (
                            <div key={text} className="flex items-center gap-3 text-green-100/90">
                                <span className="text-xl">{emoji}</span>
                                <span className="text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="relative flex gap-6">
                    {[{ n: '2.5L+', l: 'Farmers' }, { n: '18', l: 'States' }, { n: '28%', l: 'Yield Boost' }].map(({ n, l }) => (
                        <div key={l}>
                            <p className="text-2xl font-extrabold text-kissan-amber">{n}</p>
                            <p className="text-green-200/70 text-xs">{l}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right Panel: Auth Form ────────────────────────────────────── */}
            <div className="flex-1 flex flex-col justify-center items-center p-5 sm:p-8 md:p-12 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="md:hidden flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-kissan-green rounded-2xl flex items-center justify-center mb-3">
                            <Sprout className="w-9 h-9 text-white" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Smart Kissan</h1>
                        <p className="text-gray-500 text-sm mt-1">Smarter Farming, Better Harvests</p>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex justify-center mb-6 w-full">
                        <div className="flex flex-wrap justify-center bg-white border-2 border-gray-200 rounded-2xl p-1.5 gap-1">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code)}
                                    id={`auth-lang-${lang.code}`}
                                    className={cn(
                                        'px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 no-tap-highlight',
                                        language === lang.code
                                            ? 'bg-kissan-green text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    )}
                                    aria-label={`Switch to ${lang.name}`}
                                    aria-pressed={language === lang.code}
                                >
                                    {lang.native}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-7">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                            {activeTab === 'login' ? 'Welcome Back 👋' : 'Create Account 🌱'}
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            {activeTab === 'login' ? 'Sign in to your Smart Kissan account' : 'Join Smart Kissan for free today'}
                        </p>

                        {/* Tab Switcher */}
                        <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6">
                            <button
                                id="tab-login"
                                onClick={() => { setActiveTab('login'); setError(''); }}
                                className={cn('flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 no-tap-highlight',
                                    activeTab === 'login' ? 'bg-white text-kissan-green shadow-sm' : 'text-gray-500'
                                )}
                                aria-pressed={activeTab === 'login'}
                            >
                                {t('login_tab')}
                            </button>
                            <button
                                id="tab-signup"
                                onClick={() => { setActiveTab('signup'); setError(''); }}
                                className={cn('flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 no-tap-highlight',
                                    activeTab === 'signup' ? 'bg-white text-kissan-green shadow-sm' : 'text-gray-500'
                                )}
                                aria-pressed={activeTab === 'signup'}
                            >
                                {t('signup_tab')}
                            </button>
                        </div>

                        {/* Google Button */}
                        <button
                            id="google-signin"
                            onClick={() => handleAuth('google')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-gray-200
                                       bg-white text-gray-700 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50
                                       transition-all duration-200 mb-5 no-tap-highlight disabled:opacity-60"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            {loading ? 'Redirecting...' : 'Continue with Google'}
                        </button>

                        {manualUrl && (
                            <p className="text-center text-sm text-gray-500 mb-4">
                                Not redirected? <a href={manualUrl} className="text-kissan-green font-semibold underline">Click here</a>
                            </p>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Form */}
                        <div className="space-y-4">

                            {/* ── Signup-only fields ── */}
                            {activeTab === 'signup' && (
                                <>
                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="auth-fullname" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                id="auth-fullname"
                                                type="text"
                                                placeholder="e.g. Ramesh Kumar"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="input-kissan pl-10"
                                                autoComplete="name"
                                            />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label htmlFor="auth-location" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Village / District *
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                id="auth-location"
                                                type="text"
                                                placeholder="e.g. Karnal, Haryana"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="input-kissan pl-10"
                                                autoComplete="address-level2"
                                            />
                                        </div>
                                    </div>

                                    {/* Farming Type */}
                                    <div>
                                        <label htmlFor="auth-farming-type" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Farming Type *
                                        </label>
                                        <div className="relative">
                                            <Tractor className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            <select
                                                id="auth-farming-type"
                                                value={farmingType}
                                                onChange={(e) => setFarmingType(e.target.value)}
                                                className="input-kissan pl-10 appearance-none"
                                            >
                                                <option value="">Select farming type...</option>
                                                {FARMING_TYPES.map((ft) => (
                                                    <option key={ft} value={ft}>{ft}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-1" />
                                </>
                            )}

                            {/* Email */}
                            <div>
                                <label htmlFor="auth-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    {t('email')}
                                </label>
                                <input
                                    id="auth-email"
                                    type="email"
                                    placeholder={t('email_placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-kissan"
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="auth-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="auth-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-kissan pr-12"
                                        autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 no-tap-highlight"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {activeTab === 'signup' && (
                                    <p className="text-xs text-gray-400 mt-1.5">Minimum 6 characters</p>
                                )}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                                    ⚠️ {error}
                                </div>
                            )}

                            <button
                                id={`submit-${activeTab}`}
                                onClick={() => handleAuth(activeTab === 'login' ? 'login' : 'signup')}
                                disabled={activeTab === 'login' ? isLoginDisabled : isSignupDisabled}
                                className={cn(
                                    'btn-primary w-full justify-center text-base mt-2',
                                    (activeTab === 'login' ? isLoginDisabled : isSignupDisabled) && 'opacity-60 cursor-not-allowed'
                                )}
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Please wait...' : activeTab === 'login' ? t('login_tab') : t('signup_tab')}
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        By continuing, you agree to our Terms of Service &amp; Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;

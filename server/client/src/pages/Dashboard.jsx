import React, { useState, useEffect } from 'react';
import {
    CloudSun, Sprout, TrendingUp, Plus, Droplets, Wind,
    ArrowUpRight, Loader2, Leaf, ShoppingBag, MessageCircle,
    FileText, Map, Star, ChevronRight, Zap, Shield, Award,
    Sun, AlertTriangle, Clock, TrendingDown, BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Feature Grid Data ─────────────────────────────────────────────────────
const FEATURES = [
    {
        icon: Sprout, label: 'Crop Advisory', sublabel: 'AI-powered tips',
        path: '/crop-health', color: 'bg-kissan-green-pale', iconColor: 'text-kissan-green',
        border: 'border-kissan-green/20', id: 'feature-crop'
    },
    {
        icon: TrendingUp, label: 'Mandi Prices', sublabel: 'Live APMC rates',
        path: '/market', color: 'bg-blue-50', iconColor: 'text-blue-600',
        border: 'border-blue-200/60', id: 'feature-market'
    },
    {
        icon: CloudSun, label: 'Weather', sublabel: '7-day forecast',
        path: '/weather', color: 'bg-kissan-sky-pale', iconColor: 'text-kissan-sky',
        border: 'border-kissan-sky/20', id: 'feature-weather'
    },
    {
        icon: ShoppingBag, label: 'Marketplace', sublabel: 'Seeds & inputs',
        path: '/marketplace', color: 'bg-kissan-amber-pale', iconColor: 'text-kissan-amber-dark',
        border: 'border-kissan-amber/20', id: 'feature-marketplace'
    },
    {
        icon: MessageCircle, label: 'Expert Connect', sublabel: 'Call an agronomist',
        path: '/expert-chat', color: 'bg-purple-50', iconColor: 'text-purple-600',
        border: 'border-purple-200/60', id: 'feature-expert'
    },
    {
        icon: FileText, label: 'Govt Schemes', sublabel: 'Subsidies & loans',
        path: '/schemes', color: 'bg-kissan-brown-pale', iconColor: 'text-kissan-brown',
        border: 'border-kissan-brown/20', id: 'feature-schemes'
    },
];

// ─── Testimonials ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
    {
        name: 'Ramesh Patel', location: 'Anand, Gujarat', crop: 'Cotton Farmer',
        quote: "Smart Kissan ne mane 3 hajar rupiya per bigha bachavya! Mandi price alert thi sahi time pe vechyu.",
        rating: 5, avatar: 'R'
    },
    {
        name: 'Sunita Devi', location: 'Ludhiana, Punjab', crop: 'Wheat Farmer',
        quote: "Crop advisory ne meri wheat ki fasal mein 30% yield increase karne mein help ki. Bahut useful app hai!",
        rating: 5, avatar: 'S'
    },
    {
        name: 'Krishnarao Yadav', location: 'Nagpur, Maharashtra', crop: 'Soybean Farmer',
        quote: "Weather forecast ki wajah se sahi time pe irrigation kiya. Pani ki bhi bachat hui aur fasal bhi achi rahi.",
        rating: 5, avatar: 'K'
    },
];

// ─── Trust Partners ────────────────────────────────────────────────────────
const PARTNERS = ['ICAR', 'APEDA', 'NABARD', 'PM-KISAN', 'e-NAM'];

// ─── Market Summary ────────────────────────────────────────────────────────
const MARKET_SUMMARY = [
    { crop: 'Wheat', price: '₹2,275', change: '+1.2%', trend: 'up', emoji: '🌾' },
    { crop: 'Rice', price: '₹3,950', change: '-0.5%', trend: 'down', emoji: '🍚' },
    { crop: 'Cotton', price: '₹6,900', change: '+2.5%', trend: 'up', emoji: '☁️' },
    { crop: 'Onion', price: '₹1,550', change: '+0.8%', trend: 'up', emoji: '🧅' },
];

// ─── Recommended Actions ───────────────────────────────────────────────────
const ACTIONS = [
    { title: 'Irrigate Plot A', desc: 'Soil moisture is low (−20%)', time: 'Today, 4 PM', severity: 'high', icon: Droplets },
    { title: 'Apply Fertilizer', desc: 'Nitrogen dose for Wheat crop', time: 'Tomorrow', severity: 'medium', icon: Leaf },
    { title: 'Check Pest Trap', desc: 'Weekly maintenance due', time: 'Wed, 9th', severity: 'low', icon: AlertTriangle },
];

// ─── Dashboard Component ───────────────────────────────────────────────────
const Dashboard = () => {
    const { t } = useLanguage();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const weatherRes = await fetch('/api/weather');
                const weatherData = await weatherRes.json();
                setWeather(weatherData);
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Auto-rotate testimonials
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentWeather = weather?.current || { temp: '--', desc: 'Loading...', humidity: '--', wind: '--' };

    return (
        <div className="page-wrapper animate-fade-in">

            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════════ */}
            <section className="rounded-3xl overflow-hidden mb-6 relative" id="dashboard-hero">
                <div className="hero-bg p-6 sm:p-8 md:p-10">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #66BB6A, transparent)', transform: 'translate(30%, -30%)' }} />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
                        style={{ background: 'radial-gradient(circle, #42A5F5, transparent)', transform: 'translate(-30%, 30%)' }} />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="max-w-lg">
                            {/* Offline badge */}
                            <div className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                                Available offline · Last synced now
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                Smarter Farming,<br />
                                <span className="text-kissan-amber">Better Harvests</span>
                            </h1>
                            <p className="text-green-100/80 mt-3 text-base sm:text-lg leading-relaxed">
                                AI-powered crop advisory, live mandi prices & weather — all in one app.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <Link
                                    to="/crop-health"
                                    id="cta-crop-advice"
                                    className="btn-amber text-center"
                                    aria-label="Get Crop Advice"
                                >
                                    <Sprout className="w-5 h-5" />
                                    Get Crop Advice
                                </Link>
                                <Link
                                    to="/market"
                                    id="cta-mandi-prices"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/50
                                               text-white font-semibold px-6 py-3 text-base backdrop-blur-sm
                                               hover:bg-white/15 transition-all duration-200 active:scale-95"
                                    aria-label="Check Mandi Prices"
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    Check Mandi Prices
                                </Link>
                            </div>
                        </div>

                        {/* Weather mini widget in hero */}
                        {!loading && weather && (
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 min-w-[180px]">
                                <div className="flex items-center gap-2 text-green-200/80 text-xs font-medium mb-3">
                                    <CloudSun className="w-4 h-4" />
                                    Today's Weather
                                </div>
                                <div className="text-5xl font-bold text-white">{currentWeather.temp}°</div>
                                <p className="text-green-100/80 text-sm mt-1 capitalize">{currentWeather.desc}</p>
                                <div className="flex gap-4 mt-4 text-xs text-green-200/70">
                                    <span className="flex items-center gap-1">
                                        <Droplets className="w-3 h-3" />{currentWeather.humidity}%
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Wind className="w-3 h-3" />{currentWeather.wind}km/h
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                QUICK STATS ROW
            ═══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-3 gap-3 mb-6" id="quick-stats">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-card">
                    <div className="text-2xl font-extrabold text-kissan-green">4</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-medium">Active Plots</div>
                    <div className="text-xs text-gray-400">12.5 Acres</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-card">
                    <div className="text-2xl font-extrabold text-kissan-sky">
                        {loading ? '--' : `${currentWeather.temp}°`}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 font-medium">Temperature</div>
                    <div className="text-xs text-gray-400">New Delhi</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-card">
                    <div className="text-2xl font-extrabold text-kissan-amber-dark">↑</div>
                    <div className="text-xs text-gray-500 mt-0.5 font-medium">Wheat Price</div>
                    <div className="text-xs text-gray-400">₹2,275/qt</div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                FEATURE GRID
            ═══════════════════════════════════════════════════════════ */}
            <section className="mb-6" id="feature-grid">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">What do you need today?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Link
                                key={feature.path}
                                to={feature.path}
                                id={feature.id}
                                className={cn(
                                    'card-feature flex flex-col items-center text-center gap-2 p-3 sm:p-4 border',
                                    feature.color, feature.border
                                )}
                                aria-label={feature.label}
                            >
                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', feature.color)}>
                                    <Icon className={cn('w-5 h-5', feature.iconColor)} />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">{feature.label}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{feature.sublabel}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                MARKET SNAPSHOT + RECOMMENDED ACTIONS
            ═══════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {/* Market Snapshot */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden" id="market-snapshot">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <div>
                            <h3 className="font-bold text-gray-900">Today's Mandi Prices</h3>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Updated just now
                            </p>
                        </div>
                        <Link to="/market" id="view-all-market"
                            className="text-xs font-semibold text-kissan-green hover:text-kissan-green-dark flex items-center gap-1">
                            View All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {MARKET_SUMMARY.map((item) => (
                            <div key={item.crop} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{item.emoji}</span>
                                    <span className="font-medium text-gray-800 text-sm">{item.crop}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 text-sm">{item.price}<span className="text-xs text-gray-400 font-normal">/qt</span></p>
                                    <p className={cn('text-xs font-semibold flex items-center gap-0.5 justify-end', {
                                        'text-green-600': item.trend === 'up',
                                        'text-red-500': item.trend === 'down',
                                    })}>
                                        {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {item.change}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden" id="recommended-actions">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <div>
                            <h3 className="font-bold text-gray-900">Today's Farm Tasks</h3>
                            <p className="text-xs text-gray-400 mt-0.5">3 actions pending</p>
                        </div>
                        <Link to="/plots" id="view-all-tasks"
                            className="text-xs font-semibold text-kissan-green hover:text-kissan-green-dark flex items-center gap-1">
                            View Plots <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {ACTIONS.map((action, i) => {
                            const Icon = action.icon;
                            const severityColors = {
                                high: 'bg-red-100 text-red-600',
                                medium: 'bg-amber-100 text-amber-700',
                                low: 'bg-green-100 text-green-600',
                            };
                            return (
                                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', severityColors[action.severity])}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{action.title}</p>
                                        <p className="text-xs text-gray-400 truncate">{action.desc}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-lg font-medium">
                                        {action.time}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-4 border-t border-gray-50">
                        <Link to="/plots" className="btn-outline-green w-full text-sm py-2.5 rounded-xl justify-center flex items-center gap-2 border-2 border-kissan-green text-kissan-green hover:bg-kissan-green-pale font-semibold transition-colors">
                            <Plus className="w-4 h-4" /> Add New Plot
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════════════════════════════════ */}
            <section className="mb-6" id="testimonials">
                <h2 className="text-lg font-bold text-gray-900 mb-4">What Farmers Say 🌾</h2>
                <div className="bg-gradient-to-br from-kissan-green-pale to-white rounded-2xl border border-kissan-green/15 p-5 sm:p-6 shadow-card">
                    <div className="flex gap-1 mb-3">
                        {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-kissan-gold text-kissan-gold" />
                        ))}
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed italic">
                        "{TESTIMONIALS[activeTestimonial].quote}"
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="w-10 h-10 rounded-full bg-kissan-green text-white flex items-center justify-center font-bold text-base">
                            {TESTIMONIALS[activeTestimonial].avatar}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{TESTIMONIALS[activeTestimonial].name}</p>
                            <p className="text-xs text-gray-500">{TESTIMONIALS[activeTestimonial].crop} · {TESTIMONIALS[activeTestimonial].location}</p>
                        </div>
                    </div>
                    {/* Dots */}
                    <div className="flex gap-1.5 mt-4">
                        {TESTIMONIALS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTestimonial(i)}
                                className={cn('h-1.5 rounded-full transition-all duration-300 no-tap-highlight',
                                    i === activeTestimonial ? 'w-6 bg-kissan-green' : 'w-1.5 bg-gray-300'
                                )}
                                aria-label={`Testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                TRUST BADGES
            ═══════════════════════════════════════════════════════════ */}
            <section className="mb-4" id="trust-badges">
                <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                        Trusted by Govt. Bodies & Partners
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {PARTNERS.map((partner) => (
                        <div key={partner}
                            className="px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-500 shadow-card hover:border-kissan-green/30 hover:text-kissan-green transition-colors">
                            {partner}
                        </div>
                    ))}
                </div>

                {/* Impact Numbers */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { num: '2.5L+', label: 'Farmers Served', icon: '👨‍🌾' },
                        { num: '28%', label: 'Avg Yield Increase', icon: '📈' },
                        { num: '18', label: 'States Covered', icon: '🇮🇳' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-card">
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-xl font-extrabold text-kissan-green">{stat.num}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { CloudSun, Sprout, TrendingUp, Plus, Droplets, Wind, ArrowUpRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
    const { t } = useLanguage();
    const [weather, setWeather] = useState(null);
    const [market, setMarket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Weather (default New Delhi or user loc)
                const weatherRes = await fetch('/api/weather');
                const weatherData = await weatherRes.json();
                setWeather(weatherData);

                // Fetch Market Data
                const marketRes = await fetch('/api/market?limit=4');
                const marketData = await marketRes.json();
                setMarket(marketData);
            } catch (e) {
                console.error('Dashboard fetch error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>;
    }

    const currentWeather = weather?.current || { temp: '--', desc: 'Loading...', humidity: '--', wind: '--' };
    const marketItems = market?.data?.slice(0, 4) || [];
    const wheatPrice = market?.data?.find(i => i.commodity === 'Wheat')?.modal_price || '2275';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('welcome_back')} 👋</h1>
                    <p className="text-gray-500 mt-1">{t('farm_happening')}</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/weather">
                        <Button variant="outline">
                            <CloudSun className="mr-2 h-4 w-4" /> {t('weather')}
                        </Button>
                    </Link>
                    <Link to="/plots">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> {t('add_plot')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Weather & Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Weather Widget */}
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg col-span-1 md:col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-blue-100 flex items-center gap-2">
                            <CloudSun className="h-5 w-5" /> {t('current_weather')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-4xl font-bold">{currentWeather.temp}°C</p>
                                <p className="text-blue-100">{currentWeather.desc}</p>
                            </div>
                            <CloudSun className="h-16 w-16 text-blue-200 opacity-80" />
                        </div>
                        <div className="mt-6 flex justify-between text-sm text-blue-100">
                            <div className="flex items-center gap-1">
                                <Droplets className="h-4 w-4" /> {currentWeather.humidity}% {t('humidity')}
                            </div>
                            <div className="flex items-center gap-1">
                                <Wind className="h-4 w-4" /> {currentWeather.wind} km/h {t('wind')}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('farm_overview')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-green-600">{t('active_plots')}</p>
                                    <Sprout className="h-4 w-4 text-green-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">4</p>
                                <p className="text-xs text-gray-500 mt-1">Total 12.5 Acres</p>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-orange-600">{t('pending_tasks')}</p>
                                    <TrendingUp className="h-4 w-4 text-orange-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">3</p>
                                <p className="text-xs text-gray-500 mt-1">2 high priority</p>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-purple-600">{t('market_updates')}</p>
                                    <ArrowUpRight className="h-4 w-4 text-purple-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">Wheat ↑</p>
                                <p className="text-xs text-gray-500 mt-1">₹{wheatPrice} / Quintal</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommended Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('recommended_actions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: "Irrigate Plot A", desc: "Soil moisture is low (-20%)", time: "Today, 4:00 PM" },
                                { title: "Fertilizer Application", desc: "Recommended for Wheat crop", time: "Tomorrow" },
                                { title: "Check Pest Trap", desc: "Weekly maintenance", time: "Wed, 12th Feb" },
                            ].map((action, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                                        <p className="text-sm text-gray-500">{action.desc}</p>
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{action.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Market Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('local_mandi_prices')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { crop: "Wheat", price: "₹2,100", change: "+1.2%", trend: "up" },
                                { crop: "Rice (Basmati)", price: "₹3,800", change: "-0.5%", trend: "down" },
                                { crop: "Mustard", price: "₹5,400", change: "+0.8%", trend: "up" },
                                { crop: "Cotton", price: "₹6,200", change: "0%", trend: "stable" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {item.crop[0]}
                                        </div>
                                        <span className="font-medium text-gray-700">{item.crop}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{item.price}</p>
                                        <p className={cn("text-xs", {
                                            "text-green-600": item.trend === "up",
                                            "text-red-500": item.trend === "down",
                                            "text-gray-500": item.trend === "stable",
                                        })}>
                                            {item.change}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-100 text-center">
                            <Link to="/market" className="text-sm font-medium text-green-600 hover:text-green-700">{t('view_market_report')} &rarr;</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

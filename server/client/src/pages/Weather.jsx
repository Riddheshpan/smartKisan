import React, { useState, useEffect } from 'react';
import { CloudSun, CloudRain, Wind, Droplets, Sun, AlertTriangle, Snowflake, Cloud, MapPin, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

const iconMap = {
    Sun, CloudSun, Cloud, CloudRain, Snowflake,
    CloudFog: Cloud, CloudDrizzle: CloudRain, CloudLightning: CloudRain,
};

const Weather = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            let location = 'New Delhi'; // default

            // Get user's location from profile
            if (user) {
                const { data } = await api.getProfile(user.id);
                if (data?.location) {
                    location = data.location;
                }
            }

            try {
                const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
                const data = await res.json();
                setWeather(data);
                setLocationName(data.location?.name || location);
                if (data?.daily?.length > 0) {
                    setSelectedDay(data.daily[0].day);
                }
            } catch (e) {
                console.error('Weather fetch error:', e);
            }
            setLoading(false);
        };
        fetchWeather();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (!weather) {
        return <div className="p-8 text-center">Failed to load weather data.</div>;
    }

    const CurrentIcon = iconMap[weather.current.icon] || Cloud;
    const hourlyData = selectedDay ? (weather.hourly[selectedDay] || []) : [];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{t('weather_forecast_title')}</h1>
                <p className="text-muted-foreground">{t('weather_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Weather Card */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-400 text-white border-none shadow-xl">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-semibold opacity-90">{t('today')}</h2>
                                <div className="mt-2 text-7xl font-bold tracking-tighter">{weather.current.temp}°C</div>
                                <p className="text-xl font-medium mt-1 text-blue-100">{weather.current.desc}</p>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-sm font-medium bg-white/20 w-fit px-3 py-1 rounded-full mx-auto md:mx-0">
                                    <MapPin className="w-4 h-4" />
                                    <span>{locationName}</span>
                                    {locationName === 'New Delhi' && user && (
                                        <span className="text-xs ml-1 opacity-70">(Default)</span>
                                    )}
                                </div>
                            </div>
                            <CurrentIcon className="w-40 h-40 text-yellow-300 drop-shadow-lg" />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
                                <Wind className="w-6 h-6 mx-auto mb-2 opacity-80" />
                                <p className="text-sm opacity-70">{t('wind')}</p>
                                <p className="font-semibold text-lg">{weather.current.wind} km/h</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
                                <Droplets className="w-6 h-6 mx-auto mb-2 opacity-80" />
                                <p className="text-sm opacity-70">{t('humidity')}</p>
                                <p className="font-semibold text-lg">{weather.current.humidity}%</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
                                <CloudRain className="w-6 h-6 mx-auto mb-2 opacity-80" />
                                <p className="text-sm opacity-70">{t('precipitation')}</p>
                                <p className="font-semibold text-lg">{weather.current.precip} mm</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts */}
                <div className="space-y-6">
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-yellow-600">
                                <AlertTriangle className="w-5 h-5" /> {t('weather_alert')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{t('weather_alert_description')}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>{t('farming_advisory')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm">• {t('advisory_irrigation')}</p>
                            <p className="text-sm">• {t('advisory_harvest')}</p>
                            <p className="text-sm">• {t('advisory_pest')}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Weekly Forecast */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>{t('weekly_forecast')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                        {weather.daily.map((day) => {
                            const DayIcon = iconMap[day.icon] || Cloud;
                            return (
                                <div
                                    key={day.day}
                                    onClick={() => setSelectedDay(day.day)}
                                    className={cn(
                                        "p-4 rounded-xl text-center cursor-pointer transition-all",
                                        selectedDay === day.day ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500" : "hover:bg-muted"
                                    )}
                                >
                                    <p className="font-medium text-sm">{day.day}</p>
                                    <DayIcon className="w-8 h-8 mx-auto my-2 text-blue-500" />
                                    <p className="font-bold">{day.maxTemp}°</p>
                                    <p className="text-sm text-muted-foreground">{day.minTemp}°</p>
                                    <p className="text-xs text-blue-500 mt-1">{day.rainChance}%</p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Hourly Chart */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>{t('hourly_temperature')} - {selectedDay}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData}>
                                <defs>
                                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip />
                                <Area type="monotone" dataKey="temp" stroke="#3b82f6" fill="url(#tempGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Weather;

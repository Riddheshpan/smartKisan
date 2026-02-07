import React, { useState, useEffect } from 'react';
import { CloudSun, CloudRain, Wind, Droplets, Sun, AlertTriangle, Thermometer, Snowflake, Cloud, MapPin, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { weatherService } from '@/lib/weather';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// Icon Map
const iconMap = {
    Sun: Sun,
    CloudSun: CloudSun,
    Cloud: Cloud,
    CloudFog: Cloud, // Fallback to Cloud
    CloudDrizzle: CloudRain, // Fallback to CloudRain
    CloudRain: CloudRain,
    Snowflake: Snowflake,
    CloudLightning: CloudRain, // Fallback to CloudRain
};

const Weather = () => {
    const { t } = useLanguage();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            const data = await weatherService.getWeather(); // Defaults to Karnal
            setWeather(data);
            if (data && data.daily.length > 0) {
                setSelectedDay(data.daily[0].day);
            }
            setLoading(false);
        };
        fetchWeather();
    }, []);

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('weather_forecast_title')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('weather_subtitle')}</p>
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
                                    <span>Karnal, Haryana</span>
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

                {/* Right Side - Alerts & Advisories */}
                <div className="space-y-6">
                    <Card className="border-l-4 border-l-yellow-500 bg-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-yellow-600 text-lg">
                                <AlertTriangle className="w-5 h-5" /> {t('weather_alert')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                {weather.current.temp > 35 ? "Heatwave conditions possible." : "No severe alerts currently."}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {weather.current.temp > 35
                                    ? "Maintain adequate irrigation for crops."
                                    : "Conditions are favorable for field operations."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{t('farm_advisory')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-3 items-start">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                                    <Thermometer className="w-4 h-4 text-green-700 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-gray-900 dark:text-gray-200">{t('current_conditions')}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Temp: {weather.current.temp}°C, {t('humidity')}: {weather.current.humidity}%.
                                        Appropriate for {weather.current.precip > 0 ? "indoor activities" : "spraying and harvesting"}.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator className="my-8" />

            {/* 7 Day Forecast */}
            <Tabs defaultValue="forecast" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="forecast">{t('seven_day_forecast')}</TabsTrigger>
                    <TabsTrigger value="details">{t('detailed_analytics')}</TabsTrigger>
                </TabsList>
                <TabsContent value="forecast" className="mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                        {weather.daily.map((day, i) => {
                            const DayIcon = iconMap[day.icon] || Cloud;
                            return (
                                <Card key={i} className={`text-center transition-all ${i === 0 ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                    <CardContent className="p-4 flex flex-col items-center justify-between h-full gap-4">
                                        <p className="font-medium text-gray-600 dark:text-gray-300">{i === 0 ? t('today') : day.day}</p>
                                        <DayIcon className={cn("w-8 h-8", {
                                            "text-yellow-500": day.icon.includes("Sun"),
                                            "text-gray-500": day.icon.includes("Cloud"),
                                            "text-blue-500": day.icon.includes("Rain")
                                        })} />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">{day.maxTemp}° <span className="text-gray-400 text-sm">{day.minTemp}°</span></p>
                                            <p className="text-xs text-gray-400 truncate w-full">{day.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="details" className="space-y-6">
                    {/* Day Selection for Analytics */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {weather.daily.map((day, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedDay(day.day)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                                    selectedDay === day.day
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                )}
                            >
                                {i === 0 ? t('today') : day.day}
                            </button>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('hourly_temperature')} - {selectedDay === weather.daily[0].day ? t('today') : selectedDay}</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <div className="w-full h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis unit="°C" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="temp"
                                            stroke="#16a34a"
                                            fillOpacity={1}
                                            fill="url(#colorTemp)"
                                            name="Temperature"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Weather;

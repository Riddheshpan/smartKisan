// Open-Meteo API Service
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather interpretation codes (WW)
const getWeatherDesc = (code) => {
    const codes = {
        0: { desc: 'Clear sky', icon: 'Sun' },
        1: { desc: 'Mainly clear', icon: 'CloudSun' },
        2: { desc: 'Partly cloudy', icon: 'CloudSun' },
        3: { desc: 'Overcast', icon: 'Cloud' },
        45: { desc: 'Fog', icon: 'CloudFog' },
        48: { desc: 'Depositing rime fog', icon: 'CloudFog' },
        51: { desc: 'Light drizzle', icon: 'CloudDrizzle' },
        53: { desc: 'Moderate drizzle', icon: 'CloudDrizzle' },
        55: { desc: 'Dense drizzle', icon: 'CloudDrizzle' },
        61: { desc: 'Slight rain', icon: 'CloudRain' },
        63: { desc: 'Moderate rain', icon: 'CloudRain' },
        65: { desc: 'Heavy rain', icon: 'CloudRain' },
        71: { desc: 'Slight snow', icon: 'Snowflake' },
        73: { desc: 'Moderate snow', icon: 'Snowflake' },
        75: { desc: 'Heavy snow', icon: 'Snowflake' },
        80: { desc: 'Slight rain showers', icon: 'CloudRain' },
        81: { desc: 'Moderate rain showers', icon: 'CloudRain' },
        82: { desc: 'Violent rain showers', icon: 'CloudRain' },
        95: { desc: 'Thunderstorm', icon: 'CloudLightning' },
    };
    return codes[code] || { desc: 'Unknown', icon: 'Cloud' };
};

export const weatherService = {
    getWeather: async (lat = 29.6857, lon = 76.9905) => {
        try {
            const params = new URLSearchParams({
                latitude: lat,
                longitude: lon,
                current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                hourly: 'temperature_2m,precipitation_probability',
                timezone: 'auto'
            });

            const response = await fetch(`${BASE_URL}?${params}`);
            if (!response.ok) throw new Error('Weather fetch failed');

            const data = await response.json();

            // Format Current Weather
            const current = {
                temp: Math.round(data.current.temperature_2m),
                humidity: data.current.relative_humidity_2m,
                wind: data.current.wind_speed_10m,
                precip: data.current.precipitation,
                ...getWeatherDesc(data.current.weather_code)
            };

            // Format Daily Forecast
            const daily = data.daily.time.map((time, index) => ({
                day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
                maxTemp: Math.round(data.daily.temperature_2m_max[index]),
                minTemp: Math.round(data.daily.temperature_2m_min[index]),
                rainChance: data.daily.precipitation_probability_max?.[index] || 0,
                ...getWeatherDesc(data.daily.weather_code[index])
            }));

            // Format Hourly Forecast (Grouped by Day)
            const hourlyByDay = {};
            data.hourly.time.forEach((timeStr, index) => {
                const date = new Date(timeStr);
                const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"

                if (!hourlyByDay[dayKey]) {
                    hourlyByDay[dayKey] = [];
                }

                hourlyByDay[dayKey].push({
                    time: date.toLocaleTimeString('en-US', { hour: 'numeric' }),
                    temp: Math.round(data.hourly.temperature_2m[index]),
                    rain: data.hourly.precipitation_probability[index]
                });
            });

            return { current, daily, hourly: hourlyByDay, location: { lat, lon } };
        } catch (error) {
            console.error('Weather API Error:', error);
            return null;
        }
    }
};

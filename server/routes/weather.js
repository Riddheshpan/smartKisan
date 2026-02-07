const express = require('express');
const router = express.Router();

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_API = 'https://geocoding-api.open-meteo.com/v1/search';

const weatherCodes = {
    0: { desc: 'Clear sky', icon: 'Sun' },
    1: { desc: 'Mainly clear', icon: 'CloudSun' },
    2: { desc: 'Partly cloudy', icon: 'CloudSun' },
    3: { desc: 'Overcast', icon: 'Cloud' },
    45: { desc: 'Fog', icon: 'Cloud' },
    48: { desc: 'Fog', icon: 'Cloud' },
    51: { desc: 'Drizzle', icon: 'CloudRain' },
    53: { desc: 'Drizzle', icon: 'CloudRain' },
    55: { desc: 'Drizzle', icon: 'CloudRain' },
    61: { desc: 'Rain', icon: 'CloudRain' },
    63: { desc: 'Rain', icon: 'CloudRain' },
    65: { desc: 'Heavy rain', icon: 'CloudRain' },
    71: { desc: 'Snow', icon: 'Snowflake' },
    73: { desc: 'Snow', icon: 'Snowflake' },
    75: { desc: 'Heavy snow', icon: 'Snowflake' },
    80: { desc: 'Rain showers', icon: 'CloudRain' },
    81: { desc: 'Rain showers', icon: 'CloudRain' },
    82: { desc: 'Heavy showers', icon: 'CloudRain' },
    95: { desc: 'Thunderstorm', icon: 'CloudRain' },
};

const getDesc = (code) => weatherCodes[code] || { desc: 'Unknown', icon: 'Cloud' };

// GET /api/weather?location=Karnal,Haryana OR ?lat=29.68&lon=76.99
router.get('/', async (req, res) => {
    try {
        let { lat, lon, location } = req.query;

        // If location name provided, geocode it
        if (location && (!lat || !lon)) {
            const geoRes = await fetch(`${GEOCODE_API}?name=${encodeURIComponent(location)}&count=1`);
            const geoData = await geoRes.json();

            if (geoData.results?.[0]) {
                lat = geoData.results[0].latitude;
                lon = geoData.results[0].longitude;
                location = geoData.results[0].name + (geoData.results[0].admin1 ? `, ${geoData.results[0].admin1}` : '');
            }
        }

        // Defaults
        lat = lat || 28.6139;
        lon = lon || 77.2090;
        location = location || 'New Delhi';

        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
            hourly: 'temperature_2m,precipitation_probability',
            timezone: 'auto'
        });

        const response = await fetch(`${WEATHER_API}?${params}`);
        if (!response.ok) throw new Error('Weather fetch failed');
        const data = await response.json();

        const current = {
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            wind: data.current.wind_speed_10m,
            precip: data.current.precipitation,
            ...getDesc(data.current.weather_code)
        };

        const daily = data.daily.time.map((time, i) => ({
            day: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            rainChance: data.daily.precipitation_probability_max?.[i] || 0,
            ...getDesc(data.daily.weather_code[i])
        }));

        const hourly = {};
        data.hourly.time.forEach((t, i) => {
            const d = new Date(t);
            const key = d.toLocaleDateString('en-US', { weekday: 'short' });
            if (!hourly[key]) hourly[key] = [];
            hourly[key].push({
                time: d.toLocaleTimeString('en-US', { hour: 'numeric' }),
                temp: Math.round(data.hourly.temperature_2m[i]),
                rain: data.hourly.precipitation_probability[i]
            });
        });

        res.json({ current, daily, hourly, location: { name: location, lat, lon } });
    } catch (error) {
        console.error('Weather Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather' });
    }
});

module.exports = router;

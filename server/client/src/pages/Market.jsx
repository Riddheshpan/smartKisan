import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Filter, Search, MapPin, Calendar,
    Leaf, Loader2, RefreshCw, ArrowUpRight, ArrowDownRight,
    Minus, Clock, BarChart3
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MARKET_DATA = [
    { id: 1, state: 'Punjab', market: 'Khanna APMC', commodity: 'Wheat', emoji: '🌾', min_price: 2100, max_price: 2350, modal_price: 2275, date: '2024-03-15', trend: 'up', change: '+1.2%' },
    { id: 2, state: 'Punjab', market: 'Ludhiana APMC', commodity: 'Rice (Basmati)', emoji: '🍚', min_price: 3500, max_price: 4200, modal_price: 3950, date: '2024-03-15', trend: 'stable', change: '0%' },
    { id: 3, state: 'Haryana', market: 'Karnal APMC', commodity: 'Wheat', emoji: '🌾', min_price: 2150, max_price: 2380, modal_price: 2300, date: '2024-03-15', trend: 'up', change: '+0.9%' },
    { id: 4, state: 'Haryana', market: 'Ambala APMC', commodity: 'Potato', emoji: '🥔', min_price: 600, max_price: 850, modal_price: 750, date: '2024-03-15', trend: 'down', change: '-2.1%' },
    { id: 5, state: 'Maharashtra', market: 'Pune APMC', commodity: 'Onion', emoji: '🧅', min_price: 1200, max_price: 1800, modal_price: 1550, date: '2024-03-15', trend: 'up', change: '+3.4%' },
    { id: 6, state: 'Maharashtra', market: 'Nashik APMC', commodity: 'Tomato', emoji: '🍅', min_price: 1500, max_price: 2200, modal_price: 1900, date: '2024-03-15', trend: 'down', change: '-1.8%' },
    { id: 7, state: 'Uttar Pradesh', market: 'Agra APMC', commodity: 'Potato', emoji: '🥔', min_price: 650, max_price: 900, modal_price: 800, date: '2024-03-15', trend: 'stable', change: '0%' },
    { id: 8, state: 'Madhya Pradesh', market: 'Indore APMC', commodity: 'Soybean', emoji: '🫘', min_price: 4200, max_price: 4800, modal_price: 4600, date: '2024-03-15', trend: 'up', change: '+1.5%' },
    { id: 9, state: 'Rajasthan', market: 'Jaipur APMC', commodity: 'Mustard', emoji: '🌼', min_price: 4800, max_price: 5300, modal_price: 5100, date: '2024-03-15', trend: 'down', change: '-0.7%' },
    { id: 10, state: 'Gujarat', market: 'Surat APMC', commodity: 'Cotton', emoji: '☁️', min_price: 6500, max_price: 7200, modal_price: 6900, date: '2024-03-15', trend: 'up', change: '+2.5%' },
];

// 7-day price trend (mock)
const WHEAT_TREND = [
    { day: 'Mon', price: 2150 }, { day: 'Tue', price: 2180 }, { day: 'Wed', price: 2200 },
    { day: 'Thu', price: 2220 }, { day: 'Fri', price: 2250 }, { day: 'Sat', price: 2260 }, { day: 'Sun', price: 2275 },
];

const CROP_CHIPS = ['All', 'Wheat', 'Rice', 'Potato', 'Onion', 'Tomato', 'Soybean', 'Mustard', 'Cotton'];
const STATE_CHIPS = ['All States', 'Punjab', 'Haryana', 'Maharashtra', 'UP', 'MP', 'Rajasthan', 'Gujarat'];

// ─── Trend Badge ───────────────────────────────────────────────────────────
const TrendBadge = ({ trend, change }) => {
    if (trend === 'up') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <TrendingUp className="w-3 h-3" /> {change}
        </span>
    );
    if (trend === 'down') return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
            <TrendingDown className="w-3 h-3" /> {change}
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
            <Minus className="w-3 h-3" /> Stable
        </span>
    );
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl shadow-card px-4 py-3">
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-lg font-bold text-kissan-green">₹{payload[0].value}</p>
                <p className="text-xs text-gray-400">per quintal</p>
            </div>
        );
    }
    return null;
};

// ─── Market Component ──────────────────────────────────────────────────────
const Market = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All States');
    const [selectedCrop, setSelectedCrop] = useState('All');
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        const fetchMarket = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedState !== 'All States') params.append('state', selectedState);
                if (selectedCrop !== 'All') params.append('commodity', selectedCrop);
                if (searchTerm) params.append('search', searchTerm);
                const res = await fetch(`/api/market?${params}`);
                const data = await res.json();
                setMarketData(data.data || MARKET_DATA);
            } catch {
                setMarketData(MARKET_DATA);
            } finally {
                setLoading(false);
                setLastUpdated(new Date());
            }
        };
        const timer = setTimeout(fetchMarket, 300);
        return () => clearTimeout(timer);
    }, [selectedState, selectedCrop, searchTerm]);

    // Client-side filter fallback
    const filteredData = marketData.filter(item => {
        const matchState = selectedState === 'All States' || item.state.toLowerCase().includes(selectedState.toLowerCase());
        const matchCrop = selectedCrop === 'All' || item.commodity.toLowerCase().includes(selectedCrop.toLowerCase());
        const matchSearch = !searchTerm ||
            item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.market.toLowerCase().includes(searchTerm.toLowerCase());
        return matchState && matchCrop && matchSearch;
    });

    const topGainer = [...MARKET_DATA].filter(i => i.trend === 'up').sort(() => 0.5 - Math.random())[0];
    const topLoser = [...MARKET_DATA].filter(i => i.trend === 'down')[0];

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                        📊 Mandi Prices <span className="text-kissan-green text-xl font-bold">LIVE</span>
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Real-time APMC data
                        <span className="mx-1">·</span>
                        <Clock className="w-3 h-3" />
                        {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <button
                    id="refresh-market"
                    onClick={() => setLoading(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-kissan-green hover:text-kissan-green transition-all no-tap-highlight"
                >
                    <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* ── Summary Cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                    <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-2">
                        <TrendingUp className="w-3.5 h-3.5" /> Top Gainer
                    </div>
                    <p className="font-extrabold text-gray-900 text-base">{topGainer?.commodity}</p>
                    <p className="text-green-600 font-semibold text-sm">{topGainer?.change}</p>
                    <p className="text-xs text-gray-400 mt-0.5">₹{topGainer?.modal_price}/qt</p>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                    <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold mb-2">
                        <TrendingDown className="w-3.5 h-3.5" /> Top Loser
                    </div>
                    <p className="font-extrabold text-gray-900 text-base">{topLoser?.commodity}</p>
                    <p className="text-red-600 font-semibold text-sm">{topLoser?.change}</p>
                    <p className="text-xs text-gray-400 mt-0.5">₹{topLoser?.modal_price}/qt</p>
                </div>
                <div className="bg-kissan-sky-pale border-2 border-kissan-sky/30 rounded-2xl p-4">
                    <div className="flex items-center gap-1.5 text-kissan-sky text-xs font-semibold mb-2">
                        <BarChart3 className="w-3.5 h-3.5" /> High Demand
                    </div>
                    <p className="font-extrabold text-gray-900 text-base">Wheat</p>
                    <p className="text-kissan-sky font-semibold text-sm">High Volume</p>
                    <p className="text-xs text-gray-400 mt-0.5">Punjab, MP</p>
                </div>
            </div>

            {/* ── 7-Day Price Trend Chart ────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-6" id="price-trend-chart">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900">7-Day Wheat Price Trend</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Khanna APMC · per quintal (₹)</p>
                    </div>
                    <span className="badge-up">↑ +1.2% week</span>
                </div>
                <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={WHEAT_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="price" stroke="#2E7D32" strokeWidth={2.5} fill="url(#priceGradient)" dot={{ fill: '#2E7D32', r: 4 }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Filter Bar ────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 mb-5" id="market-filters">
                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        id="market-search"
                        type="search"
                        placeholder="Search crop or market..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-kissan pl-12"
                        aria-label="Search market"
                    />
                </div>
                {/* Crop Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {CROP_CHIPS.map((crop) => (
                        <button
                            key={crop}
                            id={`crop-filter-${crop.toLowerCase()}`}
                            onClick={() => setSelectedCrop(crop)}
                            className={cn(
                                'flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 no-tap-highlight',
                                selectedCrop === crop
                                    ? 'bg-kissan-green text-white border-kissan-green'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-kissan-green/40 hover:text-kissan-green'
                            )}
                        >
                            {crop}
                        </button>
                    ))}
                </div>
                {/* State Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 mt-3 no-scrollbar">
                    {STATE_CHIPS.map((state) => (
                        <button
                            key={state}
                            id={`state-filter-${state.toLowerCase().replace(' ', '-')}`}
                            onClick={() => setSelectedState(state)}
                            className={cn(
                                'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 no-tap-highlight',
                                selectedState === state
                                    ? 'bg-kissan-sky text-white border-kissan-sky'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-kissan-sky/40 hover:text-kissan-sky'
                            )}
                        >
                            {state}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Price Table ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden" id="market-table">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">
                        Market Prices
                        <span className="ml-2 text-sm text-gray-400 font-normal">({filteredData.length} markets)</span>
                    </h3>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-kissan-green" />
                        <p className="text-gray-400 text-sm">Fetching latest mandi prices...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <p className="text-gray-400">No results for your filters</p>
                        <button onClick={() => { setSelectedCrop('All'); setSelectedState('All States'); setSearchTerm(''); }}
                            className="text-sm text-kissan-green font-semibold hover:underline">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Commodity', 'State / Market', 'Min ₹', 'Max ₹', 'Modal ₹', 'Trend'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{item.emoji}</span>
                                                    <span className="font-semibold text-gray-800">{item.commodity}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-700">{item.state}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3" /> {item.market}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-gray-500">₹{item.min_price}</td>
                                            <td className="px-5 py-4 text-gray-500">₹{item.max_price}</td>
                                            <td className="px-5 py-4">
                                                <span className="font-bold text-kissan-green text-base">₹{item.modal_price}</span>
                                                <span className="text-xs text-gray-400"> /qt</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <TrendBadge trend={item.trend} change={item.change} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {filteredData.map((item) => (
                                <div key={item.id} className="px-5 py-4 flex items-center gap-3">
                                    <span className="text-2xl">{item.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="font-bold text-gray-900">{item.commodity}</p>
                                            <TrendBadge trend={item.trend} change={item.change} />
                                        </div>
                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {item.market} · {item.state}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-extrabold text-kissan-green">₹{item.modal_price}</p>
                                        <p className="text-xs text-gray-400">modal/qt</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Market;

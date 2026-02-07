import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Filter, Search, MapPin, DollarSign, Calendar, Leaf, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock Data for Indian Market Prices
const MOCK_MARKET_DATA = [
    { id: 1, state: "Punjab", market: "Khanna", commodity: "Wheat", min_price: 2100, max_price: 2350, modal_price: 2275, date: "2024-03-15", trend: "up" },
    { id: 2, state: "Punjab", market: "Ludhiana", commodity: "Rice (Basmati)", min_price: 3500, max_price: 4200, modal_price: 3950, date: "2024-03-15", trend: "stable" },
    { id: 3, state: "Haryana", market: "Karnal", commodity: "Wheat", min_price: 2150, max_price: 2380, modal_price: 2300, date: "2024-03-15", trend: "up" },
    { id: 4, state: "Haryana", market: "Ambala", commodity: "Potato", min_price: 600, max_price: 850, modal_price: 750, date: "2024-03-15", trend: "down" },
    { id: 5, state: "Maharashtra", market: "Pune", commodity: "Onion", min_price: 1200, max_price: 1800, modal_price: 1550, date: "2024-03-15", trend: "up" },
    { id: 6, state: "Maharashtra", market: "Nashik", commodity: "Tomato", min_price: 1500, max_price: 2200, modal_price: 1900, date: "2024-03-15", trend: "down" },
    { id: 7, state: "Uttar Pradesh", market: "Agra", commodity: "Potato", min_price: 650, max_price: 900, modal_price: 800, date: "2024-03-15", trend: "stable" },
    { id: 8, state: "Madhya Pradesh", market: "Indore", commodity: "Soybean", min_price: 4200, max_price: 4800, modal_price: 4600, date: "2024-03-15", trend: "up" },
    { id: 9, state: "Rajasthan", market: "Jaipur", commodity: "Mustard", min_price: 4800, max_price: 5300, modal_price: 5100, date: "2024-03-15", trend: "down" },
    { id: 10, state: "Gujarat", market: "Surat", commodity: "Cotton", min_price: 6500, max_price: 7200, modal_price: 6900, date: "2024-03-15", trend: "up" },
];

const Market = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState("All");
    const [selectedCommodity, setSelectedCommodity] = useState("All");
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter lists - derived from backend data ideally, but can keep static for now or derive from full set
    const states = ["All", "Punjab", "Haryana", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Gujarat", "Karnataka", "Tamil Nadu"];
    const commodities = ["All", "Wheat", "Rice", "Potato", "Onion", "Tomato", "Soybean", "Mustard", "Cotton", "Maize"];

    useEffect(() => {
        const fetchMarket = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedState !== 'All') params.append('state', selectedState);
                if (selectedCommodity !== 'All') params.append('commodity', selectedCommodity);
                if (searchTerm) params.append('search', searchTerm);

                const res = await fetch(`/api/market?${params.toString()}`);
                const data = await res.json();
                setMarketData(data.data || []);
            } catch (e) {
                console.error('Market fetch error:', e);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchMarket, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [selectedState, selectedCommodity, searchTerm]);

    const filteredData = marketData; // Already filtered by server

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{t('smart_mandi_live')} <span className="text-primary">Live</span></h1>
                    <p className="text-muted-foreground mt-1">{t('real_time_prices')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> {new Date().toLocaleDateString()}</Button>
                    <Button>Live Updates</Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('top_gainer')} (24h)</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Cotton</div>
                        <p className="text-xs text-green-600 font-medium">+2.5% from yesterday</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Price: ₹6,900/qt</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('top_loser')} (24h)</CardTitle>
                        <TrendingDown className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Tomato</div>
                        <p className="text-xs text-red-600 font-medium">-1.8% from yesterday</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Price: ₹1,900/qt</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('high_demand')}</CardTitle>
                        <DollarSign className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Wheat</div>
                        <p className="text-xs text-blue-600 font-medium">High Volume Trade</p>
                        <p className="text-xs text-muted-foreground mt-1">Key Markets: Punjab, MP</p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table & Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <CardTitle>{t('market_prices')}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            {/* State Filter */}
                            <div className="relative">
                                <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <select
                                    className="h-9 w-[150px] pl-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-background"
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                >
                                    {states.map(state => <option key={state} value={state}>{state}</option>)}
                                </select>
                            </div>

                            {/* Commodity Filter */}
                            <div className="relative">
                                <Leaf className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <select
                                    className="h-9 w-[150px] pl-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-background"
                                    value={selectedCommodity}
                                    onChange={(e) => setSelectedCommodity(e.target.value)}
                                >
                                    {commodities.map(comm => <option key={comm} value={comm}>{comm}</option>)}
                                </select>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('search_market')}
                                    className="pl-9 w-[200px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Commodity</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">State</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Market Center</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Min Price (₹)</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Max Price (₹)</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Modal Price (₹)</th>
                                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 relative">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                    <p>Fetching latest mandi prices...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredData.length > 0 ? filteredData.map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{item.commodity}</td>
                                            <td className="p-4 align-middle">{item.state}</td>
                                            <td className="p-4 align-middle flex items-center gap-2">
                                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                                {item.market}
                                            </td>
                                            <td className="p-4 align-middle text-right">{item.min_price}</td>
                                            <td className="p-4 align-middle text-right">{item.max_price}</td>
                                            <td className="p-4 align-middle text-right font-bold text-primary">₹{item.modal_price}</td>
                                            <td className="p-4 align-middle text-center">
                                                {item.trend === 'up' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">▲ High</Badge>}
                                                {item.trend === 'down' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">▼ Low</Badge>}
                                                {item.trend === 'stable' && <Badge variant="outline" className="text-muted-foreground">Stable</Badge>}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                                No market data found for your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Market;

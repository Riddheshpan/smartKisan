const express = require('express');
const router = express.Router();

// Mock Market Data
const MARKET_DATA = [
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

// GET /api/market
router.get('/', (req, res) => {
    const { state, commodity, search } = req.query;
    let data = [...MARKET_DATA];

    if (state && state !== 'All') {
        data = data.filter(item => item.state === state);
    }

    if (commodity && commodity !== 'All') {
        data = data.filter(item => item.commodity === commodity);
    }

    if (search) {
        const term = search.toLowerCase();
        data = data.filter(item =>
            item.market.toLowerCase().includes(term) ||
            item.commodity.toLowerCase().includes(term)
        );
    }

    // Summary stats
    const states = [...new Set(MARKET_DATA.map(item => item.state))];
    const commodities = [...new Set(MARKET_DATA.map(item => item.commodity))];

    res.json({
        data,
        meta: { states, commodities, total: data.length }
    });
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const weatherRoutes = require('./routes/weather');
const aiRoutes = require('./routes/ai');
const marketRoutes = require('./routes/market');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/ai/crop-health', express.raw({ type: ['image/*'], limit: '10mb' }));

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/market', marketRoutes);

// Serve Frontend (production)
app.use(express.static(path.join(__dirname, 'client/dist')));

// SPA Fallback - serve index.html for all non-API routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;

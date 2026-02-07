const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
    return new GoogleGenerativeAI(apiKey);
};

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await model.generateContent(
            `You are an agricultural expert for Indian farmers. Keep answers short and practical. Answer in same language as question.\nQuestion: ${message}`
        );
        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error('Chat Error:', error.message);
        res.status(500).json({ error: 'AI unavailable' });
    }
});

// POST /api/ai/crop-health
router.post('/crop-health', async (req, res) => {
    try {
        const model = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
        const base64Image = req.body.toString('base64');
        const mimeType = req.headers['content-type'] || 'image/jpeg';

        const result = await model.generateContent([
            `Analyze this crop/plant image. Return ONLY valid JSON (no markdown):
{
  "plant": "plant name or Unknown",
  "status": "Healthy" or "Diseased" or "Pest Affected",
  "disease": "disease name or null",
  "severity": "None" or "Low" or "Moderate" or "High",
  "confidence": 0-100,
  "treatment": "treatment steps as string",
  "prevention": "prevention tips as string"
}`,
            { inlineData: { mimeType, data: base64Image } }
        ]);

        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            res.json({ success: true, ...analysis });
        } else {
            throw new Error('Invalid AI response format');
        }
    } catch (error) {
        console.error('Crop Health Error:', error.message);
        res.status(500).json({ error: 'Analysis failed', details: error.message });
    }
});

module.exports = router;

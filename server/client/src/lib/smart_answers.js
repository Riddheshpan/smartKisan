export const SMART_ANSWERS = [
    {
        keywords: ["weather", "rain", "forecast", "cloud"],
        answer: "I can't check live weather without an Internet connection tailored to your exact GPS, but generally: Check the 'Weather' tab for a 7-day forecast. If you see clouds, avoid spraying pesticides today."
    },
    {
        keywords: ["price", "rate", "cost", "mandi", "market"],
        answer: "Market rates update daily. Currently, Wheat is trending around ₹2200/qt and Cotton around ₹6900/qt. For precise local rates, please visit the 'Market' page."
    },
    {
        keywords: ["pm kisan", "subsidy", "scheme", "money", "government"],
        answer: "The PM-KISAN scheme provides ₹6000/year to eligible farmers. You can check your status on the official pmkisan.gov.in portal. We also have a 'Schemes' section in this app!"
    },
    {
        keywords: ["rust", "yellow", "leaf", "disease", "fungus"],
        answer: "Yellow rust is common in wheat. Symptoms include yellow stripes on leaves. Treatment: Spray Propiconazole (0.1%) immediately. Upload a photo in 'Crop Health' for a sure diagnosis."
    },
    {
        keywords: ["soil", "ph", "test", "acid", "alkaline"],
        answer: "Ideal soil pH for most crops is 6.0 to 7.0. If your soil is too acidic, add lime. If too alkaline, add gypsum. Do you need help with a specific crop's soil needs?"
    },
    {
        keywords: ["wheat", "gehu"],
        answer: "Wheat needs cold weather for growth. Best sowing time is Nov 1 - Nov 15. Recommended varieties: PBW 343, HD 2967. Irrigation is critical at the crown root initiation stage (21 days after sowing)."
    },
    {
        keywords: ["rice", "paddy", "dhan"],
        answer: "Rice requires standing water. Beware of Blast disease and Stem Borers. Use nitrogen fertilizers in splits for best yield. Harvesting should be done when 80% grains turn golden."
    },
    {
        keywords: ["cotton", "kapas"],
        answer: "Cotton is sensitive to waterlogging. Watch out for Bollworms. BT Cotton is resistant to some pests but still needs monitoring. Best soil: Black soil (Regur)."
    },
    {
        keywords: ["fertilizer", "urea", "dap", "npk"],
        answer: "Balanced fertilization is key. Don't overuse Urea as it makes plants succulent and prone to pests. Use NPK 4:2:1 ratio for general cereals, or get a Soil Health Card for specific advice."
    },
    {
        keywords: ["organic", "natural", "compost"],
        answer: "Organic farming improves long-term soil health. Start by using Vermicompost and Jeevamrut (cow dung & urine mixture). It reduces cost and improves water retention."
    },
    {
        keywords: ["irrigation", "water", "drip", "sprinkler"],
        answer: "Drip irrigation saves 40-60% water and delivers fertilizer directly to roots (fertigation). Government subsidies differ by state but often cover 50-80% of the cost."
    }
];

export const getSmartAnswer = (text) => {
    const lowerText = text.toLowerCase();

    // Find the first matching answer
    for (const item of SMART_ANSWERS) {
        if (item.keywords.some(keyword => lowerText.includes(keyword))) {
            return item.answer;
        }
    }

    return null; // No match found
};

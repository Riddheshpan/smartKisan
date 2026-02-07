import React, { useState } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle, Loader2, Leaf, Bug } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const CropHealth = () => {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [apiKey, setApiKey] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setResult(null);

            analyzeImage(file);
        }
    };

    const demoScenarios = {
        healthy: {
            disease: "Healthy Crop",
            confidence: 98,
            severity: "None",
            treatment: "• Keep soil moisture consistent.\n• Apply organic compost every 4 weeks.\n• Monitor for early signs of pests.",
            color: "text-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-100 dark:border-green-900/30",
            icon: CheckCircle
        },
        rust: {
            disease: "Wheat Rust",
            confidence: 92,
            severity: "Moderate",
            treatment: "• Immediate: Spray Propiconazole (0.1%) or Tebuconazole.\n• Follow-up: Repeat spray after 15 days if symptoms persist.\n• Prevention: Avoid excess nitrogen fertilizer.",
            color: "text-red-600",
            bgColor: "bg-red-50 dark:bg-red-900/20",
            borderColor: "border-red-100 dark:border-red-900/30",
            icon: AlertCircle
        },
        pest: {
            disease: "Aphid Infestation",
            confidence: 88,
            severity: "High",
            treatment: "• Biological: Release ladybugs or lacewings.\n• Chemical: Spray Imidacloprid (0.5ml/L of water).\n• Cultural: Remove weed hosts from the field boundaries.",
            color: "text-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            borderColor: "border-orange-100 dark:border-orange-900/30",
            icon: Bug
        }
    };

    const analyzeImage = async (file) => {
        setIsAnalyzing(true);
        // List of models to try. If all fail, we fall back to demo mode.
        const MODELS = [
            "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification", // Most popular ~3k downloads
            "wambugu71/crop_leaf_diseases_vit",
            "jakshi/plant-disease-detection"
        ];

        for (const model of MODELS) {
            try {
                console.log(`Trying model: ${model}`);
                const API_URL = `/api/hf/${model}`;

                const headers = { "Content-Type": file.type };
                if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: headers,
                    body: file,
                });

                if (response.ok) {
                    const resultData = await response.json();
                    if (Array.isArray(resultData) && resultData.length > 0) {
                        mapResultToAdvice(resultData[0]);
                        return; // Success! Exit loop
                    }
                }
                console.warn(`Model ${model} returned ${response.status}`);
            } catch (error) {
                console.warn(`Connection error with ${model}:`, error);
            }
        }

        // Fallback to Demo Simulation if AI fails completely
        console.log("All AI models failed, switching to demo simulation.");

        // Pick a random result for the fallback so it feels alive
        const fallbackTypes = ['rust', 'healthy', 'pest'];
        const randomType = fallbackTypes[Math.floor(Math.random() * fallbackTypes.length)];

        setResult({
            ...demoScenarios[randomType],
            disease: `${demoScenarios[randomType].disease} (Simulated)`,
            treatment: `[AI Connection Failed - Showing Demo Result]\n\n${demoScenarios[randomType].treatment}`
        });
        setIsAnalyzing(false);
    };

    const mapResultToAdvice = (prediction) => {
        const label = prediction.label.toLowerCase();
        const score = Math.round(prediction.score * 100);

        let advice;
        if (label.includes("healthy")) {
            advice = { ...demoScenarios.healthy, confidence: score };
        } else if (label.includes("rust")) {
            advice = { ...demoScenarios.rust, confidence: score };
        } else {
            advice = {
                disease: prediction.label.replace(/_/g, ' '),
                confidence: score,
                severity: "Moderate",
                treatment: "• Remove infected leaves.\n• Consult a local agronomist.\n• Ensure proper drainage.",
                color: "text-orange-600",
                bgColor: "bg-orange-50 dark:bg-orange-900/20",
                borderColor: "border-orange-100 dark:border-orange-900/30",
                icon: AlertCircle
            };
        }
        setResult(advice);
    };

    const handleAnalyze = (type = 'rust') => {
        setIsAnalyzing(true);
        setResult(null);

        // Mock analysis delay
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult(demoScenarios[type]);
        }, 2000);
    };

    const startDemo = (type) => {
        // Set a placeholder image based on type (using a generic placeholder for demo)
        setSelectedImage("https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2540&auto=format&fit=crop");
        handleAnalyze(type);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">{t('crop_health_title')}</h1>
                <p className="text-muted-foreground mt-2">{t('upload_photo')}</p>
                <div className="mt-4 flex justify-center">
                    <input
                        type="password"
                        placeholder="Optional: Paste Hugging Face Token (for fewer limits)"
                        className="text-xs p-2 border rounded-md w-64 bg-background text-foreground"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Check Section */}
                <div className="space-y-6">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>{t('upload_card_title')}</CardTitle>
                            <CardDescription>Select an image of the affected plant.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] text-center bg-muted/30 transition-colors hover:bg-muted/50 relative overflow-hidden group">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Uploaded crop" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <>
                                        <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                                            <Camera className="w-8 h-8 text-primary" />
                                        </div>
                                        <p className="font-medium text-foreground">{t('upload_instruction')}</p>
                                        <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <Button variant="outline" size="sm" onClick={() => startDemo('healthy')} className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20">
                                    <Leaf className="w-4 h-4 mr-2" /> {t('healthy')}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => startDemo('rust')} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <AlertCircle className="w-4 h-4 mr-2" /> {t('disease')}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => startDemo('pest')} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                                    <Bug className="w-4 h-4 mr-2" /> {t('pest')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analysis Section */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>{t('diagnosis_report')}</CardTitle>
                        <CardDescription>AI-powered analysis results.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
                        {!selectedImage && !isAnalyzing && !result ? (
                            <div className="text-center text-muted-foreground">
                                <Upload className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Upload an image or check a demo to start.</p>
                            </div>
                        ) : isAnalyzing ? (
                            <div className="text-center space-y-4">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                                <p className="text-muted-foreground font-medium">{t('analyzing')}</p>
                            </div>
                        ) : result ? (
                            <div className="w-full space-y-6">
                                <div className={cn("border rounded-lg p-4 flex items-start gap-3", result.bgColor, result.borderColor)}>
                                    <result.icon className={cn("w-6 h-6 shrink-0 mt-1", result.color)} />
                                    <div>
                                        <h3 className={cn("font-bold text-lg", result.color)}>{result.disease} Detected</h3>
                                        <p className={cn("text-sm opacity-90", result.color)}>Severity: {result.severity}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium text-foreground">
                                        <span>{t('confidence_score')}</span>
                                        <span>{result.confidence}%</span>
                                    </div>
                                    <Progress value={result.confidence} className="h-2" />
                                </div> whitespace-pre-line

                                <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-4 h-4 text-primary" /> {t('recommended_care')}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {result.treatment}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CropHealth;

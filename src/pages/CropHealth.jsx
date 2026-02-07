import React, { useState } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle, Loader2, Leaf } from 'lucide-react';
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
    const [error, setError] = useState(null);

    const analyzeImage = async (file) => {
        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/ai/crop-health', {
                method: 'POST',
                headers: { 'Content-Type': file.type },
                body: file,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Analysis failed');
            }

            setResult(data);
        } catch (e) {
            setError(e.message || 'Failed to analyze image');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            analyzeImage(file);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Healthy') return 'text-green-600 bg-green-50';
        if (status === 'Diseased') return 'text-red-600 bg-red-50';
        return 'text-orange-600 bg-orange-50';
    };

    const getStatusIcon = (status) => {
        if (status === 'Healthy') return CheckCircle;
        return AlertCircle;
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">{t('crop_health_title')}</h1>
                <p className="text-muted-foreground mt-2">{t('upload_photo')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('upload_card_title')}</CardTitle>
                        <CardDescription>Upload a clear image of the affected plant</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] bg-muted/30 relative overflow-hidden">
                            {selectedImage ? (
                                <img src={selectedImage} alt="Crop" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Camera className="w-10 h-10 text-primary mb-4" />
                                    <p className="font-medium">{t('upload_instruction')}</p>
                                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                                </>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
                        </div>
                        {selectedImage && (
                            <Button variant="outline" className="w-full mt-4" onClick={() => { setSelectedImage(null); setResult(null); setError(null); }}>
                                Upload New Image
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Results Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('diagnosis_report')}</CardTitle>
                        <CardDescription>AI-powered analysis results</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[300px] flex flex-col justify-center">
                        {!selectedImage && !isAnalyzing && !result && !error && (
                            <div className="text-center text-muted-foreground">
                                <Upload className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Upload an image to start analysis</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="text-center">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                                <p className="text-muted-foreground mt-4">{t('analyzing')}</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                <p>{error}</p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-4">
                                {/* Status Header */}
                                <div className={cn("rounded-lg p-4 flex items-start gap-3", getStatusColor(result.status))}>
                                    {React.createElement(getStatusIcon(result.status), { className: "w-6 h-6 shrink-0 mt-0.5" })}
                                    <div>
                                        <h3 className="font-bold text-lg">{result.status}</h3>
                                        {result.plant && <p className="text-sm opacity-80">Plant: {result.plant}</p>}
                                        {result.disease && <p className="text-sm">Disease: {result.disease}</p>}
                                        {result.severity !== 'None' && <p className="text-sm">Severity: {result.severity}</p>}
                                    </div>
                                </div>

                                {/* Confidence */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>{t('confidence_score')}</span>
                                        <span>{result.confidence}%</span>
                                    </div>
                                    <Progress value={result.confidence} className="h-2" />
                                </div>

                                {/* Treatment */}
                                {result.treatment && (
                                    <div className="bg-card border rounded-lg p-4">
                                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                                            <Leaf className="w-4 h-4 text-primary" /> {t('recommended_care')}
                                        </h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-line">{result.treatment}</p>
                                    </div>
                                )}

                                {/* Prevention */}
                                {result.prevention && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Prevention Tips</h4>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 whitespace-pre-line">{result.prevention}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CropHealth;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, User, Wheat, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Onboarding = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        full_name: '',
        location: '',
        primary_crop: ''
    });

    const handleComplete = async () => {
        setLoading(true);
        try {
            const { error } = await api.updateProfile(user.id, {
                ...formData,
                updated_at: new Date()
            });
            if (error) throw error;
            navigate('/');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <Wheat className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{t('setup_profile') || "Setup Your Profile"}</CardTitle>
                    <CardDescription>{t('setup_description') || "Tell us a bit about yourself to personalize your experience."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><User className="w-4 h-4" /> {t('full_name') || "Full Name"}</Label>
                                <Input
                                    placeholder="Enter your name"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setStep(2)} disabled={!formData.full_name}>
                                Next
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t('location') || "Your Location"}</Label>
                                <Input
                                    placeholder="City/Village, State"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setStep(3)} disabled={!formData.location}>Next</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Wheat className="w-4 h-4" /> {t('primary_crop') || "Primary Crop"}</Label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    value={formData.primary_crop}
                                    onChange={(e) => setFormData({ ...formData, primary_crop: e.target.value })}
                                >
                                    <option value="">Select Crop</option>
                                    <option value="Wheat">Wheat (Gehu)</option>
                                    <option value="Rice">Rice (Chawal)</option>
                                    <option value="Cotton">Cotton (Kapas)</option>
                                    <option value="Sugarcane">Sugarcane (Ganna)</option>
                                    <option value="Mustard">Mustard (Sarson)</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleComplete} disabled={!formData.primary_crop || loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Setup"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t py-3">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={cn("w-2 h-2 rounded-full", step === i ? "bg-green-600 w-6 transition-all" : "bg-gray-200")} />
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Onboarding;

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { User, Mail, MapPin, Sprout, Ruler, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        farm_name: '',
        location: '',
        farming_type: '',
        land_size: '',
    });

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        setLoading(true);
        const { data, error } = await api.getProfile(user.id);

        if (data) {
            setFormData({
                full_name: data.full_name || '',
                email: user.email || '', // Email comes from Auth, not necessarily profile
                farm_name: data.farm_name || '',
                location: data.location || '',
                farming_type: data.farming_type || '',
                land_size: data.land_size || '',
            });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        const updates = {
            full_name: formData.full_name,
            farm_name: formData.farm_name,
            location: formData.location,
            farming_type: formData.farming_type,
            land_size: formData.land_size,
            updated_at: new Date(),
        };

        const { error } = await api.updateProfile(user.id, updates);

        if (error) {
            alert('Error updating profile: ' + error.message);
        } else {
            alert('Profile updated successfully!');
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('my_profile')}</h1>
                <p className="text-gray-500">{t('manage_profile')}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar / Avatar Section */}
                <Card className="w-full md:w-80 h-fit">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="w-24 h-24 mb-4">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                                {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : 'K'}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold">{formData.full_name || 'Farmer'}</h2>
                        <p className="text-gray-500 text-sm mb-4">{user?.email}</p>

                        <div className="w-full pt-4 border-t border-gray-100 text-left space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{formData.location || 'Location not set'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Sprout className="w-4 h-4" />
                                <span>{formData.farming_type || 'Farming Type not set'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Form Section */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>{t('edit_profile')}</CardTitle>
                        <CardDescription>{t('update_account_details')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">{t('full_name')}</Label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="full_name"
                                            className="pl-9"
                                            placeholder="John Doe"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('email')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="email"
                                            className="pl-9 bg-gray-50"
                                            value={formData.email}
                                            readOnly
                                            disabled // Email cannot be changed here easily in Supabase
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="farm_name">{t('farm_name')}</Label>
                                <Input
                                    id="farm_name"
                                    placeholder="e.g. Green Valley Farm"
                                    value={formData.farm_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">{t('location_village')}</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="location"
                                            className="pl-9"
                                            placeholder="e.g. Karnal, Haryana"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="farming_type">{t('primary_farming_type')}</Label>
                                    <div className="relative">
                                        <Sprout className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="farming_type"
                                            className="pl-9"
                                            placeholder="e.g. Organic, Conventional"
                                            value={formData.farming_type}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="land_size">{t('total_land_size')}</Label>
                                <div className="relative">
                                    <Ruler className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        id="land_size"
                                        className="pl-9"
                                        placeholder="e.g. 5.5"
                                        value={formData.land_size}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('save_changes')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;

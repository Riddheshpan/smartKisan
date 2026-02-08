import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Sprout, Ruler, Loader2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

const Plots = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [plots, setPlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [newPlot, setNewPlot] = useState({ name: "", crop: "", area: "", location: "" });
    const [editingPlot, setEditingPlot] = useState(null);

    useEffect(() => {
        if (user) {
            loadPlots();
        }
    }, [user]);

    const loadPlots = async () => {
        setLoading(true);
        const { data, error } = await api.getPlots(user.id);
        if (data) {
            setPlots(data);
        }
        setLoading(false);
    };

    const handleAddClick = () => {
        setEditingPlot(null);
        setNewPlot({ name: "", crop: "", area: "", location: "" });
        setIsDialogOpen(true);
    };

    const handleEditClick = (plot) => {
        setEditingPlot(plot);
        setNewPlot({
            name: plot.name,
            crop: plot.crop,
            area: plot.area,
            location: plot.location || ""
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPlot.name || !newPlot.crop || !newPlot.area) return;

        setSaving(true);
        const plotData = {
            user_id: user.id,
            name: newPlot.name,
            crop: newPlot.crop,
            area: parseFloat(newPlot.area),
            location: newPlot.location,
            status: editingPlot ? editingPlot.status : 'Preparation',
        };

        let result;
        if (editingPlot) {
            result = await api.updatePlot(editingPlot.id, plotData);
        } else {
            result = await api.createPlot(plotData);
        }

        const { data, error } = result;

        if (error) {
            alert('Failed to save plot: ' + error.message);
        } else {
            loadPlots();
            setEditingPlot(null);
            setNewPlot({ name: "", crop: "", area: "", location: "" });
            setIsDialogOpen(false);
        }
        setSaving(false);
    };

    const handleViewOnMap = (location) => {
        if (!location) {
            alert("Location not set for this plot.");
            return;
        }
        const query = encodeURIComponent(location);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    const handleDelete = async (plotId) => {
        if (window.confirm(t('delete_confirmation') || 'Are you sure you want to delete this plot?')) {
            const { error } = await api.deletePlot(plotId);
            if (error) {
                alert('Error deleting plot: ' + error.message);
            } else {
                loadPlots();
            }
        }
    };

    if (loading && plots.length === 0) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('my_plots_title')}</h1>
                    <p className="text-gray-500">{t('manage_plots')}</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddClick}>
                            <Plus className="mr-2 h-4 w-4" /> {t('add_new_plot')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingPlot ? 'Edit Plot' : t('add_plot_dialog')}</DialogTitle>
                            <DialogDescription>
                                {t('enter_details')}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    {t('name')}
                                </Label>
                                <Input
                                    id="name"
                                    value={newPlot.name}
                                    onChange={(e) => setNewPlot({ ...newPlot, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. North Field"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="crop" className="text-right">
                                    {t('crop')}
                                </Label>
                                <Input
                                    id="crop"
                                    value={newPlot.crop}
                                    onChange={(e) => setNewPlot({ ...newPlot, crop: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. Wheat"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="area" className="text-right">
                                    {t('area')}
                                </Label>
                                <Input
                                    id="area"
                                    type="number"
                                    step="0.1"
                                    value={newPlot.area}
                                    onChange={(e) => setNewPlot({ ...newPlot, area: e.target.value })}
                                    className="col-span-3"
                                    placeholder="in Acres"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    value={newPlot.location}
                                    onChange={(e) => setNewPlot({ ...newPlot, location: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. Coordinates or Address"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingPlot ? 'Update Plot' : t('save_plot_btn')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {plots.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Sprout className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No plots found. Add your first plot to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plots.map((plot) => (
                        <Card key={plot.id} className="hover:shadow-md transition-shadow relative">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{plot.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Sprout className="mr-2 h-4 w-4 text-green-600" />
                                        Crop: <span className="font-medium text-gray-900 ml-1">{plot.crop}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Ruler className="mr-2 h-4 w-4 text-blue-600" />
                                        Area: <span className="font-medium text-gray-900 ml-1">{plot.area} Acres</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="mr-2 h-4 w-4 text-red-500" />
                                        Location: <span className="text-gray-600 ml-1">{plot.location || 'Not set'}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(plot)}>Edit</Button>
                                        <Button variant="destructive" size="sm" className="flex-none px-3" onClick={() => handleDelete(plot.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                                        onClick={() => handleViewOnMap(plot.location || plot.name)}
                                    >
                                        <MapPin className="w-3 h-3 mr-1" /> View on Map
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Plots;

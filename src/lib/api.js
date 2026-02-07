import { supabase } from './supabase';

export const api = {
    // Profile
    getProfile: async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        return { data, error };
    },

    updateProfile: async (userId, updates) => {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select();
        return { data, error };
    },

    // Plots
    getPlots: async (userId) => {
        const { data, error } = await supabase
            .from('plots')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    },

    createPlot: async (plotData) => {
        const { data, error } = await supabase
            .from('plots')
            .insert([plotData])
            .select();
        return { data, error };
    },

    updatePlot: async (plotId, updates) => {
        const { data, error } = await supabase
            .from('plots')
            .update(updates)
            .eq('id', plotId)
            .select();
        return { data, error };
    },

    deletePlot: async (plotId) => {
        const { error } = await supabase
            .from('plots')
            .delete()
            .eq('id', plotId);
        return { error };
    },
};

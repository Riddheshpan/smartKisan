import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Weather from './pages/Weather';
import CropHealth from './pages/CropHealth';
import Market from './pages/Market';
import Schemes from './pages/Schemes';
import Profile from './pages/Profile';
import Plots from './pages/Plots';
import Settings from './pages/Settings';
import ExpertChat from './pages/ExpertChat';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<Auth />} />

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <Layout>
            <Outlet />
          </Layout>
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/crop-health" element={<CropHealth />} />
        <Route path="/market" element={<Market />} />
        <Route path="/plots" element={<Plots />} />
        <Route path="/expert-chat" element={<ExpertChat />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Onboarding - Separate layout? For now keep it invalid or same. 
          Actually Onboarding usually doesn't have the full sidebar. 
          Let's keep it separate as before or wrap it differently.
      */}
      <Route path="/onboarding" element={<ProtectedRoute requireCompleteProfile={false}><Onboarding /></ProtectedRoute>} />


      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import GlobalVoiceAssistant from './GlobalVoiceAssistant';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
                {/* Global Voice Assistant Button */}
                <GlobalVoiceAssistant />
            </main>
        </div>
    );
};

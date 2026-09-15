import React from 'react';
import { Outlet } from 'react-router-dom';
import { PortalTopBar } from '@/components/navigation/PortalTopBar';
import { PortalHeader } from '@/components/navigation/PortalHeader';
import { Navbar } from '@/components/navigation/Navbar';
import { BreakingNewsTicker } from '@/components/navigation/BreakingNewsTicker';
import { Footer } from '@/components/layout/Footer';
import { SyncBanner } from '@/components/ui/SyncBanner';
import { SOSButton } from '@/components/navigation/SOSButton';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { ToastContainer } from '@/components/notifications/ToastContainer';
import { DemoControlBar } from '@/components/ui/DemoControlBar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#FF9933] selection:text-slate-900">
      {/* 1. Accessibility Top Bar & Public Portal Identity */}
      <PortalTopBar />

      {/* 2. Institutional Portal Header with 24x7 Emergency Helplines (1078, 112, 101, 108) */}
      <PortalHeader />

      {/* 3. Deep Navy Navigation Bar with Saffron Accents */}
      <Navbar />

      {/* 4. Live Emergency Broadcast Ticker */}
      <BreakingNewsTicker />

      {/* 3. System Resiliency Status Banners */}
      <SyncBanner />
      <OfflineBanner />

      {/* 4. Active Page Content */}
      <main className="flex-1 relative bg-white" id="main-content">
        <Outlet />
      </main>

      {/* 5. Modern Civic-Tech Humanitarian Footer */}
      <Footer />

      {/* 6. Floating Emergency Distress & Demo Controls */}
      <SOSButton />
      <DemoControlBar />
      <ToastContainer />
    </div>
  );
}

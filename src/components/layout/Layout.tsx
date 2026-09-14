import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovernmentTopBar } from '@/components/navigation/GovernmentTopBar';
import { OfficialHeader } from '@/components/navigation/OfficialHeader';
import { Navbar } from '@/components/navigation/Navbar';
import { BreakingNewsTicker } from '@/components/navigation/BreakingNewsTicker';
import { Footer } from '@/components/layout/Footer';
import { SyncBanner } from '@/components/ui/SyncBanner';
import { SOSButton } from '@/components/navigation/SOSButton';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { ToastContainer } from '@/components/notifications/ToastContainer';
import { BootSequence } from '@/components/ui/BootSequence';
import { DemoControlBar } from '@/components/ui/DemoControlBar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#FF9933] selection:text-black">
      {/* 1. Official Initial Loading Sequence */}
      <BootSequence />

      {/* 2. Government Top Utility Strip (GIGW Compliant Accessibility) */}
      <GovernmentTopBar />

      {/* 3. Official State Emblem Header with Emergency Helplines */}
      <OfficialHeader />

      {/* 4. Solid Institutional Navy Navigation Bar */}
      <Navbar />

      {/* 5. Classic Latest Updates Scrolling News Ticker */}
      <BreakingNewsTicker />

      {/* 6. System Resiliency Status Banners */}
      <SyncBanner />
      <OfflineBanner />

      {/* 7. Active Page Content on Crisp White Background */}
      <main className="flex-1 relative bg-white" id="main-content">
        <Outlet />
      </main>

      {/* 8. Official Government Footer */}
      <Footer />

      {/* 9. Floating Emergency Assistance & Demo Presenter Controls */}
      <SOSButton />
      <DemoControlBar />
      <ToastContainer />
    </div>
  );
}

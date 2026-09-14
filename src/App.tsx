import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Layout } from '@/components/layout/Layout';

// Pages
import { Home } from '@/pages/Home';
import { Report } from '@/pages/Report';
import { Track } from '@/pages/Track';
import { Live } from '@/pages/Live';
import { Responder } from '@/pages/Responder';
import { Analytics } from '@/pages/Analytics';
import { Admin } from '@/pages/Admin';
import { About } from '@/pages/About';
import { NotFound } from '@/pages/NotFound';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="report" element={<Report />} />
            <Route path="track" element={<Track />} />
            <Route path="live" element={<Live />} />
            <Route path="responder" element={<Responder />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="admin" element={<Admin />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

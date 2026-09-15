import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Menu, X, Bell, ShieldAlert, ShieldCheck, Lock
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { SystemStatusBadge } from '@/components/ui/SystemStatusBadge';
import { VolunteerAuthModal } from '@/components/auth/VolunteerAuthModal';
import { AdminAuthModal } from '@/components/auth/AdminAuthModal';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'HOME', hindiLabel: 'मुख्य पृष्ठ', exact: true },
  { to: '/report', label: 'REPORT INCIDENT', hindiLabel: 'आपदा दर्ज करें' },
  { to: '/track', label: 'TRACK DOSSIER', hindiLabel: 'स्थिति ट्रैक करें' },
  { to: '/live', label: 'LIVE SITUATION', hindiLabel: 'लाइव स्थिति' },
  { to: '/responder', label: 'RESPONDERS & EOC', hindiLabel: 'राहत दल' },
  { to: '/analytics', label: 'ANALYTICS', hindiLabel: 'सांख्यिकी' },
  { to: '/admin', label: 'DUTY DESK', hindiLabel: 'सत्यापन कक्ष' },
  { to: '/about', label: 'ABOUT PORTAL', hindiLabel: 'पोर्टल परिचय' },
];

export function Navbar() {
  const {
    unreadCount,
    adminSession,
    volunteerSession,
    isAuthenticatedResponder,
    responderProfile
  } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#003366] text-white shadow-md border-b-2 border-[#FF9933] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 sm:h-13 items-center justify-between">
          {/* Desktop Navigation Links (Classic Structured National Portal Navbar) */}
          <div className="hidden lg:flex items-center h-full space-x-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  cn(
                    'h-full flex flex-col justify-center px-3.5 text-[12px] font-bold uppercase transition-colors select-none text-left cursor-pointer',
                    isActive
                      ? 'bg-[#002244] text-[#FF9933] border-b-4 border-[#FF9933]'
                      : 'text-white/90 hover:bg-[#002852] hover:text-white'
                  )
                }
              >
                <span>{link.label}</span>
                <span className="text-[9px] font-normal text-white/70 tracking-normal leading-none -mt-0.5">
                  {link.hindiLabel}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Title (visible on smaller screens) */}
          <div
            onClick={() => navigate('/')}
            className="lg:hidden flex items-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="h-5 w-5 text-[#FF9933]" />
            <span className="text-sm font-bold tracking-tight text-white">DISASTERSHIELD</span>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. SEPARATE ACCESS POINT: System Admin Portal for Dispatch Coordinators */}
            {!adminSession?.isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAdminModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 h-8.5 px-2.5 text-xs font-bold border-cyan-400/70 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200 hover:text-white transition-all cursor-pointer rounded"
                title="System Admin Portal for Dispatch Coordinators"
              >
                <Lock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-tight">System Admin</span>
                  <span className="text-[8px] text-cyan-300 font-normal">व्यवस्थापक</span>
                </div>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center gap-1.5 h-8.5 px-2.5 text-xs font-bold bg-cyan-800 hover:bg-cyan-700 text-white transition-all cursor-pointer rounded shadow-xs"
                title={`Coordinator: ${adminSession.name} (${adminSession.coordinatorId})`}
              >
                <Lock className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-tight">Admin Desk</span>
                  <span className="text-[8px] text-cyan-200 font-normal">{adminSession.coordinatorId.replace('COORD-', '')}</span>
                </div>
              </Button>
            )}

            {/* 2. SEPARATE ACCESS POINT: Volunteer / NGO Portal requiring Registered ID */}
            {!volunteerSession?.isAuthenticated && !isAuthenticatedResponder ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setVolunteerModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 h-8.5 px-2.5 text-xs font-bold border-amber-400/90 bg-amber-500/10 hover:bg-amber-500/25 text-amber-200 hover:text-white transition-all cursor-pointer rounded"
                title="Volunteer & NGO Login (Requires Registered ID)"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-tight">Volunteer / NGO</span>
                  <span className="text-[8px] text-amber-300 font-normal">स्वयंसेवक प्रवेश</span>
                </div>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate('/restricted-responder')}
                className="hidden sm:flex items-center gap-1.5 h-8.5 px-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer rounded shadow-xs"
                title={`Active Volunteer: ${volunteerSession?.name || responderProfile?.name} (${volunteerSession?.registeredId || responderProfile?.id})`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-tight">Field Portal</span>
                  <span className="text-[8px] text-emerald-200 font-normal">
                    {volunteerSession ? volunteerSession.registeredId.replace('VOL-2026-', '') : (responderProfile?.clearanceLevel || 'ACTIVE')}
                  </span>
                </div>
              </Button>
            )}

            {/* Online/Offline Status Indicator */}
            <div className="hidden md:block">
              <SystemStatusBadge />
            </div>

            {/* Notification Drawer */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded hover:bg-[#002244] text-white/90 hover:text-white transition-colors cursor-pointer"
                aria-label={`Official Notifications (${unreadCount} unread)`}
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E65100] text-[9px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Critical Report Button (Saffron Accent with High Clickability) */}
            <Button
              size="sm"
              className="flex items-center gap-1.5 h-8.5 px-3.5 text-xs font-bold shadow-xs uppercase tracking-wider bg-[#FF9933] hover:bg-[#E65100] text-slate-900 hover:text-white transition-all cursor-pointer rounded"
              onClick={() => navigate('/report')}
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>REPORT CRISIS</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden p-1.5 rounded text-white hover:bg-[#002244] cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#002244] border-t border-[#FF9933] px-4 py-3"
          >
            <div className="flex flex-col divide-y divide-white/10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'py-2.5 px-2 text-xs font-semibold flex items-center justify-between',
                      isActive ? 'text-[#FF9933] bg-[#001830]' : 'text-white hover:text-[#FF9933]'
                    )
                  }
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] text-white/60">{link.hindiLabel}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-white/20 flex flex-col gap-2">
              {/* Mobile System Admin Portal */}
              {!adminSession?.isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setAdminModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-cyan-950/70 border border-cyan-500/80 text-cyan-200 font-bold text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-cyan-400" />
                    <span>SYSTEM ADMIN PORTAL</span>
                  </span>
                  <span className="text-[10px] text-cyan-300/80">व्यवस्थापक पोर्टल</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-cyan-800 text-white font-bold text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-cyan-300" />
                    <span>COORDINATOR DESK</span>
                  </span>
                  <span className="text-[10px] text-cyan-200">{adminSession.coordinatorId}</span>
                </button>
              )}

              {/* Mobile Volunteer / NGO Login */}
              {!volunteerSession?.isAuthenticated && !isAuthenticatedResponder ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setVolunteerModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-amber-500/10 border border-amber-400 text-amber-300 font-bold text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    <span>VOLUNTEER & NGO LOGIN</span>
                  </span>
                  <span className="text-[10px] text-amber-300/80">स्वयंसेवक प्रवेश</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/restricted-responder');
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    <span>FIELD VOLUNTEER DESK</span>
                  </span>
                  <span className="text-[10px] text-emerald-200">
                    {volunteerSession ? volunteerSession.registeredId : (responderProfile?.clearanceLevel || 'ACTIVE')}
                  </span>
                </button>
              )}
              <SystemStatusBadge />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SEPARATE Volunteer & NGO Auth Gateway Modal (requires Registered ID) */}
      <VolunteerAuthModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        redirectTo="/restricted-responder"
      />

      {/* 2. SEPARATE System Admin Portal Modal (requires Coordinator Key / Dispatch Token) */}
      <AdminAuthModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        redirectTo="/admin"
      />
    </nav>
  );
}

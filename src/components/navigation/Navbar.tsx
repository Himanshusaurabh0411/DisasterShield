import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Menu, X, Bell, User, ShieldAlert
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { SystemStatusBadge } from '@/components/ui/SystemStatusBadge';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'HOME', hindiLabel: 'मुख्य पृष्ठ', exact: true },
  { to: '/report', label: 'REPORT INCIDENT', hindiLabel: 'आपदा दर्ज करें' },
  { to: '/track', label: 'TRACK DOSSIER', hindiLabel: 'स्थिति ट्रैक करें' },
  { to: '/live', label: 'LIVE SITUATION', hindiLabel: 'लाइव स्थिति' },
  { to: '/responder', label: 'RESPONDERS & EOC', hindiLabel: 'राहत दल' },
  { to: '/analytics', label: 'ANALYTICS', hindiLabel: 'सांख्यिकी' },
  { to: '/admin', label: 'DUTY DESK', hindiLabel: 'सत्यापन कक्ष' },
  { to: '/about', label: 'ABOUT NDMA', hindiLabel: 'प्राधिकरण परिचय' },
];

export function Navbar() {
  const { unreadCount } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#003366] text-white shadow-md border-b-2 border-[#FF9933] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 sm:h-13 items-center justify-between">
          {/* Desktop Navigation Links (Classic NIC Government Navbar) */}
          <div className="hidden lg:flex items-center h-full space-x-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  cn(
                    'h-full flex flex-col justify-center px-3.5 text-[12px] font-bold uppercase transition-colors select-none text-left',
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
          <div className="lg:hidden flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#FF9933]" />
            <span className="text-sm font-bold tracking-tight text-white">NDMA DISASTER PORTAL</span>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Online/Offline Status Indicator */}
            <div className="hidden sm:block">
              <SystemStatusBadge />
            </div>

            {/* Notification Drawer */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded hover:bg-[#002244] text-white/90 hover:text-white transition-colors"
                aria-label={`Official Notifications (${unreadCount} unread)`}
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E65100] text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Critical Report Button (Saffron Accent) */}
            <Button
              variant="saffron"
              size="sm"
              className="flex items-center gap-1.5 h-8.5 px-3.5 text-xs font-bold shadow-xs uppercase tracking-wider"
              onClick={() => navigate('/report')}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>REPORT CRISIS</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden p-1.5 rounded text-white hover:bg-[#002244]"
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
              <SystemStatusBadge />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

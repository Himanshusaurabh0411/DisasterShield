import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Phone, Mail, MapPin, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto select-none">
      {/* Top Tricolor Strip */}
      <div className="tricolor-bar" />

      {/* Main Navy Institutional Body */}
      <div className="bg-[#002244] text-white pt-10 pb-6 border-t border-[#001830]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10 text-xs">
            {/* Column 1: NDMA Headquarters & Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#FF9933]" />
                <h4 className="font-bold text-sm tracking-wide text-[#FF9933]">
                  NDMA HEADQUARTERS
                </h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                National Disaster Management Authority (NDMA)<br />
                Ministry of Home Affairs, Government of India<br />
                NDMA Bhawan, A-1, Safdarjung Enclave,<br />
                New Delhi &ndash; 110029, India
              </p>
              <div className="space-y-1.5 pt-1 text-slate-200">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#FF9933]" />
                  <span>24x7 Helpline: <strong className="text-white">1078</strong> (Toll Free)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#FF9933]" />
                  <span>Control Room: 011-24363260</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#FF9933]" />
                  <span>controlroom[at]ndma[dot]gov[dot]in</span>
                </div>
              </div>
            </div>

            {/* Column 2: Citizen Emergency Services */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm tracking-wide text-[#FF9933] border-b border-white/10 pb-1">
                CITIZEN SERVICES
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link to="/report" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                    &bull; Report Disaster / Incident (आपातकाल दर्ज करें)
                  </Link>
                </li>
                <li>
                  <Link to="/track" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                    &bull; Track Incident Dossier (स्थिति ट्रैक करें)
                  </Link>
                </li>
                <li>
                  <Link to="/live" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                    &bull; Live Incident & Response Grid (लाइव स्थिति)
                  </Link>
                </li>
                <li>
                  <Link to="/responder" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                    &bull; EOC Response Battalion Roster (राहत दल)
                  </Link>
                </li>
                <li>
                  <Link to="/analytics" className="hover:text-[#FF9933] transition-colors flex items-center gap-1.5">
                    &bull; Annual Disaster Statistical Bulletins (सांख्यिकी)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Apex Government Portals */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm tracking-wide text-[#FF9933] border-b border-white/10 pb-1">
                GOVERNMENT OF INDIA PORTALS
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center justify-between">
                    <span>&bull; National Portal of India (india.gov.in)</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://www.digitalindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center justify-between">
                    <span>&bull; Digital India Portal</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://mausam.imd.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center justify-between">
                    <span>&bull; India Meteorological Department (IMD)</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://cwc.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center justify-between">
                    <span>&bull; Central Water Commission (CWC Flood Telemetry)</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://ndrf.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] transition-colors flex items-center justify-between">
                    <span>&bull; National Disaster Response Force (NDRF)</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Institutional Policies & Compliance */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm tracking-wide text-[#FF9933] border-b border-white/10 pb-1">
                POLICIES & GUIDELINES
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <Link to="/about" className="hover:text-[#FF9933] transition-colors">
                    &bull; Disaster Management Act 2005
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#FF9933] transition-colors">
                    &bull; Website Policies & Disclaimer
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#FF9933] transition-colors">
                    &bull; Privacy Policy & Hyperlinking Policy
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#FF9933] transition-colors">
                    &bull; Help & Accessibility Statement
                  </Link>
                </li>
                <li>
                  <span className="text-[#FF9933] font-semibold block pt-1">
                    GIGW 2.0 Compliant Portal
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom NIC Bar */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-300">
            <div>
              <p>
                Website Content Managed by <strong>National Disaster Management Authority, Government of India</strong>.
              </p>
              <p className="text-slate-400">
                Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong>.
              </p>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Website Last Updated: 15 Sep 2026</span>
              <span>&bull;</span>
              <span>Visitors: 2,418,902</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

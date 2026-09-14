import React from 'react';
import { PhoneCall, ShieldAlert, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OfficialHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-3 sm:py-4 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: National Emblem of India & Bilingual Titles */}
        <Link to="/" className="flex items-center gap-4 text-left group">
          {/* State Emblem of India Vector Graphic */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <svg
              className="h-16 w-12 text-[#996515]"
              viewBox="0 0 120 160"
              fill="currentColor"
              aria-label="State Emblem of India"
            >
              {/* Ashoka Lion Capital Vector Representation */}
              <path d="M60 5 C50 5, 45 15, 45 25 C45 35, 52 42, 60 42 C68 42, 75 35, 75 25 C75 15, 70 5, 60 5 Z" fill="#8B5A2B" />
              <path d="M40 22 C32 22, 28 32, 28 40 C28 48, 34 54, 40 54 C46 54, 52 48, 52 40 C52 32, 48 22, 40 22 Z" fill="#8B5A2B" />
              <path d="M80 22 C72 22, 68 32, 68 40 C68 48, 74 54, 80 54 C86 54, 92 48, 92 40 C92 32, 88 22, 80 22 Z" fill="#8B5A2B" />
              {/* Pillar Base & Abacus */}
              <rect x="25" y="58" width="70" height="12" rx="2" fill="#8B5A2B" />
              {/* Ashoka Chakra in Abacus */}
              <circle cx="60" cy="64" r="5" fill="#000080" />
              <circle cx="60" cy="64" r="3" fill="#ffffff" />
              {/* Bell Lotus Base */}
              <path d="M30 72 C35 88, 85 88, 90 72 Z" fill="#8B5A2B" />
              {/* Satyameva Jayate Inscription in Devanagari */}
              <text x="60" y="104" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#000000" fontFamily="serif">
                सत्यमेव जयते
              </text>
            </svg>
          </div>

          {/* Bilingual Institutional Text */}
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              राष्ट्रीय आपदा प्रबंधन प्राधिकरण
            </span>
            <span className="text-base sm:text-xl font-black tracking-tight text-[#003366] uppercase leading-snug">
              National Disaster Management Authority
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 leading-tight">
              गृह मंत्रालय, भारत सरकार | Ministry of Home Affairs, Government of India
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#E65100] font-bold tracking-wide mt-0.5">
              DISASTERSHIELD — एकीकृत राष्ट्रीय आपदा प्रबंधन एवं राहत प्रणाली
            </span>
          </div>
        </Link>

        {/* Right: 24x7 Emergency Helplines & Official Badges */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Toll Free Emergency Box */}
          <div className="flex items-center gap-3 border-2 border-red-500/80 bg-red-50/70 px-3.5 py-2 rounded-md shadow-xs">
            <div className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                24x7 National Emergency Helpline
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="tel:1078"
                  className="text-lg font-black text-red-700 hover:underline leading-none"
                >
                  1078
                </a>
                <span className="text-xs text-slate-500 font-semibold">(Toll Free)</span>
                <span className="text-slate-300">|</span>
                <a
                  href="tel:112"
                  className="text-sm font-black text-slate-800 hover:text-red-700 hover:underline leading-none"
                >
                  ERSS 112
                </a>
              </div>
            </div>
          </div>

          {/* Digital India / Azadi Emblem Badge */}
          <div className="hidden lg:flex flex-col items-center justify-center border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-md text-center">
            <span className="text-[9px] font-bold text-[#FF9933] uppercase tracking-wider">
              DIGITAL INDIA
            </span>
            <span className="text-xs font-black text-[#003366] leading-none">
              डिजिटल भारत
            </span>
            <span className="text-[8px] text-slate-500">Power To Empower</span>
          </div>
        </div>
      </div>
    </header>
  );
}

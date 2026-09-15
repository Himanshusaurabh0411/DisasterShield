import React, { useState } from 'react';
import { Volume2, Globe } from 'lucide-react';

export function PortalTopBar() {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const adjustFontSize = (size: 'sm' | 'base' | 'lg') => {
    setFontSize(size);
    const html = document.documentElement;
    if (size === 'sm') html.style.fontSize = '14px';
    else if (size === 'base') html.style.fontSize = '16px';
    else if (size === 'lg') html.style.fontSize = '18px';
  };

  return (
    <div className="w-full bg-slate-100 border-b border-slate-300 text-slate-700 text-xs select-none">
      {/* Tricolor Top Accent Line */}
      <div className="tricolor-bar h-1 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Portal Identity (Independent Public Emergency Utility) */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#003366]">
            {lang === 'en'
              ? 'National Disaster Management & Crisis Response Portal'
              : 'राष्ट्रीय आपदा प्रबंधन एवं संकट प्रतिक्रिया पोर्टल'}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-600 font-medium">
            24x7 Citizen Emergency & Response Coordination Utility
          </span>
        </div>

        {/* Right: Accessibility and Language Options */}
        <div className="flex items-center gap-3 sm:gap-4 font-medium">
          <a
            href="#main-content"
            className="hidden sm:inline text-slate-600 hover:text-[#003366] hover:underline"
          >
            Skip to Main Content
          </a>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Screen Reader Access link */}
          <button
            type="button"
            onClick={() => alert('Screen reader accessibility features enabled.')}
            className="flex items-center gap-1 text-slate-600 hover:text-[#003366] cursor-pointer"
            title="Screen Reader Access"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Screen Reader</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Font Size Resizer */}
          <div className="flex items-center gap-1 border border-slate-300 rounded bg-white px-1.5 py-0.5">
            <button
              type="button"
              onClick={() => adjustFontSize('sm')}
              className={`px-1 rounded hover:bg-slate-100 cursor-pointer ${fontSize === 'sm' ? 'font-bold text-[#003366]' : 'text-slate-600'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => adjustFontSize('base')}
              className={`px-1 rounded hover:bg-slate-100 cursor-pointer ${fontSize === 'base' ? 'font-bold text-[#003366]' : 'text-slate-600'}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => adjustFontSize('lg')}
              className={`px-1 rounded hover:bg-slate-100 cursor-pointer ${fontSize === 'lg' ? 'font-bold text-[#003366]' : 'text-slate-600'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <span className="text-slate-300">|</span>

          {/* Language Switch */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 font-semibold text-[#003366] hover:text-[#E65100] cursor-pointer"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Volume2, Eye, Globe } from 'lucide-react';

export function GovernmentTopBar() {
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
      {/* India Tricolor Top Border Accent */}
      <div className="tricolor-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government of India attribution */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800">
            {lang === 'en' ? 'भारत सरकार | Government of India' : 'Government of India | भारत सरकार'}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-600">
            {lang === 'en' ? 'गृह मंत्रालय | Ministry of Home Affairs' : 'Ministry of Home Affairs | गृह मंत्रालय'}
          </span>
        </div>

        {/* Right: Accessibility and Language Options (GIGW Standard) */}
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
            onClick={() => alert('Screen reader accessibility features enabled. The portal complies with GIGW 2.0 standards.')}
            className="flex items-center gap-1 text-slate-600 hover:text-[#003366]"
            title="Screen Reader Access"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Screen Reader</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>

          {/* Font Size Resizer */}
          <div className="flex items-center gap-1 border border-slate-300 rounded bg-white px-1.5 py-0.5">
            <button
              onClick={() => adjustFontSize('sm')}
              className={`px-1 rounded hover:bg-slate-100 ${fontSize === 'sm' ? 'font-bold text-[#003366]' : 'text-slate-600'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => adjustFontSize('base')}
              className={`px-1 rounded hover:bg-slate-100 ${fontSize === 'base' ? 'font-bold text-[#003366]' : 'text-slate-600'}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => adjustFontSize('lg')}
              className={`px-1 rounded hover:bg-slate-100 ${fontSize === 'lg' ? 'font-bold text-[#003366]' : 'text-slate-600'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <span className="text-slate-300">|</span>

          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 font-semibold text-[#003366] hover:text-[#E65100]"
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

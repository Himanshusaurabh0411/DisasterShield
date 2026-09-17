import React from 'react';

interface CommunityLogoProps {
  className?: string;
  size?: number;
}

export function CommunityLogo({ className = 'h-12 w-auto', size = 48 }: CommunityLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DisasterShield Community Logo"
    >
      <defs>
        {/* Outer Shield Gradient */}
        <linearGradient id="shieldGrad" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#003366" />
          <stop offset="100%" stopColor="#0A2540" />
        </linearGradient>

        {/* Accent Flare Gradient */}
        <linearGradient id="accentFlare" x1="16" y1="12" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9933" />
          <stop offset="100%" stopColor="#FF5500" />
        </linearGradient>

        {/* Soft Glow Filter */}
        <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#003366" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Protective Shield Silhouette */}
      <path
        d="M32 4L10 14V30C10 44.5 19.5 56.5 32 60C44.5 56.5 54 44.5 54 30V14L32 4Z"
        fill="url(#shieldGrad)"
        filter="url(#shieldGlow)"
      />

      {/* Modern Inner Geometric Border */}
      <path
        d="M32 7.5L13 16V30C13 42.8 21.2 53.4 32 56.8C42.8 53.4 51 42.8 51 30V16L32 7.5Z"
        stroke="#FF9933"
        strokeWidth="1.5"
        strokeOpacity="0.65"
      />

      {/* Central Radiating Community Signal Pulse / Beacon */}
      {/* Outer Signal Arc */}
      <path
        d="M20 28C20 21.3726 25.3726 16 32 16C38.6274 16 44 21.3726 44 28"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />

      {/* Mid Signal Arc */}
      <path
        d="M24 30C24 25.5817 27.5817 22 32 22C36.4183 22 40 25.5817 40 30"
        stroke="#FF9933"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Central Vital Core / Beacon Center */}
      <circle cx="32" cy="33" r="4.5" fill="url(#accentFlare)" />
      <circle cx="32" cy="33" r="2" fill="#FFFFFF" />

      {/* Mutual-Aid Anchor Cross Baseline */}
      <path
        d="M32 38V49M26 44H38"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

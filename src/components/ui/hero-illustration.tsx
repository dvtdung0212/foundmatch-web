import React from "react";

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 340"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F9ECE3" />
          <stop offset="100%" stopColor="#EEDDD0" />
        </linearGradient>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9F5" />
          <stop offset="100%" stopColor="#F9ECE3" />
        </linearGradient>
      </defs>

      {/* Background Container */}
      <rect width="520" height="340" rx="24" fill="url(#bg-grad)" />

      {/* Background Buildings Silhouette */}
      <path
        d="M 20 340 V 160 H 60 V 180 H 90 V 140 H 130 V 200 H 170 V 130 H 220 V 190 H 270 V 120 H 320 V 170 H 370 V 140 H 420 V 180 H 460 V 150 H 500 V 340 Z"
        fill="#E4CFBF"
        opacity="0.5"
      />
      <path
        d="M 40 340 V 190 H 80 V 220 H 140 V 170 H 190 V 230 H 250 V 160 H 300 V 210 H 360 V 180 H 410 V 220 H 480 V 340 Z"
        fill="#D6BDAA"
        opacity="0.6"
      />

      {/* Trees & Foliage */}
      <circle cx="50" cy="270" r="45" fill="#7D9670" opacity="0.7" />
      <circle cx="110" cy="280" r="40" fill="#6A855D" opacity="0.8" />
      <circle cx="420" cy="270" r="50" fill="#7D9670" opacity="0.7" />
      <circle cx="470" cy="280" r="40" fill="#6A855D" opacity="0.8" />

      {/* Floating Shield Badge (Bảo mật / Heart Shield) */}
      <g transform="translate(420, 110)">
        <path
          d="M 25 0 C 40 0 50 10 50 25 C 50 45 25 60 25 60 C 25 60 0 45 0 25 C 0 10 10 0 25 0 Z"
          fill="#5B0E2D"
        />
        <path
          d="M 25 15 L 35 25 L 29 25 L 29 40 L 21 40 L 21 25 L 15 25 Z"
          fill="#FFFFFF"
          opacity="0"
        />
        <path
          d="M 16 26 L 23 33 L 34 20"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Girl Character (Left - Person returning item) */}
      <g id="girl">
        {/* Hair */}
        <path d="M 120 180 C 110 150 155 140 165 170 C 175 190 170 250 170 250 H 120 Z" fill="#2A1B17" />
        {/* Face & Neck */}
        <ellipse cx="148" cy="175" rx="14" ry="18" fill="#FAD0C4" />
        <path d="M 144 190 H 152 V 205 H 144 Z" fill="#F7B7A3" />
        {/* Torso - Purple Top */}
        <path d="M 125 205 C 135 200 160 200 170 205 L 180 340 H 115 Z" fill="#5B0E2D" />
        {/* Arms holding backpack */}
        <path d="M 155 215 L 205 245" stroke="#FAD0C4" strokeWidth="12" strokeLinecap="round" />
        <path d="M 155 215 L 205 245" stroke="#5B0E2D" strokeWidth="16" strokeLinecap="round" />
        <path d="M 160 220 L 210 250" stroke="#FAD0C4" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* Backpack Item in Middle */}
      <g id="backpack" transform="translate(200, 220)">
        <rect width="65" height="85" rx="20" fill="#2E2B2A" />
        <rect x="10" y="35" width="45" height="40" rx="10" fill="#423E3D" />
        <path d="M 22 10 Q 32 0 42 10" stroke="#1A1817" strokeWidth="6" fill="none" />
        <circle cx="32" cy="55" r="5" fill="#D4E157" />
      </g>

      {/* Guy Character (Right - Person receiving item) */}
      <g id="guy">
        {/* Hair */}
        <path d="M 370 170 C 365 150 405 145 410 165 C 415 180 405 210 405 210 H 370 Z" fill="#2A1B17" />
        {/* Face & Neck */}
        <ellipse cx="385" cy="175" rx="14" ry="18" fill="#F5C2B3" />
        <path d="M 381 190 H 389 V 205 H 381 Z" fill="#EEA996" />
        {/* Torso - Light Gray Hoodie */}
        <path d="M 360 205 C 370 200 395 200 405 205 L 420 340 H 350 Z" fill="#D4CECD" />
        <path d="M 380 205 Q 385 230 390 205" stroke="#B0A7A6" strokeWidth="3" fill="none" />
        {/* Arms taking backpack */}
        <path d="M 370 215 L 265 245" stroke="#F5C2B3" strokeWidth="12" strokeLinecap="round" />
        <path d="M 370 215 L 265 245" stroke="#D4CECD" strokeWidth="16" strokeLinecap="round" />
        <path d="M 365 220 L 260 250" stroke="#F5C2B3" strokeWidth="10" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// components/ui/YugmoraLogo.tsx — Faceted wireframe Y logo component
import React from "react";

interface YugmoraLogoProps {
  className?: string;
  size?: number;
}

export function YugmoraLogo({ className = "", size = 36 }: YugmoraLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_0_12px_rgba(0,123,244,0.6)] ${className}`}
    >
      <defs>
        {/* Left Arm Gradient (Neon Blue -> Cyan) */}
        <linearGradient id="leftArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22e1ff" />
          <stop offset="100%" stopColor="#007bf4" />
        </linearGradient>

        {/* Stem Gradient (Indigo) */}
        <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#461bef" />
          <stop offset="100%" stopColor="#2a168a" />
        </linearGradient>

        {/* Right Arm Gradient (Neon Pink -> Magenta) */}
        <linearGradient id="rightArmGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff3ddb" />
          <stop offset="100%" stopColor="#a701ce" />
        </linearGradient>

        {/* Center Facet Gradient */}
        <linearGradient id="centerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#8312dc" />
          <stop offset="100%" stopColor="#461bef" />
        </linearGradient>
      </defs>

      {/* Stem (Bottom Column) */}
      <polygon
        points="43,54 57,54 57,90 43,90"
        fill="url(#stemGrad)"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Stem facet divider */}
      <line x1="50" y1="54" x2="50" y2="90" stroke="#8f7dff" strokeWidth="1" strokeDasharray="2 2" />

      {/* Left Upper Arm (Faceted polygon) */}
      <polygon
        points="14,14 40,14 50,54 36,54 14,24"
        fill="url(#leftArmGrad)"
        stroke="#22e1ff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Left arm inner facet */}
      <polygon
        points="22,18 36,18 45,50 36,50"
        fill="#007bf4"
        opacity="0.6"
        stroke="#ffffff"
        strokeWidth="0.8"
      />

      {/* Right Upper Arm (Faceted polygon) */}
      <polygon
        points="86,14 60,14 50,54 64,54 86,24"
        fill="url(#rightArmGrad)"
        stroke="#ff3ddb"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right arm inner facet */}
      <polygon
        points="78,18 64,18 55,50 64,50"
        fill="#a701ce"
        opacity="0.6"
        stroke="#ffffff"
        strokeWidth="0.8"
      />

      {/* Central Diamond Facet */}
      <polygon
        points="50,42 42,54 50,66 58,54"
        fill="url(#centerGrad)"
        stroke="#ffffff"
        strokeWidth="1.4"
      />

      {/* Wireframe Accent Crosshairs */}
      <line x1="14" y1="14" x2="50" y2="54" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
      <line x1="86" y1="14" x2="50" y2="54" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
    </svg>
  );
}

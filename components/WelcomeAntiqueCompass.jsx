import React from "react";

/**
 * Antique bronze pocket compass — skeleton gear dial + N–S needle that slowly seeks / turns.
 */
function WelcomeAntiqueCompass({ className = "w-14 h-14" }) {
  const uid = "wc";
  return (
    <span className={`headline-compass inline-flex ${className}`} aria-hidden="true">
      <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[0_3px_10px_rgba(140,90,40,0.45)]">
        <defs>
          <linearGradient id={`${uid}-bronze`} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#C08A4F" />
            <stop offset="40%" stopColor="#A66B35" />
            <stop offset="75%" stopColor="#7A4A22" />
            <stop offset="100%" stopColor="#4A2E16" />
          </linearGradient>
          <linearGradient id={`${uid}-bronze-hi`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="45%" stopColor="#B87333" />
            <stop offset="100%" stopColor="#6B4423" />
          </linearGradient>
          <radialGradient id={`${uid}-well`} cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#322820" />
            <stop offset="55%" stopColor="#1F1812" />
            <stop offset="100%" stopColor="#12100C" />
          </radialGradient>
          <linearGradient id={`${uid}-needle-n`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#C08A4F" />
            <stop offset="100%" stopColor="#8B5A2B" />
          </linearGradient>
          <linearGradient id={`${uid}-needle-s`} x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#6B4423" />
            <stop offset="100%" stopColor="#4A2E16" />
          </linearGradient>
        </defs>

        {/* Outer case */}
        <circle cx="36" cy="36" r="34" fill={`url(#${uid}-bronze)`} />
        <circle cx="36" cy="36" r="30.5" fill={`url(#${uid}-bronze-hi)`} opacity="0.9" />
        <circle cx="36" cy="36" r="28.5" fill={`url(#${uid}-well)`} />

        {/* Inner bronze rings */}
        <circle cx="36" cy="36" r="26.5" fill="none" stroke="#B87333" strokeWidth="1.4" opacity="0.85" />
        <circle cx="36" cy="36" r="23" fill="none" stroke="#8B5A2B" strokeWidth="0.8" opacity="0.7" />
        <circle cx="36" cy="36" r="19.5" fill="none" stroke="#A66B35" strokeWidth="0.7" opacity="0.55" />

        {/* Degree notches on outer ledge */}
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i * 10 * Math.PI) / 180;
          const major = i % 3 === 0;
          const o = 27.8;
          const inn = major ? 25.2 : 26.2;
          return (
            <line
              key={`t-${i}`}
              x1={36 + o * Math.sin(a)}
              y1={36 - o * Math.cos(a)}
              x2={36 + inn * Math.sin(a)}
              y2={36 - inn * Math.cos(a)}
              stroke="#B87333"
              strokeWidth={major ? 1 : 0.55}
              opacity={0.65}
            />
          );
        })}

        {/* Skeleton gears / struts under the needle */}
        <g opacity="0.55" fill="none" stroke="#B87333" strokeWidth="0.85">
          <circle cx="36" cy="36" r="14" />
          <circle cx="36" cy="36" r="9.5" />
          <circle cx="28" cy="30" r="4.2" />
          <circle cx="44" cy="42" r="3.6" />
          <circle cx="42" cy="27" r="2.8" />
          <line x1="36" y1="22" x2="36" y2="50" opacity="0.7" />
          <line x1="22" y1="36" x2="50" y2="36" opacity="0.7" />
          <line x1="26" y1="26" x2="46" y2="46" opacity="0.45" />
          <line x1="46" y1="26" x2="26" y2="46" opacity="0.45" />
        </g>
        {/* Tiny gear teeth suggestion */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i * 36 * Math.PI) / 180;
          const r = 14;
          return (
            <circle
              key={`g-${i}`}
              cx={36 + r * Math.sin(a)}
              cy={36 - r * Math.cos(a)}
              r="1.05"
              fill="#8B5A2B"
              opacity="0.5"
            />
          );
        })}

        {/* Pocket-watch crown at ~2 o'clock */}
        <g transform="rotate(35 36 36)">
          <rect x="33.2" y="1.5" width="5.6" height="5" rx="1.2" fill={`url(#${uid}-bronze-hi)`} />
          <rect x="34" y="0.2" width="4" height="2.2" rx="0.7" fill={`url(#${uid}-bronze)`} />
          {[0, 1, 2].map((i) => (
            <line
              key={`c-${i}`}
              x1={34.6 + i * 1.2}
              y1="0.5"
              x2={34.6 + i * 1.2}
              y2="2.1"
              stroke="#4A2E16"
              strokeWidth="0.45"
              opacity="0.7"
            />
          ))}
        </g>

        {/* Spinning N–S needle only */}
        <g className="compass-needle">
          <polygon points="36,11 39.4,36 36,33 32.6,36" fill={`url(#${uid}-needle-n)`} />
          <polygon points="36,61 39.4,36 36,39 32.6,36" fill={`url(#${uid}-needle-s)`} />
          <circle cx="36" cy="36" r="3.4" fill={`url(#${uid}-bronze-hi)`} stroke="#3D2817" strokeWidth="0.7" />
          <circle cx="36" cy="36" r="1.4" fill="#B87333" />
        </g>
      </svg>
    </span>
  );
}

export default WelcomeAntiqueCompass;

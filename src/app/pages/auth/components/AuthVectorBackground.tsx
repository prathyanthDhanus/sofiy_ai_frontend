import React from 'react'

export const AuthVectorBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Subtle Warm Gradient Glow Blobs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-gradient-to-b from-[#E8B931]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle Dotted Matrix Pattern across whole canvas */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_15%,transparent_85%)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="auth-grid-dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="#E8B931" fillOpacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid-dots)" />
      </svg>

      {/* Delicate Ambient AI Constellation / Neural Accents in background */}
      <svg
        className="absolute top-4 right-1/4 w-[420px] h-[320px] text-[#E8B931] opacity-35"
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#E8B931" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#E8B931" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Outer Orbital Ellipses */}
        <ellipse
          cx="250"
          cy="150"
          rx="180"
          ry="85"
          transform="rotate(-15 250 150)"
          stroke="url(#orbitGrad1)"
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />

        {/* Small Golden Nodes */}
        <circle cx="250" cy="150" r="3.5" fill="#E8B931" />
        <circle cx="250" cy="150" r="8" stroke="#E8B931" strokeOpacity="0.25" strokeWidth="1" />
        <circle cx="180" cy="120" r="2.5" fill="#E8B931" fillOpacity="0.8" />
        <circle cx="320" cy="170" r="2.5" fill="#E8B931" fillOpacity="0.8" />

        {/* Sparkles */}
        <g transform="translate(140, 90)">
          <path d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7 Z" fill="#E8B931" opacity="0.5" />
        </g>
        <g transform="translate(340, 110)">
          <path d="M0 -8 Q0 0 8 0 Q0 0 0 8 Q0 0 -8 0 Q0 0 0 -8 Z" fill="#E8B931" opacity="0.6" />
        </g>
      </svg>

      {/* Bottom Flowing Waves */}
      <svg
        className="absolute -bottom-6 left-0 right-0 w-full h-44 text-[#E8B931] opacity-40"
        viewBox="0 0 800 180"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.0" />
            <stop offset="35%" stopColor="#E8B931" stopOpacity="0.25" />
            <stop offset="65%" stopColor="#E8B931" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E8B931" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path
          d="M0 120 C180 80 280 160 450 110 C620 60 700 140 800 110"
          stroke="url(#waveGrad1)"
          strokeWidth="1.2"
        />
        <path
          d="M0 140 C190 110 300 170 470 130 C640 90 710 150 800 130"
          stroke="url(#waveGrad1)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  )
}

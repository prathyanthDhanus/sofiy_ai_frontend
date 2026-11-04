import React from 'react'

export const AuthVectorBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Subtle Warm Gradient Glow Blobs */}
      <div className="absolute -top-28 -right-28 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E8B931]/15 via-amber-300/5 to-transparent blur-3xl opacity-80" />
      <div className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-amber-400/10 via-amber-200/5 to-transparent blur-3xl opacity-70" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[#E8B931]/5 blur-3xl" />

      {/* SVG Dotted Matrix Grid across whole canvas */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 [mask-image:radial-gradient(ellipse_80%_80%_at_60%_50%,#000_25%,transparent_90%)]"
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
            <circle cx="2" cy="2" r="1.2" fill="#E8B931" fillOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid-dots)" />
      </svg>

      {/* Vector Artwork: Top-Right AI Orbital & Neural Constellation */}
      <svg
        className="absolute -top-10 -right-10 w-[520px] h-[520px] text-[#E8B931]"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#E8B931" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E8B931" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#D8A721" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="nodeLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E8B931" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Outer Orbital Ellipses */}
        <ellipse
          cx="340"
          cy="160"
          rx="210"
          ry="105"
          transform="rotate(-28 340 160)"
          stroke="url(#orbitGrad1)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <ellipse
          cx="340"
          cy="160"
          rx="145"
          ry="70"
          transform="rotate(18 340 160)"
          stroke="url(#orbitGrad2)"
          strokeWidth="1.2"
        />
        <circle
          cx="340"
          cy="160"
          r="85"
          stroke="#E8B931"
          strokeOpacity="0.15"
          strokeWidth="1"
        />

        {/* Constellation Lines & Connected Nodes */}
        <g opacity="0.8">
          <line x1="280" y1="120" x2="340" y2="160" stroke="url(#nodeLine)" strokeWidth="1" />
          <line x1="340" y1="160" x2="420" y2="140" stroke="url(#nodeLine)" strokeWidth="1" />
          <line x1="340" y1="160" x2="360" y2="240" stroke="url(#nodeLine)" strokeWidth="1" />
          <line x1="420" y1="140" x2="450" y2="210" stroke="url(#nodeLine)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="240" y1="190" x2="280" y2="120" stroke="url(#nodeLine)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Golden Nodes with Glow */}
          <circle cx="340" cy="160" r="4.5" fill="#E8B931" />
          <circle cx="340" cy="160" r="10" stroke="#E8B931" strokeOpacity="0.35" strokeWidth="1" />

          <circle cx="280" cy="120" r="3.5" fill="#E8B931" />
          <circle cx="420" cy="140" r="3.5" fill="#E8B931" />
          <circle cx="360" cy="240" r="3" fill="#E8B931" fillOpacity="0.8" />
          <circle cx="240" cy="190" r="2.5" fill="#E8B931" fillOpacity="0.6" />
          <circle cx="450" cy="210" r="2.5" fill="#E8B931" fillOpacity="0.6" />
        </g>

        {/* 4-Point Sparkle Accents */}
        <g transform="translate(230, 90)">
          <path
            d="M0 -8 Q0 0 8 0 Q0 0 0 8 Q0 0 -8 0 Q0 0 0 -8 Z"
            fill="#E8B931"
            opacity="0.6"
          />
        </g>
        <g transform="translate(430, 80)">
          <path
            d="M0 -11 Q0 0 11 0 Q0 0 0 11 Q0 0 -11 0 Q0 0 0 -11 Z"
            fill="#E8B931"
            opacity="0.75"
          />
        </g>
        <g transform="translate(390, 270)">
          <path
            d="M0 -6 Q0 0 6 0 Q0 0 0 6 Q0 0 -6 0 Q0 0 0 -6 Z"
            fill="#E8B931"
            opacity="0.5"
          />
        </g>
      </svg>

      {/* Floating Center-Bridge Sparks (Spanning between left image & right card) */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.65">
          {/* Bridge nodes */}
          <circle cx="42%" cy="45%" r="2" fill="#E8B931" />
          <circle cx="48%" cy="58%" r="1.5" fill="#E8B931" opacity="0.7" />
          <circle cx="53%" cy="38%" r="2.5" fill="#E8B931" opacity="0.8" />
          <circle cx="56%" cy="65%" r="1.5" fill="#E8B931" opacity="0.5" />
          <line x1="42%" y1="45%" x2="53%" y2="38%" stroke="#E8B931" strokeOpacity="0.15" strokeDasharray="3 3" />
          <line x1="48%" y1="58%" x2="56%" y2="65%" stroke="#E8B931" strokeOpacity="0.12" strokeDasharray="3 3" />
        </g>
      </svg>

      {/* Vector Artwork: Bottom Flowing Wave / Neural Curves */}
      <svg
        className="absolute -bottom-6 left-0 right-0 w-full h-64 text-[#E8B931]"
        viewBox="0 0 800 240"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#E8B931" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#E8B931" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E8B931" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.0" />
            <stop offset="45%" stopColor="#E8B931" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#E8B931" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#E8B931" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="waveFill" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#E8B931" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#E8B931" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path
          d="M0 160 C150 110 260 210 420 150 C580 90 690 190 800 140 L800 240 L0 240 Z"
          fill="url(#waveFill)"
        />
        <path
          d="M0 160 C150 110 260 210 420 150 C580 90 690 190 800 140"
          stroke="url(#waveGrad1)"
          strokeWidth="1.5"
        />
        <path
          d="M0 180 C160 140 280 230 440 170 C600 110 700 200 800 165"
          stroke="url(#waveGrad2)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M0 200 C180 170 300 240 460 190 C620 140 710 215 800 185"
          stroke="url(#waveGrad1)"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

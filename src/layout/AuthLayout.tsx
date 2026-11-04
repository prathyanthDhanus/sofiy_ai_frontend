import React from 'react'
import loginImg from '@/assets/login.jpg'
import { AuthVectorBackground } from '@/app/pages/auth/components/AuthVectorBackground'
import { GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface AuthLayoutProps {
  children?: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="dark min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden bg-[#07090e] text-foreground select-text">
      {/* Full-bleed Cinematic Visual Background showing both AI Robot and Human Child */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={loginImg}
          alt="Sofiy AI Tutor Robot and Human Learner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 select-none"
        />

        {/* Soft Cinematic Overlays for Top/Bottom Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]" />

        {/* Ambient Center Glow behind the card */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#E8B931]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Subtle Vector Background Accents */}
      <AuthVectorBackground />

      {/* Top Navigation Bar: Auth-specific brand header (No admin sidebar/navbar) */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8B931] flex items-center justify-center text-white shadow-lg shadow-[#E8B931]/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">Sofiy AI</span>
            <span className="text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full bg-[#E8B931]/20 border border-[#E8B931]/40 text-[#E8B931]">
              TUTOR
            </span>
          </div>
        </div>

        {/* Top-Right Status Badge */}
        <Badge variant="outline" className="h-7 px-3 gap-1.5 border-white/15 bg-black/40 text-zinc-200 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#E8B931] animate-pulse shadow-[0_0_8px_#E8B931]" />
          AI Learning Platform
        </Badge>
      </header>

      {/* Main Content Area: Centered Login Form with Transparent Glassmorphic Card */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-[460px]">
          <div className="relative rounded-3xl bg-black/45 backdrop-blur-xl border border-white/15 p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {/* Top Accent Shimmer Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#E8B931] to-transparent opacity-90 shadow-[0_0_10px_#E8B931]" />
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Footer: Auth-specific legal & security links */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pb-6 sm:px-10 sm:pb-8 text-xs text-zinc-300">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#E8B931]" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <span className="hidden sm:inline text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <Sparkles className="w-4 h-4 text-[#E8B931]" />
            <span>Enterprise-Grade Security</span>
          </div>
        </div>
        <p className="text-[11px] text-zinc-400">
          © {new Date().getFullYear()} Sofiy AI Tutor. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default AuthLayout

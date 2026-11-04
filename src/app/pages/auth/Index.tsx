import React from 'react'
import loginImg from '@/assets/login.jpg'
import { LoginForm } from './components/loginForm'
import { AuthVectorBackground } from './components/AuthVectorBackground'
import { Sparkles, GraduationCap, ShieldCheck } from 'lucide-react'

export const AuthPage: React.FC = () => {
  return (
    <div className="dark min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden bg-[#07090e] text-foreground select-text">
      {/* Seamless Blended Background Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Left Hero Image with smooth horizontal gradient mask blending seamlessly across */}
        <img
          src={loginImg}
          alt="Sofiy AI Tutor Visual"
          className="absolute left-0 top-0 h-full w-full lg:w-[72%] object-cover object-[25%_center] lg:object-left-center opacity-85 [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(0,0,0,0.95)_30%,rgba(0,0,0,0.6)_58%,rgba(0,0,0,0.15)_82%,transparent_100%)] max-lg:[mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.25)_50%,transparent_100%)]"
        />

        {/* Directional Soft Vignettes that melt the image into #07090e */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-[#07090e]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/60 via-transparent to-[#07090e]" />

        {/* Radiant Golden Flower Bloom spreading from center-left across towards the right */}
        <div className="absolute left-[38%] top-[52%] -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-radial from-[#E8B931]/18 via-[#E8B931]/4 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Decorative Vector Accents (constellations, orbitals, neural curves, sparks) */}
      <AuthVectorBackground />

      {/* Top Navigation Bar: Spans seamlessly across the entire screen */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8B931] flex items-center justify-center text-white shadow-lg shadow-[#E8B931]/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-white">Sofiy AI</span>
            <span className="text-xs font-semibold ml-2 px-2.5 py-0.5 rounded-full bg-[#E8B931]/20 border border-[#E8B931]/40 text-[#E8B931]">
              TUTOR
            </span>
          </div>
        </div>

        {/* Top-Right Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/70 border border-white/10 text-xs font-medium text-zinc-300 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#E8B931] animate-pulse shadow-[0_0_8px_#E8B931]" />
          <span>AI Learning Platform</span>
        </div>
      </header>

      {/* Main Content Area: Organic, non-partitioned layout */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 px-6 py-8 sm:px-10">
        {/* Left Floating Brand Card (Floating organically over the robot visual) */}
        <div className="hidden lg:flex flex-col gap-4 max-w-md p-7 rounded-3xl bg-zinc-950/45 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 text-[#E8B931] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Learning Experience</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Personalized AI Tutoring at your fingertips.
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Master complex concepts, ace exams, and elevate your intellect with an intelligent mentor tailored to your pace.
          </p>
          <div className="pt-3 mt-1 flex items-center gap-4 text-xs text-zinc-400 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-zinc-200 font-medium">Active AI Mentor</span>
            </div>
            <span>•</span>
            <span>Adaptive Multi-Modal Learning</span>
          </div>
        </div>

        {/* Right Floating Authentication Card */}
        <div className="w-full max-w-[450px] lg:ml-auto">
          <div className="relative rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-white/15 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-5px_rgba(232,185,49,0.12)]">
            {/* Top Accent Shimmer Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#E8B931] to-transparent opacity-90 shadow-[0_0_12px_#E8B931]" />
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Bottom Footer: Spans full width */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pb-6 sm:px-10 sm:pb-8 text-xs text-zinc-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#E8B931]" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Sparkles className="w-4 h-4 text-[#E8B931]" />
            <span>Enterprise-Grade Security</span>
          </div>
        </div>
        <p className="text-[11px] text-zinc-500">
          © {new Date().getFullYear()} Sofiy AI Tutor. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default AuthPage

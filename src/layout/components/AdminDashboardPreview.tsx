import React from 'react'
import {
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  Bot,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const AdminDashboardPreview: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-card to-card border border-[#E8B931]/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8B931] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time Learning Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor live AI tutoring sessions, student performance metrics, and adaptive learning engines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="h-9 rounded-xl bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950 font-semibold text-xs gap-1.5 cursor-pointer">
            <Zap className="w-3.5 h-3.5" />
            <span>Train AI Model</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Active Learners</span>
            <Users className="w-4 h-4 text-[#E8B931]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">14,820</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Live AI Sessions</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">342</span>
            <span className="text-xs font-semibold text-emerald-400">Online Now</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Concept Mastery Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#E8B931]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">94.8%</span>
            <span className="text-xs font-semibold text-emerald-400">+3.1%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">AI Tutoring Hours</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">128,450</span>
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
        </div>
      </div>

      {/* Live AI Sessions Monitor Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Active AI Tutoring Sessions
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time interactive speech & visual tutoring sessions across student cohorts.
            </p>
          </div>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
            Live Stream
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject & Topic</th>
                <th className="py-3 px-4">AI Mentor Model</th>
                <th className="py-3 px-4">Session Duration</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">Sophia Reynolds</td>
                <td className="py-3 px-4">Advanced Calculus · Integration by Parts</td>
                <td className="py-3 px-4 text-muted-foreground">Sofiy Math-v3</td>
                <td className="py-3 px-4">24m 12s</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">Marcus Vance</td>
                <td className="py-3 px-4">Organic Chemistry · Reaction Mechanisms</td>
                <td className="py-3 px-4 text-muted-foreground">Sofiy Chem-v2</td>
                <td className="py-3 px-4">15m 45s</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">Aarav Patel</td>
                <td className="py-3 px-4">Quantum Physics · Wave-Particle Duality</td>
                <td className="py-3 px-4 text-muted-foreground">Sofiy Physics-Pro</td>
                <td className="py-3 px-4">38m 04s</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Solving Quiz
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPreview

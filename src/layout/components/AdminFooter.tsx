import React from 'react'

export interface AdminFooterProps {
  className?: string
}

export const AdminFooter: React.FC<AdminFooterProps> = ({ className }) => {
  return (
    <footer
      className={`h-16 shrink-0 border-t border-border bg-card/60 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground mt-auto w-full ${className || ''}`}
    >
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} Sofiy AI HR Platform.</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline text-foreground font-medium">HR Operations Console v2.4</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          All Systems Operational · 24ms
        </span>
        <span>•</span>
        <span className="hover:text-foreground cursor-pointer transition-colors">Documentation</span>
        <span className="hidden sm:inline hover:text-foreground cursor-pointer transition-colors">Support</span>
      </div>
    </footer>
  )
}

export default AdminFooter

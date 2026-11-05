import React, { useState } from 'react'
import { Copy, Check, Mail, Phone, Hash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface CopyableCellProps {
  value: string | number
  type?: 'id' | 'email' | 'mobile' | 'text' | 'badge' | 'custom'
  label?: string
  className?: string
}

export const CopyableCell: React.FC<CopyableCellProps> = ({
  value,
  type = 'text',
  label,
  className = '',
}) => {
  const [copied, setCopied] = useState(false)
  const stringValue = String(value ?? '')

  if (!stringValue) {
    return <span className="text-muted-foreground/60">—</span>
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(stringValue)
      setCopied(true)
      const descriptor = label || (type === 'mobile' ? 'Phone number' : type === 'email' ? 'Email' : 'ID')
      toast.success(`${descriptor} copied to clipboard`, {
        description: stringValue,
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const getPrefixIcon = () => {
    switch (type) {
      case 'id':
        return <Hash className="w-3 h-3 text-muted-foreground/70 shrink-0" />
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
      case 'mobile':
        return <Phone className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
      default:
        return null
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`group h-auto inline-flex items-center gap-1.5 px-2 py-0.5 -mx-1.5 rounded-md hover:bg-muted/70 transition-all text-left font-mono text-xs cursor-pointer select-none whitespace-nowrap shrink-0 ${className}`}
          >
            {getPrefixIcon()}
            <span className="whitespace-nowrap font-medium text-foreground group-hover:text-[#E8B931] transition-colors">
              {stringValue}
            </span>
            <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs bg-popover text-popover-foreground border border-border shadow-md">
          {copied ? 'Copied!' : `Click to copy ${label || type}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

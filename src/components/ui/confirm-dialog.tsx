import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  itemName?: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'default'
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed? This action cannot be undone.',
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'destructive',
  isLoading = false,
  onConfirm,
}) => {
  const isDestructive = variant === 'destructive'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card shadow-2xl p-6">
        <DialogHeader className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isDestructive
                  ? 'bg-destructive/15 text-destructive'
                  : 'bg-[#E8B931]/15 text-[#E8B931]'
              }`}
            >
              {isDestructive ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-0.5 text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                {title}
              </DialogTitle>
              {itemName && (
                <div className="text-xs font-mono font-medium text-muted-foreground truncate max-w-[280px]">
                  {itemName}
                </div>
              )}
            </div>
          </div>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-2.5 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs h-9 px-4 cursor-pointer"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={isDestructive ? 'destructive' : 'default'}
            size="sm"
            disabled={isLoading}
            onClick={async () => {
              await onConfirm()
            }}
            className={`rounded-xl text-xs h-9 px-4 font-semibold cursor-pointer gap-1.5 ${
              !isDestructive ? 'bg-[#E8B931] hover:bg-[#D8A721] text-zinc-950' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {isDestructive && <Trash2 className="h-3.5 w-3.5" />}
                <span>{confirmText}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

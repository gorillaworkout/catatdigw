"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface SubscriptionGuardButtonDashboardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  showLockIcon?: boolean
  tooltipText?: string
}

export const SubscriptionGuardButtonDashboard = forwardRef<HTMLButtonElement, SubscriptionGuardButtonDashboardProps>(
  ({ children, className, showLockIcon = true, tooltipText = "Subscription berakhir. Hubungi WhatsApp untuk pembayaran.", ...props }, ref) => {
    const { isActive } = useSubscription()

    const buttonContent = (
      <Button
        ref={ref}
        {...props}
        disabled={!isActive || props.disabled}
        className={cn(className)}
      >
        {children}
        {!isActive && showLockIcon && <Lock className="ml-2 h-4 w-4" />}
      </Button>
    )

    if (!isActive) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {buttonContent}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return buttonContent
  }
)

SubscriptionGuardButtonDashboard.displayName = "SubscriptionGuardButtonDashboard"

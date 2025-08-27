"use client"

import { ReactNode } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubscriptionGuardButtonProps {
  children: ReactNode
  disabled?: boolean
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  tooltipText?: string
  showLockIcon?: boolean
  type?: "button" | "submit" | "reset"
}

export function SubscriptionGuardButton({
  children,
  disabled = false,
  className,
  variant = "default",
  size = "default",
  onClick,
  tooltipText = "Subscription Anda telah berakhir. Perpanjang subscription untuk mengakses fitur ini.",
  showLockIcon = true,
  type = "button",
  ...props
}: SubscriptionGuardButtonProps) {
  const { isActive } = useSubscription()
  const isDisabled = disabled || !isActive

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      className={cn(
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {showLockIcon && isDisabled && <Lock className="h-4 w-4 mr-2" />}
      {children}
    </Button>
  )

  if (isDisabled) {
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

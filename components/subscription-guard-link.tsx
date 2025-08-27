"use client"

import { ReactNode } from "react"
import { useSubscription } from "@/hooks/use-subscription"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SubscriptionGuardLinkProps {
  children: ReactNode
  href: string
  className?: string
  tooltipText?: string
  showLockIcon?: boolean
  onClick?: () => void
}

export function SubscriptionGuardLink({
  children,
  href,
  className,
  tooltipText = "Subscription Anda telah berakhir. Perpanjang subscription untuk mengakses halaman ini.",
  showLockIcon = true,
  onClick,
}: SubscriptionGuardLinkProps) {
  const { isActive } = useSubscription()

  const linkContent = (
    <Link
      href={isActive ? href : "#"}
      className={cn(
        "inline-flex items-center",
        !isActive && "pointer-events-none opacity-50 cursor-not-allowed",
        className
      )}
      onClick={isActive ? onClick : (e) => e.preventDefault()}
    >
      {showLockIcon && !isActive && <Lock className="h-4 w-4 mr-2" />}
      {children}
    </Link>
  )

  if (!isActive) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return linkContent
}

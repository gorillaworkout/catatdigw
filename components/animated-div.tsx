"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedDivProps {
  children: ReactNode
  direction?: "left" | "right" | "top" | "bottom"
  delay?: number
  duration?: number
  className?: string
}

export function AnimatedDiv({
  children,
  direction = "bottom",
  delay = 0,
  duration = 0.6,
  className = "",
}: AnimatedDivProps) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      y: direction === "top" ? -50 : direction === "bottom" ? 50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

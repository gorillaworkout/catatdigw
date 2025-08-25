"use client"

import { useEffect, useState } from "react"
import { AnimatedDiv } from "@/components/animated-div"

const stats = [
  { label: "Pengguna Aktif", value: 10000, suffix: "+" },
  { label: "Transaksi Tercatat", value: 500000, suffix: "+" },
  { label: "Laporan Diunduh", value: 25000, suffix: "+" },
  { label: "Rating Aplikasi", value: 4.9, suffix: "/5" },
]

export function StatsSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-12 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedDiv
              key={index}
              direction={index % 2 === 0 ? "bottom" : "top"}
              delay={0.1 * index}
              className="text-center"
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value.toLocaleString()}
                {stat.suffix}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

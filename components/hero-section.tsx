"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight, Shield, TrendingUp, PieChart } from "lucide-react"
import Link from "next/link"
import { AnimatedDiv } from "@/components/animated-div"

export function HeroSection() {
  const { user, signInWithGoogle } = useAuth()

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedDiv direction="top" delay={0.1}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Shield className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Aman & Terpercaya</span>
            </div>
          </AnimatedDiv>

          <AnimatedDiv direction="left" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Kelola Keuangan Anda dengan <span className="text-primary">Mudah & Rapih</span>
            </h1>
          </AnimatedDiv>

          <AnimatedDiv direction="right" delay={0.3}>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              catatdiGW membantu Anda mencatat pengeluaran dan pemasukan dengan interface yang elegan, laporan yang
              detail, dan analisis keuangan yang mendalam.
            </p>
          </AnimatedDiv>

          <AnimatedDiv direction="bottom" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    Buka Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={signInWithGoogle}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  Mulai Gratis Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Lihat Demo
              </Button>
            </div>
          </AnimatedDiv>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <AnimatedDiv direction="left" delay={0.5}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-lg mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Analisis Real-time</h3>
                <p className="text-sm text-muted-foreground">Pantau keuangan Anda secara real-time</p>
              </div>
            </AnimatedDiv>
            <AnimatedDiv direction="bottom" delay={0.6}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-lg mb-3">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Laporan Detail</h3>
                <p className="text-sm text-muted-foreground">Export ke PDF dan Excel</p>
              </div>
            </AnimatedDiv>
            <AnimatedDiv direction="right" delay={0.7}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-lg mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Data Aman</h3>
                <p className="text-sm text-muted-foreground">Enkripsi tingkat bank</p>
              </div>
            </AnimatedDiv>
          </div>
        </div>
      </div>
    </section>
  )
}

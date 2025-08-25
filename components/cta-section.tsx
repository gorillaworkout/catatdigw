"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { AnimatedDiv } from "@/components/animated-div"

export function CTASection() {
  const { user, signInWithGoogle } = useAuth()

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedDiv direction="top" delay={0.1}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">Mulai Hari Ini</span>
            </div>
          </AnimatedDiv>

          <AnimatedDiv direction="left" delay={0.2}>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Siap Mengambil Kontrol Keuangan Anda?
            </h2>
          </AnimatedDiv>

          <AnimatedDiv direction="right" delay={0.3}>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan mengelola keuangan dengan catatdiGW.
              Gratis untuk memulai!
            </p>
          </AnimatedDiv>

          <AnimatedDiv direction="bottom" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                    Lanjut ke Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={signInWithGoogle}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  Daftar Gratis Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  )
}

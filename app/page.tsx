import { Suspense } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<LoadingSkeleton />}>
        <Header />
        <main>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <CTASection />
        </main>
        <Footer />
      </Suspense>
    </div>
  )
}

import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Users, Shield, Zap, Heart, Award } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tentang catatandiGW - Aplikasi Pencatatan Keuangan",
  description:
    "Pelajari lebih lanjut tentang catatandiGW, aplikasi pencatatan keuangan yang membantu Anda mengelola pengeluaran dan pemasukan dengan mudah dan aman.",
  keywords: "tentang catatandigw, aplikasi keuangan, pencatatan pengeluaran, manajemen keuangan personal",
}

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Data keuangan Anda dilindungi dengan enkripsi tingkat bank dan autentikasi Google yang aman.",
    },
    {
      icon: Zap,
      title: "Mudah Digunakan",
      description: "Interface yang intuitif dan responsif memudahkan pencatatan transaksi kapan saja, di mana saja.",
    },
    {
      icon: Target,
      title: "Laporan Detail",
      description: "Analisis keuangan mendalam dengan grafik interaktif dan export ke PDF/Excel.",
    },
    {
      icon: Heart,
      title: "Gratis Selamanya",
      description: "Nikmati semua fitur premium tanpa biaya berlangganan atau biaya tersembunyi.",
    },
  ]

  const stats = [
    { number: "10K+", label: "Pengguna Aktif" },
    { number: "500K+", label: "Transaksi Tercatat" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.8/5", label: "Rating Pengguna" },
  ]

  const team = [
    { name: "Ahmad Rizki", role: "Founder & CEO", description: "Passionate tentang financial literacy" },
    { name: "Sarah Putri", role: "Lead Developer", description: "Expert dalam pengembangan web modern" },
    { name: "Budi Santoso", role: "UI/UX Designer", description: "Menciptakan pengalaman pengguna terbaik" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold text-sm sm:text-base">Kembali ke Beranda</span>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="sm:text-base">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6">
          <Badge variant="outline" className="mx-auto">
            Tentang Kami
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            catatandiGW
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Aplikasi pencatatan keuangan yang membantu Anda mengelola pengeluaran dan pemasukan dengan mudah, aman, dan
            efisien. Dibuat dengan cinta untuk membantu masyarakat Indonesia mencapai kebebasan finansial.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
          <Card className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg w-fit">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Misi Kami</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Memberdayakan setiap individu untuk mengambil kendali atas keuangan mereka melalui teknologi yang mudah
                diakses, aman, dan gratis. Kami percaya bahwa setiap orang berhak memiliki alat yang tepat untuk
                mengelola keuangan dengan baik.
              </p>
            </div>
          </Card>
          <Card className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg w-fit">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Visi Kami</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Menjadi platform pencatatan keuangan terdepan di Indonesia yang membantu jutaan orang mencapai
                stabilitas finansial dan meningkatkan literasi keuangan masyarakat melalui teknologi yang inovatif dan
                mudah digunakan.
              </p>
            </div>
          </Card>
        </section>

        {/* Features */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Mengapa Memilih catatandiGW?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Kami menghadirkan solusi pencatatan keuangan yang komprehensif dengan fitur-fitur unggulan
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg w-fit mx-auto">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="text-center space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Dipercaya oleh Ribuan Pengguna</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Tim Kami</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Bertemu dengan tim passionate yang bekerja keras untuk menghadirkan pengalaman terbaik
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {team.map((member, index) => (
              <Card key={index} className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">{member.name}</h3>
                  <p className="text-blue-600 font-medium text-sm sm:text-base">{member.role}</p>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-2">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4 sm:space-y-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Siap Mengelola Keuangan Anda?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
            Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan mengelola keuangan dengan catatandiGW
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 text-sm sm:text-base">
              Mulai Sekarang - Gratis!
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}

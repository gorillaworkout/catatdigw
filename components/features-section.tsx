import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingDown, TrendingUp, Settings, FileText, HelpCircle, History, PieChart } from "lucide-react"
import { AnimatedDiv } from "@/components/animated-div"

const features = [
  {
    icon: BarChart3,
    title: "Dashboard",
    description: "Statistik lengkap dan daftar rekening dalam satu tampilan yang elegan",
    color: "text-blue-500",
  },
  {
    icon: TrendingDown,
    title: "Pengeluaran",
    description: "Catat dan analisis pengeluaran dengan filter dan kategori yang detail",
    color: "text-red-500",
  },
  {
    icon: TrendingUp,
    title: "Pendapatan",
    description: "Kelola pemasukan dengan statistik dan filter yang mudah dipahami",
    color: "text-green-500",
  },
  {
    icon: Settings,
    title: "Pengaturan",
    description: "Tambah dan kelola berbagai rekening serta kustomisasi aplikasi",
    color: "text-gray-500",
  },
  {
    icon: FileText,
    title: "Laporan Keuangan",
    description: "Download laporan dalam format PDF atau Excel untuk analisis mendalam",
    color: "text-purple-500",
  },
  {
    icon: HelpCircle,
    title: "Bantuan & FAQ",
    description: "Panduan lengkap dan jawaban atas pertanyaan yang sering diajukan",
    color: "text-orange-500",
  },
  {
    icon: History,
    title: "Riwayat & Backup",
    description: "Akses riwayat transaksi dan backup data untuk keamanan ekstra",
    color: "text-indigo-500",
  },
  {
    icon: PieChart,
    title: "Analisis Visual",
    description: "Grafik dan chart interaktif untuk memahami pola keuangan Anda",
    color: "text-teal-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedDiv direction="top" className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Fitur Lengkap untuk Kebutuhan Keuangan Anda
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola keuangan pribadi atau bisnis dalam satu aplikasi
          </p>
        </AnimatedDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimatedDiv
              key={index}
              direction={index % 4 === 0 ? "left" : index % 4 === 1 ? "top" : index % 4 === 2 ? "right" : "bottom"}
              delay={0.1 * index}
            >
              <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg text-card-foreground">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

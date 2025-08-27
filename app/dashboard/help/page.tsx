import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Book, Video, Mail, Phone, Home, Settings, HelpCircle, Plus, Edit, Trash2, TrendingUp, PieChart, Wallet, CreditCard } from "lucide-react"
import Link from "next/link"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

export const metadata: Metadata = {
  title: "Bantuan & FAQ - catatdiGW",
  description: "Pusat bantuan lengkap dan pertanyaan yang sering diajukan untuk catatdiGW",
}

export default function HelpPage() {
  const faqCategories = [
    {
      title: "Memulai",
      icon: Home,
      items: [
        {
          question: "Bagaimana cara mendaftar di catatdiGW?",
          answer: "Anda dapat mendaftar dengan mudah menggunakan akun Google. Klik tombol 'Masuk dengan Google' di halaman utama, dan akun Anda akan langsung terdaftar dan siap digunakan.",
        },
        {
          question: "Apakah catatdiGW gratis untuk digunakan?",
          answer: "Ya, catatdiGW sepenuhnya gratis untuk digunakan. Kami menyediakan semua fitur pencatatan keuangan tanpa biaya berlangganan atau biaya tersembunyi.",
        },
        {
          question: "Bagaimana cara mengunduh aplikasi mobile?",
          answer: "catatdiGW adalah Progressive Web App (PWA). Anda dapat menginstalnya di perangkat mobile dengan membuka website di browser, lalu pilih 'Add to Home Screen' atau 'Install App' dari menu browser.",
        },
        {
          question: "Bagaimana cara menambahkan rekening pertama?",
          answer: "Setelah login, pergi ke menu Settings > Account Management, lalu klik 'Tambah Rekening Baru'. Isi nama rekening, jenis, dan saldo awal.",
        },
      ],
    },
    {
      title: "Pencatatan Transaksi",
      icon: Plus,
      items: [
        {
          question: "Bagaimana cara menambahkan pengeluaran baru?",
          answer: "Masuk ke halaman 'Pengeluaran', klik tombol 'Tambah Pengeluaran', isi formulir dengan detail transaksi (jumlah, kategori, tanggal, deskripsi), lalu klik 'Simpan'.",
        },
        {
          question: "Bagaimana cara menambahkan pemasukan?",
          answer: "Masuk ke halaman 'Pemasukan', klik tombol 'Tambah Pemasukan', isi formulir dengan detail transaksi, lalu klik 'Simpan'.",
        },
        {
          question: "Bisakah saya mengedit transaksi yang sudah dicatat?",
          answer: "Ya, Anda dapat mengedit transaksi kapan saja. Klik ikon edit (pensil) pada transaksi yang ingin diubah, lakukan perubahan, lalu simpan.",
        },
        {
          question: "Bagaimana cara menghapus transaksi?",
          answer: "Klik ikon titik tiga pada transaksi yang ingin dihapus, pilih 'Hapus', lalu konfirmasi penghapusan. Data yang dihapus tidak dapat dikembalikan.",
        },
        {
          question: "Apakah ada batasan jumlah transaksi yang bisa dicatat?",
          answer: "Tidak ada batasan jumlah transaksi. Anda dapat mencatat sebanyak mungkin transaksi sesuai kebutuhan keuangan Anda.",
        },
      ],
    },
    {
      title: "Kategori dan Rekening",
      icon: Settings,
      items: [
        {
          question: "Bagaimana cara menambahkan kategori baru?",
          answer: "Masuk ke halaman 'Pengaturan', pilih tab 'Kategori', klik 'Tambah Kategori', masukkan nama kategori dan pilih warna, lalu simpan.",
        },
        {
          question: "Bisakah saya mengubah nama kategori yang sudah ada?",
          answer: "Ya, di halaman Pengaturan > Kategori, klik ikon edit pada kategori yang ingin diubah, masukkan nama baru, lalu simpan.",
        },
        {
          question: "Bagaimana cara menambahkan rekening bank?",
          answer: "Di halaman 'Pengaturan', pilih tab 'Rekening', klik 'Tambah Rekening', pilih jenis rekening (Bank, Tunai, Kartu Kredit, dll), masukkan nama dan saldo awal, lalu simpan.",
        },
        {
          question: "Apakah saldo rekening otomatis terupdate?",
          answer: "Ya, saldo rekening akan otomatis terupdate setiap kali Anda menambahkan transaksi pemasukan atau pengeluaran pada rekening tersebut.",
        },
        {
          question: "Bisakah saya mengedit atau menghapus rekening?",
          answer: "Ya, di halaman Pengaturan > Rekening, Anda dapat mengedit atau menghapus rekening. Namun, rekening yang masih memiliki transaksi tidak dapat dihapus.",
        },
      ],
    },
    {
      title: "Laporan dan Analisis",
      icon: TrendingUp,
      items: [
        {
          question: "Bagaimana cara melihat laporan keuangan?",
          answer: "Masuk ke halaman 'Laporan', pilih periode yang diinginkan, dan Anda akan melihat ringkasan keuangan lengkap dengan grafik dan statistik.",
        },
        {
          question: "Bisakah saya mengunduh laporan dalam format PDF?",
          answer: "Ya, di halaman Laporan, klik tombol 'Unduh PDF' untuk mengunduh laporan keuangan dalam format PDF yang siap dicetak.",
        },
        {
          question: "Bagaimana cara mengatur periode laporan?",
          answer: "Di halaman Laporan, pilih tanggal mulai dan akhir menggunakan date picker, lalu pilih jenis laporan yang diinginkan.",
        },
        {
          question: "Apa saja jenis laporan yang tersedia?",
          answer: "Tersedia laporan pengeluaran, pemasukan, saldo rekening, dan analisis tren keuangan dengan berbagai periode waktu.",
        },
      ],
    },
    {
      title: "Keamanan dan Privasi",
      icon: HelpCircle,
      items: [
        {
          question: "Apakah data keuangan saya aman?",
          answer: "Ya, semua data keuangan Anda disimpan dengan aman menggunakan enkripsi dan hanya dapat diakses oleh Anda sendiri.",
        },
        {
          question: "Bisakah saya menghapus akun saya?",
          answer: "Ya, Anda dapat menghapus akun di halaman Pengaturan > Profil. Semua data akan dihapus secara permanen.",
        },
        {
          question: "Apakah ada backup data otomatis?",
          answer: "Data Anda tersimpan otomatis di cloud dan dapat diakses dari perangkat manapun yang terhubung dengan akun Google Anda.",
        },
      ],
    },
  ]

  const quickActions = [
    { 
      icon: Plus, 
      title: "Tambah Transaksi", 
      description: "Cara mencatat pengeluaran dan pemasukan",
      link: "/dashboard/expenses"
    },
    { 
      icon: Settings, 
      title: "Kelola Rekening", 
      description: "Tambah dan atur rekening keuangan",
      link: "/dashboard/settings"
    },
    { 
      icon: TrendingUp, 
      title: "Lihat Laporan", 
      description: "Analisis keuangan dan laporan",
      link: "/dashboard/reports"
    },
    { 
      icon: Wallet, 
      title: "Dashboard", 
      description: "Ringkasan keuangan harian",
      link: "/dashboard"
    },
  ]

  const helpResources = [
    { icon: Book, title: "Panduan Lengkap", description: "Dokumentasi lengkap penggunaan aplikasi" },
    { icon: Video, title: "Video Tutorial", description: "Tutorial video step-by-step" },
    { icon: MessageCircle, title: "Live Chat", description: "Chat langsung dengan tim support" },
    { icon: Mail, title: "Email Support", description: "Kirim pertanyaan via email" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bantuan & FAQ</h1>
          <p className="text-muted-foreground">Temukan jawaban untuk pertanyaan Anda dan pelajari cara menggunakan catatdiGW</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari bantuan atau FAQ..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.link}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <action.icon className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Resources */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Sumber Bantuan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpResources.map((resource, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <resource.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan yang Sering Diajukan</CardTitle>
            <CardDescription>Jawaban lengkap untuk pertanyaan umum tentang catatdiGW</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-3 mb-4">
                    <category.icon className="h-5 w-5 text-primary" />
                    <Badge variant="outline" className="text-sm font-medium">{category.title}</Badge>
                  </div>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Masih Butuh Bantuan?</CardTitle>
            <CardDescription>Tim support kami siap membantu Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <SubscriptionGuardButton tooltipText="Subscription berakhir. Perpanjang subscription untuk akses live chat.">
                <MessageCircle className="mr-2 h-4 w-4" />
                Live Chat
              </SubscriptionGuardButton>
              <SubscriptionGuardButton variant="outline" tooltipText="Subscription berakhir. Perpanjang subscription untuk akses email support.">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </SubscriptionGuardButton>
              <SubscriptionGuardButton variant="outline" tooltipText="Subscription berakhir. Perpanjang subscription untuk akses telepon support.">
                <Phone className="mr-2 h-4 w-4" />
                Telepon
              </SubscriptionGuardButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

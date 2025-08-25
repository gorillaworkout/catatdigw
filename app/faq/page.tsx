import type { Metadata } from "next"
import { AnimatedDiv } from "@/components/animated-div"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail, ArrowLeft, Home, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQ - Pertanyaan yang Sering Diajukan | catatdiGW",
  description:
    "Temukan jawaban untuk pertanyaan yang sering diajukan tentang aplikasi pencatatan keuangan catatdiGW. Panduan lengkap untuk mengelola keuangan Anda.",
  keywords: "FAQ, bantuan, panduan, pencatatan keuangan, catatdiGW, tutorial",
}

const faqData = [
  {
    category: "Memulai",
    questions: [
      {
        question: "Bagaimana cara mendaftar di catatdiGW?",
        answer:
          "Anda dapat mendaftar dengan mudah menggunakan akun Google. Klik tombol 'Masuk dengan Google' di halaman utama, dan akun Anda akan langsung terdaftar dan siap digunakan.",
      },
      {
        question: "Apakah catatdiGW gratis untuk digunakan?",
        answer:
          "Ya, catatdiGW sepenuhnya gratis untuk digunakan. Kami menyediakan semua fitur pencatatan keuangan tanpa biaya berlangganan atau biaya tersembunyi.",
      },
      {
        question: "Bagaimana cara mengunduh aplikasi mobile?",
        answer:
          "catatdiGW adalah Progressive Web App (PWA). Anda dapat menginstalnya di perangkat mobile dengan membuka website di browser, lalu pilih 'Add to Home Screen' atau 'Install App' dari menu browser.",
      },
    ],
  },
  {
    category: "Pencatatan Transaksi",
    questions: [
      {
        question: "Bagaimana cara menambahkan pengeluaran baru?",
        answer:
          "Masuk ke halaman 'Pengeluaran', klik tombol 'Tambah Pengeluaran', isi formulir dengan detail transaksi (jumlah, kategori, tanggal, deskripsi), lalu klik 'Simpan'.",
      },
      {
        question: "Bisakah saya mengedit transaksi yang sudah dicatat?",
        answer:
          "Ya, Anda dapat mengedit transaksi kapan saja. Klik ikon edit (pensil) pada transaksi yang ingin diubah, lakukan perubahan, lalu simpan.",
      },
      {
        question: "Bagaimana cara menghapus transaksi?",
        answer:
          "Klik ikon titik tiga pada transaksi yang ingin dihapus, pilih 'Hapus', lalu konfirmasi penghapusan. Data yang dihapus tidak dapat dikembalikan.",
      },
      {
        question: "Apakah ada batasan jumlah transaksi yang bisa dicatat?",
        answer:
          "Tidak ada batasan jumlah transaksi. Anda dapat mencatat sebanyak mungkin transaksi sesuai kebutuhan keuangan Anda.",
      },
    ],
  },
  {
    category: "Kategori dan Rekening",
    questions: [
      {
        question: "Bagaimana cara menambahkan kategori baru?",
        answer:
          "Masuk ke halaman 'Pengaturan', pilih tab 'Kategori', klik 'Tambah Kategori', masukkan nama kategori dan pilih warna, lalu simpan.",
      },
      {
        question: "Bisakah saya mengubah nama kategori yang sudah ada?",
        answer:
          "Ya, di halaman Pengaturan > Kategori, klik ikon edit pada kategori yang ingin diubah, masukkan nama baru, lalu simpan.",
      },
      {
        question: "Bagaimana cara menambahkan rekening bank?",
        answer:
          "Di halaman 'Pengaturan', pilih tab 'Rekening', klik 'Tambah Rekening', pilih jenis rekening (Bank, Tunai, Kartu Kredit, dll), masukkan nama dan saldo awal, lalu simpan.",
      },
      {
        question: "Apakah saldo rekening otomatis terupdate?",
        answer:
          "Ya, saldo rekening akan otomatis terupdate setiap kali Anda menambahkan transaksi pemasukan atau pengeluaran pada rekening tersebut.",
      },
    ],
  },
  {
    category: "Laporan dan Analisis",
    questions: [
      {
        question: "Bagaimana cara melihat laporan keuangan?",
        answer:
          "Masuk ke halaman 'Laporan', pilih periode yang diinginkan, dan Anda akan melihat ringkasan keuangan lengkap dengan grafik dan statistik.",
      },
      {
        question: "Bisakah saya mengunduh laporan dalam format PDF?",
        answer:
          "Ya, di halaman Laporan, klik tombol 'Unduh PDF' untuk mengunduh laporan keuangan dalam format PDF yang siap dicetak.",
      },
      {
        question: "Apakah tersedia export data ke Excel?",
        answer:
          "Ya, Anda dapat mengexport data transaksi ke format Excel (.xlsx) melalui halaman Laporan dengan klik tombol 'Export Excel'.",
      },
      {
        question: "Bagaimana cara melihat tren pengeluaran bulanan?",
        answer:
          "Di halaman Dashboard atau Pengeluaran, Anda akan melihat grafik tren yang menampilkan pola pengeluaran bulanan dengan visualisasi yang mudah dipahami.",
      },
    ],
  },
  {
    category: "Keamanan dan Data",
    questions: [
      {
        question: "Apakah data saya aman di catatdiGW?",
        answer:
          "Ya, kami menggunakan enkripsi tingkat bank dan autentikasi Google untuk melindungi data Anda. Data disimpan dengan aman di server yang terpercaya.",
      },
      {
        question: "Bagaimana cara backup data saya?",
        answer:
          "Di halaman 'Riwayat & Backup', klik 'Buat Backup' untuk menyimpan salinan data Anda. Backup otomatis juga dilakukan setiap hari.",
      },
      {
        question: "Bisakah saya mengakses data dari perangkat lain?",
        answer:
          "Ya, dengan login menggunakan akun Google yang sama, Anda dapat mengakses data dari perangkat apapun dengan sinkronisasi real-time.",
      },
      {
        question: "Bagaimana jika saya lupa password?",
        answer:
          "catatdiGW menggunakan autentikasi Google, jadi Anda tidak perlu mengingat password terpisah. Gunakan fitur reset password Google jika diperlukan.",
      },
    ],
  },
  {
    category: "Fitur Lanjutan",
    questions: [
      {
        question: "Apakah ada fitur pengingat untuk tagihan?",
        answer:
          "Saat ini fitur pengingat tagihan sedang dalam pengembangan. Anda dapat menggunakan kategori 'Tagihan' untuk melacak pembayaran rutin.",
      },
      {
        question: "Bisakah saya mengatur budget bulanan?",
        answer:
          "Fitur budget planning akan segera hadir. Saat ini Anda dapat memantau pengeluaran melalui grafik dan laporan yang tersedia.",
      },
      {
        question: "Apakah ada fitur split bill untuk pengeluaran bersama?",
        answer:
          "Fitur split bill sedang dalam roadmap pengembangan. Saat ini Anda dapat mencatat pengeluaran bersama dengan deskripsi yang jelas.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Kembali</span>
                </Link>
              </Button>
              <div className="hidden sm:block">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">FAQ & Bantuan</h2>
              </div>
            </div>

            {/* Right side - Navigation buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Link href="/dashboard">
                  <Home className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Link href="/dashboard/help">
                  <HelpCircle className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Bantuan</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-2">
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Pengaturan</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <AnimatedDiv direction="top" className="bg-gradient-to-r from-primary/10 to-blue-600/10 border-b">
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">Pertanyaan yang Sering Diajukan</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Temukan jawaban untuk pertanyaan umum tentang catatdiGW</p>
          </div>
        </div>
      </AnimatedDiv>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick Help */}
          <AnimatedDiv direction="left" delay={0.2}>
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-primary/5 to-blue-600/5">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Butuh Bantuan Lebih Lanjut?</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Jika Anda tidak menemukan jawaban yang dicari, jangan ragu untuk menghubungi tim support kami
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button asChild variant="default" size="sm" className="sm:text-base">
                    <Link href="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Hubungi Support
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="sm:text-base">
                    <Link href="/dashboard/help">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Live Chat
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </AnimatedDiv>

          {/* FAQ Sections */}
          {faqData.map((category, categoryIndex) => (
            <AnimatedDiv
              key={category.category}
              direction={categoryIndex % 2 === 0 ? "left" : "right"}
              delay={0.1 * categoryIndex}
              className="mb-6 sm:mb-8"
            >
              <Card className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-primary">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary transition-colors text-sm sm:text-base">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </AnimatedDiv>
          ))}

          {/* Contact CTA */}
          <AnimatedDiv direction="bottom" delay={0.4}>
            <Card className="p-8 text-center bg-gradient-to-r from-primary/10 to-blue-600/10">
              <h3 className="text-2xl font-semibold mb-4">Masih Ada Pertanyaan?</h3>
              <p className="text-muted-foreground mb-6">Tim support kami siap membantu Anda 24/7</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">
                    <Phone className="w-4 h-4 mr-2" />
                    Hubungi Kami
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Kembali ke Dashboard</Link>
                </Button>
              </div>
            </Card>
          </AnimatedDiv>
        </div>
      </div>
    </div>
  )
}

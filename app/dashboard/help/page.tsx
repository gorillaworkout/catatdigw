import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Book, Video, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Bantuan & FAQ - catatdiGW",
  description: "Pusat bantuan dan pertanyaan yang sering diajukan untuk catatdiGW",
}

export default function HelpPage() {
  const faqCategories = [
    {
      title: "Memulai",
      items: [
        {
          question: "Bagaimana cara membuat akun baru?",
          answer:
            'Anda dapat membuat akun dengan mengklik tombol "Masuk dengan Google" di halaman utama. Sistem akan otomatis membuat akun baru jika email Anda belum terdaftar.',
        },
        {
          question: "Bagaimana cara menambahkan rekening pertama?",
          answer:
            'Setelah login, pergi ke menu Settings > Account Management, lalu klik "Tambah Rekening Baru". Isi nama rekening, jenis, dan saldo awal.',
        },
      ],
    },
    {
      title: "Pencatatan Transaksi",
      items: [
        {
          question: "Bagaimana cara mencatat pengeluaran?",
          answer:
            'Pergi ke menu Pengeluaran, klik tombol "Tambah Pengeluaran", isi detail transaksi seperti jumlah, kategori, dan deskripsi.',
        },
        {
          question: "Bisakah saya mengubah transaksi yang sudah dicatat?",
          answer:
            "Ya, Anda dapat mengedit atau menghapus transaksi dengan mengklik menu titik tiga pada setiap item transaksi.",
        },
      ],
    },
    {
      title: "Laporan & Export",
      items: [
        {
          question: "Format apa saja yang tersedia untuk export?",
          answer: "Anda dapat mengexport laporan dalam format PDF untuk viewing dan Excel untuk analisis lebih lanjut.",
        },
        {
          question: "Bagaimana cara mengatur periode laporan?",
          answer:
            "Di halaman Laporan, pilih tanggal mulai dan akhir menggunakan date picker, lalu pilih jenis laporan yang diinginkan.",
        },
      ],
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
          <p className="text-muted-foreground">Temukan jawaban untuk pertanyaan Anda</p>
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

        {/* Help Resources */}
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

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan yang Sering Diajukan</CardTitle>
            <CardDescription>Jawaban untuk pertanyaan umum tentang catatdiGW</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{category.title}</Badge>
                  </div>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
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
            <div className="flex gap-3">
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                Live Chat
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

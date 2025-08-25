import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, MessageCircle, Phone, MapPin, Clock, Send } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Hubungi Kami - catatdiGW",
  description: "Hubungi tim catatdiGW untuk pertanyaan, saran, atau bantuan teknis. Kami siap membantu Anda 24/7.",
  keywords: "kontak catatdiGW, bantuan, support, customer service, hubungi kami",
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Kirim email untuk pertanyaan detail",
      contact: "support@catatdiGW.com",
      available: "24/7",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat langsung dengan tim support",
      contact: "Chat tersedia di dashboard",
      available: "08:00 - 22:00 WIB",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      description: "Hubungi via WhatsApp untuk bantuan cepat",
      contact: "+62 812-3456-7890",
      available: "08:00 - 17:00 WIB",
    },
  ]

  const officeInfo = [
    { icon: MapPin, label: "Alamat", value: "Jl. Sudirman No. 123, Jakarta Pusat 10220" },
    { icon: Clock, label: "Jam Operasional", value: "Senin - Jumat: 08:00 - 17:00 WIB" },
    { icon: Mail, label: "Email Bisnis", value: "business@catatdiGW.com" },
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

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6">
          <Badge variant="outline" className="mx-auto">
            Hubungi Kami
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Kami Siap <span className="text-blue-600">Membantu Anda</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan, saran, atau butuh bantuan? Tim support kami siap membantu Anda 24/7
          </p>
        </section>

        {/* Contact Methods */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {contactMethods.map((method, index) => (
            <Card key={index} className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4 hover:shadow-lg transition-shadow">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg w-fit mx-auto">
                <method.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">{method.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{method.description}</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm sm:text-base">{method.contact}</p>
                <Badge variant="outline" className="text-xs">{method.available}</Badge>
              </div>
            </Card>
          ))}
        </section>

        {/* Contact Form & Office Info */}
        <section className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Kirim Pesan</CardTitle>
              <CardDescription className="text-sm sm:text-base">Isi form di bawah ini dan kami akan merespons dalam 24 jam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Nama Lengkap</label>
                  <Input placeholder="Masukkan nama lengkap Anda" className="text-sm sm:text-base" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Email</label>
                  <Input type="email" placeholder="nama@email.com" className="text-sm sm:text-base" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Subjek</label>
                <Input placeholder="Subjek pesan Anda" className="text-sm sm:text-base" />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">Pesan</label>
                <Textarea placeholder="Tulis pesan Anda di sini..." className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base" />
              </div>
              <Button className="w-full text-sm sm:text-base">
                <Send className="mr-2 h-4 w-4" />
                Kirim Pesan
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Informasi Kantor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                {officeInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg">
                      <info.icon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-xs sm:text-sm">{info.label}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">{info.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">FAQ</CardTitle>
                <CardDescription className="text-sm">Pertanyaan yang sering diajukan</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Link href="/dashboard/help">
                  <Button variant="outline" className="w-full bg-transparent text-sm sm:text-base">
                    Lihat FAQ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Response Time */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Waktu Respons Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">&lt; 1 jam</div>
                <div className="text-muted-foreground text-sm">Live Chat</div>
              </div>
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">&lt; 24 jam</div>
                <div className="text-muted-foreground text-sm">Email Support</div>
              </div>
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">&lt; 2 jam</div>
                <div className="text-muted-foreground text-sm">WhatsApp</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

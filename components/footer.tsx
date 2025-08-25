import Link from "next/link"
import { Wallet, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-card-foreground">catatdiGW</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Aplikasi pencatatan keuangan yang elegan dan mudah digunakan. Kelola pengeluaran dan pemasukan Anda dengan
              lebih efisien.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                support@catatdiGW.com
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-card-foreground transition-colors">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-card-foreground transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-card-foreground transition-colors">
                  Bantuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-card-foreground transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Dukungan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/help" className="text-muted-foreground hover:text-card-foreground transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-card-foreground transition-colors">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-card-foreground transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-muted-foreground hover:text-card-foreground transition-colors">
                  Keamanan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">© 2024 catatdiGW. Semua hak dilindungi undang-undang.</p>
        </div>
      </div>
    </footer>
  )
}

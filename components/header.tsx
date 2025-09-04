"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";
import Image from "next/image"

export function Header() {
  const { user, loading, signInWithGoogle, logout, error } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10">
                <Image
                  src="/catatdigw.png"
                  alt="catatdiGW Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-foreground">catatdiGW</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </Link>
            <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Kontak
            </Link>
          </nav>

          {/* Auth Button */}
          <div className="flex items-center space-x-4">
            {error ? (
              <div className="text-sm text-red-500 px-3 py-1 bg-red-50 rounded-md">
                Firebase Error
              </div>
            ) : loading ? (
              <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.photoURL || "/placeholder.svg?height=32&width=32"}
                  alt={user.displayName || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:block text-sm text-foreground">{user.displayName}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  Keluar
                </Button>
              </div>
            ) : (
              <Button onClick={signInWithGoogle} className="bg-primary hover:bg-primary/90">
                Masuk dengan Google
              </Button>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fitur
              </Link>
              <Link
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontak
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

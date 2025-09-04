"use client"

import { DomainDetector } from "@/components/domain-detector"

export default function DomainTestPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Domain & Firebase Test</h1>
          <p className="text-muted-foreground">
            Test halaman untuk memeriksa domain dan konfigurasi Firebase
          </p>
        </div>

        <DomainDetector />

        <div className="text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

// Configuration file for app settings
export const config = {
  // WhatsApp contact information
  whatsapp: {
    number: "6281234567890", // Format: 6281234567890 (tanpa + atau spasi)
    displayNumber: "+62 851-3352-4900", // Format yang ditampilkan ke user
    businessHours: "Senin - Jumat, 09:00 - 17:00 WIB",
    responseTime: "1-2 jam",
  },
  
  // Subscription settings
  subscription: {
    trialDays: 7,
    warningDays: 7, // Tampilkan warning jika ≤ 7 hari tersisa
    urgentWarningDays: 3, // Tampilkan warning urgent jika ≤ 3 hari tersisa
  },
  
  // App settings
  app: {
    name: "catatdiGW",
    description: "Aplikasi pencatatan keuangan pribadi",
    version: "1.0.0",
  }
}


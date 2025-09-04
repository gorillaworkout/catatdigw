# Firebase Authentication Troubleshooting Guide

## Masalah Umum dan Solusi

### 1. Error "Firebase environment variables not configured"

**Gejala:**
- Aplikasi menampilkan error "Firebase environment variables not configured"
- Login button tidak berfungsi
- Console menampilkan warning tentang environment variables

**Solusi:**
1. **Pastikan Environment Variables di Vercel sudah benar:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

2. **Verifikasi di Firebase Console:**
   - Buka [Firebase Console](https://console.firebase.google.com/)
   - Pilih project Anda
   - Pergi ke Project Settings > General
   - Scroll ke bawah ke "Your apps" section
   - Copy konfigurasi yang benar

3. **Redeploy aplikasi di Vercel:**
   - Setelah mengupdate environment variables
   - Trigger redeploy manual atau push commit baru

### 2. Error "Google Sign-In tidak diaktifkan"

**Gejala:**
- Error message: "Google Sign-In tidak diaktifkan. Hubungi administrator."
- Login popup tidak muncul

**Solusi:**
1. **Aktifkan Google Sign-In di Firebase:**
   - Buka Firebase Console
   - Pergi ke Authentication > Sign-in method
   - Enable "Google" provider
   - Tambahkan authorized domains jika perlu

2. **Pastikan domain sudah diizinkan:**
   - Di Firebase Console > Authentication > Settings
   - Tambahkan domain production Anda ke "Authorized domains"

### 3. Error "Popup login diblokir"

**Gejala:**
- Error: "Popup login diblokir. Silakan izinkan popup untuk domain ini."
- Popup tidak muncul saat klik login

**Solusi:**
1. **Izinkan popup di browser:**
   - Klik icon popup blocker di address bar
   - Pilih "Always allow popups from this site"

2. **Cek browser settings:**
   - Chrome: Settings > Privacy and security > Site settings > Pop-ups and redirects
   - Firefox: Settings > Privacy & Security > Permissions > Block pop-up windows

### 4. Error "Koneksi jaringan gagal"

**Gejala:**
- Error: "Koneksi jaringan gagal. Periksa koneksi internet Anda."
- Timeout saat login

**Solusi:**
1. **Cek koneksi internet**
2. **Cek firewall/proxy settings**
3. **Coba browser lain**
4. **Cek apakah Firebase services sedang down**

### 5. Error "Terlalu banyak percobaan"

**Gejala:**
- Error: "Terlalu banyak percobaan login. Silakan coba lagi nanti."
- Login gagal berulang kali

**Solusi:**
1. **Tunggu 15-30 menit**
2. **Clear browser cache dan cookies**
3. **Coba browser incognito/private mode**

## Debugging Steps

### 1. Cek Console Browser
Buka Developer Tools (F12) dan lihat Console tab untuk error messages.

### 2. Cek Network Tab
Lihat apakah ada request yang gagal ke Firebase endpoints.

### 3. Cek Environment Variables
Di browser console, jalankan:
```javascript
console.log({
  apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
});
```

### 4. Test Firebase Connection
```javascript
// Di browser console
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const config = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(config);
const auth = getAuth(app);
console.log('Firebase initialized:', !!auth);
```

## Environment Variables Checklist

Pastikan semua environment variables berikut ada di Vercel:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`

## Firebase Console Checklist

Pastikan konfigurasi berikut di Firebase Console:

- [ ] Google Sign-In provider enabled
- [ ] Authorized domains include your production domain
- [ ] Project ID matches environment variable
- [ ] Web app registered and configured correctly

## Support

Jika masalah masih berlanjut:

1. Cek [Firebase Status Page](https://status.firebase.google.com/)
2. Lihat [Firebase Documentation](https://firebase.google.com/docs/auth/web/google-signin)
3. Hubungi support dengan detail error message dan steps to reproduce

## Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `auth/popup-closed-by-user` | User closed popup | User action - no fix needed |
| `auth/popup-blocked` | Popup blocked by browser | Allow popups for domain |
| `auth/network-request-failed` | Network error | Check internet connection |
| `auth/too-many-requests` | Rate limited | Wait and retry |
| `auth/operation-not-allowed` | Provider not enabled | Enable in Firebase Console |
| `auth/invalid-api-key` | Wrong API key | Check environment variables |
| `auth/unauthorized-domain` | Domain not authorized | Add domain to authorized list |

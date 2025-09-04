# Firebase Setup Instructions

## Error: Cannot read properties of undefined (reading 'call')

Error ini terjadi karena Firebase belum dikonfigurasi dengan benar. Ikuti langkah-langkah berikut untuk mengatasi masalah ini:

## 1. Buat File Environment Variables

Buat file `.env.local` di root project dengan isi berikut:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 2. Dapatkan Firebase Configuration

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda atau buat project baru
3. Klik ikon gear (⚙️) di sidebar kiri
4. Pilih "Project settings"
5. Scroll ke bawah ke bagian "Your apps"
6. Klik "Add app" dan pilih "Web" (</>)
7. Beri nama app dan klik "Register app"
8. Copy konfigurasi yang diberikan

## 3. Isi Environment Variables

Ganti nilai-nilai berikut di file `.env.local`:

- `your_api_key_here` → API Key dari Firebase config
- `your_project_id` → Project ID dari Firebase config
- `your_sender_id` → Messaging Sender ID dari Firebase config
- `your_app_id` → App ID dari Firebase config

## 4. Enable Authentication

1. Di Firebase Console, pilih "Authentication" di sidebar
2. Klik "Get started"
3. Pilih tab "Sign-in method"
4. Enable "Google" provider
5. Isi Project support email
6. Klik "Save"

## 5. Enable Firestore Database

1. Di Firebase Console, pilih "Firestore Database" di sidebar
2. Klik "Create database"
3. Pilih "Start in test mode" (untuk development)
4. Pilih lokasi database
5. Klik "Done"

## 6. Restart Development Server

Setelah mengisi environment variables, restart development server:

```bash
npm run dev
```

## Troubleshooting

### Jika masih ada error:

1. Pastikan file `.env.local` ada di root project
2. Pastikan semua environment variables sudah diisi
3. Restart development server
4. Clear browser cache
5. Check console untuk error messages

### Untuk Production:

Pastikan environment variables juga dikonfigurasi di hosting platform Anda (Vercel, Netlify, dll).

## Security Rules (Firestore)

Untuk production, pastikan Firestore security rules sudah dikonfigurasi dengan benar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

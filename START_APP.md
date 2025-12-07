# How to Start PERPUS App

## Quick Start Guide

### Step 1: Open Terminal/Command Prompt
Navigate to the perpus-apps folder:
```bash
cd perpus-apps
```

### Step 2: Start the Development Server
Run one of these commands:

**Option 1 (Recommended):**
```bash
npm start
```

**Option 2 (If port is busy):**
```bash
npx expo start --port 8085
```

**Option 3 (With tunnel for remote testing):**
```bash
npx expo start --tunnel
```

### Step 3: Open on Your Phone

1. **Install Expo Go** on your phone from:
   - iOS: App Store
   - Android: Google Play Store

2. **Scan the QR Code** that appears in the terminal:
   - iOS: Use Camera app, it will prompt to open in Expo Go
   - Android: Use Expo Go app's built-in scanner

### Step 4: Test the App Flow

1. **First Time - Register:**
   - The app will open on the Register screen
   - Fill in your details:
     - Full Name: e.g., "John Doe"
     - Email: e.g., "john@example.com"
     - Password: minimum 6 characters
     - Confirm Password: same as password
   - Click "Register"
   - You'll see a success message

2. **Login:**
   - After registration, you'll be redirected to Login
   - Enter the same email and password you just registered
   - Click "Login"
   - You'll see a welcome message

3. **Explore the App:**
   - **Library Tab (Home):** Browse and borrow books
   - **My Books Tab:** View your profile and statistics
   - Click on the "+" icon next to available books to borrow them
   - Use the logout button to sign out

## Troubleshooting

### If the server won't start:
1. Close any other Expo/React Native apps running
2. Try a different port: `npx expo start --port 8090`
3. Clear cache: `npx expo start -c`

### If you can't scan the QR code:
1. Make sure your phone and computer are on the same WiFi network
2. Try using tunnel mode: `npx expo start --tunnel`
3. Or manually enter the URL shown in Expo Go

### If you get "Network error":
1. Check firewall settings
2. Use tunnel mode (see above)
3. Make sure Expo Go is updated to the latest version

## App Features Summary

✅ **Fully Compatible with Expo Go** - No custom native modules required
✅ **User Registration & Login** - With validation
✅ **Book Browsing** - View all library books with details
✅ **Borrow Books** - Interactive borrowing system
✅ **User Profile** - View account details and statistics
✅ **Beautiful UI** - Modern, clean design with smooth interactions
✅ **Local Storage** - Data persists using AsyncStorage

## Technical Details

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based routing)
- **Storage:** @react-native-async-storage/async-storage
- **Icons:** @expo/vector-icons (Ionicons)

Enjoy using PERPUS! 📚

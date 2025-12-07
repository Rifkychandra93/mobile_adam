# 🧪 PERPUS App - Complete Testing Guide

## 🎬 Step-by-Step Testing Instructions

### STEP 1: Start the Development Server

Open your terminal/command prompt and run:

```bash
cd perpus-apps
npm start
```

Wait for the QR code to appear in your terminal.

---

### STEP 2: Install Expo Go on Your Phone

- **iOS:** Download from App Store
- **Android:** Download from Google Play Store

Search for "Expo Go" (official app by Expo)

---

### STEP 3: Scan the QR Code

- **iOS:** Open Camera app → Point at QR code → Tap notification
- **Android:** Open Expo Go app → Tap "Scan QR Code" → Point at QR code

---

### STEP 4: Test Registration (First Screen)

The app will open on the **REGISTER** screen.

**Fill in the form:**
```
Full Name: John Doe
Email: john@example.com
Password: john123
Confirm Password: john123
```

**Test validations:**
- Try empty fields → Should show error
- Try invalid email (without @) → Should show error
- Try password less than 6 chars → Should show error
- Try mismatched passwords → Should show error

**Complete registration:**
- Fill in correctly → Tap "Register"
- Should show success alert
- Tap "OK" → Redirects to Login screen

---

### STEP 5: Test Login (Second Screen)

You're now on the **LOGIN** screen.

**Login with your registered credentials:**
```
Email: john@example.com
Password: john123
```

**Test validations:**
- Try wrong password → Should show error
- Try unregistered email → Should show error

**Successful login:**
- Enter correct credentials → Tap "Login"
- Should show welcome message
- Tap "OK" → Redirects to Homepage

---

### STEP 6: Test Homepage/Library (Third Screen)

You're now on the **LIBRARY** tab (Homepage).

**What you should see:**
- Your name in the header: "Hello, John Doe"
- Three statistics cards:
  - Total Books: 6
  - Available: 4
  - Borrowed: 2
- List of 6 books with details

**Test book borrowing:**
1. Find an "Available" book (green badge)
2. Tap the "+" icon on the right
3. Confirm borrowing in the alert
4. Book status changes to "Borrowed" (red badge)
5. Statistics update automatically

**Try borrowing an already borrowed book:**
- Tap the "X" icon on a borrowed book
- Should show "Unavailable" message

---

### STEP 7: Test Profile (Fourth Screen)

Tap the **"My Books"** tab at the bottom.

**What you should see:**
- Profile avatar with your initials
- Your full name: "John Doe"
- Your email: "john@example.com"
- Account Information card with:
  - Full Name
  - Email
  - Member Since: 2024
- Library Statistics:
  - Books Borrowed: 0
  - Currently Reading: 0
- Red logout button

---

### STEP 8: Test Logout

**From Homepage:**
- Tap the logout icon (top-right corner)
- Confirm logout → Redirects to Login screen

**From Profile:**
- Tap the red "Logout" button
- Confirm logout → Redirects to Login screen

---

### STEP 9: Test Persistent Login

**After logging out:**
1. Close the app completely (swipe up)
2. Reopen from Expo Go
3. Should show Login screen (not Register)

**After logging in:**
1. Close the app
2. Reopen from Expo Go
3. Should go directly to Homepage (stays logged in)

---

## 🎯 Features to Verify

### ✅ Registration Features
- [ ] All form fields work
- [ ] Validation messages appear
- [ ] Password toggle (eye icon) works
- [ ] Success message shows
- [ ] Redirects to login after registration

### ✅ Login Features
- [ ] Email and password fields work
- [ ] Validation works
- [ ] Wrong credentials show error
- [ ] Correct credentials show welcome message
- [ ] Redirects to homepage after login

### ✅ Library/Homepage Features
- [ ] User name displays correctly
- [ ] Statistics cards show correct numbers
- [ ] All 6 books display
- [ ] Book details are visible (title, author, category)
- [ ] Status badges show correct colors
- [ ] Borrow button works for available books
- [ ] Cannot borrow already borrowed books
- [ ] Statistics update after borrowing
- [ ] Logout button works
- [ ] Scrolling works smoothly

### ✅ Profile Features
- [ ] User information displays
- [ ] Email shows correctly
- [ ] Statistics cards display
- [ ] Logout button works

### ✅ Navigation Features
- [ ] Can switch between Library and My Books tabs
- [ ] Tab bar shows correct icons
- [ ] Navigation is smooth
- [ ] Back from login works

### ✅ Data Persistence
- [ ] Registration data saves
- [ ] Login state persists after app restart
- [ ] Borrowed books state persists
- [ ] Can logout and login again with same credentials

---

## 📱 Expected Behavior Summary

```
App Launch
    ↓
Is user logged in?
    ↓
NO → Register Screen
    ↓
Register & Submit
    ↓
Login Screen
    ↓
Enter credentials
    ↓
Homepage (Library Tab)
    ↓
Can browse books, borrow, and logout
    ↓
Switch to My Books Tab
    ↓
View profile and logout
    ↓
Logout → Login Screen
    ↓
Login again → Homepage
```

---

## 🐛 Common Issues & Solutions

### "Cannot connect to Metro"
- Make sure phone and computer are on same WiFi
- Try: `npm start -- --tunnel`

### "Port already in use"
- Try: `npx expo start --port 8090`

### "Module not found: @react-native-async-storage"
- Run: `npm install`
- Then: `npm start`

### App shows white screen
- Shake phone → Reload
- Or restart: Stop server → `npm start`

### Cannot scan QR code
- Ensure Expo Go is installed
- Try manual connection: Type the URL shown in Expo Go

---

## 🎨 UI/UX Elements to Notice

- **Beautiful Colors:** Indigo primary theme
- **Smooth Shadows:** On cards and buttons
- **Icons:** Ionicons throughout
- **Touch Feedback:** Buttons react to touch
- **Validation Feedback:** Real-time error messages
- **Status Indicators:** Color-coded badges
- **Responsive Design:** Works on all phone sizes

---

## ✨ Congratulations!

If all tests pass, you have a fully functional library management app! 🎉

The app is ready to:
- Demo to your teacher
- Show to classmates
- Use as a school project
- Expand with more features

---

**Happy Testing! 📚✨**

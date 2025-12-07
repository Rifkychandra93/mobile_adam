# PERPUS - Library Management Mobile App

A beautiful and modern library management mobile application built with React Native and Expo.

## Features

- **User Authentication**
  - Registration with validation
  - Login with stored credentials
  - Secure logout functionality

- **Library Management**
  - Browse available books
  - View book details (title, author, category)
  - Borrow books functionality
  - Real-time availability status

- **User Profile**
  - View personal information
  - Library statistics
  - Account details

## Tech Stack

- React Native
- Expo SDK 54
- TypeScript
- Expo Router (File-based routing)
- AsyncStorage (Local data persistence)
- Expo Vector Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your mobile device (iOS or Android)

### Installation

1. Navigate to the project directory:
```bash
cd perpus-apps
```

2. Install dependencies (if not already installed):
```bash
npm install
```

### Running the App

1. Start the development server:
```bash
npm start
```

2. Scan the QR code with:
   - **iOS**: Camera app (will open in Expo Go)
   - **Android**: Expo Go app

### Testing the App

1. **Register a new account:**
   - Enter your full name
   - Enter a valid email address
   - Create a password (minimum 6 characters)
   - Confirm your password
   - Click "Register"

2. **Login:**
   - Use the email and password you registered with
   - Click "Login"

3. **Explore the app:**
   - **Library Tab**: Browse and borrow books
   - **My Books Tab**: View your profile and account information

## App Structure

```
perpus-apps/
├── app/
│   ├── (tabs)/           # Tab navigation screens
│   │   ├── index.tsx     # Library/Home screen
│   │   └── explore.tsx   # Profile screen
│   ├── index.tsx         # Entry point with auth check
│   ├── register.tsx      # Registration screen
│   ├── login.tsx         # Login screen
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
├── constants/           # Theme and constants
└── assets/             # Images and assets
```

## Features Explanation

### Authentication Flow
- App starts at register screen for new users
- Users can navigate to login if they already have an account
- Credentials are stored securely in AsyncStorage
- Login validates against stored credentials
- Successful login redirects to the main app

### Library Screen
- Displays a list of available books
- Shows book status (Available/Borrowed)
- Users can borrow available books
- Real-time statistics (Total, Available, Borrowed)

### Profile Screen
- Displays user information
- Shows library statistics
- Logout functionality

## Color Scheme

- Primary: Indigo (#6366f1)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Danger: Red (#ef4444)
- Background: Light Gray (#f9fafb)

## Compatible with Expo Go

This app is fully compatible with Expo Go and doesn't use any custom native modules that would require a development build.

## License

This project is created for educational purposes.

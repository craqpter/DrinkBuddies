## Mobile app overview

This folder contains a cross-platform React Native app built with the Expo SDK.
It includes:

- User registration and login (stored locally on the device).
- Personal cabinet (profile) where the user can:
  - Upload an avatar from the gallery.
  - Change password.
  - Logout.
- After login, a map screen that:
  - Shows the user’s real-time GPS position.
  - Supports rotation, panning, and zooming.

### Prerequisites

1. Install Node.js (LTS) from the official website.
2. Install the Expo CLI:

```bash
npm install -g expo-cli
```

### Install dependencies

From this `mobile-app` folder, run:

```bash
npm install
```

This installs all dependencies defined in `package.json`.

### Run the app

From the same `mobile-app` folder:

```bash
npm start
```

Then:

- Press `a` to open on an Android emulator or connected device.
- Press `i` to open on an iOS simulator (on macOS), or scan the QR code with the Expo Go app on your phone.

### Notes

- Authentication is demo-style and stored only on the device via AsyncStorage (no backend).
- Maps use `expo-maps` and `expo-location`, which require:
  - A real Android or iOS device or a properly configured emulator.
  - Location permissions granted when prompted.


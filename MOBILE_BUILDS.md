# Mobile Packaging Guide: Android (.apk) & iOS (.ipa)

This guide provides step-by-step instructions on how to compile the **Kargil Purgi Dictionary & AI Tutor** application into a fully-functional native **Android APK** and **iOS package** using **Capacitor**, the modern native runtime engine.

Since compilation of binary packages requires physical compilers (**Android SDK / Gradle** for Android, and **macOS + Xcode** for iOS), compiling them must be done on your local computer. We have pre-configured and installed Capacitor in this project so you can start right away!

---

## 🛠️ Prerequisites (On Your Local Machine)

Make sure you have downloaded or exported this project folder to your local machine (using the Export / Settings menu in AI Studio).

### For Both Platforms:
*   **Node.js** (v18 or higher)
*   An active internet connection to reach your live hosted server APIs.

### For Android Build (.apk):
*   **Android Studio** (includes Android SDK, platform tools, and Gradle).
*   Configured `ANDROID_HOME` environment variables on your system.

### For iOS Build (.ipa):
*   **macOS** (Required to compile iOS apps).
*   **Xcode** (Installed from the Mac App Store).
*   **Cocoapods** (`sudo gem install cocoapods` or installed via brew).

---

## 🚀 Step 1: Install Native Platforms
In your project folder, open a terminal and run:

```bash
# Install native mobile platforms as dev dependencies
npm install @capacitor/android @capacitor/ios
```

---

## 📱 Option A: The "Local Offline" Build (Recommended)
This approach bundles the built frontend static assets (HTML, CSS, JS) directly inside the mobile app. The app runs lightning-fast and offline, making network calls only when requesting the live AI Translation and AI Tutor Coach endpoints on your hosted server.

### 1. Build the Web App
Compile the React/Vite frontend into standard web files:
```bash
npm run build
```

### 2. Initialize Native Projects
Create the native Android and iOS source directories:
```bash
npx cap add android
npx cap add ios
```

### 3. Sync Assets to Native Platforms
Copy the built files from `dist/` into the native shells:
```bash
npx cap sync
```

### 4. Compile & Run

#### For Android (.apk):
Open the project in Android Studio to build and sign your APK:
```bash
npx cap open android
```
*   This will open **Android Studio** automatically.
*   Let Gradle sync finish.
*   Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate your installable debug `.apk` file instantly.
*   Or select **Build > Generate Signed Bundle / APK...** to sign it for the Google Play Store.

#### For iOS Package:
Open the project in Xcode to compile your iOS app:
```bash
npx cap open ios
```
*   This will open **Xcode** automatically.
*   Select your target simulator or a plugged-in physical device.
*   Configure your Signing & Capabilities (select your Apple Developer account/team).
*   Click **Play (Build)** to run it.
*   To package it into a `.ipa`, select **Product > Archive**, and then click **Distribute App** to download the package or push to TestFlight.

---

## 🌐 Option B: The "Live Hosted Web Shell" Build
If you want your mobile application to load directly from your live hosted URL, behaving like an immersive, standalone app shell:

1.  Open `/capacitor.config.ts` in your text editor.
2.  Uncomment the `url` property and configure it to point to your hosted URL:
    ```typescript
    server: {
      androidScheme: 'https',
      url: 'https://ais-pre-yn3xnios343hveccptb4ag-1063163461455.asia-southeast1.run.app'
    }
    ```
3.  Sync the configuration to the mobile folders:
    ```bash
    npx cap sync
    ```
4.  Compile using `npx cap open android` or `npx cap open ios` as described in Option A. Any updates you make on the server in future will automatically reflect in the mobile apps without needing a re-compile!

---

## ⚡ Helper Package.json Scripts
You can add these handy scripts into your `package.json` under `"scripts"` to automate your workflow:

```json
"mobile:sync": "npm run build && npx cap sync",
"mobile:android": "npm run build && npx cap sync && npx cap open android",
"mobile:ios": "npm run build && npx cap sync && npx cap open ios"
```

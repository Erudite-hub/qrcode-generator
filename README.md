# SmartQR Studio 🚀

Welcome to **SmartQR Studio**! This is a modern, privacy-first, fully client-side QR Code ecosystem built for professionals, designers, and everyday users. Create, design, scan, analyze, and manage your QR codes locally—without ever sending your data to a remote server.

Built with **Next.js 15, React 19, Tailwind CSS v4, and shadcn/ui**, it delivers a blazing-fast, responsive, and beautiful user experience across all devices.

## 🌟 Core Features

### 1. 🎨 Universal QR Generator & Design Studio
Create beautiful QR codes tailored precisely to your needs.
* **13 Supported Content Types:** URL, Plain Text, Wi-Fi Networks, vCard (Contacts), Email, Phone, SMS, WhatsApp, Geolocation, Calendar Events, Social Media links, Payments, and PDF links.
* **Deep Design Customization:** 
  * Granular control over Foreground and Background colors.
  * Linear Gradients for striking visuals.
  * Customize Dot shapes (squares, dots, rounded, extra-rounded, class, etc.).
  * Customize Corner Squares and Corner Dots.
  * Embed logos directly into the center of your codes with customizable margins.
  * Adjust Error Correction Levels (L, M, Q, H) to ensure readability when heavily styled.
* **Export Options:** Instantly download as **PNG** or **SVG**.

### 2. 📷 Smart QR Scanner
Scan codes anywhere, on any device.
* **Camera Integration:** Real-time scanning using your device's webcam or mobile camera.
* **Image Upload:** Upload screenshots or saved images to extract QR data.
* **Quick Actions:** One-click copy, visit URL, or instantly forward URLs to the Security Lab for threat analysis.

### 3. 🛡️ Security Lab
Never trust a random QR code again.
* **Heuristic Threat Analysis:** Evaluate scanned URLs for security risks.
* **Risk Scoring:** Analyzes protocol (HTTPS), suspicious IP domains, URL shorteners, embedded credentials, and subdomain bloat to generate a risk score (0-100).
* **Clear Reporting:** Provides actionable security indicators and a risk level assessment (Low, Moderate, High, Critical).

### 4. 🗂️ Projects Library
Your personal QR code vault.
* **Offline Storage:** Securely save your custom QR projects directly in your browser using IndexedDB.
* **Workflow Resumption:** Load saved projects back into the Design Studio with a single click to iterate on previous designs.
* **Grid Management:** A clean dashboard to view, load, and delete your saved codes.

### 5. 📊 Usage Analytics
Understand your activity without sacrificing privacy.
* **Local Event Tracking:** Automatically tracks your interactions (Generations, Scans, Downloads, Bulk exports).
* **Visual Dashboards:** Interactive charts powered by Recharts (Time-series lines, Action Distribution pies).
* **Total Control:** View 7-day rolling statistics or completely clear your local history at any time.

### 6. 📦 Bulk Generator
Mass production made easy.
* **CSV / Text Input:** Paste raw data or comma-separated lists to generate dozens of QR codes instantly.
* **Mass Export:** Download all generated QR codes simultaneously in a single **ZIP** archive.

### 7. 🤖 AI Assistant & Quality Analyzer
* **AI Chat:** An integrated assistant to help you brainstorm marketing use cases, understand QR error correction, and troubleshoot scanning issues.
* **Quality Metrics:** Evaluates your configured QR codes for data density and error-correction suitability before you deploy them.

---

## 🛠️ Tech Stack & Architecture

SmartQR Studio is engineered as an offline-first "Frontend-as-Backend" application. It requires zero cloud databases or external persistence APIs.

* **Framework:** Next.js 15 (App Router, Turbopack)
* **UI/Styling:** Tailwind CSS v4, shadcn/ui, Lucide Icons, next-themes (Dark/Light mode support)
* **Typography:** Inter (Body) & Outfit (Headings)
* **Local Database:** Dexie.js (IndexedDB wrapper) for Projects and Analytics
* **QR Engine:** qr-code-styling, react-qr-reader, jsqr
* **Charts:** Recharts
* **State Management:** Zustand
* **Responsiveness:** Fluid scaling, dynamic grids, and mobile-first architectural patterns ensuring flawless rendering from 320px screens to Ultrawide monitors.

## 🚀 Getting Started

To run SmartQR Studio locally on your machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will boot up on `http://localhost:3000`.*

3. **Build for Production:**
   ```bash
   npm run build
   ```
   *The app generates perfectly as static HTML/JS thanks to Next.js SSG.*

## 🔒 Privacy Guarantee
This application processes all QR code generation, scanning, analysis, and data storage **entirely within your local browser environment**. No payload, content, or analytic event is ever transmitted to remote servers.

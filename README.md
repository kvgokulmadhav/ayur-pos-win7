# AyurPOS — Portable Windows 7 Standalone Edition

Zero-install, fully offline retail POS & inventory ERP for Kottakkal Arya Vaidya Sala dealerships, pre-compiled and optimized to run natively on **Windows 7** (SP1, 64-bit).

---

## 🚀 How to Run on Windows 7 (Zero Install)

### Step 1: Ensure `node.exe` is present
Windows 7 does not support official Node.js installers (Node 18/20 MSI).  
Instead, you just need **one single portable `node.exe` file**:
1. Download the portable zip from the official Node.js archive:  
   👉 **[https://nodejs.org/dist/v16.20.2/node-v16.20.2-win-x64.zip](https://nodejs.org/dist/v16.20.2/node-v16.20.2-win-x64.zip)**
2. Open the zip and copy `node.exe`.
3. Paste `node.exe` directly inside this folder (next to `Start-AyurPOS-Win7.bat`).

---

### Step 2: Double-Click to Start
Double-click:
```text
Start-AyurPOS-Win7.bat
```
- It automatically configures the environment (`NODE_SKIP_PLATFORM_CHECK=1`, SQLite database).
- It starts the local offline server on `http://localhost:3005`.
- It automatically launches your default browser (Chrome / Firefox / Supermium) to the Sales POS screen!

---

### Step 3: Log In With Counter PIN
- **Admin:** `1234`
- **Manager:** `2345`
- **Cashier / Staff:** `3456`

---

## 🛑 How to Stop / Close
- Simply close the command prompt window, OR
- Double-click **`Stop-AyurPOS-Win7.bat`**.

---

## 💾 Daily Backup
- Double-click **`Backup-AyurPOS-Win7.bat`** to create an instant timestamped snapshot of your database in the `backups/` folder.

---

## 📦 What Is Included
- **Pre-compiled Next.js Production Server** (`server.js`)
- **666 Pre-Seeded Kottakkal Medicines** with **433 Official Loose MRPs**
- **Offline SQLite Database** (`prisma/ayur_pos.db`)
- **Windows Query Engine** (`query_engine-windows.dll.node`)
- **Official Dealer Indent Template** (`Dealer Indent Format - Latest.xlsx`)
- **Thermal Receipt Printing** for TVS MSP 240 / RP 250 Star

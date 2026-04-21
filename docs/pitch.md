# 🚀 SplitEX — Pitch Document

## 🧠 Problem

Managing shared expenses in groups today is still frustrating and inefficient:

* Manual calculations often lead to mistakes
* Tracking balances becomes confusing in larger groups
* Too many transactions create unnecessary friction
* Settling payments is not seamless
* Existing apps are not optimized for Indian users and UPI workflows

---

## 💡 Our Solution — SplitEX

**SplitEX** is a smart expense-sharing platform designed to simplify group finances with:

* Automated balance tracking
* Optimized settlements
* Seamless UPI-based payments
* Real-time synchronization

👉 *Split smart. Pay easy.*

---

## ⚙️ Core Features

### 👥 Group Management

* Create and manage groups (trips, roommates, events)
* Add/remove members easily
* Role-based access control

---

### 💸 Expense Tracking

* Add expenses in seconds
* Flexible split options:

  * Equal
  * Exact
  * Percentage
* Real-time updates across all users

---

### 📊 Balance Engine

* Automatically calculates:

  * Who owes whom
  * Exact payable amounts
* Maintains a clean and transparent ledger

---

### 🔁 Smart Settlement Optimizer

* Reduces number of transactions
* Uses a greedy algorithm to simplify settlements
* Ideal for large groups

---

### 💳 UPI Integration

* Generate UPI payment links instantly
* Works with all major apps (GPay, PhonePe, Paytm)
* Enables one-click settlements

---

### 🔔 Smart Notifications

* Payment reminders
* Expense alerts
* Settlement confirmations

---

### ⚡ Real-Time Sync

* Live updates using WebSockets
* No refresh required

---

## 🧾 🆕 Image-Based Bill Scanning (NEW FEATURE)

To eliminate manual entry, SplitEX introduces a **Python-powered OCR scanning system**:

### 🔍 What It Does

* Users upload a receipt image
* System extracts:

  * Line items
  * Prices
  * Total amount
* Converts it into structured expense data

---

### ⚙️ How It Works

#### Python OCR Microservice

* Built using **FastAPI**
* Endpoint: `/scan-receipt`
* Processes uploaded images using:

  * `pytesseract`
  * `opencv-python`
* Extracts structured JSON:

```json
[
  { "item": "Pizza", "price": 450 },
  { "item": "Coke", "price": 80 }
]
```

---

### 🧑‍💻 User Flow

1. Click **“Scan Bill”**
2. Upload receipt image
3. System scans and extracts data
4. User reviews & edits items
5. Click **“Confirm & Split”**
6. Expense added automatically

---

### 🎯 Key Benefits

* Eliminates manual data entry
* Saves time
* Reduces human errors
* Improves user experience

---

## 🧱 Tech Stack

### Frontend

* React / Next.js
* Tailwind CSS

### Backend

* Node.js + Express

### Database

* **MongoDB** (NoSQL, flexible schema for scaling groups & expenses)

### Realtime

* Socket.IO

### OCR Service

* Python + FastAPI
* Tesseract + OpenCV

### Notifications

* Firebase Cloud Messaging

### Payments

* UPI Deep Links

---

## 🏗️ Architecture

* Modular Monolith Design
* Easily scalable to microservices

### Core Modules:

* Authentication
* Groups
* Expenses
* Balances
* Settlements
* Notifications
* OCR Service (Python Microservice)

---

## 🔄 Product Flow

1. User logs in
2. Creates a group
3. Adds expense OR scans bill
4. System calculates balances
5. Optimizer reduces transactions
6. User pays via UPI
7. System updates and notifies

---

## 🎯 Unique Selling Points

* 🇮🇳 Built specifically for Indian users (UPI-first)
* 📸 Image-based expense entry (OCR scanning)
* ⚡ Real-time syncing
* 🧠 Smart transaction minimization
* 📱 Clean, intuitive UI

---

## ❌ What We Are NOT Doing

To keep the product focused and reliable:

* ❌ No AI-based financial insights
* ❌ No complex prediction systems
* ❌ No unnecessary feature bloat

👉 Focus is on **speed, accuracy, and usability**

---

## 📈 Future Scope

* Multi-currency support
* Recurring expense tracking
* Bank API integrations
* Advanced analytics dashboard

---

## 👨‍💻 Team Contributions

| Role            | Responsibility               |
| --------------- | ---------------------------- |
| Frontend        | UI/UX & user interaction     |
| Backend         | APIs & business logic        |
| Database        | Schema design & optimization |
| OCR Integration | Receipt scanning system      |

---

## 🎬 Demo Flow

1. Login / Signup
2. Create group
3. Add expense OR scan bill
4. Show balance calculation
5. Show optimized settlement
6. Click “Pay via UPI”
7. Mark as paid
8. Show notifications

---

## 🏁 Conclusion

SplitEX simplifies shared expenses by combining:

* Automation
* Optimization
* Seamless payments
* Image-based expense entry

👉 Making group finances **simple, fast, and transparent**

---

## 🔥 Tagline

> **SplitEX — Split smart. Pay easy.**

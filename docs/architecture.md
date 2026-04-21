# 🏗️ SplitEX Architecture Documentation

## 📌 Overview

SplitEX is a full-stack expense sharing application designed to simplify group expense management, real-time tracking, and optimized settlement using minimal transactions.

The system follows a **modular monolith architecture** with an additional **microservice for OCR (bill scanning)**.

---

## 🧱 High-Level Architecture

```
Users (Web / Mobile)
│
▼
Frontend (React / Next.js)
│
▼
Backend API (Node.js / Express)
│
├── Auth Module
├── User Module
├── Group Module
├── Expense Module
├── Balance Engine
├── Settlement Optimizer
├── Notification Module
├── Payment Module (UPI)
│
├── OCR Integration Layer
│        │
│        ▼
│   Python OCR Service (FastAPI)
│        └── Receipt Parsing (Tesseract / OpenCV)
│
▼
Database (MongoDB)
│
├── users
├── groups (with embedded members)
├── expenses (with embedded participants)
├── balances
├── settlements
└── notifications
│
▼
External Services
├── Firebase (Notifications)
├── UPI Apps (Google Pay / PhonePe / Paytm)
└── Redis (optional caching)
```

---

## ⚙️ Tech Stack

### Frontend

* React / Next.js
* Tailwind CSS
* ShadCN UI

### Backend

* Node.js
* Express.js

### Database

* **MongoDB (NoSQL)**
* Mongoose ODM

### Realtime

* Socket.IO

### OCR Service

* Python
* FastAPI
* pytesseract
* OpenCV

### Notifications

* Firebase Cloud Messaging

### Payments

* UPI Deep Links

---

## 🧩 Architectural Style

### Modular Monolith + Microservice Extension

SplitEX uses:

* **Modular Monolith (Core App)**

  * All core modules run in a single backend
  * Faster development and debugging

* **Microservice (OCR Service)**

  * Dedicated Python service for image processing
  * Keeps heavy computation separate
  * Improves scalability

---

## 🧠 Core Modules

### 1. Auth Module

Handles:

* User login/signup
* JWT authentication
* Session validation

---

### 2. User Module

Handles:

* Profile management
* UPI ID storage
* Preferences

---

### 3. Group Module

Handles:

* Group creation
* Member management (embedded in MongoDB)
* Roles & permissions

---

### 4. Expense Module

Handles:

* Adding expenses
* Splitting logic (equal, exact, percentage)
* Expense history
* Stores participants inside expense documents

---

### 5. Balance Engine

Handles:

* Real-time balance calculation
* Ledger maintenance

---

### 6. Settlement Optimizer

Handles:

* Minimizing number of transactions
* Generating optimized settlement plan

---

### 7. Notification Module

Handles:

* Payment reminders
* Activity alerts

---

### 8. Payment Module

Handles:

* UPI deep link generation
* Payment tracking

---

### 9. OCR Module (NEW)

Handled via external Python service.

Responsibilities:

* Accept receipt images
* Extract text using OCR
* Convert into structured JSON
* Send parsed data back to backend

---

## 🔄 Data Flow Example

### Adding an Expense

1. User adds expense via frontend
2. Request sent to backend API
3. Expense stored in MongoDB
4. Participants embedded within expense
5. Balance engine updates debts
6. Notifications sent to group members
7. Realtime update pushed to UI

---

### Scanning a Bill (NEW FLOW)

1. User uploads receipt image
2. Frontend sends image to Python OCR service
3. OCR service extracts items + prices
4. Parsed JSON returned to frontend
5. User reviews & edits data
6. Confirmed data sent to backend
7. Expense created in MongoDB
8. Balance engine updates automatically

---

## ⚡ Realtime Updates

Using WebSockets (Socket.IO):

* Expense updates instantly visible
* Balance changes synced live
* Settlement updates broadcasted
* Bill scan results reflected instantly

---

## 🔐 Security Considerations

* JWT-based authentication
* Role-based access control
* Input validation & sanitization
* Secure environment variables
* File upload validation (for receipt scanning)

---

## 🚀 Scalability Plan

Future improvements:

* Split modules into microservices
* Introduce event-driven architecture
* Add Redis caching for balances
* Scale OCR service independently
* Use MongoDB sharding for large datasets

---

## 🎯 Why This Architecture?

* Hackathon-friendly and fast to build
* Clean modular structure
* Optimized for real-time applications
* Easily scalable to microservices
* Supports advanced features like OCR without overloading backend

---

## 🏁 Conclusion

SplitEX architecture balances:

* Simplicity (modular monolith)
* Performance (MongoDB + WebSockets)
* Extensibility (OCR microservice)

👉 Delivering a system that is **fast, scalable, and production-ready**

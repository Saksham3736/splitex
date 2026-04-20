
# 📄 1. `Architecture.md`

# 🏗️ SplitEX Architecture Documentation

## 📌 Overview

SplitEX is a full-stack expense sharing application designed to simplify group expense management, real-time tracking, and optimized settlement using minimal transactions.

The system follows a **modular monolith architecture** for faster development and scalability during hackathons.

---

## 🧱 High-Level Architecture


```
Users (Web / Mobile)
│
▼
Frontend (React / Next.js / React Native)
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
└── Payment Module (UPI)
│
▼
Database (PostgreSQL)
│
├── Users
├── Groups
├── Expenses
├── Participants
├── Balances
├── Settlements
└── Notifications
│
▼
External Services
├── Firebase (Notifications)
├── UPI Apps (Google Pay / PhonePe)
└── Redis (optional caching)

```



## ⚙️ Tech Stack

### Frontend
- React / Next.js
- Tailwind CSS
- ShadCN UI

### Backend
- Node.js
- Express.js (or NestJS)

### Database
- PostgreSQL
- Prisma ORM

### Realtime
- Socket.IO / Supabase Realtime

### Notifications
- Firebase Cloud Messaging

### Payments
- UPI Deep Links



## 🧩 Architectural Style

### Modular Monolith

SplitEX is designed as a **modular monolith**, where:
- Each feature is isolated into modules
- All modules run in a single backend service
- Easy to scale into microservices later



## 🧠 Core Modules

### 1. Auth Module
Handles:
- User login/signup
- JWT authentication
- Session validation

---

### 2. User Module
Handles:
- Profile management
- UPI ID storage
- Preferences

---

### 3. Group Module
Handles:
- Group creation
- Member management
- Roles & permissions

---

### 4. Expense Module
Handles:
- Adding expenses
- Splitting logic (equal, exact, percentage)
- Expense history

---

### 5. Balance Engine
Handles:
- Real-time balance calculation
- Ledger maintenance

---

### 6. Settlement Optimizer
Handles:
- Minimizing number of transactions
- Generating settlement plan

---

### 7. Notification Module
Handles:
- Payment reminders
- Activity alerts

---

### 8. Payment Module
Handles:
- UPI deep link generation
- Payment tracking

---

## 🔄 Data Flow Example

### Adding an Expense

1. User adds expense via frontend
2. Request sent to backend API
3. Expense stored in database
4. Participants and shares calculated
5. Balance engine updates debts
6. Notifications sent to group members
7. Realtime update pushed to UI

---

## ⚡ Realtime Updates

Using WebSockets:
- Expense updates instantly visible
- Balance changes synced live
- Settlement updates broadcasted

---

## 🔐 Security Considerations

- JWT-based authentication
- Role-based access (group members only)
- Input validation & sanitization
- Secure environment variables

---

## 🚀 Scalability Plan

Future improvements:
- Split modules into microservices
- Add caching layer (Redis)
- Introduce event-driven architecture
- Add analytics service

---

## 🎯 Why This Architecture?

- Fast to build (hackathon-friendly)
- Clean separation of concerns
- Easy to debug and maintain
- Scalable for production

---


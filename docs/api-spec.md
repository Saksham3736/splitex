# 🔌 SplitEX API Specification

## 📌 Overview

This document defines the REST API endpoints for SplitEX.

The backend follows a modular architecture using:

* Node.js + Express
* MongoDB (NoSQL)
* Socket.IO (Realtime)
* Python OCR Microservice (for bill scanning)

---

## 🌐 Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 🔑 AUTH MODULE

## Signup

```
POST /auth/signup
```

### Body:

```json
{
  "name": "Saksham",
  "email": "saksham@example.com",
  "password": "123456"
}
```

---

## Login

```
POST /auth/login
```

### Response:

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "name": "Saksham",
    "email": "saksham@example.com"
  }
}
```

---

## Get Current User

```
GET /auth/me
```

---

# 👤 USER MODULE

## Get User Profile

```
GET /users/:id
```

---

## Update Profile

```
PUT /users/:id
```

---

## Update UPI ID

```
PUT /users/:id/upi
```

---

# 👥 GROUP MODULE

## Create Group

```
POST /groups
```

### Body:

```json
{
  "name": "Goa Trip",
  "members": ["user1", "user2"]
}
```

---

## Get All Groups

```
GET /groups?page=1&limit=10
```

---

## Get Group Details

```
GET /groups/:groupId
```

---

## Add Member

```
POST /groups/:groupId/members
```

---

## Remove Member

```
DELETE /groups/:groupId/members/:userId
```

---

# 💸 EXPENSE MODULE

## Add Expense

```
POST /groups/:groupId/expenses
```

### Body:

```json
{
  "amount": 1200,
  "paidBy": "user1",
  "description": "Dinner",
  "splitType": "equal",
  "participants": [
    { "userId": "user1" },
    { "userId": "user2" },
    { "userId": "user3" }
  ]
}
```

---

## Get Expenses

```
GET /groups/:groupId/expenses?page=1&limit=10
```

---

## Get Expense Detail

```
GET /expenses/:expenseId
```

---

## Update Expense

```
PUT /expenses/:expenseId
```

---

## Delete Expense

```
DELETE /expenses/:expenseId
```

---

# 🧾 🆕 OCR / BILL SCANNING MODULE

## Scan Receipt

```
POST /ocr/scan-receipt
```

### Body (multipart/form-data):

* image: file

### Response:

```json
{
  "success": true,
  "data": {
    "items": [
      { "name": "Pizza", "price": 450 },
      { "name": "Coke", "price": 80 }
    ],
    "total": 530
  }
}
```

---

## Confirm Scanned Expense

```
POST /groups/:groupId/expenses/from-scan
```

### Body:

```json
{
  "items": [
    { "name": "Pizza", "price": 450 },
    { "name": "Coke", "price": 80 }
  ],
  "paidBy": "user1",
  "participants": ["user1", "user2"]
}
```

---

# 📊 BALANCE MODULE

## Get Group Balances

```
GET /groups/:groupId/balances
```

---

## Get Net Balances

```
GET /groups/:groupId/net-balances
```

### Response:

```json
{
  "success": true,
  "data": {
    "user1": 500,
    "user2": -200,
    "user3": -300
  }
}
```

---

# 🔁 SETTLEMENT MODULE

## Get Settlement Plan

```
GET /groups/:groupId/settlement-plan
```

### Response:

```json
{
  "success": true,
  "data": [
    { "from": "user2", "to": "user1", "amount": 200 },
    { "from": "user3", "to": "user1", "amount": 300 }
  ]
}
```

---

## Record Settlement

```
POST /groups/:groupId/settlements
```

---

## Mark Settlement as Paid

```
PUT /settlements/:settlementId/paid
```

---

## Get Settlement History

```
GET /groups/:groupId/settlements
```

---

# 🔔 NOTIFICATION MODULE

## Get Notifications

```
GET /notifications
```

---

## Mark as Read

```
PUT /notifications/:id/read
```

---

## Send Reminder

```
POST /notifications/reminder
```

---

# 💳 PAYMENT MODULE

## Generate UPI Link

```
POST /payments/upi-link
```

### Body:

```json
{
  "amount": 250,
  "receiverUpi": "user@upi",
  "name": "Saksham"
}
```

### Response:

```json
{
  "success": true,
  "upiLink": "upi://pay?pa=user@upi&pn=Saksham&am=250&cu=INR"
}
```

---

# ⚠️ ERROR HANDLING

Standard error format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

# 🔄 STANDARD RESPONSE FORMAT

All APIs follow:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

---

# 🔄 STATUS CODES

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 404  | Not Found    |
| 500  | Server Error |

---

# 🧪 TESTING

Tools:

* Postman
* Thunder Client (VS Code)

---

# 🎯 SUMMARY

This API is designed to be:

* RESTful
* MongoDB-optimized
* Real-time ready
* OCR-enabled (bill scanning)
* Scalable and production-ready

👉 Built for **speed, simplicity, and extensibility**

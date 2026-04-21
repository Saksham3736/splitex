# 🔍 SplitEX System Analysis & Integration Report

**Generated:** April 21, 2026  
**Purpose:** Identify requirements and integration points for MongoDB, OCR, UPI Payments, and Wallet System

---

## 📊 CURRENT SYSTEM STATUS

### ✅ What's Working
1. **Backend Structure** - Complete Node.js + Express + MongoDB/Mongoose setup
2. **Authentication** - JWT-based auth with bcrypt
3. **All Modules** - Auth, Users, Groups, Expenses, Balances, Settlements, Notifications, Payments
4. **Python OCR Service** - FastAPI service with Tesseract OCR (existing)
5. **Frontend** - Next.js app with ScanModal component
6. **API Documentation** - Complete Postman tests and README

### ⚠️ What's Missing/Not Connected
1. **MongoDB** - Not connected (needs credentials/config)
2. **OCR Integration** - Frontend can call Python service, but not integrated with backend expense flow
3. **UPI Payments** - Only generates deep links, no transaction tracking
4. **Wallet System** - Not implemented
5. **Environment Variables** - Frontend missing `.env.local`

---

## 1️⃣ MONGODB & MONGOOSE CONNECTION

### What You Need to Provide:

#### Option A: MongoDB Atlas (Cloud - Recommended)
```
1. MongoDB Atlas Account Credentials
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create free tier account
   
2. After setup, provide:
   - Cluster connection string
   - Database username
   - Database password
   - Database name (e.g., "splitex")
   
3. Format will be:
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/splitex?retryWrites=true&w=majority
```

#### Option B: Local MongoDB
```
1. Install MongoDB Community Edition
   - Download: https://www.mongodb.com/try/download/community
   - Install on your Windows machine
   
2. Provide:
   - MongoDB installation path
   - Port number (default: 27017)
   - Database name (e.g., "splitex")
   
3. Current .env is already set for local:
   MONGO_URI=mongodb://localhost:27017/splitex
```

### What I'll Do Once You Provide:
1. ✅ Update `backend/.env` with your MongoDB URI
2. ✅ Test connection by running `npm run dev`
3. ✅ Create database indexes for performance
4. ✅ Set up database seeding script (optional test data)
5. ✅ Verify all CRUD operations work

### Files That Will Be Modified:
- `backend/.env` - Add MongoDB connection string
- `backend/src/db/db.js` - Already configured, just needs testing

### Status: 🔴 BLOCKED (Needs MongoDB URI)

---

## 2️⃣ BILL SCANNING (OCR) INTEGRATION

### Current State:
✅ **Python OCR Service Exists** at `python-ocr-service/main.py`
- FastAPI server on port 8000
- Endpoint: `POST /scan-receipt`
- Uses: Tesseract OCR + OpenCV
- Returns: `{ items: [{description, price}], total, method }`

✅ **Frontend ScanModal Exists** at `frontend/src/components/antigravity/ScanModal.tsx`
- Already calls Python service at `http://localhost:8000/scan-receipt`
- Has fallback mock data
- File upload working

❌ **Missing: Backend Integration**
- No endpoint to receive scanned data
- No automatic expense creation from scan
- No validation of OCR results

### What You Need to Provide for YOUR Existing Model:

If you have a **custom/better OCR model**, provide:

```
1. Model Location
   - Is it a Python file? (.py)
   - Is it a REST API? (endpoint URL)
   - Is it a local file path?
   
2. Input Requirements
   - Image format: JPEG, PNG, PDF?
   - Max file size?
   - Resolution requirements?
   
3. Output Format
   What does your model return? Example:
   {
     "items": [
       {"name": "Pizza", "price": 450, "quantity": 1},
       {"name": "Coke", "price": 60, "quantity": 2}
     ],
     "total": 570,
     "tax": 50,
     "merchant_name": "Domino's",
     "date": "2024-01-15"
   }
   
4. How to Run It
   - Command to start the service
   - Port number
   - Any dependencies (pip packages, etc.)
   
5. API Endpoint (if it's a service)
   - URL: http://localhost:XXXX/scan
   - Method: POST
   - Request format: multipart/form-data or base64?
   - Headers required?
```

### What I'll Build Once You Provide:

#### 1. Backend OCR Integration Endpoint
```javascript
// POST /api/ocr/scan-receipt
- Receives image from frontend
- Forwards to your OCR model/service
- Returns structured data
- Validates OCR results
```

#### 2. Auto-Expense Creation Flow
```javascript
// POST /api/expense/from-scan
- Takes OCR result
- Creates expense automatically
- Splits equally among participants
- Updates balances
- Sends notifications
```

#### 3. Frontend Integration
```typescript
// Update ScanModal to:
- Call backend OCR endpoint (not direct Python call)
- Show preview of scanned items
- Allow editing before confirming
- Auto-create expense on confirm
```

### Integration Architecture:
```
User uploads image
    ↓
Frontend ScanModal
    ↓
Backend: POST /api/ocr/scan-receipt
    ↓
Python OCR Service: POST /scan-receipt (port 8000)
    ↓
Backend validates & returns to frontend
    ↓
User reviews & confirms
    ↓
Backend: POST /api/expense/from-scan
    ↓
Expense created + balances updated + notifications sent
```

### Status: 🟡 PARTIAL (Python service exists, needs backend integration)

---

## 3️⃣ UPI PAYMENT INTEGRATION (Best & Easiest Way)

### Current State:
✅ **Basic UPI Link Generation** exists
- Generates: `upi://pay?pa=receiver@upi&pn=name&am=amount&cu=INR`
- Opens UPI app on mobile
- No transaction tracking
- No payment confirmation

### Recommended Solution: **UPI Intent + Webhook Tracking**

#### Option 1: UPI Deep Links (Current - Simplest)
**Pros:**
- ✅ No external service needed
- ✅ Works on all UPI apps
- ✅ Free
- ✅ Already implemented

**Cons:**
- ❌ No payment confirmation
- ❌ Can't track if payment succeeded
- ❌ No automatic settlement update

**What's Needed:**
```
Just need to enhance current implementation:
1. Add payment confirmation button ("I Paid" / "Payment Complete")
2. Manual settlement marking
3. Transaction history in app
```

#### Option 2: Razorpay/X Payment Gateway (Recommended for Production)
**Pros:**
- ✅ Payment confirmation webhooks
- ✅ Automatic transaction tracking
- ✅ Payment receipts
- ✅ Works on web + mobile
- ✅ Settlement automation

**Cons:**
- ❌ Requires account setup
- ❌ Transaction fees (2% per transaction)
- ❌ More complex integration

**What You'd Need to Provide:**
```
1. Razorpay Account
   - Sign up: https://razorpay.com
   - Get API Key & Secret
   
2. Provide:
   - Razorpay Key ID
   - Razorpay Key Secret
   - Webhook URL (for payment confirmations)
```

**What I'll Build:**
```javascript
// Backend
1. POST /api/payment/create-order
   - Creates Razorpay order
   - Returns order_id
   
2. POST /api/payment/verify
   - Verifies payment signature
   - Updates settlement status
   - Marks balance as paid
   - Creates transaction record

3. POST /api/payment/webhook
   - Receives Razorpay webhook
   - Auto-updates payment status
   - Sends notifications

// Frontend
1. Razorpay checkout integration
2. Payment success/failure screens
3. Transaction history page
```

#### Option 3: UPI Collect + Manual Confirmation (Best Balance)
**This is the SWEET SPOT for your app:**

**How it works:**
1. Generate UPI deep link (already done)
2. User pays via UPI app
3. User gets UPI transaction ID (from their UPI app)
4. User enters transaction ID in SplitEX
5. Backend verifies and marks as paid
6. Settlement auto-updates

**What I'll Build:**
```javascript
// Backend
1. POST /api/payment/initiate
   - Generate UPI link
   - Create pending transaction record
   - Return transaction_id

2. POST /api/payment/confirm
   - User submits UPI transaction ID
   - Mark transaction as complete
   - Update settlement
   - Update balances
   - Send notification to receiver

3. GET /api/payment/history
   - All transactions for user
   - Status: pending/completed/failed

// Frontend
1. Payment screen with:
   - UPI link button
   - "Enter Transaction ID" field
   - Payment status tracker
   
2. Transaction history page
3. Auto-mark settlements as paid
```

**Database Schema Addition:**
```javascript
// Transaction Model
{
  _id: ObjectId,
  fromUser: ObjectId,
  toUser: ObjectId,
  amount: Number,
  upiTransactionId: String,  // From user's UPI app
  status: 'pending' | 'completed' | 'failed',
  paymentMethod: 'upi' | 'wallet',
  createdAt: Date,
  completedAt: Date
}
```

### My Recommendation: **Option 3 (UPI Collect + Manual Confirmation)**

**Why:**
- ✅ Free (no gateway fees)
- ✅ Works immediately
- ✅ Embedded in app
- ✅ Transaction tracking
- ✅ Easy to implement
- ✅ Can upgrade to Razorpay later

### Status: 🟡 PARTIAL (Deep links work, needs transaction tracking)

---

## 4️⃣ WALLET SYSTEM FOR OFFLINE TRANSACTIONS

### Concept:
Users can add money to their SplitEX wallet and use it for internal transfers without actual UPI payments.

### What I'll Build:

#### 1. Database Schema
```javascript
// Wallet Model
{
  userId: ObjectId,
  balance: Number,          // Current balance
  totalAdded: Number,       // Total money added
  totalSpent: Number,       // Total money spent
  updatedAt: Date
}

// WalletTransaction Model
{
  userId: ObjectId,
  type: 'credit' | 'debit',
  amount: Number,
  description: String,      // "Added via UPI", "Paid to John"
  referenceId: ObjectId,    // Link to expense/settlement
  status: 'success' | 'pending' | 'failed',
  createdAt: Date
}
```

#### 2. Backend Endpoints
```javascript
// Wallet Management
POST /api/wallet/add-funds
  - Add money to wallet (via UPI/cash)
  - Create wallet transaction
  - Update balance

POST /api/wallet/pay
  - Pay someone from wallet
  - Deduct from payer
  - Add to receiver
  - Create transaction records
  - Update settlements

GET /api/wallet/balance
  - Get current balance
  - Recent transactions

GET /api/wallet/history
  - All wallet transactions
  - Filter by type/date
```

#### 3. Frontend Features
```
1. Wallet Dashboard
   - Current balance (large display)
   - Add Funds button
   - Recent transactions list
   
2. Add Funds Flow
   - Enter amount
   - Generate UPI link to add money
   - Confirm payment
   - Balance updates
   
3. Pay from Wallet
   - "Pay with Wallet" option on settlements
   - One-click payment
   - Instant balance update
   
4. Transaction History
   - All credits/debits
   - Filter by date
   - Export option
```

#### 4. Integration with Existing Features
```javascript
// When creating expense:
- Option to "Pay from Wallet" instead of splitting
- Wallet balance checked before payment

// When settling debts:
- "Settle with Wallet" button
- Instant transfer
- Auto-update balances

// Benefits:
- No UPI needed for internal transfers
- Instant settlements
- Transaction history
- Can still withdraw to bank later
```

#### 5. Withdrawal System (Future Enhancement)
```javascript
POST /api/wallet/withdraw
  - Request withdrawal to bank
  - Admin approval (or auto)
  - UPI transfer to user's bank
  - Deduct from wallet
```

### Wallet Flow Example:
```
User A adds ₹1000 to wallet (via UPI)
    ↓
Wallet balance: ₹1000
    ↓
User A owes User B ₹250
    ↓
User A clicks "Pay from Wallet"
    ↓
Wallet balance: ₹750
User B wallet: +₹250 (if they have wallet)
OR
User B can withdraw ₹250 to bank
    ↓
Settlement marked as paid
Balance updated
```

### Database Changes Required:
```javascript
// Add to User model:
hasWallet: Boolean,
walletBalance: Number

// New Models:
- Wallet
- WalletTransaction
```

### Status: 🔴 NOT IMPLEMENTED (Ready to build)

---

## 📋 ACTION ITEMS CHECKLIST

### Immediate (To Get System Running):

#### 1. MongoDB Connection 🔴
- [ ] Provide MongoDB Atlas credentials OR confirm local MongoDB installation
- [ ] I'll update `.env` and test connection
- **Time needed:** 5 minutes

#### 2. OCR Model Integration 🟡
- [ ] Provide details of your OCR model:
  - Location/file
  - Input format
  - Output format
  - How to run it
- [ ] I'll integrate it with backend expense flow
- **Time needed:** 30 minutes

### Short-term (Enhance Payment System):

#### 3. UPI Transaction Tracking 🟡
- [ ] Confirm: Use Option 3 (UPI Collect + Manual Confirmation)?
- [ ] I'll build:
  - Transaction model
  - Payment confirmation flow
  - Transaction history
- **Time needed:** 1 hour

#### 4. Wallet System 🔴
- [ ] Confirm: Build wallet system as described?
- [ ] I'll build:
  - Wallet models
  - Add funds flow
  - Pay from wallet
  - Transaction history
- **Time needed:** 2-3 hours

### Optional (Future Enhancements):

#### 5. Razorpay Integration (Production)
- [ ] Create Razorpay account
- [ ] Provide API keys
- [ ] I'll integrate full payment gateway
- **Time needed:** 2 hours

#### 6. Real-time Updates
- [ ] Add Socket.IO for live balance updates
- [ ] Real-time notifications
- **Time needed:** 1 hour

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Get Basic System Running (Today)
1. Connect MongoDB
2. Test all existing endpoints
3. Fix any connection issues

### Phase 2: OCR Integration (Tomorrow)
1. Integrate your OCR model
2. Create auto-expense creation from scan
3. Update frontend ScanModal

### Phase 3: Payment Tracking (This Week)
1. Build UPI transaction tracking
2. Add payment confirmation flow
3. Create transaction history

### Phase 4: Wallet System (Next Week)
1. Build wallet models
2. Add funds flow
3. Pay from wallet feature
4. Transaction history

### Phase 5: Polish & Production (Later)
1. Razorpay integration (optional)
2. Real-time updates
3. Withdrawal system
4. Analytics & reports

---

## 💡 QUICK WINS

### Things I Can Build RIGHT NOW (No Info Needed):

1. ✅ **Transaction History Page** (UI only)
2. ✅ **Wallet UI Components** (frontend)
3. ✅ **Payment Confirmation Modal**
4. ✅ **Enhanced UPI Link UI**
5. ✅ **Dashboard with Stats**

### Things That Need Your Input:

1. 🔴 MongoDB connection string
2. 🔴 Your OCR model details
3. 🔴 Payment tracking preference (Option 1, 2, or 3)
4. 🔴 Wallet system confirmation

---

## 📞 WHAT TO PROVIDE NEXT

### Minimum to Get Started:
```
1. MongoDB Connection:
   - Atlas URI OR confirm local MongoDB
   
2. OCR Model:
   - How to access it (file/API)
   - Input/output format
   
3. Payment Tracking:
   - Confirm Option 3 (UPI Collect + Manual)
   
4. Wallet System:
   - Confirm you want it built
```

### Optional But Helpful:
```
- Razorpay account (if you want gateway integration)
- Any specific UI preferences
- Test data requirements
- Deployment preferences
```

---

## 🚀 SYSTEM ARCHITECTURE (After Integration)

```
┌─────────────────────────────────────────┐
│          FRONTEND (Next.js)             │
│  - React Components                     │
│  - ScanModal (OCR)                      │
│  - Wallet UI                            │
│  - Payment UI                           │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│       BACKEND (Node.js + Express)       │
│  - Auth & JWT                           │
│  - Expense Management                   │
│  - Balance Tracking                     │
│  - Settlement Optimization              │
│  - Payment Tracking                     │
│  - Wallet System                        │
│  - Notifications                        │
└──────┬───────────────┬──────────────────┘
       │               │
       ↓               ↓
┌──────────────┐  ┌──────────────────┐
│  MongoDB     │  │  Python OCR      │
│  (Database)  │  │  Service         │
│              │  │  (FastAPI)       │
│  - Users     │  │                  │
│  - Expenses  │  │  - Tesseract     │
│  - Balances  │  │  - OpenCV        │
│  - Wallet    │  │  - Your Model?   │
│  - Payments  │  │                  │
└──────────────┘  └──────────────────┘
```

---

## 📝 SUMMARY

| Feature | Status | Blocker | Time to Complete |
|---------|--------|---------|------------------|
| MongoDB Connection | 🔴 Not Connected | Need URI | 5 min |
| OCR Integration | 🟡 Partial | Need model details | 30 min |
| UPI Tracking | 🟡 Partial | Need confirmation | 1 hour |
| Wallet System | 🔴 Not Built | Need confirmation | 2-3 hours |
| Razorpay Gateway | 🔴 Not Built | Need account | 2 hours |

---

**Next Step:** Provide the items in "WHAT TO PROVIDE NEXT" section, and I'll start implementing immediately! 🚀

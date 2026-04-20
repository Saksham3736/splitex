# 📄 4. `Flow-diagrams.md`

# 🔄 SplitEX Flow Diagrams

## 📌 Overview

This document describes the key workflows of SplitEX using structured flow representations.

These flows explain how data moves through the system for:
- User authentication
- Group creation
- Expense addition
- Balance calculation
- Settlement optimization
- Payment flow

---

# 🔐 1. USER AUTHENTICATION FLOW



User → Frontend → Backend → Database

1. User enters email/password
2. Frontend sends request to /auth/login
3. Backend validates credentials
4. If valid → generate JWT token
5. Token sent to frontend
6. Frontend stores token (localStorage/session)
7. User is authenticated


---

# 👥 2. CREATE GROUP FLOW



User → Frontend → Backend → Database

1. User clicks "Create Group"
2. Enters group name + members
3. Frontend sends POST /groups
4. Backend:

   * Validates input
   * Creates group
   * Adds members to group_members
5. Database stores group + members
6. Response sent to frontend
7. Group appears in UI


---

# 💸 3. ADD EXPENSE FLOW (CORE LOGIC)



User → Frontend → Backend → Database → Balance Engine → Realtime Update

1. User enters:

   * amount
   * paid by
   * participants
   * split type

2. Frontend sends POST /groups/:id/expenses

3. Backend:

   * Validates group membership
   * Stores expense
   * Calculates split shares

4. Shares saved in expense_participants

5. Balance Engine:

   * Updates who owes whom

6. Updated balances stored

7. Realtime update sent to all users

8. UI refreshes instantly



---

# 📊 4. BALANCE CALCULATION FLOW



Input: Expenses + Participants

1. For each expense:

   * Identify payer
   * Identify participants
   * Calculate share per user

2. For each participant:
   owes = share_amount
   paid = amount (if payer)

3. Net balance computed:
   balance = total_paid - total_owed

4. Store:
   from_user → to_user → amount

Output: Balance table


---

# 🔁 5. SETTLEMENT OPTIMIZATION FLOW



Input: Net balances

Step 1:

* Create two lists:
  creditors (positive balance)
  debtors (negative balance)

Step 2:

* Sort both lists

Step 3:

* Match highest debtor with highest creditor

Step 4:

* Settle minimum amount

Step 5:

* Repeat until all balances = 0

Output:

* Optimized transactions list


---

# 💳 6. PAYMENT FLOW (UPI)



User → Frontend → UPI App → Backend

1. User clicks "Settle Up"

2. System shows recommended payments

3. User clicks "Pay via UPI"

4. Backend generates UPI link:
   upi://pay?pa=receiver@upi&am=amount

5. Frontend opens UPI app (GPay/PhonePe)

6. User completes payment externally

7. User returns and marks payment as done

8. Backend updates settlement status

9. Notification sent to receiver



---

# 🔔 7. NOTIFICATION FLOW



Trigger → Backend → Notification Service → User

Triggers:

* New expense added
* Settlement completed
* Payment reminder

Flow:

1. Event occurs
2. Backend creates notification entry
3. Push notification sent (Firebase)
4. User sees alert in app



---

# ⚡ 8. REALTIME UPDATE FLOW



Backend → WebSocket → Clients

1. Event occurs (expense added / settlement done)
2. Backend emits event via Socket.IO
3. Connected clients receive update
4. UI updates instantly without refresh



---

# 🧠 9. COMPLETE SYSTEM FLOW (END-TO-END)

```

User creates group
↓
Adds expenses
↓
System calculates balances
↓
Optimizes settlements
↓
User pays via UPI
↓
System updates records
↓
Notifications sent

```

---

# 🎯 SUMMARY

These flows ensure:
- Smooth user experience
- Real-time updates
- Accurate calculations
- Minimal transactions
- Scalable system behavior


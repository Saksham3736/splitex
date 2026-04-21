# 🗄️ SplitEX Database Schema (MongoDB)

## 📌 Overview

SplitEX uses **MongoDB (NoSQL database)** to store users, groups, expenses, balances, and settlements.

The schema is designed to:

* Support flexible expense splitting
* Enable faster reads with embedded data
* Scale easily with growing users/groups
* Reduce complex joins (NoSQL advantage)

---

## 🧱 Collections Overview

Core collections:

* users
* groups
* expenses
* balances
* settlements
* notifications

---

# 👤 USERS COLLECTION

Stores all registered users.

```json
{
  _id: ObjectId,
  name: "Saksham",
  email: "user@email.com",
  password: "hashed_password",
  upi_id: "user@upi",
  profile_image: "url",
  created_at: ISODate,
  updated_at: ISODate
}
```

---

# 👥 GROUPS COLLECTION

Stores groups along with embedded members.

```json
{
  _id: ObjectId,
  name: "Goa Trip",
  description: "Trip expenses",
  created_by: ObjectId,
  group_type: "trip",
  members: [
    {
      user_id: ObjectId,
      role: "admin",
      status: "active",
      joined_at: ISODate
    }
  ],
  created_at: ISODate
}
```

### 💡 Why Embedded Members?

* Faster reads (no join needed)
* Group data is always accessed together

---

# 💸 EXPENSES COLLECTION

Stores all expenses.

```json
{
  _id: ObjectId,
  group_id: ObjectId,
  paid_by: ObjectId,
  description: "Dinner",
  amount: 1200,
  currency: "INR",
  split_type: "equal",
  category: "food",
  expense_date: ISODate,

  participants: [
    {
      user_id: ObjectId,
      share_amount: 400,
      share_percentage: null,
      share_units: null
    }
  ],

  created_by: ObjectId,
  created_at: ISODate
}
```

### 💡 Embedded Participants

* Avoids separate table
* Keeps expense + split data together

---

# 📊 BALANCES COLLECTION

Stores net balances between users.

```json
{
  _id: ObjectId,
  group_id: ObjectId,
  from_user_id: ObjectId,
  to_user_id: ObjectId,
  amount: 500,
  updated_at: ISODate
}
```

### 💡 Meaning:

* `from_user_id` owes `to_user_id`

---

# 🔁 SETTLEMENTS COLLECTION

Stores payment records.

```json
{
  _id: ObjectId,
  group_id: ObjectId,
  payer_id: ObjectId,
  receiver_id: ObjectId,
  amount: 500,
  payment_method: "UPI",
  payment_status: "completed",
  transaction_ref: "txn_12345",
  settled_at: ISODate,
  created_at: ISODate
}
```

---

# 🔔 NOTIFICATIONS COLLECTION

Stores user notifications.

```json
{
  _id: ObjectId,
  user_id: ObjectId,
  type: "payment_reminder",
  title: "Pending Payment",
  message: "You owe ₹500",
  is_read: false,
  metadata: {
    group_id: ObjectId
  },
  created_at: ISODate
}
```

---

# 🧾 🆕 SCANNED RECEIPTS (OCR DATA)

Optional collection for storing raw OCR results.

```json
{
  _id: ObjectId,
  user_id: ObjectId,
  group_id: ObjectId,
  image_url: "receipt.jpg",
  extracted_items: [
    { item: "Pizza", price: 450 },
    { item: "Coke", price: 80 }
  ],
  total_amount: 530,
  status: "reviewed",
  created_at: ISODate
}
```

---

# 🔗 RELATIONSHIP DESIGN (NoSQL Style)

| Relation                | Approach              |
| ----------------------- | --------------------- |
| Users ↔ Groups          | Embedded members      |
| Groups ↔ Expenses       | Referenced (group_id) |
| Expenses ↔ Participants | Embedded              |
| Users ↔ Balances        | Referenced            |
| Users ↔ Settlements     | Referenced            |

---

# ⚙️ INDEXING (IMPORTANT)

```js
db.expenses.createIndex({ group_id: 1 })
db.notifications.createIndex({ user_id: 1 })
db.balances.createIndex({ group_id: 1 })
db.settlements.createIndex({ group_id: 1 })
```

---

# 🧠 DESIGN DECISIONS

### 1. Embedded vs Referenced

* Embedded where data is tightly coupled (participants, members)
* Referenced where data grows independently (expenses, settlements)

### 2. No Joins = Faster Reads

* MongoDB avoids expensive joins
* Improves performance in real-time apps

### 3. Flexible Schema

* Easy to extend (OCR, future features)
* No migration headaches

---

# 🚀 SCALABILITY

Future improvements:

* Sharding by `group_id`
* Redis caching for balances
* Event-driven architecture
* Microservices separation (OCR service already external)

---

# 🎯 SUMMARY

This MongoDB schema ensures:

* Flexible data modeling
* High performance for real-time updates
* Easy scalability
* Clean and practical design for SplitEX

👉 Optimized for **speed, flexibility, and real-world usage**

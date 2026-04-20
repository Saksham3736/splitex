# 📄 3. `Db-schema.md`


# 🗄️ SplitEX Database Schema

## 📌 Overview

SplitEX uses a **PostgreSQL relational database** to store users, groups, expenses, balances, and settlements.

The schema is designed to:
- Support flexible expense splitting
- Maintain accurate balances
- Enable optimized settlements
- Ensure data consistency

---

## 🧱 Entity Relationship Overview

Core entities:

- Users
- Groups
- Group Members
- Expenses
- Expense Participants
- Balances
- Settlements
- Notifications

---

# 👤 USERS TABLE

Stores all registered users.

```sql id="2n5g7q"
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password TEXT,
  upi_id VARCHAR(100),
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);
````



# 👥 GROUPS TABLE

Stores all groups.

```sql id="1x8r9k"
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  name VARCHAR(150),
  description TEXT,
  created_by UUID REFERENCES users(id),
  group_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 👥 GROUP_MEMBERS TABLE

Defines user membership in groups.

```sql id="s9v4e1"
CREATE TABLE group_members (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);
```

---

# 💸 EXPENSES TABLE

Stores all expenses added in groups.

```sql id="0m7k2d"
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  paid_by UUID REFERENCES users(id),
  description TEXT,
  amount DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'INR',
  split_type VARCHAR(20), -- equal, exact, percentage
  category VARCHAR(50),
  expense_date TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 👥 EXPENSE_PARTICIPANTS TABLE

Stores how an expense is divided among users.

```sql id="5z2p9n"
CREATE TABLE expense_participants (
  id UUID PRIMARY KEY,
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  share_amount DECIMAL(10,2),
  share_percentage DECIMAL(5,2),
  share_units INT,
  is_included BOOLEAN DEFAULT TRUE
);
```

---

# 📊 BALANCES TABLE

Stores net balances between users.

```sql id="8d3k1h"
CREATE TABLE balances (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 💡 Meaning:

* `from_user_id` owes `to_user_id`

---

# 🔁 SETTLEMENTS TABLE

Stores payment records between users.

```sql id="6r4b7c"
CREATE TABLE settlements (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups(id),
  payer_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  amount DECIMAL(10,2),
  payment_method VARCHAR(50), -- UPI, cash, etc.
  payment_status VARCHAR(20), -- pending, completed
  transaction_ref TEXT,
  settled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 🔔 NOTIFICATIONS TABLE

Stores user notifications.

```sql id="9x1c5m"
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(150),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 📜 AUDIT_LOGS TABLE (Optional but advanced)

Tracks important actions.

```sql id="7h2w8p"
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50),
  performed_by UUID REFERENCES users(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 🔗 RELATIONSHIPS SUMMARY

| Table                   | Relationship                   |
| ----------------------- | ------------------------------ |
| users ↔ groups          | many-to-many via group_members |
| groups ↔ expenses       | one-to-many                    |
| expenses ↔ participants | one-to-many                    |
| users ↔ balances        | many-to-many                   |
| users ↔ settlements     | many-to-many                   |

---

# ⚙️ INDEXING (IMPORTANT)

Add indexes for performance:

```sql id="4f8j2q"
CREATE INDEX idx_group_expenses ON expenses(group_id);
CREATE INDEX idx_user_notifications ON notifications(user_id);
CREATE INDEX idx_group_balances ON balances(group_id);
CREATE INDEX idx_settlements_group ON settlements(group_id);
```

---

# 🧠 DESIGN DECISIONS

### 1. Separate participants table

* Allows flexible split types
* Supports equal, exact, percentage

### 2. Balance table

* Stores computed debts
* Avoids recalculation every time

### 3. Settlement table

* Tracks real payments
* Enables history and audit

### 4. JSONB in notifications

* Flexible metadata storage

---

# 🚀 SCALABILITY

Future improvements:

* Partition large tables (expenses)
* Add Redis caching
* Introduce event-based updates

---

# 🎯 SUMMARY

This schema ensures:

* Flexibility in splitting expenses
* Efficient balance tracking
* Scalable and normalized structure
* Clean relational design


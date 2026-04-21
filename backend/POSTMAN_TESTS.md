# SplitEX Backend - Postman Test Sequence

This guide provides a complete test sequence for testing all backend API endpoints using Postman.

## Prerequisites

1. **Start the backend server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Base URL:** `http://localhost:3000`

3. **Set up environment variable in Postman:**
   - Create a new environment
   - Add variable `base_url` with value `http://localhost:3000`
   - Add variable `token` (will be populated after login)

---

## Test Sequence

### 1. Register User A

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/register`  
**Headers:**  
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "name": "User A",
  "email": "usera@test.com",
  "password": "password123",
  "upiId": "usera@upi"
}
```

**Expected Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "userId": "...",
  "name": "User A",
  "email": "usera@test.com",
  "upiId": "usera@upi"
}
```

**Action:** Copy the `token` and `userId` values for later use.

---

### 2. Register User B

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/register`  
**Headers:**  
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "name": "User B",
  "email": "userb@test.com",
  "password": "password123",
  "upiId": "userb@upi"
}
```

**Expected Response:** `201 Created` (same structure as above)

**Action:** Copy the `userId` for User B.

---

### 3. Login User A

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/login`  
**Headers:**  
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "email": "usera@test.com",
  "password": "password123"
}
```

**Expected Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGci...",
  "userId": "...",
  "name": "User A",
  "email": "usera@test.com",
  "upiId": "usera@upi"
}
```

**Action:** 
1. Copy the `token` value
2. In Postman, set the `token` environment variable to this value
3. For all subsequent requests, add header: `Authorization: Bearer {{token}}`

---

### 4. Get Current User Profile

**Method:** `GET`  
**URL:** `{{base_url}}/api/user/me`  
**Headers:**  
- `Authorization: Bearer {{token}}`

**Expected Response:** `200 OK`
```json
{
  "userId": "...",
  "name": "User A",
  "email": "usera@test.com",
  "upiId": "usera@upi",
  "createdAt": "2024-..."
}
```

---

### 5. Update User Profile

**Method:** `PATCH`  
**URL:** `{{base_url}}/api/user/me`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "name": "User A Updated",
  "upiId": "usera@paytm"
}
```

**Expected Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "userId": "...",
  "name": "User A Updated",
  "email": "usera@test.com",
  "upiId": "usera@paytm"
}
```

---

### 6. Create Group

**Method:** `POST`  
**URL:** `{{base_url}}/api/group`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "name": "Goa Trip 2024"
}
```

**Expected Response:** `201 Created`
```json
{
  "message": "Group created successfully",
  "groupId": "...",
  "name": "Goa Trip 2024",
  "createdBy": "...",
  "members": ["..."]
}
```

**Action:** Copy the `groupId` value for later use.

---

### 7. Add Member to Group

**Method:** `POST`  
**URL:** `{{base_url}}/api/group/{{groupId}}/members`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "userId": "<USER_B_ID>"
}
```

**Expected Response:** `200 OK`
```json
{
  "message": "Member added successfully",
  "members": ["<USER_A_ID>", "<USER_B_ID>"]
}
```

---

### 8. Create Expense (Equal Split)

**Method:** `POST`  
**URL:** `{{base_url}}/api/expense`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "group": "<GROUP_ID>",
  "paidBy": "<USER_A_ID>",
  "amount": 1200,
  "splitType": "equal",
  "participants": ["<USER_A_ID>", "<USER_B_ID>"],
  "description": "Hotel booking"
}
```

**Expected Response:** `201 Created`
```json
{
  "message": "Expense created successfully",
  "expense": {
    "_id": "...",
    "group": "...",
    "paidBy": "...",
    "amount": 1200,
    "splitType": "equal",
    "participants": [
      { "user": "...", "share": 600 },
      { "user": "...", "share": 600 }
    ],
    "description": "Hotel booking",
    "createdAt": "..."
  }
}
```

---

### 9. Create Expense (Exact Split)

**Method:** `POST`  
**URL:** `{{base_url}}/api/expense`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "group": "<GROUP_ID>",
  "paidBy": "<USER_A_ID>",
  "amount": 1000,
  "splitType": "exact",
  "participants": [
    { "user": "<USER_A_ID>", "share": 700 },
    { "user": "<USER_B_ID>", "share": 300 }
  ],
  "description": "Dinner"
}
```

**Expected Response:** `201 Created`

---

### 10. Create Expense (Percentage Split)

**Method:** `POST`  
**URL:** `{{base_url}}/api/expense`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "group": "<GROUP_ID>",
  "paidBy": "<USER_B_ID>",
  "amount": 500,
  "splitType": "percentage",
  "participants": [
    { "user": "<USER_A_ID>", "percentage": 60 },
    { "user": "<USER_B_ID>", "percentage": 40 }
  ],
  "description": "Taxi fare"
}
```

**Expected Response:** `201 Created`

---

### 11. Optimize Settlements

**Method:** `POST`  
**URL:** `{{base_url}}/api/settlements/optimize`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{}
```

**Expected Response:** `200 OK`
```json
{
  "message": "Settlements optimized successfully",
  "settlements": [
    {
      "fromUser": "...",
      "fromUserName": "User B",
      "toUser": "...",
      "toUserName": "User A",
      "amount": 250.00
    }
  ],
  "count": 1
}
```

---

### 12. Get Notifications

**Method:** `GET`  
**URL:** `{{base_url}}/api/notifications`  
**Headers:**  
- `Authorization: Bearer {{token}}`

**Expected Response:** `200 OK`
```json
{
  "notifications": [
    {
      "_id": "...",
      "userId": "...",
      "message": "You owe ₹600.00 for: Hotel booking",
      "read": false,
      "createdAt": "..."
    }
  ],
  "count": 3
}
```

---

### 13. Mark Notification as Read

**Method:** `PATCH`  
**URL:** `{{base_url}}/api/notifications/<NOTIFICATION_ID>/read`  
**Headers:**  
- `Authorization: Bearer {{token}}`

**Expected Response:** `200 OK`
```json
{
  "message": "Notification marked as read"
}
```

---

### 14. Generate UPI Payment Link

**Method:** `POST`  
**URL:** `{{base_url}}/api/payment/upi-link`  
**Headers:**  
- `Authorization: Bearer {{token}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "userId": "<USER_A_ID>",
  "amount": 250
}
```

**Expected Response:** `200 OK`
```json
{
  "message": "UPI link generated successfully",
  "upiLink": "upi://pay?pa=usera@paytm&pn=User%20A%20Updated&am=250&cu=INR",
  "recipientName": "User A Updated",
  "upiId": "usera@paytm",
  "amount": 250
}
```

---

## Error Testing

### Test Invalid Login

**Method:** `POST`  
**URL:** `{{base_url}}/api/auth/login`  
**Body:**
```json
{
  "email": "usera@test.com",
  "password": "wrongpassword"
}
```

**Expected Response:** `401 Unauthorized`
```json
{
  "error": "Invalid credentials"
}
```

---

### Test Unauthorized Access (No Token)

**Method:** `GET`  
**URL:** `{{base_url}}/api/user/me`  
**Headers:** (no Authorization header)

**Expected Response:** `401 Unauthorized`
```json
{
  "error": "No token, authorization denied"
}
```

---

### Test Invalid Expense (Non-member)

**Method:** `POST`  
**URL:** `{{base_url}}/api/expense`  
**Headers:**  
- `Authorization: Bearer {{token}}`

**Body:**
```json
{
  "group": "<GROUP_ID>",
  "paidBy": "<RANDOM_USER_ID>",
  "amount": 100,
  "splitType": "equal",
  "participants": ["<RANDOM_USER_ID>"]
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "error": "Payer must be a group member"
}
```

---

## Tips

1. **Use Postman Environment Variables:**
   - `base_url`: `http://localhost:3000`
   - `token`: Auto-set after login
   - `userIdA`, `userIdB`: Save user IDs
   - `groupId`: Save group ID

2. **Use Tests Tab in Postman to Auto-save Variables:**
   ```javascript
   // In login request Tests tab
   const response = pm.response.json();
   pm.environment.set("token", response.token);
   pm.environment.set("userIdA", response.userId);
   ```

3. **Common Issues:**
   - Make sure MongoDB is running and `.env` file is configured
   - Check that `JWT_SECRET` is set in `.env`
   - Verify server is running on port 3000

---

## API Endpoints Summary

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/user/me` | Yes | Get current user |
| PATCH | `/api/user/me` | Yes | Update user profile |
| POST | `/api/group` | Yes | Create group |
| POST | `/api/group/:id/members` | Yes | Add member |
| DELETE | `/api/group/:id/members/:userId` | Yes | Remove member |
| POST | `/api/expense` | Yes | Create expense |
| POST | `/api/settlements/optimize` | Yes | Optimize settlements |
| GET | `/api/notifications` | Yes | Get notifications |
| PATCH | `/api/notifications/:id/read` | Yes | Mark as read |
| POST | `/api/payment/upi-link` | Yes | Generate UPI link |

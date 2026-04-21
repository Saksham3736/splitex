# SplitEX Backend API

Complete Node.js + Express + MongoDB backend for the SplitEX expense splitting application.

## Features

- 🔐 **Authentication**: JWT-based auth with bcrypt password hashing
- 👥 **Groups**: Create groups, manage members (creator-only controls)
- 💰 **Expenses**: Support for equal, exact, and percentage splits
- ⚖️ **Balances**: Automatic net-aware debt tracking with smart netting
- 🎯 **Settlements**: Greedy optimization algorithm to minimize transactions
- 🔔 **Notifications**: Auto-triggered on expenses and settlements
- 💳 **Payments**: UPI deep link generation for easy payments

## Quick Start

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB (Atlas or local)

### 2. Installation

```bash
cd backend
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
PORT=3000
```

**Important:** 
- Replace the MongoDB URI with your actual connection string
- Use a strong, random JWT_SECRET
- PORT is optional (defaults to 3000)

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

Base URL: `http://localhost:3000/api`

### Authentication (No token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### User (Token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get current user profile |
| PATCH | `/api/user/me` | Update user profile |

### Groups (Token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/group` | Create new group |
| POST | `/api/group/:id/members` | Add member (creator only) |
| DELETE | `/api/group/:id/members/:userId` | Remove member (creator only) |

### Expenses (Token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expense` | Create expense with splits |

### Settlements (Token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/settlements/optimize` | Get optimized settlements |

### Notifications (Token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification as read |

### Payments (Token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/upi-link` | Generate UPI payment link |

## Testing with Postman

See [POSTMAN_TESTS.md](./POSTMAN_TESTS.md) for a complete test sequence with examples.

## Project Structure

```
backend/
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── server.js                 # Server entry point
├── app.js                    # Express app setup
├── POSTMAN_TESTS.md          # Postman testing guide
└── src/
    ├── db/
    │   └── db.js             # MongoDB connection
    ├── middleware/
    │   └── authMiddleware.js # JWT authentication
    └── modules/
        ├── auth/             # User registration & login
        │   ├── auth.model.js
        │   ├── auth.controller.js
        │   └── auth.routes.js
        ├── user/             # Profile management
        │   ├── user.controller.js
        │   └── user.routes.js
        ├── group/            # Group management
        │   ├── group.model.js
        │   ├── group.controller.js
        │   └── group.routes.js
        ├── expense/          # Expense tracking
        │   ├── expense.model.js
        │   ├── expense.controller.js
        │   └── expense.routes.js
        ├── balance/          # Balance tracking
        │   ├── balance.model.js
        │   └── balance.service.js
        ├── settlement/       # Settlement optimization
        │   ├── settlement.service.js
        │   ├── settlement.controller.js
        │   └── settlement.routes.js
        ├── notification/     # Notifications
        │   ├── notification.model.js
        │   ├── notification.service.js
        │   ├── notification.controller.js
        │   └── notification.routes.js
        └── payment/          # UPI payments
            ├── payment.service.js
            ├── payment.controller.js
            └── payment.routes.js
```

## Key Features Explained

### Expense Split Types

1. **Equal Split**: Amount divided equally among all participants
   ```json
   {
     "splitType": "equal",
     "participants": ["userId1", "userId2", "userId3"]
   }
   ```

2. **Exact Split**: Each participant pays a specific amount
   ```json
   {
     "splitType": "exact",
     "participants": [
       { "user": "userId1", "share": 500 },
       { "user": "userId2", "share": 300 }
     ]
   }
   ```

3. **Percentage Split**: Each participant pays a percentage
   ```json
   {
     "splitType": "percentage",
     "participants": [
       { "user": "userId1", "percentage": 60 },
       { "user": "userId2", "percentage": 40 }
     ]
   }
   ```

### Balance Netting

The system automatically nets debts:
- If User A owes User B ₹100
- And User B owes User A ₹40
- Result: User A owes User B ₹60

### Settlement Optimization

Uses a greedy algorithm to minimize the number of transactions needed to settle all debts.

### UPI Payment Links

Generates standard UPI deep links that work with any UPI app:
```
upi://pay?pa=receiver@upi&pn=Receiver%20Name&am=250&cu=INR
```

## Security

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- All protected routes require valid JWT
- Creator-only actions in groups are enforced
- Input validation on all endpoints

## Error Handling

All endpoints return proper HTTP status codes:
- `200/201`: Success
- `400`: Bad request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not found
- `500`: Server error

## Development

### Adding New Features

1. Create model in `src/modules/<feature>/<feature>.model.js`
2. Create controller in `src/modules/<feature>/<feature>.controller.js`
3. Create routes in `src/modules/<feature>/<feature>.routes.js`
4. Mount routes in `app.js`

### Debugging

Enable detailed logging by adding `console.log()` statements. The server will auto-reload in development mode.

## Python OCR Service

The bill scanning feature uses a separate Python microservice:

```bash
cd python-ocr-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

See `python-ocr-service/README.md` for more details.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

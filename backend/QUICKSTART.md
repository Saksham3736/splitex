# SplitEX Backend - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Configure MongoDB

**Option A: Use Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service
3. The `.env` file is already configured for local: `mongodb://localhost:27017/splitex`

**Option B: Use MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env` file with your Atlas URI

### Step 2: Install & Run

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Start the server
npm run dev
```

You should see:
```
MongoDB connected ✅
✅ Server is running on port 3000
🌐 API available at http://localhost:3000/api
```

### Step 3: Test the API

Open your browser and visit:
```
http://localhost:3000
```

You should see:
```json
{
  "message": "SplitEX API is running",
  "version": "1.0.0"
}
```

## 📝 First API Calls

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "upiId": "john@paytm"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

### 3. Create a Group

```bash
curl -X POST http://localhost:3000/api/group \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Room Expenses"
  }'
```

## 🧪 Using Postman

For complete testing guide, see [POSTMAN_TESTS.md](./POSTMAN_TESTS.md)

## 📚 API Documentation

See [README.md](./README.md) for full API documentation.

## ❌ Troubleshooting

### MongoDB Connection Error
- **Error**: `MongoDB connection error`
- **Fix**: Check if MongoDB is running and `MONGO_URI` in `.env` is correct

### JWT_SECRET Error
- **Error**: `ERROR: JWT_SECRET is not defined`
- **Fix**: Make sure `.env` file exists with `JWT_SECRET` defined

### Port Already in Use
- **Error**: `EADDRINUSE: address already in use`
- **Fix**: Change `PORT` in `.env` to another port (e.g., 3001)

### Module Not Found
- **Error**: `Cannot find module`
- **Fix**: Run `npm install` again

## 🔧 Development Commands

```bash
# Start with auto-reload (development)
npm run dev

# Start without auto-reload (production)
npm start

# Install new dependencies
npm install <package-name>
```

## 📁 Important Files

- `.env` - Environment configuration (DO NOT commit to Git)
- `server.js` - Server entry point
- `app.js` - Express app configuration
- `src/modules/` - All API modules
- `POSTMAN_TESTS.md` - Complete API testing guide
- `README.md` - Full documentation

## 🎯 Next Steps

1. ✅ Backend is running
2. 📱 Connect your frontend to `http://localhost:3000/api`
3. 🧪 Test all endpoints using Postman
4. 🚀 Start building features!

## 📞 Need Help?

- Check [README.md](./README.md) for detailed documentation
- See [POSTMAN_TESTS.md](./POSTMAN_TESTS.md) for testing examples
- Review the code in `src/modules/` for implementation details

---

**Happy Coding! 🎉**

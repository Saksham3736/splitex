const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./src/modules/auth/auth.routes');
const userRoutes = require('./src/modules/user/user.routes');
const groupRoutes = require('./src/modules/group/group.routes');
const expenseRoutes = require('./src/modules/expense/expense.routes');
const settlementRoutes = require('./src/modules/settlement/settlement.routes');
const notificationRoutes = require('./src/modules/notification/notification.routes');
const paymentRoutes = require('./src/modules/payment/payment.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create API router
const apiRouter = express.Router();

// Mount all routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRoutes);
apiRouter.use('/groups', groupRoutes);
apiRouter.use('/expense', expenseRoutes);
apiRouter.use('/settlements', settlementRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/payment', paymentRoutes);

// Mount API router under /api
app.use('/api', apiRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SplitEX API is running',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

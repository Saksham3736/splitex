const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/db/db');

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Start server
const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const MAX_PORT_ATTEMPTS = 10;

const startServer = (port, attemptsLeft) => {
  const server = app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
    console.log(`🌐 Health check: http://localhost:${port}/`);
    console.log(`🌐 API root: http://localhost:${port}/api`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.warn(
        `⚠️ Port ${port} is already in use. Retrying on port ${nextPort}...`
      );
      startServer(nextPort, attemptsLeft - 1);
      return;
    }

    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
};

startServer(DEFAULT_PORT, MAX_PORT_ATTEMPTS);

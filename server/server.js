require('dotenv').config();
const app = require('./app');
const prisma = require('./config/database');

// macOS grabs 5000 for AirPlay, so defaulting to 5001 locally
const PORT = process.env.PORT || 5001;

const start = async () => {
  await prisma.$connect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Email: ${process.env.RESEND_API_KEY ? '✅ Resend configured' : '⚠️  RESEND_API_KEY not set'}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

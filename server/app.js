require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Render (and most cloud hosts) sit behind a proxy — needed for rate limiter + correct IPs
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const clientUrl = process.env.CLIENT_URL; // e.g. https://radhakrishna.dev
    const allowed = [
      clientUrl,
      clientUrl ? `https://www.${clientUrl.replace('https://', '')}` : null, // also allow www variant
      'http://localhost:5173',
      'http://localhost:4173',
    ].filter(Boolean);

    // Allow any Vercel deployment URL (preview + production)
    const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

    if (allowed.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(generalLimiter);

app.use('/api', require('./routes/public.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

module.exports = app;

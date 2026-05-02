require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

connectDB();

const app = express();

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:4173',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

// Body parser — 10mb to support base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, max: 200,
  message: { success: false, message: 'Too many requests. Please slow down.' },
}));
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
}));

// Health check
app.get('/health', (_, res) => res.json({
  status: 'ok', service: 'AutoElite API',
  env: process.env.NODE_ENV, timestamp: new Date().toISOString(),
}));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/cars',      require('./routes/cars'));
app.use('/api/enquiries', require('./routes/enquiries'));

// 404 + Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🚗  AutoElite Dealership API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  🚀 Server   : http://localhost:${PORT}`);
  console.log(`  📡 API      : http://localhost:${PORT}/api`);
  console.log(`  🌿 Env      : ${process.env.NODE_ENV}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

module.exports = app;

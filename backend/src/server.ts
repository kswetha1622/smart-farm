import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import connectDB from './config/db';
import { initFirebase } from './config/firebase';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/authRoutes';
import fieldRoutes from './routes/fieldRoutes';
import satelliteRoutes from './routes/satelliteRoutes';
import damageRoutes from './routes/damageRoutes';
import weatherRoutes from './routes/weatherRoutes';
import cropRoutes from './routes/cropRoutes';
import diseaseRoutes from './routes/diseaseRoutes';
import voiceRoutes from './routes/voiceRoutes';
import settingsRoutes from './routes/settingsRoutes';
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';
import agroRoutes from './routes/agroRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Detect if a built frontend exists at ../dist (i.e., d:/FAMER/dist)
const FRONTEND_DIST = path.resolve(process.cwd(), '..', 'dist');
const SERVE_FRONTEND = fs.existsSync(path.join(FRONTEND_DIST, 'index.html'));

// Initialize services
initFirebase();
connectDB();

// Security middleware - relax CSP when serving frontend
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: SERVE_FRONTEND
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com', 'https://maps.googleapis.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
            connectSrc: ["'self'", 'https:', 'wss:', 'https://apis.google.com', 'https://securetoken.googleapis.com', 'https://identitytoolkit.googleapis.com'],
            frameSrc: ["'self'", 'https://smart-farmer-ai-f0c5b.firebaseapp.com'],
            workerSrc: ["'self'", 'blob:'],
          },
        }
      : false,
  })
);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
}));

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve uploaded files (disease images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate limiting on API routes
app.use('/api/', generalLimiter);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/damage', damageRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/agro', agroRoutes);

// ─── Serve built React frontend ───────────────────────────────────────────────
if (SERVE_FRONTEND) {
  // Serve static assets (JS, CSS, images) from the dist folder
  app.use(express.static(FRONTEND_DIST, { index: false }));

  // Catch-all: send index.html for any non-API route (React Router)
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });

  console.log(`[Server] Serving React frontend from ${FRONTEND_DIST}`);
} else {
  console.log('[Server] No frontend build found. Run: cd .. && npm run build');
  // 404 for unknown routes in API-only mode
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } });
  });
}

// Global error handler (must come last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🌾 Smart Farm AI is running!`);
  console.log(`   → Open: http://localhost:${PORT}`);
  console.log(`   → API:  http://localhost:${PORT}/api/health`);
  console.log(`   → Env:  ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;

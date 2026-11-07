const express = require('express');
const path = require('path');
const fs = require('fs');
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile) && typeof process.loadEnvFile === 'function') process.loadEnvFile(envFile);
const { handleGenerateWorkout } = require('./workout-api');
const app = express();
app.disable('x-powered-by');
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || origin === process.env.RENDER_EXTERNAL_URL)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'fitia-api' }));
app.post('/api/generate-workout', handleGenerateWorkout);
const dist = path.join(__dirname, '..', 'dist');
app.use(express.static(dist, { maxAge: '1h', index: false }));
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
const port = Number(process.env.PORT || 10000);
app.listen(port, '0.0.0.0', () => console.log(`FitIA listening on ${port}`));

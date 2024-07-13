import 'dotenv/config';
import express from 'express';
import db from './db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import authRouter from './routes/authRoute.js';
import tripRouter from './routes/tripRoute.js';
import recordRouter from './routes/recordRoute.js';
import tagRouter from './routes/tagRoute.js';
import fileRouter from './routes/fileRoute.js';
import followerRouter from './routes/followerRoute.js';
import commentRouter from './routes/commentRoute.js';
import profileRouter from './routes/profileRoute.js';
import likeRouter from './routes/likeRoute.js';
import errorHandler from './middleware/error/errorHandler.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/records', recordRouter);
app.use('/api/v1/tags', tagRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/follows', followerRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/users', profileRouter);
app.use('/api/v1/likes', likeRouter);

// Error handler middleware
app.use(errorHandler);

// Handle invalid API routes
app.use('/api/v1', (req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Static files serving
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.log('Serving static files from the build directory.');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('Build directory not found. Assuming development environment.');

  app.get('*', (req, res) => {
    res.send('Development mode. Build folder not found.');
  });
}

const server = app.listen(process.env.PORT || 3003, () => {
  console.log(`Listening on port ${process.env.PORT || 3003}`);
});

// Graceful shutdown
let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) {
    console.log(`Already shutting down. Ignoring ${signal} signal.`);
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}. Shutting down gracefully...`);

  server.close((err) => {
    if (err) {
      console.error('Error shutting down the server:', err);
      process.exit(1);
    }
    console.log('Closed out remaining connections.');
    db.end((dbErr) => {
      if (dbErr) {
        console.error('Error closing the database connection:', dbErr);
        process.exit(1);
      }
      console.log('Database connection closed.');
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;


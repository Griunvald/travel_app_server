import express from 'express';
import 'dotenv/config';
import db from './db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
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

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/records', recordRouter);
app.use('/api/v1/tags', tagRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/follows', followerRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/users', profileRouter);
app.use('/api/v1/likes', likeRouter);
app.use(errorHandler);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(3003, () => {
  console.log('Listening on port 3003');
});

const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('Closed out remaining connections.');
    db.close(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


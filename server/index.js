import express from 'express';
import 'dotenv/config';
import db from './db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import tripRouter from './routes/tripRoute.js';
import recordRouter from './routes/recordRoute.js';
import tagRouter from './routes/tagRoute.js';
import fileRouter from './routes/fileRoute.js';
import followerRouter from './routes/followerRoute.js';
import commentRouter from './routes/commentRoute.js';
import profileRouter from './routes/profileRoute.js';
import errorHandler from './middleware/error/errorHandler.js';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  //origin: 'http://localhost:4173',  //production build preview
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/trips', tripRouter);
app.use('/api/v1/records', recordRouter);
app.use('/api/v1/tags', tagRouter);
app.use('/api/v1/files', fileRouter);
app.use('/api/v1/follow', followerRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/user/profile', profileRouter);
app.use(errorHandler);

app.listen(3003, () => {
  console.log('Listening on a port 3003');
});


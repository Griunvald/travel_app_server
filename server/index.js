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
app.use('/api/v1/trip', tripRouter);
app.use('/api/v1/record', recordRouter);
app.use('/api/v1/tag', tagRouter);
app.use('/api/v1/file', fileRouter);
app.use('/api/v1/follow', followerRouter);
app.use('/api/v1/comment', commentRouter);
app.use(errorHandler);

app.listen(3003, () => {
    console.log('Listening on a port 3003');
});


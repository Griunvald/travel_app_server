import express from 'express';
import 'dotenv/config';
import db from './db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import tripRouter from './routes/tripRoute.js';
import errorHandler from './middleware/error/errorHandler.js';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/trip', tripRouter);
app.use(errorHandler);

app.listen(3003, () => {
    console.log('Listening on a port 3003');
});


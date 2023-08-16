import express from 'express';
import 'dotenv/config';
import db from './db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
const app = express();

app.use(express.json());
app.use(coockieParser());
app.use('/api/v1/auth', authRouter);

app.listen(3003, () => {
    console.log('Listening on a port 3003');
});


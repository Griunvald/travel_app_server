import express from 'express';
import 'dotenv/config';
import db from './db.js';
import authRouter from './routes/authRoute.js';
const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);

app.listen(3003, () => {
    console.log('Listening on a port 3003');
});


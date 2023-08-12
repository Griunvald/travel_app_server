import express from 'express';
import 'dotenv/config';
import db from './db.js';

const app = express();


app.listen(3003, () => {
    console.log('Listening on a port 3003');
});


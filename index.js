import express, {json} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import userRouter from './routes/user-routes.js';
import authRouter from './routes/auth-routes.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};

//middleware
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, ()=>console.log(`Listening to port: ${PORT}`));
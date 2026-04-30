import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import {clerkMiddleware} from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from './inngest/index.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

await connectDB();

// Routes
app.get('/', (req, res) => {res.send('Welcome to the UCLan Movie Ticket App Server!');});
app.use('/api/inngest', serve({ client: inngest, functions }));

// Start the server
app.listen(port, () => {console.log(`Server is running on http://localhost:${port}`);});
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import showRouter from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhook.js';
import {clerkMiddleware} from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from './inngest/index.js';

const app = express();
const port = 3000;

//stripeWebhook
app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhook)


// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

await connectDB();


// Routes
app.get('/', (req, res) => {res.send('Welcome to the UCLan Movie Ticket App Server!');});
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRoutes)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

// Start the server
app.listen(port, () => {console.log(`Server is running on http://localhost:${port}`);});
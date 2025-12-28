import express from 'express';
import { config } from 'dotenv';
//routes import
import movieRouter from './routes/movie-routes.js';
import authRouter from './routes/auth-routes.js';
import watchlistRouter from './routes/watchlist-routes.js';
import { connectDB, disconnectDB } from './config/db.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  errorHandlerMiddleware,
  notFoundMiddleware,
} from './middlewares/error-middleware.js';
config();
connectDB();

const app = express();
//security
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
//parsing body middlewares\

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
//routes
app.use('/movies', movieRouter);
app.use('/auth', authRouter);
app.use('/watchlist', watchlistRouter);

//error handler and not found
// 404 handler for undefined routes (AFTER all routes)
app.use(notFoundMiddleware);

// Global error handler (MUST be last)
app.use(errorHandlerMiddleware);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//handle gracefull shutdown on SIGTERM
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

import express from 'express';
import { config } from 'dotenv';
import movieRouter from './routes/movie-routes.js';
import { connectDB, disconnectDB } from './config/db.js';
config();
connectDB();

const app = express();

//routes
app.use('/movies', movieRouter);

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
    process.exit(0);
  });
});

import express from 'express';
import { addToWatchlist } from '../controllers/watchlist-controller.js';
const router = express.Router();

router.route('/').post(addToWatchlist);

export default router;

import express from 'express';
import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from '../controllers/watchlist-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
const router = express.Router();
router.use(authMiddleware);
router.route('/').post(addToWatchlist);
router.route('/:id').delete(removeFromWatchlist).put(updateWatchlistItem);
export default router;

import express from 'express';
import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from '../controllers/watchlist-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import {
  addToWatchlistSchema,
  updateWatchlistItemSchema,
} from '../validators/watchlist-validators.js';
import validateRequest from '../middlewares/validate-request.js';
const router = express.Router();
router.use(authMiddleware);
router.route('/').post(validateRequest(addToWatchlistSchema), addToWatchlist);
router
  .route('/:id')
  .delete(removeFromWatchlist)
  .put(validateRequest(updateWatchlistItemSchema), updateWatchlistItem);
export default router;

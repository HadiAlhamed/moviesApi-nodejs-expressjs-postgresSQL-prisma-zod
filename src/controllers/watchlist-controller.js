import { prisma } from '../config/db.js';
import { StatusCodes } from 'http-status-codes';
const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;
  try {
    //check if movie does not exist
    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });
    if (!movie) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Movie with Id ${movieId} does not exist` });
    }
    //check if movie is already in the watchlist
    const isInWatchlisht = await prisma.WatchlistItem.findUnique({
      where: {
        userId_movieId: {
          userId: req.user.id,
          movieId: movieId,
        },
      },
    });
    if (isInWatchlisht) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Movie with Id ${movieId} is already in current user watchlist`,
      });
    }

    //all is good
    const watchlistItem = await prisma.watchlistItem.create({
      data: {
        userId: req.user.id,
        movieId,
        status: status || 'PLANNED',
        rating,
        notes,
      },
    });
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        watchlistItem,
      },
    });
  } catch (error) {
    console.error(`Error while adding movie to watchlist : ${error}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error while adding movie to watchlist' });
  }
};
const removeFromWatchlist = async (req, res) => {
  const itemId = req.params.id;
  try {
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: {
        id: itemId,
      },
    });
    if (!watchlistItem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Watchlist item not found' });
    }

    if (watchlistItem.userId !== req.user.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'Not allowed to delete this watchlist item' });
    }

    await prisma.watchlistItem.delete({
      where: {
        id: itemId,
      },
    });
    return res
      .status(StatusCodes.OK)
      .json({ status: 'success', message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Error while deleting watchlist item:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'failed to delete watchlist item' });
  }
};

const updateWatchlistItem = async (req, res) => {
  const itemId = req.params.id;
  const { rating, notes, status } = req.body;
  try {
    const existingItem = await prisma.watchlistItem.findUnique({
      where: {
        id: itemId,
      },
    });
    if (!existingItem) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Watchlist item not found' });
    }
    if (existingItem.userId !== req.user.id) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'Not allowed to update this watchlist item' });
    }
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (notes !== undefined) updateData.notes = notes;
    if (rating !== undefined) updateData.rating = rating;
    const updatedItem = await prisma.watchlistItem.update({
      data: {
        ...updateData,
      },
      where: {
        id: itemId,
      },
    });
    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        watchlistItem: updatedItem,
      },
    });
  } catch (error) {
    console.error('Error while updating watchlist item:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'failed to update watchlist item' });
  }
};

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem };

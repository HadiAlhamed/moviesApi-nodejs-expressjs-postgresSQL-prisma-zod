import { prisma } from '../config/db.js';
import { StatusCodes } from 'http-status-codes';
const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes, userId } = req.body;
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
          userId: userId,
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
        userId,
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

// const addToWatchlist = async (req, res) => {};

// const addToWatchlist = async (req, res) => {};

// const addToWatchlist = async (req, res) => {};

export { addToWatchlist };

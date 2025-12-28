import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { StatusCodes } from 'http-status-codes';
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else {
    //no token
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Not authorized , no token was provided' });
  }
  try {
    //verify token is valid and get userid
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Not authorized , user no longer exists' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in auth middleware : ${error}`);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Not authorized , token failed' });
  }
};
export default authMiddleware;

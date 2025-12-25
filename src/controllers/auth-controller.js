import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/db.js';
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'please provide name , email and password' });
  }
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          'user already exists with this email, please use different email',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name,
          email,
        },
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error during registration' });
  }
};
const login = async (req, res) => {};

export { register, login };

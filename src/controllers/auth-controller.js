import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/db.js';
import generateToken from '../utils/generate-token.js';
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
    const token = await generateToken(user.id, res);
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      token,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error during registration' });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'user with these credentials does not exist' });
    }
    //check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Invalid Credentials , incorrect password' });
    }
    const token = await generateToken(user.id, res);
    res.status(StatusCodes.OK).json({
      status: 'success',
      token,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error during login' });
  }
};

const logout = async (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ status: 'success', message: 'Logged out successfully' });
};

export { register, login, logout };

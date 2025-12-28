import express from 'express';
import { register, login, logout } from '../controllers/auth-controller.js';
import validateRequest from '../middlewares/validate-request.js';
import { registerSchema, loginSchema } from '../validators/auth-validators.js';
const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);

export default router;

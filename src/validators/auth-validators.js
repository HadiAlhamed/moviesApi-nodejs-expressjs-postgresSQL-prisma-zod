import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Please provide a valid email'),
  password: z
    .string()
    .min(1, 'Password is Required')
    .min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please provide a valid email')
    .toLowerCase(),
  password: z.string().min(1, 'Password is Required'),
});

export { registerSchema, loginSchema };

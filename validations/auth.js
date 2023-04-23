import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password should be a minimum of 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Enter your name').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong image URL').optional().isURL(),
];

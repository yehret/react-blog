import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password should be a minimum of 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Enter your name').isLength({ min: 3 }),
  body('avatarUrl', 'Wrong image URL').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password should be a minimum of 5 symbols').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Enter post title').isLength({ min: 3 }).isString(),
  body('text', 'Enter post description').isLength({ min: 10 }).isString(),
  body('tags', 'Wrong tags format (enter an array)').optional().isString(),
  body('imageUrl', 'Wrong image URL').optional().isString(),
];

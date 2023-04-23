import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { validationResult } from 'express-validator';
import { registerValidation } from './validations/auth.js';

import UserModel from './models/User.js';

mongoose
  .connect(
    'mongodb+srv://serge:R6XXezMn8BeFy5lz@cluster0.eww0rwe.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('DB is connected');
  })
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return req.status(404).json({
        message: 'User not found',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return req.status(404).json({
        message: 'Wrong login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'hornydog',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Authorization failed',
    });
  }
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    // If Error
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    // If there is no errors

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'hornydog',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Registration failed',
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server is working');
});

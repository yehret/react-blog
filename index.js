import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
// import queryParser from 'query-parser';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB is connected');
  })
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

//ROUTES
// USER ROUTES
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// POST ROUTES
app.get('/posts', PostController.getAllPosts);
app.get('/posts/:id', PostController.getPost);
app.delete('/posts/:id', checkAuth, PostController.deletePost);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.updatePost,
);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.createPost,
);
app.post('/posts/comment/:id', checkAuth, PostController.addComment);
// POST SORTED BY POPULAR
app.get('/posts', PostController.getAllPosts);

// POST TAGS
app.get('/tags', PostController.getLastTags);

// UPLOAD ROUTE
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(process.env.POST || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server is working');
});

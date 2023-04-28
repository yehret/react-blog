import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
<<<<<<< HEAD

=======
>>>>>>> 05c7a2a08c17ff9486dc6a6570383a9639328cf7
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(
    'mongodb+srv://serge:R6XXezMn8BeFy5lz@cluster0.9p7ruuj.mongodb.net/?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('DB is connected');
  })
  .catch((err) => console.log('DB error', err));

const app = express();
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
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

app.get('/', (req, res) => {
  res.json({
    message: 'hi',
  });
});

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
<<<<<<< HEAD

// POST TAGS
app.get('/tags', PostController.getLastTags);
=======
>>>>>>> 05c7a2a08c17ff9486dc6a6570383a9639328cf7

// UPLOAD ROUTE
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server is working');
});

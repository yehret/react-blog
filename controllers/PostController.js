import PostModel from '../models/Post.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); // Connection to another table;

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post creation failed',
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    ).then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json(doc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Unsuccessful',
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({
      _id: postId,
    }).then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.json({
        message: 'Post has been deleted',
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Unsuccessful',
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post creation failed',
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    );

    res.json({
      message: 'Update has been succeed',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'An error has occurred',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec(); // Connection to another table;

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Post creation failed',
    });
  }
};

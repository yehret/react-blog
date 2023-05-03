import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({
        path: 'user',
        select: '-passwordHash',
      })
      .populate({
        path: 'comments',
        populate: { path: 'user', select: '-passwordHash -createdAt -updatedAt' },
      })
      .exec(); // Connection to another table;   populate({ path: "user", select: ["name", "avatar"] })

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
    const post = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate({
        path: 'user',
        select: '-passwordHash',
      })
      .populate({
        path: 'comments',
        populate: { path: 'user', select: '-passwordHash -createdAt -updatedAt' },
      })
      .exec();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
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

export const addComment = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = {
      user: user,
      text: req.body.text,
    };

    post.comments.unshift(comment);
    await post.save().then((doc) =>
      doc.populate({
        path: 'comments',
        populate: { path: 'user', select: '-passwordHash -createdAt -updatedAt' },
      }),
    );

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

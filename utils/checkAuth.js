import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123215521kasghaliw');

      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'No permission',
      });
    }
  } else {
    return res.status(403).json({
      message: 'No permission',
    });
  }
};

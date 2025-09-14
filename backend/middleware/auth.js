import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_12345';
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_12345';
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

import jwt from 'jsonwebtoken';

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) return null;
  const [, token] = authorizationHeader.split(' ');
  return token || null;
};

export const authenticateToken = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }

  return next();
};

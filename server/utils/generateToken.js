const jwt = require('jsonwebtoken');

/**
 * Signs a JWT carrying the minimum claims needed to identify and authorize
 * the user. Never embed sensitive data (password hash, etc.) in the payload
 * since JWTs are only signed, not encrypted.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;

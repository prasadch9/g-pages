const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { submitContactMessage } = require('../controllers/contactController');
const validate = require('../middleware/validate');

const router = express.Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages. Please try again later.' },
});

router.post(
  '/',
  contactLimiter,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Enter your name.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('subject').trim().isLength({ min: 3, max: 120 }).withMessage('Enter a subject.'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters.'),
  validate,
  submitContactMessage
);

module.exports = router;
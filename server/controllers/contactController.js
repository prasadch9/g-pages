const sendEmail = require('../utils/sendEmail');

const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const safeSubject = subject.replace(/[\r\n]+/g, ' ');

    await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: { name, address: email },
      subject: `Google Pages contact: ${safeSubject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${safeSubject}\n\n${message}`,
    });

    res.status(200).json({ success: true, message: 'Your message has been sent.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContactMessage };
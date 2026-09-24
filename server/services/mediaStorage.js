const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const extensionFor = (file) => path.extname(file.originalname || '').toLowerCase() || (file.mimetype.split('/')[1] ? `.${file.mimetype.split('/')[1]}` : '');

const storeUpload = (file) => {
  const filename = `${crypto.randomUUID()}${extensionFor(file)}`;
  const target = path.join(uploadDirectory, filename);
  fs.writeFileSync(target, file.buffer);
  return { url: `/uploads/${filename}`, filename, mimeType: file.mimetype, size: file.size };
};

const removeUpload = (url) => {
  if (!url || !url.startsWith('/uploads/')) return;
  const filename = path.basename(url);
  const target = path.join(uploadDirectory, filename);
  if (target.startsWith(uploadDirectory)) fs.rmSync(target, { force: true });
};

module.exports = { storeUpload, removeUpload };

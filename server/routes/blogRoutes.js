const express = require('express');
const { getBlogMeta, getPublishedBlog, listPublishedBlogs } = require('../controllers/blogController');

const router = express.Router();

router.get('/', listPublishedBlogs);
router.get('/meta', getBlogMeta);
router.get('/:slug', getPublishedBlog);

module.exports = router;

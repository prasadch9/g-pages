const express = require('express');
const { getPublicSettings } = require('../controllers/siteSettingsController');

const router = express.Router();

router.get('/public', getPublicSettings);

module.exports = router;
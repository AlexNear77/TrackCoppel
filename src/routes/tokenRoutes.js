const express = require('express');
const { getToken } = require('../controllers/tokenController');

const router = express.Router();

router.get('/token', getToken);

module.exports = router;
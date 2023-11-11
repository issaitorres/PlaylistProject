const express = require('express');
const router = express.Router();
const spotifyLoginController = require('../controllers/spotifyLoginController');

router.post('/', spotifyLoginController.handleLogin);
router.post('/accessToken', spotifyLoginController.getAccessToken);

module.exports = router;
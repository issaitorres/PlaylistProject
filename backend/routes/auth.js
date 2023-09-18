const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const playlistsController = require('../controllers/playlistsController');

router.post('/', authController.handleLogin);
// delete playlists that havent been updated in a week
// http://localhost:3500/login/deletepastweek - need a proper location for this
// router.delete('/deletepastweek', playlistsController.deletePlaylistObjectsNotUpdatedInPastWeek)


module.exports = router;
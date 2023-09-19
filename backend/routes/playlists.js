const express = require('express');
const router = express.Router();
const playlistsController = require('../controllers/playlistsController');

router
    .get('/', playlistsController.getAllPlaylists)
    .get('/user', playlistsController.getMyPlaylists)
    .post('/', playlistsController.addPlaylist)
    .delete('/', playlistsController.deletePlaylistAndDissociateUserWithPlayListId)
    .post('/refresh', playlistsController.refreshPlaylist)

    // .patch('/', playlistsController.updatePlaylistById)


module.exports = router;
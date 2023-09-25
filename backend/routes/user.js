const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.patch('/', userController.updateUser)
router.delete('/deletemyplaylists', userController.deleteMyPlaylists)

module.exports = router
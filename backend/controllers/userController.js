const { User } = require('../model/User')
const { Playlist } = require('../model/Playlist')
const bcrypt = require('bcrypt');


const updateUser = async (req, res) => {
    const { email, username, oldPassword, newPassword } = req.body
    const mongoUserId = req.mongoUserId
    const userObject = await User.findOne({ _id: mongoUserId }).exec()

    const oldEmail = userObject.email
    const oldusername = userObject.userName

    if(oldusername != username) {
        userObject.userName = username
    }

    // check if email is unique
    if(oldEmail != email) {
        const userWithDuplicateEmail = await User.findOne({ email: email }).exec()

        if(userWithDuplicateEmail == null) {
            userObject.email = email
        } else {
            return res.status(404).json({"message": "Email address has already taken"})
        }
    }


    if(oldPassword && newPassword) {
        const match = await bcrypt.compare(oldPassword, userObject.password)
        if(match) {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            userObject.password = hashedPassword
        }
    } else {
        if(!oldPassword && !newPassword) {

        } else {
            // this is handled on client side but just in case
            return res.status(404).json({"message": "Need both old and new password to update to new password"})
        }
    }

    const result = await userObject.save()

    res.status(200).json({
         'newUsername': result.userName,
         'newEmail': result.email
    })
}

const deleteMyPlaylists = async (req, res) => {
    const mongoUserId = req.mongoUserId
    var playlistObjectsToDelete = []
    const userObject = await User.findOne({ _id: mongoUserId }).exec()

    var multipleIds = userObject.userPlaylistObjectIds.map((playlistObjectId) => { return { _id: playlistObjectId } })
    if (multipleIds.length) {
        const playlistObjects = await Playlist.find({ "$or":  multipleIds })
        for (const playlistObject of playlistObjects) {
            if(playlistObject.userOwner.length == 1) {
                playlistObjectsToDelete.push(playlistObject._id)
                // try playlistObject._id.toString()
            } else {
                const newOwners = playlistObject.userOwner.filter((user) => user != mongoUserId)
                playlistObject.userOwner = newOwners
                const resPlaylistObject = await playlistObject.save()
            }
        }

        if(playlistObjectsToDelete) {
            const resDeleteMany = await Playlist.deleteMany({ _id: { $in: playlistObjectsToDelete } });
        }

        userObject.userPlaylistObjectIds = []
        const resSave = await userObject.save()
    } else {
        return res.status(204).json({ 'message': "nothing to delete" })
    }

    return res.status(200).json({ 'message': "success" })
}


module.exports = { updateUser, deleteMyPlaylists }

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userPlaylistObjectIds: [{
        type: Array,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'playlists'
        }
    }],
    refreshToken: {
        type: String
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User }


// major model change
// essentially userPlaylistObjectIds would store only an array of ids
// but then we had to do extra steps to format it properly to then pass
// into the request to find the playlist in getMyPlaylists
// instead now userPlaylistObjectIds stores an object containing key _id and 
// value of the playlistobjectid and this serves as that extra step
// where it is formatted correctly
// changes can be found here --------------------------
// user.js model - userPlaylistObjectIds
// playlistscontrollers - addPlaylistObjectIdToUserPlaylistObjectIds
// playlistscontrollers - getMyPlaylists


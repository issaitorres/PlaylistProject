const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema(
    {
        playlistId: {
            type: String,
            required: true
        },
        userOwner: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        }],
        playlistName: String,
        playlistOwner: String,
        playlistImage: String,
        totalTracks: Number,
        snapshotId: String,
        playlistDuplicates: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        },
        trackTable: {
            type: Array,
            of: mongoose.Schema.Types.Mixed
        }
    },
    {
        timestamps: true
    }
)

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = { Playlist }

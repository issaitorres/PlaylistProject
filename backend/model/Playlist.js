const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    playlistId: {
        type: String,
        required: true
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    playlistName: String,
    playlistOwner: String,
    playlistImage: String,
    songCount: Number,
    artistCount: Number,
    topGenre: [String], 
    topArtist: [String],
    topYear: [Number],
    playlistDuration: Number,
    averageTrackDuration: Number,
    shortestTrack: {
        type: Map,
        of: String
    },
    longestTrack: {
        type: Map,
        of: String
    },
    genreFrequency: {
        type: Map,
        of: [{
            type: String
        }]
    },
    // yearFrequency: {
    //     type: Map,
    //     of: [{
    //         type: Map,
    //         of: String
    //     }]
    // },
    yearFrequency: {
        type: Map,
        of: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    },
    artistPopularity: [{
        type: Map,
        of: String
    }],
    artistSongsInfo: {
        type: Map,
        of: {
            type: Map,
            of: mongoose.Schema.Types.Mixed
        }
    }
})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = { Playlist }

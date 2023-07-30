const { Playlist } = require('../model/Playlist')
const { User } = require('../model/User')
const { getPlaylistInfo } = require('../config/playlistInformation')


const getAllPlaylists = async (req, res) => {
    const playlists = await Playlist.find()

    if (!playlists || !playlists.length){
        return res.status(204).json({ 'message': 'No playlists found'})
    } 

    res.json(playlists)
}


//user 1 { "playlistId": "3cT4tGoRr5eC3jGUZT5MTD" } { "playlistId": "5WRysPh2irCupBRNBWq48l" }
//user 2 { "playlistId": "37i9dQZF1F0sijgNaJdgit" } { "playlistId": "1EPm5HSeYnoKwXVUyXKFxe" }
const addPlaylist = async (req, res) => {
    const { playlistId } = req.body
    const mongoUserId = req.mongoUserId
    if (!playlistId || !mongoUserId) return res.status(400).json({ 'message': 'missing playlistID or mongoUserId' })
    
    // check if playlistObject already exists
    const playlistObject = await Playlist.findOne({ playlistId: playlistId }).exec()
    if(playlistObject) {
        addPlaylistObjectIdToUserPlaylistObjectIds(mongoUserId, playlistObject._id)
        res.status(200).json({ 'message' : 'added playlist object id added to userPlaylistObjectIds if not there' })
    } else {
        const playlistInfo = await getPlaylistInfo(playlistId)
        const playlistObject = await Playlist.create({
            playlistId: playlistId,
            userOwner: mongoUserId,
            playlistName: playlistInfo.playlistName,
            playlistOwner: playlistInfo.playlistOwner,
            playlistImage: playlistInfo.playlistImage,
            songCount: playlistInfo.songCount,
            artistCount: playlistInfo.artistCount,
            topArtist: playlistInfo.topArtist,
            topGenre: playlistInfo.topGenre,
            topYear: playlistInfo.topYear,
            playlistDuration: playlistInfo.totalDuration,
            averageTrackDuration: playlistInfo.averageDuration,
            shortestTrack: playlistInfo.shortestDurationandName,
            longestTrack: playlistInfo.longestDurationandName,
            artistFrequency: playlistInfo.artistFrequency,
            genreFrequency: playlistInfo.genreFrequency,
            yearFrequency: playlistInfo.yearFrequency,
            artistPopularity: playlistInfo.artistPopularity
        })

        addPlaylistObjectIdToUserPlaylistObjectIds(mongoUserId, playlistObject._id)
        res.status(200).json({ 'message' : 'New playlist object created and id added to userPlaylistObjectIds' })
    }
}


// get all playlist objects for specific user
const getMyPlaylists = async (req, res) => {
    const mongoUserId = req.mongoUserId
    const userObject = await User.findOne({ _id: mongoUserId }).exec()

    // const newUserPlaylistObjectIds = userObject.userPlaylistObjectIds.map((p) => p.toString())
    // newUserPlaylistObjectIds.map((p) => p.toString())
    // const properForm = []
    // newUserPlaylistObjectIds.map((p) => properForm.push({"_id": p}))
    // const playlistObjects = await Playlist.find({
    //     "$or":  properForm
    // })

    try {
        const playlistObjects = await Playlist.find({
            "$or":  userObject.userPlaylistObjectIds
        })

        res.status(200).json(playlistObjects)
    } catch (err) {
        res.status(200).json({ 'message' : `some error` })

    }
}


const disassociateUserFromPlaylistById = async (req, res) => {
    const mongoUserId = req.mongoUserId
    const playlistObjectId = req.body.playlistObjectId

    if (!mongoUserId || !playlistObjectId) return res.status(400).json({ 'message': 'missing playlistObjectId or mongoUserId' })

    const userObject = await User.findOne({ _id: mongoUserId }).exec()

    if(userObject.userPlaylistObjectIds.includes(playlistObjectId)) {
        const newPlaylistObjectIds = userObject.userPlaylistObjectIds.filter((object) => object.toString() !== playlistObjectId)

        userObject.userPlaylistObjectIds = newPlaylistObjectIds

        const result = await userObject.save()
        res.status(200).json({ 'message': 'delete successful'})
    } else {
        res.status(200).json({ 'message' : 'couldn\'t find that playlistId'})

    }
}

const addPlaylistObjectIdToUserPlaylistObjectIds = async (mongoUserId, playlistObjectId) => {
    const user = await User.findOne({ _id: mongoUserId})

    if(!user.userPlaylistObjectIds.includes(playlistObjectId)) {
        const obj = { _id: playlistObjectId}
        user.userPlaylistObjectIds.push(obj)

        // user.userPlaylistObjectIds.push(playlistObjectId)
        const result = await user.save()
    } 
}

module.exports = { getAllPlaylists, addPlaylist, getMyPlaylists, disassociateUserFromPlaylistById }




// don't think I'll really have an option to update a playlistId with a new one
// we can still do updates on a user page where we can update email, first, last name, and password  

// { "oldPlaylistId": "3cT4tGoRr5eC3jGUZT5MTD", "newPlaylistId": "5WRysPh2irCupBRNBWq48l" }
// const updatePlaylistById = async (req, res) => {
//     const mongoUserId = req.mongoUserId
//     const oldPlaylistId = req.body.oldPlaylistId
//     const newPlaylistId = req.body.newPlaylistId


//     if (!mongoUserId || !oldPlaylistId || !newPlaylistId) return res.status(400).json({ 'message': 'missing oldPlaylistID or newPlaylistId or mongoUserId' })
//     const playlistObject = await Playlist.findOne({ mongoUserId: mongoUserId }).exec()

//     if(playlistObject.playlistIds.includes(oldPlaylistId)) {

//         const indexOldPlaylist = playlistObject.playlistIds.indexOf(oldPlaylistId)

//         playlistObject.playlistIds[indexOldPlaylist] = newPlaylistId
//         const result = await playlistObject.save()

//         res.status(200).json({ 'message': 'update succesful'})
//     } else {
//         res.status(200).json({ 'message' : `couldn't find that oldPlaylistId to update` })
//     }
// }

    // const result = async () => {
    //     const result2 = Promise.all(
    //         userObject.userPlaylistObjectIds.map(async (id) => {

    //             const playlist = await Playlist.findById(id).exec()
    //             playlistObjects.push(playlist)
    //         })
    //     )
    //     return result2

    // }

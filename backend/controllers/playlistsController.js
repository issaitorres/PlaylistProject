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


const addPlaylist = async (req, res) => {
    const { playlistId } = req.body
    const mongoUserId = req.mongoUserId
    if (!playlistId || !mongoUserId) return res.status(400).json({ 'message': 'missing playlistID or mongoUserId' })

    // check if playlistObject already exists
    const playlistObject = await Playlist.findOne({ playlistId: playlistId }, excludedProperties).exec()
    if(playlistObject) {
        res.status(200).json(playlistObject)
        addPlaylistObjectIdToUserPlaylistObjectIds(mongoUserId, playlistObject._id)
        addUserIdToPlaylistObjectOwnerUser(mongoUserId, playlistObject._id)
    } else {
        const playlistInfo = await getPlaylistInfo(playlistId)
        const playlistObject = await Playlist.create({
            playlistId: playlistId,
            userOwner: mongoUserId,
            playlistName: playlistInfo.playlistName,
            playlistOwner: playlistInfo.playlistOwner,
            playlistImage: playlistInfo.playlistImage,
            totalTracks: playlistInfo.totalTracks,
            snapshotId: playlistInfo.snapshotId,
            playlistDuplicates: playlistInfo.duplicates,
            trackTable: playlistInfo.trackTable
        })

        // filter out the excludedProperties by only returning properties we need
        const filteredPlaylistObject = {
            _id: playlistObject._id,
            playlistId: playlistObject.playlistId,
            playlistName: playlistObject.playlistName,
            playlistOwner: playlistObject.playlistOwner,
            playlistImage: playlistObject.playlistImage,
            playlistDuplicates: playlistObject.playlistDuplicates,
            trackTable: playlistObject.trackTable
        }

        res.status(200).json(filteredPlaylistObject)
        addPlaylistObjectIdToUserPlaylistObjectIds(mongoUserId, playlistObject._id)
    }
}


// get all playlist objects for specific user
const getMyPlaylists = async (req, res) => {
    const mongoUserId = req.mongoUserId
    const userObject = await User.findOne({ _id: mongoUserId }).exec()
    try {
        var multipleIds = userObject.userPlaylistObjectIds.map((playlistObjectId) => { return { _id: playlistObjectId } })
        const playlistObjects = await Playlist.find({ "$or":  multipleIds }, excludedProperties)
        res.status(200).json(playlistObjects)
    } catch (err) {
        res.status(500).json({ 'message' : 'Invalid playlist object id(s)' })
    }
}

const refreshPlaylist = async (req, res) => {
    const { playlistId } = req.body
    const mongoUserId = req.mongoUserId

    if (!playlistId || !mongoUserId) return res.status(400).json({ 'message': 'missing playlistID or mongoUserId' })

    const playlistObject = await Playlist.findOne({ playlistId: playlistId }, excludedProperties).exec()
    if(playlistObject) {
        var playlistInfo = await getPlaylistInfo(playlistId, playlistObject.snapshotId)

        if(playlistInfo) {
            const result = await playlistObject.updateOne({
                playlistName: playlistInfo.playlistName,
                playlistOwner: playlistInfo.playlistOwner,
                playlistImage: playlistInfo.playlistImage,
                totalTracks: playlistInfo.totalTracks,
                snapshotId: playlistInfo.snapshotId,
                playlistDuplicates: playlistInfo.duplicates,
                trackTable: playlistInfo.trackTable
            })

            // filter out the excludedProperties by only returning properties we need
            const filteredPlaylistObject = {
                _id: playlistObject._id,
                playlistId: playlistId,
                playlistName: playlistInfo.playlistName,
                playlistOwner: playlistInfo.playlistOwner,
                playlistImage: playlistInfo.playlistImage,
                playlistDuplicates: playlistInfo.duplicates,
                trackTable: playlistInfo.trackTable
            }

            res.status(200).json(filteredPlaylistObject)
        } else {
            res.status(204).json({ 'message' : 'no refresh needed'})
        }

    } else {
        res.status(404).json({ 'message' : 'Could not find the the playlistobject we wanted to update'})
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


const deletePlaylistAndDissociateUserWithPlayListId = async (req, res) => {
    const mongoUserId = req.mongoUserId
    const playlistObjectId = req.body.playlistObjectId

    if (!mongoUserId || !playlistObjectId) return res.status(400).json({ 'message': 'missing playlistObjectId or mongoUserId' })

    const userObject = await User.findOne({ _id: mongoUserId }).exec()

    if(userObject.userPlaylistObjectIds.includes(playlistObjectId)) {
        const newUserPlaylistObjectIds = userObject.userPlaylistObjectIds.filter((userPlaylistObjectId) => userPlaylistObjectId !=  playlistObjectId)
        userObject.userPlaylistObjectIds = newUserPlaylistObjectIds

        const result = await userObject.save()

        const playlistObject = await Playlist.findOne({ _id: playlistObjectId }).exec()

        if(playlistObject.userOwner.includes(mongoUserId) && playlistObject.userOwner.length == 1) {
            const deletedResult = await Playlist.deleteOne({ _id: playlistObjectId })
        } else {
            // PlaylistObject has multiple owners so only remove an owner
            const newUserOwner = playlistObject.userOwner.filter((userOwnerId) => userOwnerId != mongoUserId)
            playlistObject.userOwner = newUserOwner
            const result = await playlistObject.save()
        }

        res.status(200).json({ 'message': 'delete successful'})
    } else {
        res.status(200).json({ 'message' : 'couldn\'t find that playlistId'})
    }
}


const addPlaylistObjectIdToUserPlaylistObjectIds = async (mongoUserId, playlistObjectId) => {
    const user = await User.findOne({ _id: mongoUserId})

    if(!user.userPlaylistObjectIds.includes(playlistObjectId)) {
        user.userPlaylistObjectIds.push(playlistObjectId._id)
        const result = await user.save()
    } 
}


const addUserIdToPlaylistObjectOwnerUser = async (mongoUserId, playlistObjectId) => {
    const playlistObject = await Playlist.findOne({ _id: playlistObjectId})

    if(!playlistObject.userOwner.includes(mongoUserId)) {
        playlistObject.userOwner.push(mongoUserId)
        const result = await playlistObject.save()
    }
}


const deletePlaylistObjectsNotUpdatedInPastWeek = async (req, res) => {
    var weekAgoDate = new Date();
    weekAgoDate.setDate(weekAgoDate.getDate() - 7) // for last week
    // weekAgoDate.setHours(weekAgoDate.getHours() - 1) // for last hour

    // $gt - would be anything from past x days until now
    // $lt - would be anything in the past x+ days
    const deletedPlaylists = await Playlist.deleteMany({"updatedAt": {$lt: weekAgoDate}})

    res.status(200).json({ 'message': 'deleted all playslists one week old and older if any'})
}


const excludedProperties = {
    userOwner: 0,
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
    totalTracks: 0,
    snapshotId: 0
}


module.exports = {
    getAllPlaylists,
    addPlaylist,
    getMyPlaylists,
    disassociateUserFromPlaylistById,
    deletePlaylistAndDissociateUserWithPlayListId,
    deletePlaylistObjectsNotUpdatedInPastWeek,
    refreshPlaylist
}

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
            console.log("\n res status set 2")

            return res.status(404).json({"message": "Need both old and new password to update to new password"})
        }
    }


    const result = await userObject.save()

    res.status(200).json({
         'newusername': result.userName,
         'newemail': result.email
    })
}

const deleteMyPlaylists = async (req, res) => {
    const mongoUserId = req.mongoUserId
    var playlistObjectsToDelete = []
    const userObject = await User.findOne({ _id: mongoUserId }).exec()

    var multipleIds = userObject.userPlaylistObjectIds.map((playlistObjectId) => { return { _id: playlistObjectId } })
    const playlistObjects = await Playlist.find({ "$or":  multipleIds })


    for (const playlistObject of playlistObjects) {
        if(playlistObject.userOwner.length == 1) {
            playlistObjectsToDelete.push(playlistObject._id.toString() ) // try without toString() afterwards
        } else {
            const newOwners = playlistObject.userOwner.filter((user) => user != mongoUserId)
            playlistObject.userOwner = newOwners
            const res3 = await playlistObject.save()
        }
    }

    if(playlistObjectsToDelete) {
        console.log("\n\n\n\n these are the objects we will delete since only one owner")
        console.log(playlistObjectsToDelete)

        const resDeleteMany = await Playlist.deleteMany({ _id: { $in: playlistObjectsToDelete } }); 
        console.log("\n\n\n resDeleteMany here")
        console.log(resDeleteMany)
    }

    console.log("\n\n\n reached here 600")

    // set user userPlaylistObjectIds to empty array here!!!!!!
    // res cannot be sharing names with other stuff named res
    userObject.userPlaylistObjectIds = []
    const resSave = await userObject.save()

    console.log("\n\n\n reached here 700")


    return res.status(200).json({ 'message': "success" })
}





module.exports = { updateUser, deleteMyPlaylists }





    // playlistObjects.forEach((playlistObject) => {
    //     // console.log("\n\n\n\n here is a single playlist objet")
    //     // console.log(playlistObject.userOwner)
    //     // console.log(playlistObject.userOwner.length)
    //     // console.log(typeof(playlistObject.userOwner))})

    //     if(playlistObject.userOwner.length == 1) {
    //         console.log("\n\n\n\n\n this playlistObject only has one user")
    //         console.log(playlistObject.userOwner)
    //     } else {
    //         console.log("\n\n\n\n this playlistObject has mulitple users")
    //         console.log(playlistObject.userOwner)
    //         const newOwners = playlistObject.userOwner.filter((user) => user != mongoUserId)

    //         console.log("\n this newOwners")
    //         console.log(newOwners)
    //         playlistObject.userOwner = newOwners
    //         await playlistObject.save()

    //     }
    // })


    // const newPlaylistObjectIds = userObject.userPlaylistObjectIds.filter((object) => object.toString() !== playlistObjectId)


    

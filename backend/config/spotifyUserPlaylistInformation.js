const axios = require('axios');
const { getPlaylistInfo } = require('../config/playlistInformation')


const getUserPlaylists = async (accessToken) => {
    // for now we'll get 20 of the user's playlists at a time but then
    // we'll bump it to 50
    var spotifyUserPlaylistsEndpoint = "https://api.spotify.com/v1/me/playlists"
    var userPlaylists = []
    var filteredUserPlaylists = []
    var next

    var loop = true
    while(loop) {
        var res
        try {
            res = await axios.get(spotifyUserPlaylistsEndpoint, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        } catch (err) {
            console.log(err)
            return false
        }

        userPlaylists = userPlaylists.concat(res.data.items)
        next = res.data.next
        if(next == null) {
            loop = false
        } else {
            spotifyUserPlaylistsEndpoint = next
        }
    }


    // only return the information we need for now
    // playlist id, first image, playlistname and author
    userPlaylists.forEach((playlist) => {
        filteredUserPlaylists.push(
            {
                "playlistId": playlist.id,
                "playlistName": playlist.name,
                "playlistImage": playlist?.images[0]?.url,
                "playlistOwner": playlist.owner.display_name,
                "playlistTrackCount": playlist.tracks.total
            }
        )
    })

    return filteredUserPlaylists
}

const getUserDisplayName = async (accessToken) => {
    const spotifyUserProfileEndpoint = "https://api.spotify.com/v1/me"

    var res
    try {
        res = await axios.get(spotifyUserProfileEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    } catch (err) {
        console.log(err)
        return false
    }

    return {
        displayName: res?.data?.display_name,
        spotifyUserUrl: res?.data?.external_urls?.spotify
    }

}

module.exports = {
    getUserPlaylists,
    getUserDisplayName
}

const axios = require('axios');
const { GenerateAccessTokenOrGetFromEnvVar } = require('./GetAccessToken')


const getPlaylistInfo = async (
    playlistId,
    refreshPlaylistId=false,
    accessTokenWithScope=false,
    likedSongsEndpoint=false
    ) => {
    var accessToken
    if(!accessTokenWithScope) {
        // access token without scope
        accessToken = await GenerateAccessTokenOrGetFromEnvVar()
    } else {
        // access token with scope
        accessToken = accessTokenWithScope
    }
    var spotify_playlists_endpoint = `https://api.spotify.com/v1/playlists/${playlistId}`
    if(likedSongsEndpoint) {
        spotify_playlists_endpoint = "https://api.spotify.com/v1/me/tracks"
    }

    var trackTable = []
    const playlistArtistIds = new Set()
    const playlistAlbumIds = new Set()
    var playlistInfo = {}
    var items
    var next
    var playlistName
    var playlistOwner
    var playlistImage
    var totalTracks
    var snapshotId

    var playlistPosition = 1
    var loop = true
    while(loop) {
        var res
        try {
            res = await axios.get(spotify_playlists_endpoint, {
                params: { limit: 50 },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        } catch (err) {
            console.log(err)
            // playlist id not found
            if(err.response.status == 404) {
                return false
            }
        }


        if(refreshPlaylistId) {
            if(refreshPlaylistId == res.data.snapshot_id) {
                // playlist hasn't changed so don't need to fetch data
                return false
            }
        }

        if(spotify_playlists_endpoint.includes('/tracks')){
            items = res.data.items
            next = res.data.next
        } else {
            items = res.data.tracks.items
            next = res.data.tracks.next
            playlistName =  res.data.name
            playlistOwner = res.data.owner.display_name
            playlistImage = res.data.images[0]?.url || null
            totalTracks = res.data.tracks.total
            snapshotId = res.data.snapshot_id
        }

        for(const [position, itemObject] of Object.entries(items)) {
            var trackInfo = {}
            const track = itemObject.track
            var multipleArtists = {}
            for(let artist of track.artists) {
                multipleArtists[artist.id] = {
                    "name": artist.name,
                    "id": artist.id
                }
            }

            trackInfo["playlistPosition"] = playlistPosition
            trackInfo["trackId"] = track.id
            trackInfo["trackArtists"] = multipleArtists
            trackInfo["trackDuration"] = track.duration_ms
            trackInfo["trackExplicit"] = track.explicit
            trackInfo["trackName"] = track.name
            trackInfo["trackPopularity"] = track.popularity
            trackInfo["trackPreview"] = track.preview_url
            trackInfo["album"] = {
                "albumId": track.album.id,
                "albumName": track.album.name,
                "albumReleaseYear": new Date(track.album.release_date).getFullYear(),
                "albumPopularity": track.album.popularity,
                "albumImage": track.album.images[0]?.url
            }

            // populate artistIds and albumIds
            track.artists.map((artist) => playlistArtistIds.add(artist.id))
            playlistAlbumIds.add(track.album.id)

            playlistPosition += 1
            trackTable.push(trackInfo)
        }

        if(next == null) {
            loop = false
        } else {
            spotify_playlists_endpoint = next
        }
    }

    // get BPMs and merge into trackTable
    //  - could get other attributes like energy, danceability, time_signature
    const trackIds = trackTable.map((track) => track.trackId)
    var audioFeatures = await getAudioFeatures(accessToken, trackIds)
    for (let track of trackTable) {
        track["trackTempo"] = audioFeatures[track.trackId]?.tempo
        track["danceability"] = audioFeatures[track.trackId]?.danceability
        track["energy"] = audioFeatures[track.trackId]?.energy
        track["instrumentalness"] = audioFeatures[track.trackId]?.instrumentalness
        track["key"] = audioFeatures[track.trackId]?.key
        track["liveness"] = audioFeatures[track.trackId]?.liveness
        track["loudness"] = audioFeatures[track.trackId]?.loudness
        track["mode"] = audioFeatures[track.trackId]?.mode
        track["speechiness"] = audioFeatures[track.trackId]?.speechiness
        track["time_signature"] = audioFeatures[track.trackId]?.time_signature
        track["valence"] = audioFeatures[track.trackId]?.valence
        track["acousticness"] = audioFeatures[track.trackId]?.acousticness
    }

    // get artist data and merge into trackTable
    var artistInfo = await getArtistInfo(accessToken, playlistArtistIds)
    for (let track of trackTable) {
        for(let artistId of Object.keys(track.trackArtists)) {
            track.trackArtists[artistId]["artistPopularity"] = artistInfo[artistId]?.artistPopularity
            track.trackArtists[artistId]["artistGenres"] = artistInfo[artistId]?.artistGenres
            track.trackArtists[artistId]["artistImage"] = artistInfo[artistId]?.artistImage
        }
    }

    // get album data and merge data into trackTable
    var albumInfo = await getAlbumPopularity(accessToken, playlistAlbumIds)
    for (let track of trackTable) {
        track.album["albumPopularity"] = albumInfo[track.album.albumId]?.albumPopularity
    }

    // duplicates and missing tracks
    var missingTracks = []
    var seenTrackIds = []
    var duplicates = {
            duplicateCount: 0,
            duplicateTracks: {}
        }

    trackTable.forEach((track, index) => {
        if(track.trackId !== null && seenTrackIds.includes(track.trackId)) {
            if (!duplicates.duplicateTracks[track.trackId]) {
                duplicates.duplicateTracks[track.trackId] = {
                    title: track.trackName,
                    positions: [seenTrackIds.indexOf(track.trackId) + 1, index + 1]
                }
            } else {
                duplicates.duplicateTracks[track.trackId].positions.push(index + 1)
            }
            duplicates.duplicateCount += 1
        }

        if(track.trackId === null) {
            missingTracks.push(index)
        }

        // push duplicates here as well to keep order with tracktable track ids
        seenTrackIds.push(track.trackId)
    })

    playlistInfo["playlistName"] = playlistName
    playlistInfo["playlistOwner"] = playlistOwner
    playlistInfo["playlistImage"] = playlistImage
    playlistInfo["totalTracks"] = totalTracks
    playlistInfo["snapshotId"] = snapshotId
    playlistInfo["duplicates"] = duplicates
    playlistInfo["missingTracks"] = missingTracks
    playlistInfo["trackTable"] = trackTable

    return playlistInfo
}


const getAlbumPopularity = async (accessToken, playlistAlbumIds) => {
    const albumIdsArray = Array.from(playlistAlbumIds);
    const maxIds = 20
    var albumInfo = {}

    for(let i = 0; i < albumIdsArray.length; i += maxIds) {
        var upperLimit = ((i + maxIds) > albumIdsArray.length) ? albumIdsArray.length : (i + maxIds)
        var albumIds = albumIdsArray.slice(i,upperLimit).join(",")
        const spotify_multiple_albums_url = `https://api.spotify.com/v1/albums?ids=${albumIds}`

        const multipleAlbumsRes = await axios.get(spotify_multiple_albums_url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        for (let albumObject of multipleAlbumsRes.data.albums) {
            var albumGather = {}
            if (albumObject) {
                albumGather["albumPopularity"] = albumObject.popularity
                albumInfo[albumObject.id] = albumGather
            }
        }
    }
    return albumInfo
}

const getArtistInfo = async (accessToken, playlistArtistIds) => {
    const artistIdsArray = Array.from(playlistArtistIds);
    const maxIds = 50
    var playlistArtistInfo = {}

    for(let i = 0; i < artistIdsArray.length; i += maxIds) {
        var upperLimit = ((i + maxIds) > artistIdsArray.length) ? artistIdsArray.length : (i + maxIds)
        var artistsIds = artistIdsArray.slice(i,upperLimit).join(",")
        const spotify_multiple_artists_url = `https://api.spotify.com/v1/artists?ids=${artistsIds}`
    
        const multipleArtistsRes = await axios.get(spotify_multiple_artists_url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        for (let artistObject of multipleArtistsRes.data.artists) {
            if(artistObject) {
                playlistArtistInfo[artistObject.id] = {
                    "artistId": artistObject.id,
                    "artistName": artistObject.name,
                    "artistPopularity": artistObject.popularity,
                    "artistGenres": artistObject.genres,
                    "artistImage": artistObject?.images[0]?.url
                }
            }
        }
    }
    return playlistArtistInfo
}

const getAudioFeatures = async (accessToken, trackIds) => {
    const maxIds = 100
    var tracksIdsAndBPM = {}

    for(let i = 0; i < trackIds.length; i += maxIds) {
        var upperLimit = ((i + maxIds) > trackIds.length) ? trackIds.length : (i + maxIds)
        var maxTrackIds = trackIds.slice(i,upperLimit).join(",")
        var spotify_audio_features_endpoint = `https://api.spotify.com/v1/audio-features?ids=${maxTrackIds}`
        const audioFeaturesResponse = await axios.get(spotify_audio_features_endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        for (let audioFeatures of audioFeaturesResponse.data.audio_features) {
            if(audioFeatures) {
                tracksIdsAndBPM[audioFeatures.id] = {
                    "trackId": audioFeatures.id,
                    "tempo": audioFeatures.tempo,
                    "danceability": audioFeatures.danceability,
                    "energy": audioFeatures.energy,
                    "instrumentalness": audioFeatures.instrumentalness,
                    "key": audioFeatures.key,
                    "liveness": audioFeatures.liveness,
                    "loudness": audioFeatures.loudness,
                    "mode": audioFeatures.mode,
                    "speechiness": audioFeatures.speechiness,
                    "time_signature": audioFeatures.time_signature,
                    "valence": audioFeatures.valence,
                    "acousticness": audioFeatures.acousticness
                }
            }


        }
    }
    return tracksIdsAndBPM
}

module.exports = { getPlaylistInfo }

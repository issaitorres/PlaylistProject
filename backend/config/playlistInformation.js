const axios = require('axios');
const { GenerateAccessTokenOrGetFromEnvVar } = require('./GetAccessToken')


const getPlaylistInfo = async (playlistId) => {
    const accessToken = await GenerateAccessTokenOrGetFromEnvVar()
    const playlistTrackIds = []
    const playlistArtistNameFrequency = {}
    const playlistAlbumReleaseYearFrequency = {}
    const playlistArtistIds = new Set()
    // var spotify_tracks_url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    var spotify_tracks_url = `https://api.spotify.com/v1/playlists/${playlistId}`

    var playlistInfo = {}
    var songCount = 0
    var topArtist 
    var playlistArtistInfo
    var playlistName
    var playlistOwner
    var playlistImage
    var itemsPath
    var nextPath

    var loop = true
    while(loop) {
        const res = await axios.get(spotify_tracks_url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if(spotify_tracks_url.includes('/tracks')){
            itemsPath = res.data.items
            nextPath = res.data.next
        } else {
            // this should only run once - additional track info is found in endpoint which contains /tracks
            // but we are coming from /playlistid
            itemsPath = res.data.tracks.items
            nextPath = res.data.tracks.next
            playlistName = res.data.name
            playlistOwner = res.data.owner.display_name
            playlistImage = res.data.images[0]?.url || null
        }

        for(const [position, itemObject] of Object.entries(itemsPath)) {
            const trackId = itemObject.track.id
            const trackArtists = itemObject.track.artists
            playlistTrackIds.push(trackId)

            const releaseYear = new Date(itemObject.track.album.release_date).getFullYear()
            // playlistAlbumReleaseYearFrequency[releaseYear] = (playlistAlbumReleaseYearFrequency[releaseYear] + 1) || 1
            if(playlistAlbumReleaseYearFrequency[releaseYear]) {
                playlistAlbumReleaseYearFrequency[releaseYear]["trackCount"] += 1
                playlistAlbumReleaseYearFrequency[releaseYear]["tracks"].push(itemObject.track.name)
            } else {
                playlistAlbumReleaseYearFrequency[releaseYear] = {"trackCount": 1}
                playlistAlbumReleaseYearFrequency[releaseYear]["tracks"] = [itemObject.track.name]
            }


            for(const [position, artistObject] of Object.entries(trackArtists)) {
                playlistArtistIds.add(artistObject.id)
                playlistArtistNameFrequency[artistObject.name] = (playlistArtistNameFrequency[artistObject.name] + 1) || 1
            }
        }

        songCount += itemsPath.length

        if(nextPath == null) {
            loop = false
        } else {
            spotify_tracks_url = nextPath
        }

    }




    playlistInfo = await getPlaylistDurationInfo(accessToken, playlistTrackIds)
    playlistArtistInfo = await getArtistGenres(accessToken, playlistArtistIds)

    // playlistInfo["yearFrequency"] = groupObjectValuesByFrequency(playlistAlbumReleaseYearFrequency)
    playlistInfo["yearFrequency"] = playlistAlbumReleaseYearFrequency
    playlistInfo["topYear"] = groupTopYearsByTrackcount(playlistInfo["yearFrequency"])
    playlistInfo["artistFrequency"] = groupObjectValuesByFrequency(playlistArtistNameFrequency)
    playlistInfo["topArtist"] = playlistInfo["artistFrequency"][Math.max(...Object.keys(playlistInfo["artistFrequency"]))]
    playlistInfo["songCount"] = songCount
    playlistInfo["playlistName"] = playlistName
    playlistInfo["playlistOwner"] = playlistOwner
    playlistInfo["playlistImage"] = playlistImage

    playlistInfo["genreFrequency"] = playlistArtistInfo.genreFrequency
    playlistInfo["topGenre"] = playlistInfo["genreFrequency"][Math.max(...Object.keys(playlistInfo["genreFrequency"]))]
    playlistInfo["artistPopularity"] = playlistArtistInfo.artistPopularity
    playlistInfo["artistCount"] = playlistArtistIds.size

    return playlistInfo
}

const getArtistGenres = async (accessToken, playlistArtistIds) => {
    const artistIdsArray = Array.from(playlistArtistIds);
    const maxIds = 50
    const playlistArtistGenreFrequency = {}
    const playlistArtistPopularity = []
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
            playlistArtistPopularity.push({
                "id": artistObject.id,
                "artistName": artistObject.name,
                "popularity": artistObject.popularity
            })

            for(const genre of artistObject.genres) {
                playlistArtistGenreFrequency[genre] = (playlistArtistGenreFrequency[genre] + 1) || 1
            }
        }

    }

    const playlistArtistGenresGroupedByFrequency = groupObjectValuesByFrequency(playlistArtistGenreFrequency)
    playlistArtistInfo["genreFrequency"] = playlistArtistGenresGroupedByFrequency
    playlistArtistInfo["artistPopularity"] = playlistArtistPopularity
    return playlistArtistInfo
}


const getPlaylistDurationInfo = async (accessToken, playlistTrackIds) => {
    const maxIds = 50 //max is 50 ids at a time!
    var totalDuration = 0 // milliseconds
    let playlistDurationInfo = {}
    let shortestDuration = {
        "name": "",
        "duration": -1
    }
    let longestDuration = {
        "name": "",
        "duration": -1
    }

    for(let i = 0; i < playlistTrackIds.length; i += maxIds) {
        var upperLimit = ((i + maxIds) > playlistTrackIds.length) ? playlistTrackIds.length : (i + maxIds)
        var tracksIds = playlistTrackIds.slice(i, upperLimit).join(",")
        const spotify_multiple_tracks_url = `https://api.spotify.com/v1/tracks?ids=${tracksIds}`
    
        const multipleTracksRes = await axios.get(spotify_multiple_tracks_url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    
        for (let trackInfo of multipleTracksRes.data.tracks) {
            totalDuration += trackInfo.duration_ms

            if (shortestDuration.duration == -1) {
                shortestDuration["name"] = trackInfo.name
                shortestDuration["duration"] = trackInfo.duration_ms
            } else {
                if(shortestDuration.duration > trackInfo.duration_ms) {
                    shortestDuration["name"] = trackInfo.name
                    shortestDuration["duration"] = trackInfo.duration_ms
                }
            }

            if (longestDuration.duration == -1) {
                longestDuration["name"] = trackInfo.name
                longestDuration["duration"] = trackInfo.duration_ms
            } else {
                if(longestDuration.duration < trackInfo.duration_ms) {
                    longestDuration["name"] = trackInfo.name
                    longestDuration["duration"] = trackInfo.duration_ms
                }
            }
        }

    }

    playlistDurationInfo["totalDuration"] = totalDuration
    playlistDurationInfo["averageDuration"] = totalDuration / playlistTrackIds.length
    playlistDurationInfo["shortestDurationandName"] = shortestDuration
    playlistDurationInfo["longestDurationandName"] = longestDuration
    return playlistDurationInfo
}


const groupObjectValuesByFrequency = (object) => {
    const result = {}
    for (let [key, value] of Object.entries(object)) {
        if(result[value] != undefined) {
            result[value].push(key)
        } else {
            result[value] = [key]
        }
    }
    return result
}

const groupTopYearsByTrackcount = (yearFrequency) => {
    var largestTrackcount = 0
    var topYears = []
    for([key, value] of Object.entries(yearFrequency)) {
    // yearFrequency.forEach((key, value) => {
        if(value.trackCount > largestTrackcount){
            topYears = []
            largestTrackcount = value.trackCount
            topYears.push(key)
        } else if (value.trackCount == largestTrackcount) {
            topYears.push(key)
        } 
    }

    return topYears
}

module.exports = { getPlaylistInfo }

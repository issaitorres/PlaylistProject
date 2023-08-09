
const convertMStoFormat = (durationInMs, keepSeconds=false) => {
    var durationInMs = Number(durationInMs)
    const seconds = Math.floor((durationInMs / 1000) % 60);
    const minutes = Math.floor((durationInMs / 1000 / 60) % 60);
    const hours = Math.floor((durationInMs / 1000 / 60 / 60) % 24);
    var res = ""
    if(!keepSeconds) res += "~ "
    if(hours) res += `${hours} ${hours > 1 ? "hrs": "hr"} `
    if(minutes) res += `${minutes} ${minutes > 1 ? "mins": "min"} `
    if(keepSeconds && seconds) res += `${seconds} ${seconds > 1 ? "secs": "sec"} `
    return res
}


const getArtistSongsInfo = (trackTable) => {
    var artistSongsInfo = {}
    for(const [trackID, trackInfo] of Object.entries(trackTable)) {
        for(const artistInfo of Object.values(trackInfo.trackArtists)) {
            if(artistSongsInfo[artistInfo.id]) {
                artistSongsInfo[artistInfo.id].trackCount += 1
                artistSongsInfo[artistInfo.id].trackNames.push(trackInfo.trackName)
            } else {
                artistSongsInfo[artistInfo.id] = {
                    "artistId": artistInfo.id,
                    "artistName": artistInfo.name,
                    "artistPopularity": artistInfo.artistPopularity,
                    "trackCount": 1,
                    "trackNames": [trackInfo.trackName]
                }
            }
        }
    }
    return artistSongsInfo
}

const getGenreSongs = (trackTable) => {
    var genreSongs = {}
    for(const [trackID, trackInfo] of Object.entries(trackTable)) {
        for (const artistInfo of Object.values(trackInfo.trackArtists)) {
            for (const genre of artistInfo.artistGenres) {
                if(genreSongs[genre]) {
                    genreSongs[genre].trackCount += 1
                    genreSongs[genre].trackNames.add(trackInfo.trackName)
                } else {
                    var trackNamesSet = new Set()
                    trackNamesSet.add(trackInfo.trackName)
                    genreSongs[genre] = {
                        "trackCount": 1,
                        "trackNames": trackNamesSet
                    }
                }
            }
        }
    }
    for(const [genre, genreInfo] of Object.entries(genreSongs)) {
        genreInfo.trackNames = Array.from(genreInfo.trackNames)
    }
    return genreSongs
}


const getYearSongs = (trackTable) => {
    var yearSongs = {}
    for(const [trackID, trackInfo] of Object.entries(trackTable)) {
        if(yearSongs[trackInfo.album.albumReleaseYear]) {
            yearSongs[trackInfo.album.albumReleaseYear].trackCount += 1
            yearSongs[trackInfo.album.albumReleaseYear].trackNames.push(trackInfo.trackName)
        } else {
            yearSongs[trackInfo.album.albumReleaseYear] = {
                "trackCount": 1,
                "trackNames": [trackInfo.trackName]
            }
        }
    }
    return yearSongs
    }


const groupTopItemsByTrackcount = (itemSongs, returnType=null) => {
    var largestTrackcount = 0
    var topItems = []
    for(const [item, itemInfo] of Object.entries(itemSongs)) {
        if(itemInfo.trackCount > largestTrackcount){
            topItems = []
            largestTrackcount = itemInfo.trackCount
            if (returnType) {
                topItems.push(itemInfo[returnType])
            } else {
                topItems.push(item)
            }
        } else if (itemInfo.trackCount == largestTrackcount) {
            if (returnType) {
                topItems.push(itemInfo[returnType])
            } else {
                topItems.push(item)
            }        } 
    }
    return topItems
}

const getShortestDuration = (trackTable) => {
    var duration
    var name

    for(const [track, trackInfo] of Object.entries(trackTable)) {
    if (duration){
        if(trackInfo.trackDuration < duration) {
        duration = trackInfo.trackDuration
        name = trackInfo.trackName
        }
    } else {
        duration = trackInfo.trackDuration
        name = trackInfo.trackName
    }
    }
    return [duration, name]
}


const getLongestDuration = (trackTable) => {
    var duration
    var name

    for(const [track, trackInfo] of Object.entries(trackTable)) {
    if (duration){
        if(trackInfo.trackDuration > duration) {
        duration = trackInfo.trackDuration
        name = trackInfo.trackName
        }
    } else {
        duration = trackInfo.trackDuration
        name = trackInfo.trackName
    }
    }
    return [duration, name]
}




  export {
    convertMStoFormat,
    getArtistSongsInfo,
    getGenreSongs,
    getYearSongs,
    groupTopItemsByTrackcount,
    getShortestDuration,
    getLongestDuration
}
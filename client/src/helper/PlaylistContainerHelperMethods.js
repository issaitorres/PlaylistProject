const convertMStoFormat = (durationInMs, keepSeconds=false, simplifyAbbreviation=false) => {
    var durationInMs = Number(durationInMs)
    const seconds = Math.floor((durationInMs / 1000) % 60);
    const minutes = Math.floor((durationInMs / 1000 / 60) % 60);
    const hours = Math.floor((durationInMs / 1000 / 60 / 60) % 24);
    var res = ""
    if(!keepSeconds) res += "~ "
    if(hours) res += `${hours} ${hours > 1 ? "hrs": "hr"} `
    if(minutes) res += `${minutes} ${minutes > 1 ? "mins": "min"} `
    if(keepSeconds && seconds) res += `${seconds} ${seconds > 1 ? "secs": "sec"} `

    if(simplifyAbbreviation) {
        const simplifications = {
            "hrs": "h",
            "hr": "h",
            "mins": "m",
            "min": "m",
            "secs": "s",
            "sec": "s"
        }

        for(const [key, val] of Object.entries(simplifications)) {
            res = res.replace(key, val)
        }
    }

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


// set artists related to genres here!!!!!
const getGenreSongs = (trackTable) => {
    var genreSongs = {}
    for(const [trackID, trackInfo] of Object.entries(trackTable)) {
        for (const artistInfo of Object.values(trackInfo.trackArtists)) {
            for (const genre of artistInfo.artistGenres) {
                if(genreSongs[genre]) {
                    genreSongs[genre].trackNames.add(trackInfo.trackName)
                    Object.values(trackInfo.trackArtists).map((artistInfo) => genreSongs[genre].trackArtists.add(artistInfo.name))

                } else {
                    var trackNamesSet = new Set()
                    trackNamesSet.add(trackInfo.trackName)

                    var trackArtistsSet = new Set()
                    Object.values(trackInfo.trackArtists).map((artistInfo) => trackArtistsSet.add(artistInfo.name))

                    genreSongs[genre] = {
                        "trackNames": trackNamesSet,
                        "trackArtists": trackArtistsSet

                    }
                }
            }
        }
    }

    for(const [genre, genreInfo] of Object.entries(genreSongs)) {
        genreInfo["trackCount"] = genreInfo.trackNames.size
        genreInfo.trackNames = Array.from(genreInfo.trackNames)
        genreInfo.trackArtists = Array.from(genreInfo.trackArtists)
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


const getShortestTrack = (trackTable) => {
    var trackObject = {}
    for(const [track, trackInfo] of Object.entries(trackTable)) {
        if (trackObject?.trackDuration){
            if(trackInfo.trackDuration < trackObject.trackDuration) {
                trackObject = trackInfo
            }
        } else {
            trackObject["trackDuration"] = trackInfo.trackDuration
        }
    }
    return trackObject
}


const getLongestTrack = (trackTable) => {
    var trackObject = {}
    for(const [track, trackInfo] of Object.entries(trackTable)) {
        if (trackObject?.trackDuration){
            if(trackInfo.trackDuration > trackObject.trackDuration) {
                trackObject = trackInfo
            }
        } else {
            trackObject["trackDuration"] = trackInfo.trackDuration
        }
    }
    return trackObject
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

// only energy, dancibility.. for now
const getAverageField = (fieldName, trackTable) => {
    var average = 0
    for(const [track, trackInfo] of Object.entries(trackTable)) {
        average += trackInfo[fieldName]
    }
    return (average/Object.keys(trackTable).length).toFixed(2)
}

// only energy, dancibility.. for now
const getHighestLowestField = (fieldName, trackTable) => {
    var highestLowest = {
        "highestScore": null,
        "highestName": "",
        "highestArtist": "",
        "lowestScore": null,
        "lowestName": "",
        "lowestArtist": "",
    }

    const setHighestScoreNameArtist = (score, name, artist, albumImage) => {
        highestLowest["highestScore"] = score
        highestLowest["highestName"] = name
        highestLowest["highestArtist"] = Object.values(artist)
                                            .map((artistInfo) => artistInfo.name)
                                            .join(' & ')
        highestLowest["highestAlbumImage"] = albumImage

    }
    const setLowestScoreNameArtist = (score, name, artist, albumImage) => {
        highestLowest["lowestScore"] = score
        highestLowest["lowestName"] = name
        highestLowest["lowestArtist"] = Object.values(artist)
                                            .map((artistInfo) => artistInfo.name)
                                            .join(' & ')
        highestLowest["lowestAlbumImage"] = albumImage

    }

    for(const [track, trackInfo] of Object.entries(trackTable)) {
        if(highestLowest["highestScore"] == null) {
            setHighestScoreNameArtist(trackInfo[fieldName], trackInfo.trackName, trackInfo.trackArtists, trackInfo.album.albumImage )
        } else {
            if(trackInfo[fieldName] > highestLowest["highestScore"]) {
                setHighestScoreNameArtist(trackInfo[fieldName], trackInfo.trackName, trackInfo.trackArtists, trackInfo.album.albumImage )
            }
        }

        if(highestLowest["lowestScore"] == null) {
            setLowestScoreNameArtist(trackInfo[fieldName], trackInfo.trackName, trackInfo.trackArtists, trackInfo.album.albumImage )
        } else {
            if(trackInfo[fieldName] < highestLowest["lowestScore"]) {
                setLowestScoreNameArtist(trackInfo[fieldName], trackInfo.trackName, trackInfo.trackArtists, trackInfo.album.albumImage )
            }
        }
    }
    return highestLowest
}


 const isInViewport = (element) => {
    var bounding = element.getBoundingClientRect();

    // Checking if *fully* visible
    if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
        console.log('In the viewport! :)');
        return true;
    } else {
        console.log('Not in the viewport. :(');
        return false;
    }
}


export {
    convertMStoFormat,
    getArtistSongsInfo,
    getGenreSongs,
    getYearSongs,
    groupTopItemsByTrackcount,
    getShortestDuration,
    getLongestDuration,
    getShortestTrack,
    getLongestTrack,
    getAverageField,
    getHighestLowestField,
    isInViewport
}
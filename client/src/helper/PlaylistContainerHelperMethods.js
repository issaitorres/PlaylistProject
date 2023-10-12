const convertMStoFormat = (durationInMs, keepSeconds=false, simplifyAbbreviation=false) => {
    var durationMs = Number(durationInMs)
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / 1000 / 60) % 60);
    const hours = Math.floor((durationMs / 1000 / 60 / 60) % 24);
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
    for(const [ , trackInfo] of Object.entries(trackTable)) {
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
    return Object.values(artistSongsInfo).sort((a,b) =>a.artistPopularity < b.artistPopularity ? -1 : 1)
}


// set artists related to genres here!!!!!
const getGenreSongs = (trackTable) => {
    var genreSongs = {}
    var trackNamesSet
    var trackArtistsSet

    for(const [ , trackInfo] of Object.entries(trackTable)) {
        for (const artistInfo of Object.values(trackInfo.trackArtists)) {
            trackNamesSet = new Set()
            trackArtistsSet = new Set()
            if(artistInfo.id !== null) {
                for (const genre of artistInfo.artistGenres) {
                    if(genreSongs[genre]) {
                        genreSongs[genre].trackNames.add(trackInfo.trackName)
                        Object.values(trackInfo.trackArtists).map((artistInfo) => genreSongs[genre].trackArtists.add(artistInfo.name))
                    } else {
                        trackNamesSet.add(trackInfo.trackName)
                        Object.values(trackInfo.trackArtists).map((artistInfo) => trackArtistsSet.add(artistInfo.name))
                        genreSongs[genre] = {
                            "trackNames": trackNamesSet,
                            "trackArtists": trackArtistsSet
                        }
                    }
                }
            }
        }
    }

    for(const [ , genreInfo] of Object.entries(genreSongs)) {
        genreInfo["trackCount"] = genreInfo.trackNames.size
        genreInfo.trackNames = Array.from(genreInfo.trackNames)
        genreInfo.trackArtists = Array.from(genreInfo.trackArtists)
    }

    return genreSongs
}


const getYearSongs = (trackTable) => {
    var yearSongs = {}
    for(const [ , trackInfo] of Object.entries(trackTable)) {
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
        } else if (itemInfo.trackCount === largestTrackcount) {
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
    for(const [ , trackInfo] of Object.entries(trackTable)) {
        if (trackObject?.trackDuration){
            if(trackInfo.trackDuration < trackObject.trackDuration) {
                trackObject = trackInfo
            }
        } else {
            trackObject = trackInfo
        }
    }
    return trackObject
}


const getLongestTrack = (trackTable) => {
    var trackObject = {}
    for(const [ , trackInfo] of Object.entries(trackTable)) {
        if (trackObject?.trackDuration){
            if(trackInfo.trackDuration > trackObject.trackDuration) {
                trackObject = trackInfo
            }
        } else {
            trackObject = trackInfo
        }
    }
    return trackObject
}

// only energy, dancibility.. for now
const getAverageField = (fieldName, trackTable) => {
    var average = 0
    for(const [ , trackInfo] of Object.entries(trackTable)) {
        average += trackInfo[fieldName]
    }
    return (average/Object.keys(trackTable).length).toFixed(2)
}

const getHighestLowestTrack = (fieldName, trackTable) => {
    var highestLowest = {
        "highestTrack": null,
        "lowestTrack": null
    }

    for(const [ , trackInfo] of Object.entries(trackTable)) {
        if(highestLowest["highestTrack"] == null) {
            highestLowest.highestTrack = trackInfo
        } else {
            if(trackInfo[fieldName] > highestLowest["highestTrack"][fieldName]) {
                highestLowest.highestTrack = trackInfo
            }
        }

        if(highestLowest["lowestTrack"] == null) {
            highestLowest.lowestTrack = trackInfo
        } else {
            if(trackInfo[fieldName] < highestLowest["lowestTrack"][fieldName]) {
                highestLowest.lowestTrack = trackInfo
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
        return true;
    } else {
        return false;
    }
}

// remove tracks with missing information from analysis
const filterTracktable = (tracktable) => {
    const newTrackTable = tracktable.filter((trackInfo) => trackInfo.trackId !== null)
    return newTrackTable
}


export {
    convertMStoFormat,
    getArtistSongsInfo,
    getGenreSongs,
    getYearSongs,
    groupTopItemsByTrackcount,
    getShortestTrack,
    getLongestTrack,
    getAverageField,
    getHighestLowestTrack,
    isInViewport,
    filterTracktable
}

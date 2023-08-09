import React, { useState, useEffect} from 'react'

const TrackGridContent = ({ trackTable }) => {

    const [stateTrackTable, setStateTrackTable] = useState(trackTable)
    const [columnToggles, setColumnToggles] = useState([true, true, true, true, true, true ,true, true])
    const [dataArray, setDataArray] = useState([])
    const [headers, setHeaders] = useState([])

    var heads = {
        "#": "test",
        "Song": "test",
        "Song Pop.": "test",
        "Artist": "test",
        // "Artist Pop": "test", // can't have artist pop since 1 track can multiple artists and this complicates the grid 
        "Album": "test",
        "Album Pop.": "test", 
        "Album Release Year": "test",
        "BPM": "test",
    }

    const sortNumerically = (dataArray, toggle, colVal) => {
        const val = toggle ? -1 : 1
        return ([...dataArray].sort((a, b) => val * b[colVal] - val * a[colVal]))
    }

    const sortAlphabetically = (dataArray, toggle, colVal) => {
        const val = toggle ? -1 : 1
        return ([...dataArray].sort((a,b) => a[colVal] < b[colVal] ? val * -1 : val * 1))

    }

    const determineColTypeAndSort = (colType, dataArray, columnToggle, colVal) => {
        if(colType == "string") {
            return sortAlphabetically(dataArray, columnToggle, colVal)
        } else if (colType == "number") {
            return sortNumerically(dataArray, columnToggle, colVal)
        } else { //array
            return null
        }
    }

    const gridHeaderToggle = (index) => {
        var update = [...columnToggles]
        var colVal = Object.keys(dataArray[0])[index]
        const sorted = determineColTypeAndSort(typeof(colVal), dataArray, update[index], colVal)
        setDataArray(sorted)
        update[index] = !update[index]
        setColumnToggles(update)
    }        


    useEffect(() => {
        var initialDataArray=[]
        for (let [trackId, trackInfo] of Object.entries(trackTable)) {
            initialDataArray.push({
                "#": trackInfo.playlistPosition,
                "song": trackInfo.trackName,
                "songPop": trackInfo.trackPopularity,
                "artist":  Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => artistInfo.name)
                            .join(', '),
                "album": trackInfo.album.albumName,
                "albumPop" : trackInfo.album.albumPopularity,
                "albumReleaseYear": trackInfo.album.albumReleaseYear,
                "bpm": Math.ceil(trackInfo.trackTempo)
            })
        }

        setDataArray(initialDataArray)
    }, [trackTable])


  return (
    <>
        <div className="track-table-container">
            {Object.keys(heads).map((header, index) => (
                <div 
                    className="track-table-header header-toggle-sort"
                    onClick={() => gridHeaderToggle(index)}
                >
                <b>
                    {header}
                </b>
                </div>
            ))}

            {dataArray.map((info) => {
                return (
                    <>
                        <div className="grid-item">
                            {info["#"]}
                        </div>
                        <div className="grid-item">
                            {info.song}
                        </div>
                        <div className="grid-item">
                            {info.songPop}
                        </div>
                        <div className="grid-item">
                            {info.artist}
                        </div>
                        <div className="grid-item">
                            {info.album}
                        </div>
                        <div className="grid-item">
                            {info.albumPop}
                        </div>
                        <div className="grid-item">
                            {info.albumReleaseYear}
                        </div>
                        <div className="grid-item">
                            {info.bpm}
                        </div>

                    </>
                )
            })}
        </div>
    </>  
    )
}

export default TrackGridContent
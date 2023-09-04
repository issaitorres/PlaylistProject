import { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import getTrackDataColumnHeaders from '../data/getTrackDataColumnHeaders'
import { sortNumerically, sortAlphabetically } from '../helper/TableColumnHelperMethods'
import { trackTableConversions, toggleSound } from "../helper/TrackTableHelperMethods"


const TrackGridContent = ({ trackTable, playlistDuplicates }) => {
    const [columnToggles, setColumnToggles] = useState([])
    const [dataArray, setDataArray] = useState([])

    // "Artist Pop": "test", // can't have artist pop since 1 track can multiple artists and this complicates the grid 
    const columnHeaders = getTrackDataColumnHeaders()

    const determineColTypeAndSort = (colType, dataArray, columnToggle, colVal) => {
        if(colType == "string") {
            return sortAlphabetically(dataArray, columnToggle, colVal)
        } else if (colType == "number") {
            return sortNumerically(dataArray, columnToggle, colVal)
        } else if (colType == "boolean") {
            return sortAlphabetically(dataArray, columnToggle, colVal, true)
        }
        else { //array
            return null
        }
    }

    const gridHeaderToggle = (header, index) => {
        var headKeyName = columnHeaders[header].keyName
        var update = [...columnToggles]
        var sampleVal = dataArray[0][headKeyName]
        const sorted = determineColTypeAndSort(typeof(sampleVal), dataArray, update[index], headKeyName)
        setDataArray(sorted)
        updateSortArrows(index, update[index])
        update[index] = !update[index]
        setColumnToggles(update)
    }

    const updateSortArrows = (index, toggle) => {
        var current = document.getElementsByClassName(`arrow`);
        for(const cur of current) {
            cur.className = cur.className.replaceAll("hidden-arrow", "");
        }

        var triggerArrow = document.getElementsByClassName(`h${index}-arrow`);
        var pos = toggle ? 0 : 1
        triggerArrow[pos].className += "hidden-arrow"
    }

    useEffect(() => {
        var initialDataArray=[]
        for (let [trackId, trackInfo] of Object.entries(trackTable)) {
            initialDataArray.push({
                "#": trackInfo.playlistPosition,
                "albumArt": trackInfo.album.albumImage,
                "song": trackInfo.trackName,
                "trackPreview": trackInfo.trackPreview,
                "songPop": trackInfo.trackPopularity,
                "artist": Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => artistInfo.name)
                            .join(', '),
                "genres": Array.from(new Set(Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => {
                                var genres = artistInfo.artistGenres
                                 if (genres.length > 0) return genres
                                 return ["unknown"]
                            })
                            .reduce((acc, currArray) => acc.concat(currArray))))
                            .join(', '),
                "album": trackInfo.album.albumName,
                "albumPop" : trackInfo.album.albumPopularity,
                "albumReleaseYear": trackInfo.album.albumReleaseYear,
                "bpm": Math.ceil(trackInfo.trackTempo),
                "loudness": trackInfo.loudness,
                "danceability": trackInfo.danceability,
                "energy": trackInfo.energy,
                "instrumentalness": trackInfo.instrumentalness,
                "valence": trackInfo.valence,
                "speechiness": trackInfo.speechiness,
                "liveness": trackInfo.liveness,
                "key": trackInfo.key,
                "mode": trackInfo.mode,
                "time_signature": trackInfo.time_signature,
                "duration": trackInfo.trackDuration,
                "acousticness": trackInfo.acousticness,
                "explicit": trackInfo.trackExplicit
            })
        }

        // set up arrow sort initial on load
        var initialTriggerArrow = document.getElementsByClassName(`h0-arrow`);
        initialTriggerArrow[0].className += " hidden-arrow"
        setDataArray(initialDataArray)
    }, [trackTable])


  return (
    <>
        <div className="flex-container">
            <div className="track-table-heading">
                <h2>
                    Track Table
                </h2>
                <div>
                    {playlistDuplicates.duplicateCount == 0
                        ? "This playlist contains no duplicate tracks."
                        : <div>
                                <div>
                                    Duplicate Tracks
                                </div>
                                <ul>
                                    {Object.values(playlistDuplicates.duplicateTracks).map((trackValues, index) => {
                                        return (
                                            <li key={index}>
                                                {trackValues.title}  -  # {trackValues.positions.join(', ')}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                    }
                </div>
            </div>



            <div className="track-table-container">
                {Object.keys(columnHeaders).map((header, index) => (
                    <div
                        className="track-table-header header-toggle-sort"
                        onClick={() => gridHeaderToggle(header, index)}
                        key={index}
                    >
                        <b className="table-header">
                            {header}
                        </b>
                        <div className="sortable-icons">
                            <div className={`
                                arrow
                                h${index}-arrow
                            `}>
                                &#9650;
                            </div>
                            <div className={`
                                arrow
                                h${index}-arrow
                            `}>
                                &#9660;
                            </div>
                        </div>
                    </div>
                ))}

                {dataArray.map((info) => {
                    return (
                        Object.values(columnHeaders).map((head, index) => {
                            var value = trackTableConversions(info[head.keyName], head.convertType)
                            return (
                                <div className="grid-item" key={index}>
                                    <div>
                                        <div>
                                            {value}
                                        </div>
                                        { index == 0 &&
                                            <img src={info.albumArt} width="65px" height="65px"/>
                                        }
                                        { index == 1 && info.trackPreview &&
                                            <div className="audio-container">
                                                <button
                                                    onClick={(e) => toggleSound(e)}
                                                    className="audio-button"
                                                >
                                                    <FontAwesomeIcon icon={faPlay} />
                                                    <FontAwesomeIcon className="hidden-button" icon={faPause} />
                                                </button>
                                                <audio
                                                    id={`${index}-player`}
                                                    src={info.trackPreview}
                                                ></audio>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    )
                })}
            </div>
        </div>
    </>  
    )
}

export default TrackGridContent


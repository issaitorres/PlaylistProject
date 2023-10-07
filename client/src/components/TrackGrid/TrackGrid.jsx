import React, { useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import getTrackDataColumnHeaders from '../../data/getTrackDataColumnHeaders'
import { sortNumerically, sortAlphabetically } from '../../helper/TableColumnHelperMethods'
import { trackTableConversions, toggleSound } from "../../helper/TrackTableHelperMethods"
import "./TrackGrid.css"


const TrackGrid = ({ trackTable, playlistDuplicates }) => {
    const [columnToggles, setColumnToggles] = useState([])
    const [dataArray, setDataArray] = useState([])
    const columnHeaders = getTrackDataColumnHeaders()
    const columnRefs = []

    const determineColTypeAndSort = (colType, dataArray, columnToggle, colVal) => {
        if(colType === "string") {
            return sortAlphabetically(dataArray, columnToggle, colVal)
        } else if (colType === "number") {
            return sortNumerically(dataArray, columnToggle, colVal)
        } else if (colType === "boolean") {
            return sortAlphabetically(dataArray, columnToggle, colVal, true)
        } else if (colType === "object") {
            return sortAlphabetically(dataArray, columnToggle, colVal, false, "artistName")
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
        updateSortArrows(index)
        update[index] = !update[index]
        setColumnToggles(update)
    }

    const updateSortArrows = (index) => {
        for(const [refIndex, ref] of Object.entries(columnRefs)) {
            if(refIndex === index) {
                // handle switching the arrows for column that was clicked
                for(const [ , child] of Object.entries(ref.children)) {
                    if(child.className.includes("trackgrid__sortable-icons")) {
                        if(columnToggles[index] && columnToggles[index] !== null && columnToggles[index] !== undefined) {
                            child.children[0].className += " trackgrid__hidden-arrow"
                            child.children[1].className = child.children[1].className.replaceAll("trackgrid__hidden-arrow", "");
                        } else {
                            child.children[1].className += " trackgrid__hidden-arrow"
                            child.children[0].className = child.children[0].className.replaceAll("trackgrid__hidden-arrow", "");
                        }
                    }
                }
            } else {
                // handle clearing the arrows for other columns
                for(const [ , child] of Object.entries(ref.children)) {
                    if(child.className.includes("trackgrid__sortable-icons")) {
                        for(const innerChild of child.children) {
                            innerChild.className = innerChild.className.replaceAll("trackgrid__hidden-arrow", "");
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        var initialDataArray=[]
        for (let [ , trackInfo] of Object.entries(trackTable)) {
            initialDataArray.push({
                "#": trackInfo.playlistPosition,
                "albumArt": trackInfo.album.albumImage,
                "song": trackInfo.trackName,
                "trackPreview": trackInfo.trackPreview,
                "songPop": trackInfo.trackPopularity,
                "artist": Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => (
                                {"artistName": artistInfo.name, "artistId": artistInfo.id}
                            )),
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

        setDataArray(initialDataArray)
    }, [trackTable])


  return (
    <>
        <div className="trackgrid__heading">
            <h2>
                Track Table
            </h2>
            <div>
                {/* come back here and check: playlistDuplicates != {} - maybe this can never possibly happen  */}
                {playlistDuplicates?.duplicateCount === 0 || playlistDuplicates != {}
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

        <div className="trackgrid__container">
            {Object.keys(columnHeaders).map((header, index) => (
                <div
                    className="trackgrid__header trackgrid__header-toggle-sort"
                    onClick={() => gridHeaderToggle(header, index)}
                    ref={ref => columnRefs.push(ref) }
                    key={index}
                >
                    <b className="trackgrid__table-header">
                        {header}
                    </b>
                    <div className="trackgrid__sortable-icons">
                        <div className={`trackgrid__arrow ${index === 0 ? "trackgrid__hidden-arrow" : ""}`}>
                            &#9650;
                        </div>
                        <div className="trackgrid__arrow">
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
                            <div className="trackgrid__item" key={index}>
                                <div>
                                    {
                                        index !== 3
                                            ?
                                                <div>
                                                    {value}
                                                </div>
                                            :
                                                <div>
                                                    {value.map((info, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <a
                                                                    href={`https://open.spotify.com/artist/${info.artistId}`} 
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    {info.artistName}
                                                                </a>
                                                                { index + 1 < value.length ? `, `: "" }
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </div>
                                    }
                                    {
                                        index === 0 && <img src={info.albumArt} alt="albumimage" width="65px" height="65px"/>
                                    }
                                    {
                                        index === 1 && info.trackPreview &&
                                            <div className="trackgrid__audio-container">
                                                <button
                                                    onClick={(e) => toggleSound(e)}
                                                    className="trackgrid__audio-button"
                                                >
                                                    <FontAwesomeIcon icon={faPlay} />
                                                    <FontAwesomeIcon className="trackgrid__hidden-button" icon={faPause} />
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
    </>  
    )
}

export default TrackGrid


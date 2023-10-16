import React, { useState, useEffect, useRef} from 'react'
import getTrackDataColumnHeaders from '../../data/getTrackDataColumnHeaders'
import { sortNumerically, sortAlphabetically } from '../../helper/TableColumnHelperMethods'
import { trackTableConversions } from "../../helper/TrackTableHelperMethods"
import { toggleSortArrows } from "../../helper/globalGridHelperMethods"
import AlbumArtAudio from '../AlbumArtAudio/AlbumArtAudio'
import "./TrackGrid.css"


const TrackGrid = ({ trackTable, playlistDuplicates, missingTracks }) => {
    const [columnToggles, setColumnToggles] = useState([])
    const [dataArray, setDataArray] = useState([])
    const columnHeaders = getTrackDataColumnHeaders()
    const trackgridPreviousSortArrows = useRef(null)

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

    const gridHeaderToggle = (header, index, currentTarget) => {
        var headKeyName = columnHeaders[header].keyName
        var update = [...columnToggles]
        var sampleVal = dataArray[0][headKeyName]
        const sorted = determineColTypeAndSort(typeof(sampleVal), dataArray, update[index], headKeyName)
        setDataArray(sorted)
        toggleSortArrows(trackgridPreviousSortArrows, currentTarget, index, columnToggles)
        update[index] = !update[index]
        setColumnToggles(update)
    }


    useEffect(() => {
        var initialDataArray=[]
        for (let [ , trackInfo] of Object.entries(trackTable)) {
            initialDataArray.push({
                "#": trackInfo.playlistPosition,
                "albumArt": trackInfo.album.albumImage,
                "song": trackInfo.trackName,
                "trackPreview": trackInfo.trackPreview,
                "songPop": isNaN(trackInfo.trackPopularity) ? -99 : trackInfo.trackPopularity,
                "artist": Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => {
                                return {
                                    "artistName": artistInfo.name !== "" ? artistInfo.name : "unknown" ,
                                    "artistId": artistInfo.id
                                }}),
                "genres": Array.from(new Set(Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => {
                                var genres = artistInfo?.artistGenres
                                if (genres?.length > 0) return genres
                                return ["unknown"]
                            })
                            .reduce((acc, currArray) => acc.concat(currArray))))
                            .join(', '),
                "album": trackInfo.album.albumName || "unknown",
                "albumPop" : isNaN(trackInfo.album.albumPopularity) ? -99 : trackInfo.album.albumPopularity,
                "albumReleaseYear": isNaN(trackInfo.album.albumReleaseYear) ? -99 : trackInfo.album.albumReleaseYear,
                "bpm": isNaN(trackInfo.trackTempo) ? -99 : Math.ceil(trackInfo.trackTempo),
                "loudness": isNaN(trackInfo.loudness) ? -99 : trackInfo.loudness, // loudness can have negative values
                "danceability": isNaN(trackInfo.danceability) ? -99 : trackInfo.danceability,
                "energy" : isNaN(trackInfo.energy) ? -99 : trackInfo.energy,
                "instrumentalness": isNaN(trackInfo.instrumentalness) ? -99 : trackInfo.instrumentalness,
                "valence": isNaN(trackInfo.valence) ? -99 : trackInfo.valence,
                "speechiness": isNaN(trackInfo.speechiness) ? -99 : trackInfo.speechiness,
                "liveness": isNaN(trackInfo.liveness) ? -99 : trackInfo.liveness,
                "key" : isNaN(trackInfo.key) ? -99 : trackInfo.key,
                "mode" : isNaN(trackInfo.mode) ? -99 : trackInfo.mode,
                "acousticness": isNaN(trackInfo.acousticness) ? -99 : trackInfo.acousticness,
                "time_signature": trackInfo.time_signature ? trackInfo.time_signature : -99,
                "duration": isNaN(trackInfo.trackDuration) ? -99 : trackInfo.trackDuration,
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
                {
                    playlistDuplicates?.duplicateCount === 0
                        ?
                            "This playlist contains no duplicate tracks."
                        :
                            <div>
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
                {
                    missingTracks?.length > 0 &&
                        <div>
                            The following tracks songs were omitted from the analysis because of missing information: # {missingTracks.map((positions) => positions + 1).join(', ')}
                        </div>
                }
            </div>
        </div>

        <div className="trackgrid__container">
            {Object.keys(columnHeaders).map((header, index) => (
                <div
                    className="trackgrid__header trackgrid__header-toggle-sort"
                    onClick={(e) => gridHeaderToggle(header, index, e.currentTarget)}
                    ref={index === 0 ? trackgridPreviousSortArrows : null}
                    key={index}
                >
                    <b className="trackgrid__table-header">
                        {header}
                    </b>
                    <div className="trackgrid__sortable-icons">
                        <div className={`trackgrid__arrow ${index === 0 ? "hide-visibility" : ""}`}>
                            &#9650;
                        </div>
                        <div className="trackgrid__arrow">
                            &#9660;
                        </div>
                    </div>
                </div>
            ))}

            {dataArray.map((info, rowIndex) => {
                return (
                    Object.values(columnHeaders).map((head, index) => {
                        var value = trackTableConversions(info[head.keyName], head.convertType)
                        value = value === -99 ? "-" : value // handle missing info
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
                                                                {
                                                                    info.artistId
                                                                        ?
                                                                            <>
                                                                                <a
                                                                                    href={`https://open.spotify.com/artist/${info.artistId}`}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                >
                                                                                    {info.artistName}
                                                                                </a>
                                                                                { index + 1 < value.length ? `, `: "" }
                                                                            </>

                                                                        :
                                                                            <>
                                                                                {info.artistName}
                                                                            </>
                                                                }

                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </div>
                                    }
                                    {
                                        index === 0 &&
                                            <AlbumArtAudio track={info} size="80"/>
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

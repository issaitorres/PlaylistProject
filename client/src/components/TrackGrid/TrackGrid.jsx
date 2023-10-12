import React, { useState, useEffect} from 'react'
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
        toggleSortArrows(index, columnRefs, columnToggles, "trackgrid__sortable-icons", " trackgrid__hidden-arrow")
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
                "songPop": trackInfo.trackPopularity,
                "artist": Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => (
                                {"artistName": artistInfo.name, "artistId": artistInfo.id}
                            )),
                "genres": Array.from(new Set(Object.values(trackInfo.trackArtists)
                            .map((artistInfo) => {
                                var genres = artistInfo?.artistGenres
                                if (genres?.length > 0) return genres
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
                            The following tracks songs were omitted from the analysis because of missing information: # {missingTracks.join(', ')}
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

            {dataArray.map((info, rowIndex) => {
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

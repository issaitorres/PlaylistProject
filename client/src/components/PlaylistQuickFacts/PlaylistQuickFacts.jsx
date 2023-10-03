import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import {
    convertMStoFormat,
    groupTopItemsByTrackcount,
} from "../../helper/PlaylistContainerHelperMethods"
import "./PlaylistQuickFacts.css"


const PlaylistQuickFacts = ({
    playlistImage, 
    playlistName, 
    playlistOwner,
    playlistDuplicates,
    artistSongsInfo, 
    genreSongs,
    yearSongs,
    trackTable,
    refreshPlaylist
}) => {

    const trackCount = Object.keys(trackTable).length
    const artistCount = Object.keys(artistSongsInfo).length
    const topArtists = groupTopItemsByTrackcount(artistSongsInfo, "artistName")
    const topGenres = groupTopItemsByTrackcount(genreSongs)
    const topYears = groupTopItemsByTrackcount(yearSongs)
    const totalPlaylistDuration = Object.values(trackTable).map((track) => track.trackDuration).reduce((acc, val) => acc + val)
    const avgTrackDuration = totalPlaylistDuration / trackCount
    const totalBPM = Object.values(trackTable).map((track) => track.trackTempo).reduce((acc, val) => acc + val)
    const avgBPM = Math.ceil(totalBPM / trackCount)

    const [refresh, setRefresh] = useState(false)
    const getRefreshData = async () => {
        setRefresh(true)
        const res = await refreshPlaylist()
        setRefresh(false)
    }

  return (
    <>
        <div className="quickfacts-section">
            <img src={playlistImage} alt="playlist" height="350" width="350"/>
        </div>
        <div className="quickfacts-section">
            <div>
                <div className="quickfacts-section-header">
                    <div>
                        <h2 className="quickfacts-section-playlist-title">
                            {playlistName}
                        </h2>
                    </div>
                    <div className='quickfacts-section-playlist-author'>
                        by <b>{playlistOwner}</b>
                    </div>
                </div>
                <div>
                    <b>{trackCount}</b> tracks by <b>{artistCount}</b> artists
                </div>
                <div>
                    <label> {`Top Artist${topArtists.length > 1 ? 's' : ''}:`} </label> <span><b>{topArtists.join(" & ")}</b></span>
                </div>
                <div>
                    <label> {`Top Genre${topGenres.length > 1 ? 's' : ''}:`} </label> <span><b>{topGenres.join(" & ")}</b></span>
                </div>
                <div>
                    <label> {`Top Year${topYears.length > 1 ? 's' : ''}:`} </label> <span><b>{topYears.join(" & ")}</b></span>
                </div>
                <div>
                    <label> Total Duration: </label> <span><b>{convertMStoFormat(totalPlaylistDuration)}</b></span>
                </div>
                <div>
                    <label> Avg. Track length: </label> <span><b>{convertMStoFormat(avgTrackDuration)}</b></span>
                </div>
                <div>
                    <label> Avg. BPM: </label> <span><b>{avgBPM}</b></span>
                </div>
                <div>
                    <label> Duplicate Tracks: </label> <span><b>{playlistDuplicates.duplicateCount}</b></span>
                </div>
            </div>
        </div>
        <div className="quickfacts-refresh-corner" onClick={() => getRefreshData()}>
            <span className="quickfacts-refresh-tooltip">
                <span className="quickfacts-refresh-text">Outdated Playlist?</span>
                &nbsp;
                <span className="tooltiptext">
                    Playlists are updated all the time.
                    If this information looks outdated, click here to get the latest version!
                </span>
                &nbsp;
                <FontAwesomeIcon icon={faRefresh} className={`quickfacts-refresh-icon ${refresh ? `rotate`: ""}`}/>
            </span>
        </div>
    </>
  )
}

export default PlaylistQuickFacts
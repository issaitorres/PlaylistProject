import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import {
    convertMStoFormat,
    groupTopItemsByTrackcount,
} from "../../helper/PlaylistContainerHelperMethods"
import likedSongsAlbumCover from "../../Assets/liked-songs-album-art.png"
import { getSpotifyProfileData } from "../../utils/components"
import "./PlaylistQuickFacts.css"


const PlaylistQuickFacts = ({
    playlistId,
    playlistImage, 
    playlistName, 
    playlistOwner,
    playlistDuplicates,
    missingTracks,
    artistSongsInfo, 
    genreSongs,
    yearSongs,
    trackTable,
    refreshPlaylist
}) => {

    // missingTracks ternary works with existing playlists in prod database
    // missingTracks?.length would work find otherwise
    const trackCount = Object.keys(trackTable).length + (missingTracks ? missingTracks?.length : 0)
    const artistCount = Object.keys(artistSongsInfo).length
    const topArtists = groupTopItemsByTrackcount(artistSongsInfo, "artistName")
    const topGenres = groupTopItemsByTrackcount(genreSongs)
    const topYears = groupTopItemsByTrackcount(yearSongs)
    const totalPlaylistDuration = Object.values(trackTable).map((track) => track.trackDuration).reduce((acc, val) => acc + val)
    const avgTrackDuration = totalPlaylistDuration / trackCount
    const totalBPM = Object.values(trackTable).map((track) => track.trackTempo ? track.trackTempo : 0).reduce((acc, val) => acc + val)
    const avgBPM = Math.ceil(totalBPM / trackCount)
    var playlistCover = playlistImage
    var playlistCreator = playlistOwner


    if(playlistId == "likedSongs") {
        playlistCover = likedSongsAlbumCover
        const profileData = getSpotifyProfileData()
        const displayName = profileData?.displayName
        playlistCreator = displayName
    }

    const [refresh, setRefresh] = useState(false)
    const getRefreshData = async () => {
        setRefresh(true)
        const res = await refreshPlaylist()
        setRefresh(false)
    }

  return (
    <>
        <div className="quickfacts__section">
            <img src={playlistCover} alt="playlist" height="350" width="350"/>
        </div>
        <div className="quickfacts__section">
            <div>
                <div className="quickfacts__section-header">
                    <div>
                        <h2 className="quickfacts__section-playlist-title">
                            {playlistName}
                        </h2>
                    </div>
                    <div className='quickfacts__section-playlist-author'>
                        by <b>{playlistCreator}</b>
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
                    <label> Avg. Track Duration: </label> <span><b>{convertMStoFormat(avgTrackDuration)}</b></span>
                </div>
                <div>
                    <label> Avg. BPM: </label> <span><b>{avgBPM}</b></span>
                </div>
                <div className="quickfacts__fact-container">
                    <span className="tooltiptext">
                        Learn more below in the Track Table.
                    </span>
                    <FontAwesomeIcon icon={faCircleInfo} className="quickfacts__more-info"/>
                    <label> Duplicate Tracks: </label> <span><b>{playlistDuplicates.duplicateCount}</b></span>
                </div>
                {
                    missingTracks?.length > 0 &&
                    <div className="quickfacts__fact-container">
                        <span className="tooltiptext">
                            Learn more below in the Track Table.
                        </span>
                        <FontAwesomeIcon icon={faCircleInfo} className="quickfacts__more-info"/>
                        <label> Missing Tracks: </label> <span><b>{missingTracks.length}</b></span>
                    </div>
                }

            </div>
        </div>
        <div className="quickfacts__refresh-corner" onClick={() => getRefreshData()}>
            <span className="quickfacts__refresh-tooltip">
                <span className="quickfacts__refresh-text">Outdated Playlist?</span>
                &nbsp;
                <span className="tooltiptext">
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
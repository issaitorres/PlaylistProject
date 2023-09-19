import {
    convertMStoFormat,
    groupTopItemsByTrackcount,
} from "../../helper/PlaylistContainerHelperMethods"


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

  return (
    <>
        <div className="sidebar">
            <img src={playlistImage} alt="Playlist Image" height="350" width="350"/>
        </div>
        <div className="sidebar">
            <div>
                <div className="sidebar-header">
                    <div>
                    <h2 className="playlist-title">
                        {playlistName}
                    </h2>
                    </div>
                    <div className='playlist-author'>
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
                <div>
                    <button onClick={() =>refreshPlaylist()}>Refresh Playlist</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default PlaylistQuickFacts
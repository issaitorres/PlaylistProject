import { Link } from "react-router-dom"
import { shortenString } from '../../utils/components'
import { getSpotifyProfileData } from "../../utils/components"
import missingAlbum from "../../Assets/missing-album-image.png"
import likedSongsAlbumArt from "../../Assets/liked-songs-album-art.png"
import "./PlaylistTile.css"

const PlaylistTile = ({
  playlist,
  savePlaylist=false,
  useAccessTokenWithScope=false,
  likedSongsEndpoint=false
}) => {
  const maxPlaylistNameLength = 22
  const maxPlaylistOwnerNameLength = 14
  var playlistId
  var image
  var shortenPlaylistName
  var shortenPlaylistOwnerName
  var trackCount

  if(playlist.playlistId === "likedSongs") {
    const profileData = getSpotifyProfileData()
    const displayName = profileData?.displayName
    playlistId = "likedSongs"
    image = likedSongsAlbumArt
    shortenPlaylistName = "Liked Songs"
    shortenPlaylistOwnerName = shortenString(displayName, maxPlaylistOwnerNameLength)
    trackCount = -1
  } else {
    playlistId = playlist.playlistId
    image = playlist?.playlistImage ? playlist?.playlistImage : missingAlbum
    shortenPlaylistName = shortenString(playlist.playlistName, maxPlaylistNameLength)
    shortenPlaylistOwnerName = shortenString(playlist.playlistOwner, maxPlaylistOwnerNameLength)
    trackCount = playlist?.playlistTrackCount
    if(trackCount === undefined) {
      trackCount = playlist?.totalTracks !== undefined ? playlist?.totalTracks : 0
    }
  }

  return (
    <Link
      to={`/playlist/${playlistId}`}
      state={{
        savePlaylist: savePlaylist,
        useAccessTokenWithScope: useAccessTokenWithScope,
        likedSongsEndpoint: likedSongsEndpoint
      }}
      className="playlist-tile"
    >
      <img src={image} alt="playlist" />
      <div className="playlist-tile__details-container">
          <div className="playlist-tile__playlist-name">
            {shortenPlaylistName}
          </div>
          {shortenPlaylistOwnerName &&
            <div className="playlist-tile__playlist-owner">
              by {shortenPlaylistOwnerName}
            </div>
          }
          {trackCount >= 0 &&
            <div className="playlist-tile__playlist-trackcount">
              {trackCount} tracks
          </div>
          }
      </div>
    </Link>
  )
}

export default PlaylistTile

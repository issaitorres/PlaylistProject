import { Link } from "react-router-dom"
import likedSongsAlbumArt from "../../Assets/liked-songs-album-art.png"
import { getSpotifyProfileData } from "../../utils/components"
import "./LikedSongsPlaylistTile.css"

const LikedSongsPlaylistTile = () => {
  const profileData = getSpotifyProfileData()
  const displayName = profileData?.displayName

  return (
    <Link
      to={`/playlist/likedSongs`}
      state={{
        savePlaylist: false,
        useAccessTokenWithScope: true,
        likedSongsEndpoint: true
      }}
      className="likedSongs-playlist-tile"
    >
      <img src={likedSongsAlbumArt} alt="liked-songs-playlist" />
      <div className="likedSongs-playlist-tile__details-container">
          <div className="likedSongs-playlist-tile__playlist-name">
            Liked Songs
          </div>
          {displayName &&
            <div className="likedSongs-playlist-tile__playlist-owner">
              by {displayName}
            </div>
          }
      </div>
    </Link>
  )
}

export default LikedSongsPlaylistTile
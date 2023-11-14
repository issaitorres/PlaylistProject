import { Link } from "react-router-dom"
import likedSongsAlbumCover from "../../Assets/liked-songs-album-art.png"
import "./PlaylistTile.css"


const PlaylistTile = ({playlist}) => {

  const maxPlaylistNameLength = 22
  var shortenPlaylistName = playlist?.playlistName.slice(0, maxPlaylistNameLength)
  if(shortenPlaylistName.length === maxPlaylistNameLength) {
    shortenPlaylistName += "..."
  }

  var image = playlist.playlistImage
  if(playlist.playlistId === "likedSongs") {
    image = likedSongsAlbumCover
  }

  return (
    <Link
      to={`/playlist/${playlist.playlistId}`}
      state={{playlist: playlist}}
      className="playlist-tile"
    >
      <img src={image} alt="playlist" />
      <div>
        {shortenPlaylistName}
      </div>
    </Link>
  )
}

export default PlaylistTile

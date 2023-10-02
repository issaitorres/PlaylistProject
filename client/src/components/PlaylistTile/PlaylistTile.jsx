import { Link } from "react-router-dom"
import "./PlaylistTile.css"


const PlaylistTile = ({playlist}) => {

  const maxPlaylistNameLength = 22
  var shortenPlaylistName = playlist.playlistName.slice(0, maxPlaylistNameLength)
  if(shortenPlaylistName.length == maxPlaylistNameLength) {
    shortenPlaylistName += "..."
  }

  return (
        <Link
          to={`/playlist/${playlist.playlistId}`}
          state={{playlist: playlist}}
          className="playlist-tile"
        >
          <img src={playlist.playlistImage} />
          <div>
            {shortenPlaylistName}
          </div>
        </Link>
  )
}

export default PlaylistTile

import { Link } from "react-router-dom"
import "./PlaylistTile.css"



const PlaylistLinkContainer = ({playlist}) => {
  return (
    <div className="playlistLinkContainer">
        <Link to={`/playlist/${playlist._id}`} state={{playlist: playlist}}>
            <img src={playlist.playlistImage} width="200px" height="200px"/>
            <div>
                {playlist.playlistName}
            </div>
        </Link>
    </div>
  )
}

export default PlaylistLinkContainer
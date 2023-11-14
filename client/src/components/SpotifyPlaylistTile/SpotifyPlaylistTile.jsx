import React from 'react'
import { Link } from "react-router-dom"

import missingAlbum from "../../Assets/missing-album-image.png"
import "./SpotifyPlaylistTile.css"

const SpotifyPlaylistTile = ({ playlist }) => {

  const maxPlaylistNameLength = 22
  const maxPlaylistOwnerNameLength = 14

  var shortenPlaylistName = playlist.playlistName.slice(0, maxPlaylistNameLength)
  if(shortenPlaylistName.length === maxPlaylistNameLength) {
    shortenPlaylistName += "..."
  }

  var shortenPlaylistOwnerName = playlist.playlistOwner.slice(0, maxPlaylistOwnerNameLength)
  if(shortenPlaylistOwnerName.length === maxPlaylistOwnerNameLength) {
    shortenPlaylistOwnerName += "..."
  }

  return (
    <Link
      to={`/playlist/${playlist.playlistId}`}
      state={{
        savePlaylist: false,
        useAccessTokenWithScope: true
      }}
      className="spotify-playlist-tile"
    >
      <img src={playlist?.playlistImage ? playlist?.playlistImage : missingAlbum} alt="spotify-playlist" />
      <div className="spotify-playlist-tile__details-container">
          <div className="spotify-playlist-tile__playlist-name">
            {shortenPlaylistName}
          </div>
          <div className="spotify-playlist-tile__playlist-owner">
            by {shortenPlaylistOwnerName}
          </div>
          <div className="spotify-playlist-tile__playlist-trackcount">
             {playlist.playlistTrackCount} tracks
          </div>
      </div>
    </Link>
  )
}

export default SpotifyPlaylistTile
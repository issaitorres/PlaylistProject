import React from 'react'
import { useState } from 'react'
import { useLocation } from "react-router-dom";
import PlaylistContainer from '../components/playlistContainer'



const Playlist = () => {
  const location = useLocation();

  const playlist = location?.state?.playlist
  console.log("\n here is playlist")
  console.log(playlist)
  return (
    <div>
      {playlist 
        ?       
          <div key={playlist._id}>
            <PlaylistContainer 
              playlist={playlist}
            />
          </div>
        :
          <div>
          no state
          </div>
      }
    </div>
  )
}

export default Playlist
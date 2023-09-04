import React from 'react'
import { useState } from 'react'
import { useLocation } from "react-router-dom";
import PlaylistContainer from '../components/PlaylistContainer'


const Playlist = () => {
  const location = useLocation();
  const playlist = location?.state?.playlist

  return (
    <div className="page-container">
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
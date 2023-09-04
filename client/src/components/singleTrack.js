import React from 'react'
import { convertMStoFormat } from "../helper/PlaylistContainerHelperMethods"
import './singleTrack.css'


const SingleTrack = ({ track, title }) => {
  return (
    <div className="singleTrackContainer">
      <h2> {title} </h2>
      <img src={track.album.albumImage} width="150" height="150"/>
      <div>
        {track.trackName}
      </div>
      <div>
        by <b>
          {
            Object.values(track.trackArtists)
              .map((artistInfo) => artistInfo.name)
              .join(' & ')
          }
           </b>
      </div>
      <h3 className="duration-heading">
        {convertMStoFormat(track.trackDuration, true)}
      </h3>
    </div>
  )
}


export default SingleTrack
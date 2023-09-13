import React from 'react'
import './SingleTrack.css'

const SingleTrack = ({ albumImage, score, title, artist}) => {
  return (
    <div className="singleTrack-image-percentage">
      <div className="singleTrack-grid-item">

        <img src={albumImage} width="95px" height="95px"/>
      </div>
      <div className="singleTrack-grid-item">
        {title} by {artist}
      </div>
    </div>
  )
}

export default SingleTrack
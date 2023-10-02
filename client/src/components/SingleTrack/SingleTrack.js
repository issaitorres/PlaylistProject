import React from 'react'
import './SingleTrack.css'

const SingleTrack = ({ albumImage, score, title, artist}) => {
  return (
    <div className="singletrack__grid">
      <div className="singletrack__grid-item">
        <img src={albumImage} width="95px" height="95px"/>
      </div>
      <div className="singletrack__grid-item">
        {title} by {artist}
      </div>
    </div>
  )
}

export default SingleTrack
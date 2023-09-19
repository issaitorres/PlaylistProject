import React from 'react'
import { convertMStoFormat } from "../../helper/PlaylistContainerHelperMethods"
import "./shortestlongesttrack.css"


const ShortestLongestTrack = ({ shortestTrack, longestTrack}) => {
  return (
    <div className="shortest-longest-container-two">
      <div className="leftTrack">
        <div>
          <h2> Shortest Track </h2>
          <h3 className="duration-heading">
            {convertMStoFormat(shortestTrack.trackDuration, true)}
          </h3>
          <img src={shortestTrack.album.albumImage} width="160" height="160"/>
        </div>
        <div className="title-artist">
          <div>
            {shortestTrack.trackName} by {
              Object.values(shortestTrack.trackArtists)
                .map((artistInfo) => artistInfo.name)
                .join(' & ')
            }
          </div>
        </div>
      </div>
      <div className="rightTrack">
        <div>
          <h2> Longest Track </h2>
          <h3 className="duration-heading">
            {convertMStoFormat(longestTrack.trackDuration, true)}
          </h3>
          <img src={longestTrack?.album?.albumImage ? longestTrack?.album?.albumImage : "nothing"} width="160" height="160"/>
        </div>
        <div className="title-artist">
          <div>
            {longestTrack.trackName} by {
              Object.values(longestTrack.trackArtists)
                .map((artistInfo) => artistInfo.name)
                .join(' & ')
            }
          </div>
        </div>
      </div>
    </div>
  )
}


export default ShortestLongestTrack
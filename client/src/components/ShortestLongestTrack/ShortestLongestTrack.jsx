import { convertMStoFormat } from "../../helper/PlaylistContainerHelperMethods"
import AlbumArtAudio from "../AlbumArtAudio/AlbumArtAudio"
import "./shortestlongesttrack.css"


const ShortestLongestTrack = ({ shortestTrack, longestTrack }) => {
  return (
    <div className="shortestlongesttrack__container">
      <div className="shortestlongesttrack__track-container shortestlongesttrack__left-track">
        <div>
          <h2> Shortest Track </h2>
          <h3>
            {convertMStoFormat(shortestTrack.trackDuration, true)}
          </h3>
          <AlbumArtAudio track={shortestTrack} size="160" className={"shortestlongeststyles"} />
        </div>
        <div className="shortestlongesttrack__artist">
            {shortestTrack?.trackName} by {
              Object.values(shortestTrack?.trackArtists)
                .map((artistInfo) => artistInfo?.name)
                .join(' & ')
            }
        </div>
      </div>
      <div className="shortestlongesttrack__track-container shortestlongesttrack__right-track">
        <div>
          <h2> Longest Track </h2>
          <h3>
            {convertMStoFormat(longestTrack.trackDuration, true)}
          </h3>
          <AlbumArtAudio track={longestTrack} size="160" className={"shortestlongeststyles"} />
        </div>
        <div className="shortestlongesttrack__artist">
            {longestTrack.trackName} by {
              Object.values(longestTrack.trackArtists)
                .map((artistInfo) => artistInfo.name)
                .join(' & ')
            }
        </div>
      </div>
    </div>
  )
}


export default ShortestLongestTrack
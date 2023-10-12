import AlbumArtAudio from '../AlbumArtAudio/AlbumArtAudio'
import './SingleTrack.css'

const SingleTrack = ({ track }) => {

  return (
    <div className="singletrack__grid">
      <div className="singletrack__grid-item">
        <AlbumArtAudio track={track} area={"audioFeatures"} size="95" />
      </div>
      <div className="singletrack__grid-item">
        {track.trackName} by {Object.values(track.trackArtists).map((artistInfo) => artistInfo.name).join(' & ') }
      </div>
    </div>
  )
}

export default SingleTrack
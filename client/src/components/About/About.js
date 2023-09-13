import "./About.css"

const About = ({ removePlaylist }) => {
  return (
    <div className='flex-container'>
      <div className="about-heading">
        <h2>
          About Playlist Analyzer
        </h2>
        <div>
          <p>
            Spotify Playlist Analyzer is a tool designed to quickly view and learn about various qaulities of a playlist.
          </p>
          <p>
            This website was developed using
            the <a href="https://developer.spotify.com/documentation/web-api" rel="noreferrer" target="_blank">Spotify Web API</a> to
            display information about any public Spotify playlist.
          </p>
        </div>
        <div>
          <h2>
            Audio Features
          </h2>
        </div>
        <div>
          <p>
            <b>Acousticness</b>: A confidence measure of whether the track is acoustic. 100 represents a high confidence that the track is acoustic.
          </p>
          <p>
            <b>Danceability</b>: Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 100 represents most danceable.</p>
          <p>
            <b>Energy</b>: A perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy. </p>
          <p>
          <p>
            <b>Instrumentalness</b>: Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". A value of 100 represents the greater likelihood the track contains no vocal content.</p>
          </p>
          <p>
            <b>Liveness</b>: Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 80 provides strong likelihood that the track is live.        
          </p>
          <p>
            <b>Liveness</b>: The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.
          </p>
          <p>
            <b>Mode</b>: Indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived.
          </p>
          <p>
            <b>Speechiness</b>: Detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 100 the attribute value. Values above 66 describe tracks that are probably made entirely of spoken words. Values between 33 and 66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 33 most likely represent music and other non-speech-like tracks.
          </p>
          <p>
            <b>Tempo</b>: The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.
          </p>
          <p>
            <b>Time Signature</b>: An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".
          </p>
          <p>
            <b>Valence (or happiness)</b>: A measure describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).
          </p>
        </div>
        <h2>
            Your Information
        </h2>
        <p>
          Public playlists submitted are saved to this website only for ease of accessability. Feel free to remove your playlist by clicking below.
          {/* All playlists submitted are automatically deleted after one week. - Figure how to do this when app is deployed!*/}
        </p>
        <div>
        <button onClick={removePlaylist}>
          Remove this playlist
        </button>
      </div>
      </div>
    </div>
  )
}

export default About
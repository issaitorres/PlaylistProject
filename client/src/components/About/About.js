import "./About.css"
import aboutAudioFeaturesDesc from "../../data/aboutAudioFeaturesDesc"

const About = ({ removePlaylist }) => {
  const descriptions = aboutAudioFeaturesDesc()

  return (
    <div className='flex-container'>
      <div className="about-heading">
        <h2>
          About Playlist Analyzer
        </h2>
        <div>
          <p>
            Spotify Playlist Analyzer is a tool designed to quickly view and learn about various qualities of a playlist.
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
        <table className="about-table">
          <tbody>
            {descriptions.map((desc, index) => {
              return (
                <tr key={index}>
                  <td>
                    <b>{desc.title}</b>
                  </td>
                  <td>
                    {desc.description}
                  </td>
              </tr>
              )
            })}
          </tbody>
        </table>
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
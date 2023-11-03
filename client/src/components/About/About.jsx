import { Link } from "react-router-dom"
import aboutAudioFeaturesDesc from "../../data/aboutAudioFeaturesDesc"
import "./About.css"


const About = ({ removePlaylist, deleteLoader }) => {
  const descriptions = aboutAudioFeaturesDesc()

  return (
    <>
      <div className="about-section">
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
      </div>
      <div className="about-section">
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
      </div>
      <div className="about-section">
        <h2>
            Your Information
        </h2>
        <p>
          Public playlists submitted are saved to this website only for ease of accessability. Feel free to remove your playlist by clicking below.
          {/* All playlists submitted are automatically deleted after one week.
              - update: need OnRender premium to run background jobs
          */}
        </p>
        <div>
        <button className="button danger-theme about-button" onClick={removePlaylist}>
          <div className={`${deleteLoader && 'loader'}`}>{!deleteLoader && "Remove this playlist"}</div>
        </button>
        <p>To remove all your playlists, visit the &thinsp;
          <Link to="/user" className="link">
            user page
          </Link>
        </p>
      </div>
      </div>
    </>
  )
}

export default About
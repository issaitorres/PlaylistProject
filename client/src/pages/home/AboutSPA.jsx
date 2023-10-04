import { Link } from "react-router-dom"
import spa1 from "../../Assets/SPA_1.png"
import spa2 from "../../Assets/SPA_2.png"
import "./home.css"


const AboutSPA = () => {
  return (
    <div className="flex-container home__SPA-container">
        <div>
          <h1>
              Welcome to Spotify Playlist Analyzer!
          </h1>
          <p>
              The Spotify Playlist Analayzer gives back detailed information about any playlist including:
              popular artists, genres, audio features and much more!. We believe that everyone has a unique music taste and 
              understanding one's own taste is the first step in discovering new music.
              Feel free to explore!
          </p>
        </div>

        <div className="home__SPA-image-container">
          <img src={spa2} alt="Nature" className="home__SPA-responsive-image" width="415px" height="250px"/>
          <img src={spa1} alt="Nature" className="home__SPA-responsive-image" width="415px" height="415px"/>
        </div>

        <div className="home__SPA-video-container">
          <iframe 
            src="https://www.youtube.com/embed/tgbNymZ7vqY"
            title="SPA-video"
          >
          </iframe>
        </div>

        {/* 
          - number here for how many people have submitted a playlist
          -   would need like a global stats for this entire project 
        */}

        <div>
          <h2>
            Register and submit a playlist ID to get started!
          </h2>

          <Link to="/register">
            <button className="button submit-theme home__SPA-button-override">
              Register
            </button>
          </Link>
        </div>

    </div>
  )
}

export default AboutSPA
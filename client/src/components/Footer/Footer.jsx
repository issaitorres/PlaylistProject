import { useCookies } from 'react-cookie'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify, faGithub } from '@fortawesome/free-brands-svg-icons'
import "./Footer.css"

const Footer = () => {
  const [cookies] = useCookies(["access_token"])


  return (
    <div className="footer">
      <div className="footer-flex">
        <div className='footer-link-section'>
          <div>
            <Link to="/" >Home </Link>
          </div>
          {
            !cookies.access_token
              ?
                <>
                  <div>
                    <Link to="/register">Register </Link>
                  </div>
                  <div>
                    <Link to="/login">Login </Link>
                  </div>
                </>
              :
                <div>
                  <Link to="/logout">Logout </Link>
                </div>
          }
        </div>
        <div className='footer-link-section'>
          <div>
            <a href="https://developer.spotify.com/documentation/web-api" rel="noreferrer" target="_blank"> Powered by the <br></br>Spotify Web API</a>
          </div>
          <div>
            <a href="https://open.spotify.com/" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faSpotify} className="footer-icon" />
            </a>
            <a href="https://open.spotify.com/" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGithub} className="footer-icon" />
            </a>
          </div>
        </div>
      </div>
      <hr width="90%"></hr>
      <div className='footer-end'>
          Copyright &copy; Spotify Analyzer
      </div>
    </div>
  )
}

export default Footer
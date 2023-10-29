import { useCookies } from 'react-cookie'
import { Link } from "react-router-dom"
import IconButton from '../IconButton/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import glassesIcon from "../../Assets/glasses.png"
import "./Footer.css"

const Footer = () => {
  const [cookies] = useCookies(["access_token"])

  return (
    <div className="footer">
      <div className="footer-flex">
        <div className='footer__link-section'>
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
              <>
                <div>
                  <Link to="/user">Account </Link>
                </div>
                <div>
                  <Link to="/logout">Logout </Link>
                </div>
              </>
          }
        </div>
        <div className='footer__link-section'>
          <div className="footer__right">
            <a href="https://developer.spotify.com/documentation/web-api" rel="noreferrer" target="_blank"> Powered by the <br/>Spotify Web API</a>
          </div>
          <div className="footer__icon-container">
            <IconButton
              href="https://issaitorresportfolio.onrender.com"
              icon={<img src={glassesIcon} width="40px" height="40px" className="footer__portofolio-icon"/>}
            />
            <IconButton
              href="https://github.com/issaitorres/PlaylistProject"
              icon={<FontAwesomeIcon icon={faGithub} />}
            />
            <IconButton
              href="https://www.linkedin.com/in/issaitorres"
              icon={<FontAwesomeIcon icon={faLinkedin} />}
            />
            <IconButton
              href="https://open.spotify.com"
              icon={<FontAwesomeIcon icon={faSpotify} />}
            />
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
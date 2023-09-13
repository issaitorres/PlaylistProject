import React from 'react'
import { Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify, faGithub } from '@fortawesome/free-brands-svg-icons'
import "./Footer.css"

const Footer = () => {
  const [cookies, setCookies] = useCookies(["access_token"])


  return (
    <div className="footer">
      <div className="footer-flex">
        <div className='footer-links'>
          <div>
            <Link to="/" activeclassname="active">Home </Link>
          </div>
          {
            !cookies.access_token
              ?
                <>
                  <div>
                    <Link to="/register" activeclassname="active">Register </Link>
                  </div>
                  <div>
                    <Link to="/login" activeclassname="active">Login </Link>
                  </div>
                </>
              :
                <div>
                  <Link to="/logout" activeclassname="active">Logout </Link>
                </div>
          }
        </div>
        <div className='footer-links'>
          <div>
            Powered by the
          </div>
          <div>
            <a href="https://developer.spotify.com/documentation/web-api" rel="noreferrer" target="_blank">Spotify Web API</a>
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
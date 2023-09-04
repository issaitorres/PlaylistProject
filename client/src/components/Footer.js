import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"

const Footer = () => {
    const navigate = useNavigate()

  return (
    <div className="Footer">
      <div className="Footer-flex">
        <div className='Footer-links'>
            <Link to="/" activeclassname="active">Home </Link>
        </div>
        <div>
          Powered by the <a href="https://developer.spotify.com/documentation/web-api" rel="noreferrer" target="_blank">Spotify Web API</a>
        </div>
      </div>

        
        <hr width="90%"></hr>
        <div className='Footer-end'>
            Copyright &copy; Spotify Analyzer
        </div>
    </div>
  )
}

export default Footer
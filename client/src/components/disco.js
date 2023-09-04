import React from 'react'
import disco from "../Assets/disco.png"
import "./disco.css"

const Disco = () => {
  return (
    <div className="disco-container">
        <img src={disco} width="200px" height="200px" className="disco-image" />
    </div>
  )
}

export default Disco
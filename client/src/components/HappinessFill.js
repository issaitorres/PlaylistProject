import React from 'react'
import "./happinessfill.css"
import happyface from "../Assets/happy-icon.png"

// ARE WE USING THIS FILE?

const HappinessFill = ({ averageValence, highestLowestField }) => {

    const happyFaceTopStartingPoint = 12 
    const happyFaceBottomStartingPoint = 187
    const happyFaceInsideHeight = 175
    var endPoint = happyFaceBottomStartingPoint - Math.round(averageValence*happyFaceInsideHeight)
    // var endPoint = Math.round(happyFaceInsideHeight - (happyFaceInsideHeight * averageValence + happyFaceTopStartingPoint))


    const addAnimateClass = () => {
        document.getElementById("target").style.setProperty('--colorEndPoint',`${endPoint}px`);
        document.getElementById("target").className += " liquid-animate"
    }


  return (
        <div className="happiness-wrapper">
            <h2> Avg. Happiness {Math.round(averageValence * 100)}%</h2>
            <div className="testcontentboxcontainer" >
                <div className="testcontentbox" id="target">
                    <div className="textcontentboximagecontainer">
                        <img className="textcontentboximage" src={happyface} width="200" height="200"/>
                    </div>
                </div>
                <div className="highestLowestTracks">
                    <div>
                        <h3>Highest Energy Track</h3>
                        {Math.round(highestLowestField.highestScore*100) + "%"} {highestLowestField.highestName} by {highestLowestField.highestArtist}
                    </div>
                    <div>
                        <h3>Lowest Energy Track</h3>
                        {Math.round(highestLowestField.lowestScore*100) + "%"} {highestLowestField.lowestName} by {highestLowestField.lowestArtist}
                    </div>
                </div>
            </div>
            <div>
                <button onClick={() => addAnimateClass()}>
                    add the animate class
                </button>
            </div>
        </div>
  )
}

export default HappinessFill

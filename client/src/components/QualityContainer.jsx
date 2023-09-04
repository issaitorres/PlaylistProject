import React, { useEffect} from 'react'
import { isInViewport } from "../helper/PlaylistContainerHelperMethods"
import "./qualityContainer.css"


const QualityContainer = ({
    quality,
    averageQuality, 
    highestLowestField, 
    title, 
    icon, 
    animationId, 
    animationKeyword,
    callback
}) => {

    useEffect(() => {
        var qualityIcon = document.getElementById(animationId)

        // works but maybe we can add an event listener for the button "more" to be clicked
        // and the trigger animation after a delay?
        window.addEventListener('scroll', function (event) {
        if (isInViewport(qualityIcon)) {
                if(callback) {
                    callback(qualityIcon, animationKeyword)
                }
            }
        }, false);
    }, [])

    const addAnimateClass = () => {
        const happyFaceTopStartingPoint = 12 
        const happyFaceBottomStartingPoint = 187
        const happyFaceInsideHeight = 175
        var endPoint = happyFaceBottomStartingPoint - Math.round(averageQuality*happyFaceInsideHeight)
        document.getElementById("target").style.setProperty('--colorEndPoint',`${endPoint}px`);
        document.getElementById("target").className += " liquid-animate"
    }


  return (
    <div className="quality-wrapper" >
        <h2> {title} {Math.round(averageQuality * 100)}%</h2>
        <div id="iconContent">
            {icon}
        </div>
        <div className="highestLowestTracks">
            <div>
                <h3>Highest {quality} Track</h3>
                {Math.round(highestLowestField.highestScore*100) + "%"} {highestLowestField.highestName} by {highestLowestField.highestArtist}
            </div>
            <div>
                <h3>Lowest {quality} Track</h3>
                {Math.round(highestLowestField.lowestScore*100) + "%"} {highestLowestField.lowestName} by {highestLowestField.lowestArtist}
            </div>
        </div>
        <button onClick={() => addAnimateClass()}>
                    add the animate class
                </button>
    </div>
  )
}


export default QualityContainer
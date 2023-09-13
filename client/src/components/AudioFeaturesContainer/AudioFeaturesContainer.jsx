import React, { useEffect} from 'react'
import { isInViewport } from "../../helper/PlaylistContainerHelperMethods"
import SingleTrack from '../SingleTrack/SingleTrack'
import "./AudioFeaturesContainer.css"


const AudioFeaturesContainer = ({
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
        var animationSet = false // maybe reset this when out of viewport?


        // works but maybe we can add an event listener for the button "more" to be clicked
        // and the trigger animation after a delay?
        window.addEventListener('scroll', function (event) {
        if (isInViewport(qualityIcon)) {
                if(callback) {
                    // if quality icon doesn't already have the animation keyword
                    // console.log(qualityIcon)
                    // console.log(qualityIcon.classList)

                    if(!animationSet) {
                    // if(!qualityIcon.classList.contains(animationKeyword)) {
                        callback(qualityIcon, animationKeyword)
                    }
                    // qualityIcon.classList.contains(class);
                    animationSet = true


                }
            }
        }, false);
    }, [])


  return (
    <div className="quality-wrapper" >
        <h2> {`${title}: ${Math.round(averageQuality * 100)}%`}</h2>
        <div id="iconContent">
            {icon}
        </div>
        <div className="highestLowestTracks">
            <div>
                <h3>Highest {quality} song: {`${Math.round(highestLowestField.highestScore*100)}%`} </h3>
                <SingleTrack 
                    albumImage={highestLowestField.highestAlbumImage}
                    score={highestLowestField.highestScore}
                    title={highestLowestField.highestName}
                    artist={highestLowestField.highestArtist}
                />
            </div>
            <div>
                <h3>Lowest {quality} song: {`${Math.round(highestLowestField.lowestScore*100)}%`} </h3>
                <SingleTrack 
                    albumImage={highestLowestField.lowestAlbumImage}
                    score={highestLowestField.lowestScore}
                    title={highestLowestField.lowestName}
                    artist={highestLowestField.lowestArtist}
                />
            </div>
        </div>
    </div>
  )
}


export default AudioFeaturesContainer
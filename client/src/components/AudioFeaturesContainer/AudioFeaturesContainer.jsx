import { useEffect } from 'react'
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
    animationClassName,
    callback
}) => {

    useEffect(() => {
        var qualityIcon = document.getElementById(animationId)
        var animationSet = false
        var scrollTimer, lastScrollFireTime = 0;

        const triggerAnimation = () => {
            var minScrollTime = 100;
            var now = new Date().getTime();

            const processScroll = (qualityIcon, callback, animationSet, animationClassName) => {
                if (isInViewport(qualityIcon)) {
                    if(callback) {
                        if(!animationSet) {
                            callback(qualityIcon, animationClassName)
                        }
                        animationSet = true
                        window.removeEventListener('scroll', triggerAnimation, false)

                    }
                }
            }

            if (!scrollTimer) {
                if (now - lastScrollFireTime > (3 * minScrollTime)) {
                    processScroll(qualityIcon, callback, animationSet, animationClassName);   // fire immediately on first scroll
                    lastScrollFireTime = now;
                }
                scrollTimer = setTimeout(function() {
                    scrollTimer = null;
                    lastScrollFireTime = new Date().getTime();
                    processScroll(qualityIcon, callback, animationSet, animationClassName);
                }, minScrollTime);
            }
        }

        window.addEventListener('scroll', triggerAnimation, false);
        // triggers when leaving the page
        return () => window.removeEventListener('scroll', triggerAnimation, false);
    }, [])


  return (
    <div className="audiofeatures__wrapper" >
        <h2> {title} </h2>
        <h3> {`Average Song: ${Math.round(averageQuality * 100)}%`} </h3>
        <div id="iconContent"> {icon} </div>
        <div className="audiofeatures__highestLowestTracks">
            <div>
                <h3>Highest: {`${Math.round(highestLowestField.highestScore*100)}%`} </h3>
                <SingleTrack 
                    albumImage={highestLowestField.highestAlbumImage}
                    score={highestLowestField.highestScore}
                    title={highestLowestField.highestName}
                    artist={highestLowestField.highestArtist}
                />
            </div>
            <div>
                <h3>Lowest: {`${Math.round(highestLowestField.lowestScore*100)}%`} </h3>
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
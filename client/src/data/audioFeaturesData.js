
import { getAverageField, getHighestLowestTrack } from "../helper/PlaylistContainerHelperMethods"
import Sparkles from '../components/Sparkles/Sparkles';
import happyface from "../Assets/happy-icon.png"
import disco from "../Assets/disco.png"
import { useRef } from "react"


const GetAudioFeaturesData = (trackTable, activateAnimation, setActivateAnimation) => {
  const happinessIconRef = useRef(null);
  const lightingIconRef = useRef(null);
  const discoIconRef = useRef(null);

  return (
    [
      {
        quality: "energy",
        title: "Energy",
        averageQuality: getAverageField("energy", trackTable),
        highestLowestField: getHighestLowestTrack("energy", trackTable),
        icon:
          <svg width="200px" height="200px">
            <polygon
                ref={lightingIconRef}
                fill="none"
                stroke="black"
                strokeWidth="0.65"
                strokeLinejoin="round"
                points="
                    13.5 0,
                    4    10,
                    8.5  10,
                    3.5  20,
                    14    8,
                    9.5   8
                "
                transform='scale(10 10)'
            />
          </svg>,
        animationRef: lightingIconRef,
        animationClassName: "audiofeatures__lightning-animation",
        callback: (qualityIcon, animationClassName) => {
          qualityIcon.setAttribute("class", animationClassName);
        }
      },
      {
        quality: "valence",
        title: "Happiness",
        averageQuality: getAverageField("valence", trackTable),
        highestLowestField: getHighestLowestTrack("valence", trackTable),
        icon:
          <div className="audiofeatures__image-container" ref={happinessIconRef}>
            <div className="audiofeatures__image-wrapper">
                <img className="audiofeatures__image-icon" alt="happyfaceimage" src={happyface} width="200" height="200"/>
            </div>
          </div>,
        animationRef: happinessIconRef,
        callback: () => {
          const happyFaceTopStartingPoint = 12
          const happyFaceBottomStartingPoint = 187
          const happyFaceInsideHeight = 175
          var endPoint = happyFaceBottomStartingPoint - Math.round(getAverageField("valence", trackTable) * happyFaceInsideHeight)
          if(happinessIconRef.current) {
            happinessIconRef.current.style.setProperty('--colorEndPoint',`${endPoint}px`);
            happinessIconRef.current.className += " audiofeatures__liquid-animate"
          }
        }
      },
      {
        quality: "danceability",
        title: "Danceability",
        averageQuality: getAverageField("danceability", trackTable),
        highestLowestField: getHighestLowestTrack("danceability", trackTable),
        icon:
          <Sparkles activate={activateAnimation}>
            <div ref={discoIconRef}>
              <img src={disco} alt="discoimage" width="200px" height="200px" className="audiofeatures__disco-image" />
            </div>
          </Sparkles>,
        animationRef: discoIconRef,
        callback: () => { setActivateAnimation(!activateAnimation) }
      },
    ]
  )
}


export default GetAudioFeaturesData

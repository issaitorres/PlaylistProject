
import { getAverageField, getHighestLowestField } from "../helper/PlaylistContainerHelperMethods"
import Sparkles from '../components/Sparkles/Sparkles';
import happyface from "../Assets/happy-icon.png"
import disco from "../Assets/disco.png"


const getAudioFeaturesData = (trackTable, activateAnimation, setActivateAnimation) => {
    return (
      [
        {
          quality: "Energy",
          title: "Energy",
          averageQuality: getAverageField("energy", trackTable),
          highestLowestField: getHighestLowestField("energy", trackTable),
          icon:         
            <svg width="200px" height="200px">
              <polygon
                  id="lightning-icon"
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
          animationId: "lightning-icon",
          animationClassName: "audiofeatures__lightning-animation",
          callback: (qualityIcon, animationClassName) => {
            qualityIcon.setAttribute("class", animationClassName);
          }
        },
        {
          quality: "Happiness",
          title: "Happiness",
          averageQuality: getAverageField("valence", trackTable),
          highestLowestField: getHighestLowestField("valence", trackTable),
          icon:
            <div className="audiofeatures__image-container" id="happiness-icon">
              <div className="audiofeatures__image-wrapper">
                  <img className="audiofeatures__image-icon" src={happyface} width="200" height="200"/>
              </div>
            </div>,
          animationId: "happiness-icon",
          callback: () => {
            const happyFaceTopStartingPoint = 12 
            const happyFaceBottomStartingPoint = 187
            const happyFaceInsideHeight = 175
            var endPoint = happyFaceBottomStartingPoint - Math.round(getAverageField("valence", trackTable)*happyFaceInsideHeight)
            var target = document.getElementById("happiness-icon")
            if(target) {
              target.style.setProperty('--colorEndPoint',`${endPoint}px`);
              target.className += " audiofeatures__liquid-animate"
            }
          }
        },
        {
          quality: "Danceability",
          title: "Danceability",
          averageQuality: getAverageField("danceability", trackTable),
          highestLowestField: getHighestLowestField("danceability", trackTable),
          icon:    
            <Sparkles activate={activateAnimation}>
              <div id="disco-container">
                <img src={disco} width="200px" height="200px" className="audiofeatures__disco-image" />
              </div>
            </Sparkles>,
          animationId: "disco-container",
          callback: () => { setActivateAnimation(!activateAnimation) }
        },
      ]
    )
}


export default getAudioFeaturesData
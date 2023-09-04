
import { getAverageField, getHighestLowestField } from "../helper/PlaylistContainerHelperMethods"
import Disco from '../components/disco';
import Sparkles from '../components/Sparkles';
import happyface from "../Assets/happy-icon.png"


const getMoreQualityData = (trackTable, activate, setActivate) => {
    return (
      [
        {
          quality: "Energy",
          title: "Avg. Energy",
          averageQuality: getAverageField("energy", trackTable),
          highestLowestField: getHighestLowestField("energy", trackTable),
          icon:         
            <svg width="200px" height="200px">
              <polygon
                  id="lightning"
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
          animationId: "lightning",
          animationKeyword: "lightning-animation",
          callback: (qualityIcon, animationKeyword) => {
            qualityIcon.setAttribute("class", animationKeyword);
          }
        },
        {
          quality: "Happiness",
          title: "Avg. Happiness",
          averageQuality: getAverageField("valence", trackTable),
          highestLowestField: getHighestLowestField("valence", trackTable),
          icon:
            <div className="image-container" id="target">
              <div className="image-wrapper">
                  <img className="image-icon" src={happyface} width="200" height="200"/>
              </div>
            </div>,
          animationId: "target",
          animationKeyword: "lightning-bro",
          callback: () => {
            const happyFaceTopStartingPoint = 12 
            const happyFaceBottomStartingPoint = 187
            const happyFaceInsideHeight = 175
            var endPoint = happyFaceBottomStartingPoint - Math.round(getAverageField("valence", trackTable)*happyFaceInsideHeight)
            var target = document.getElementById("target")
            if(target) {
              target.style.setProperty('--colorEndPoint',`${endPoint}px`);
              target.className += " liquid-animate"
            }
          }
    
        },
        {
          quality: "Danceability",
          title: "Avg. Danceability",
          averageQuality: getAverageField("danceability", trackTable),
          highestLowestField: getHighestLowestField("danceability", trackTable),
          icon:    
            <Sparkles activate={activate}>
              <Disco />
            </Sparkles>,
          animationId: "target",
          animationKeyword: "lightning-animation",
          callback: () => {setActivate(!activate)}
        },
      ]
    )
}


export default getMoreQualityData
import React, { useEffect } from 'react'
import "./lightningfill.css"
import { isInViewport } from "../helper/PlaylistContainerHelperMethods"

const LightningFill = ({ averageEnergy, highestLowestField}) => {

    useEffect(() => {
        // var lightningIcon = document.getElementById("lightning")

        // // works but maybe we can add an event listener for the button "more" to be clicked
        // // and the trigger animation after a delay?
        // window.addEventListener('scroll', function (event) {
        // if (isInViewport(lightningIcon)) {
        //             lightningIcon.setAttribute("class","lightning-animation");
        //     }
        // }, false);
    }, [])

  return (
    <div className="lightning-wrapper" id="lightning-wrapper-bro">
        <h2> Avg. Energy {Math.round(averageEnergy * 100)}%</h2>

        <svg width="200px" height="200px">
            <polygon
                id="lightning"
                fill="none"
                stroke="black"
                strokeWidth="0.65"
                strokeLinejoin="round"
                points="
                    13.5 0, 
                    4 10,
                    8.5 10,
                    3.5 20,
                    14 8,
                    9.5 8
                "
                transform='scale(10 10)'

            />
        </svg>
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
  )
}

export default LightningFill

        {/* <svg viewBox="-10 -10 50 40"> */}
        {/* <svg viewBox="-15 -15 50 50" className="viewbox" width="300px" height="300px"> */}
        {/* <svg viewBox="-15 -15 50 50" className="viewbox"> */}


// const activateLighting = () => {
//     var lightingIcon = document.getElementById("lighting")
//     lightingIcon.setAttribute("class","lightning-animation");
// }


// const checkVisibility = () => {
//     if(lightningIcon) {
//         if (lightningIcon.getBoundingClientRect().top < window.innerHeight/2 ) {
//             lightningIcon.setAttribute("class","lightning-animation");
//           }
//     }
// }

// window.addEventListener('scroll', checkVisibility );

// const checkVisibility = () => {
//     if (lightningIcon.getBoundingClientRect().top < window.innerHeight/2 ) {
//         // lightningIcon.setAttribute("class","lightning-animation");
//         console.log("\n this icon is visible!!!")
//     }
// }

// window.addEventListener('scroll', checkVisibility());

{/* <button onClick={() => activateLighting()}>
    trigger lightning
</button> */}


// points="10 0, 
// 5 10,
// 8 10,
// 5 20,
// 11 8,
// 8 8
// " 


// points="13 0, 
// 4 10,
// 9 10,

// 4 20,
// 14 8,
// 9 8
// " 


{/* <svg viewBox="0 -10 100 40">
<polygon  
    // fill="none"
    className="round"
    fill="none" 
    stroke="black"
    style={{borderRadius: "10px"}}
    stroke-linejoin="round"
    points="10 0, 
    5 10,
    8 10,
    5 20,
    11 8,
    8 8
    " 
/>
</svg> */}



{/* <svg viewBox="0 -10 100 40">
<polygon  
    // fill="none"
    className="round"
    fill="none" 
    stroke="black"
    style={{borderRadius: "10px"}}
    stroke-linejoin="round"
    points="15 0, 
            4 11,
            9 11,

            4 21,
            16 9,
            11 9
            " 
/>

</svg> */}
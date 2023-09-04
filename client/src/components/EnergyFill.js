import React from 'react'
import "./energyfill.css"


const EnergyFill = ({ averageEnergy }) => {
    var energy = averageEnergy * 100

    const revealEnergy = () => {
        var fills = document.getElementsByClassName("battery-fill")
        var batPercent = 0
        var i = fills.length-1;                 
        const energyFillLoop = () => {        
            setTimeout(() => {  
                fills[i].className = fills[i].className.replaceAll("hidden-battery-fill", "")
                batPercent += 20          
                i--;                   
                if (i >= 0 && batPercent < energy) {           
                    energyFillLoop();             
                }                       
            }, 1000)
        }
        energyFillLoop()
    }

  return (
    <>
        <div className="icon-container">
            <div className="battery-top-node"></div>
            <div className="battery-case">
                <div className="battery-fill hidden-battery-fill"></div>
                <div className="battery-fill hidden-battery-fill"></div>
                <div className="battery-fill hidden-battery-fill"></div>
                <div className="battery-fill hidden-battery-fill"></div>
                <div className="battery-fill hidden-battery-fill"></div>
            </div>
        </div>
        <button onClick={() => revealEnergy()}>
            calculate energy
        </button>

    </>
  )
}

export default EnergyFill




        // function delay(i) {
        //     setTimeout(() => {
        //         fills[i].className = fills[i].className.replaceAll("hidden-battery-fill", "")
        //         // if (batPercent >averageEnergy) {
        //         //     break
        //         // }
        //         batPercent += 25            
        //     }, 2000);
        //   }



        // let i = fills.length-1;
        // while(i > 0) {
        //     delay(i)
        //     i--
        // }

        // for (let i = fills.length - 1; i >= 0; i--) {
        //     delay(i)
        //     // await setTimeout(5000);

        //     // fills[i].className = fills[i].className.replaceAll("hidden-battery-fill", "")
        //     // if (batPercent >averageEnergy) {
        //     //     break
        //     // }
        //     // batPercent += 25

        // }
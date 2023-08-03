import React, { useState, useEffect} from 'react'

const GridContent = ({ frequency, headers}) => {

    const [frequencyArray, setFrequencyArray] = useState([])
    const [frequencyArrayToggle, setFrequencyArrayToggle] = useState(true)
    const [headerColumn1, headerColumn2, headerColumn3] = headers

    useEffect(() => {
        var newFrequencyArray = []
    
        Object.entries(frequency).map((info) => (
            newFrequencyArray.push({
                key: info[1],
                value: Number(info[0] )
            })
      
        ))
        setFrequencyArray(newFrequencyArray)
      }, [frequency])

      // numbers
      const gridHeaderColumn2OrderToggle = () => {
        if(frequencyArrayToggle) {
          setFrequencyArray([...frequencyArray].sort((a, b) => b.value - a.value))
        } else {
          setFrequencyArray([...frequencyArray].sort((a, b) => a.value - b.value))
        }
        setFrequencyArrayToggle(!frequencyArrayToggle)
      }


  return (
    <>
        <button onClick={() => gridHeaderColumn2OrderToggle()}>
          song count order!
        </button>
        <div className="grid-container">
            <div className="grid-header">
            <b>
                {headerColumn1}
            </b>
            </div>
            <div className="grid-header">
            <b>
                {headerColumn2}
            </b>
            </div>
            <div className="grid-header">
            <b>
                {headerColumn3}
            </b>
            </div>
            {frequencyArray.map((info) => (
                <>
                    <div className="grid-item">
                        {info.key}
                    </div>
                    <div className="grid-item">
                        {info.value}
                    </div>
                    <div className="grid-item">
                        test
                    </div>
                </>
            ))}
        </div>
    </>
  )
}

export default GridContent
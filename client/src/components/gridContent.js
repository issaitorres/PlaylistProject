
import React, { useState, useEffect} from 'react'

const GridContent = ({ data, headers}) => {

    const [frequencyArray, setFrequencyArray] = useState([])
    const [frequencyArrayToggle, setFrequencyArrayToggle] = useState(true)
    const [frequencyArray2ndToggle, setFrequencyArray2ndToggle] = useState(true)
    const [headerColumn1, headerColumn2, headerColumn3] = headers

    // alphabetical
    const gridHeaderColumn1OrderToggle = () => {
        if(frequencyArray2ndToggle) {
            setFrequencyArray([...frequencyArray].sort((a,b) => a.key < b.key ? -1 : 1))
        } else {
            setFrequencyArray([...frequencyArray].sort((a,b) => a.key < b.key ? 1 : -1))
        }
        setFrequencyArray2ndToggle(!frequencyArray2ndToggle)
    }

    // numbers
    const gridHeaderColumn2OrderToggle = () => {
        if(frequencyArrayToggle) {
            setFrequencyArray([...frequencyArray].sort((a, b) => b.value - a.value))
        } else {
            setFrequencyArray([...frequencyArray].sort((a, b) => a.value - b.value))
        }
        setFrequencyArrayToggle(!frequencyArrayToggle)
    }

    useEffect(() => {
        var newFrequencyArray = []
    
        Object.values(data).map((info) => (
            newFrequencyArray.push({
                key: info.artistName,
                value: Number(info.songCount),
                songs: info.songs
            })
        ))

        newFrequencyArray.sort((a, b) => b.value - a.value)
        setFrequencyArray(newFrequencyArray)
    }, [data])

  return (
    <>
        <div className="grid-container">
            <div className="grid-header header-toggle-sort" onClick={() => gridHeaderColumn1OrderToggle()}>
            <b>
                {headerColumn1}
            </b>
            </div>
            <div className="grid-header header-toggle-sort" onClick={() => gridHeaderColumn2OrderToggle()}>
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
                        <ul>
                        {info.songs.map((song) => (
                            <li>
                                {song}
                            </li>
                        ))}
                        </ul>
                    </div>
                </>
            ))}
        </div>
    </>
  )
}

export default GridContent
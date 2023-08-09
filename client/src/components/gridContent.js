

import React, { useState, useEffect} from 'react'

const GridContent = ({ data, headers, columnTypes, columnSortable, columnValues, initialSort}) => {
    const [dataArray, setDataArray] = useState([])
    const [columnOneToggle, setColumnOneToggle] = useState(true)
    const [columnTwoToggle, setColumnTwoToggle] = useState(true)
    const [columnThreeToggle, setColumnThreeToggle] = useState(true)
    const [headerColumn1, headerColumn2, headerColumn3] = headers
    const [colOneType, colTwoType, colThreeType] = columnTypes
    const [colOneSort, colTwoSort, colThreeSort] = columnSortable
    const [colOneVal, colTwoVal, colThreeVal] = columnValues
    const [initialColValSort, initialType] = initialSort


    const gridHeaderColOneOrderToggle = () => {
        const sorted = determineColTypeAndSort(colOneType, dataArray, columnOneToggle, "colOneValue")
        setDataArray(sorted)
        setColumnOneToggle(!columnOneToggle)
    }

    const gridHeaderColTwoOrderToggle = () => {
        const sorted = determineColTypeAndSort(colTwoType, dataArray, columnTwoToggle, "colTwoValue")
        setDataArray(sorted)
        setColumnTwoToggle(!columnTwoToggle)
    }

    const gridHeaderColThreeOrderToggle = () => {
        const sorted = determineColTypeAndSort(colThreeType, dataArray, columnThreeToggle, "colThreeValue")
        setDataArray(sorted)
        setColumnThreeToggle(!columnThreeToggle)
    }

    const determineColTypeAndSort = (colType, dataArray, columnToggle, colVal) => {
        if(colType == "string") {
            return sortAlphabetically(dataArray, columnToggle, colVal)
        } else if (colType == "number") {
            return sortNumerically(dataArray, columnToggle, colVal)
        } else { //array
            return null
        }
    }

    const sortAlphabetically = (dataArray, toggle, colVal) => {
        const val = toggle ? -1 : 1
        return ([...dataArray].sort((a,b) => a[colVal] < b[colVal] ? val * -1 : val * 1))
    }

    const sortNumerically = (dataArray, toggle, colVal) => {
        const val = toggle ? -1 : 1
        return ([...dataArray].sort((a, b) => val * b[colVal] - val * a[colVal]))
    }


    useEffect(() => {
        var initialDataArray = []
        for (let [key, value] of Object.entries(data)) {
            initialDataArray.push({
                colOneValue: colOneVal =="useKey"
                    ? key
                    : typeof(value[colOneVal]) == Number
                        ?  Number(value[colOneVal])
                        : value[colOneVal],
                colTwoValue: colTwoVal =="useKey"
                    ? key
                    : typeof(value[colTwoVal]) == Number
                        ?  Number(value[colTwoVal])
                        : value[colTwoVal],
                colThreeValue: colThreeVal =="useKey"
                    ? key
                    : typeof(value[colThreeVal]) == Number
                        ?  Number(value[colThreeVal])
                        : value[colThreeVal],
            })
        }

        if (initialType == "Number") {
            initialDataArray = sortNumerically(initialDataArray, false, initialColValSort)
        } else {
            initialDataArray = sortAlphabetically(initialDataArray, false, initialColValSort)
        }

        setDataArray(initialDataArray)
    }, [data])

  return (
    <>
        <div className="grid-container">
            <div
                className={`grid-header ${colOneSort ? "header-toggle-sort ": null }`}
                onClick={colOneSort ? () => gridHeaderColOneOrderToggle() : null}
            >
            <b>
                {headerColumn1}
            </b>
            </div>
            <div
                className={`grid-header ${colTwoSort ? "header-toggle-sort ": null }`}
                onClick={colTwoSort ? () => gridHeaderColTwoOrderToggle() : null}
            >
            <b>
                {headerColumn2}
            </b>
            </div>
            <div
                className={`grid-header ${colThreeSort ? "header-toggle-sort ": null }`}
                onClick={colThreeSort ? () => gridHeaderColThreeOrderToggle() : null}
            >
            <b>
                {headerColumn3}
            </b>
            </div>
            {dataArray.map((info) => (
                <>
                    <div className="grid-item">
                        {info.colOneValue}
                    </div>
                    <div className="grid-item">
                        {info.colTwoValue}
                    </div>
                    <div className="grid-item">
                        <ul>
                            {Array.isArray(info.colThreeValue)
                                ? info.colThreeValue.map((val) => (
                                    <li>
                                        {val}
                                    </li>
                                ))
                                : info.colThreeValue
                            }
                        </ul>
                    </div>
                </>
            ))}
        </div>
    </>
  )
}

export default GridContent


import React, { useState, useEffect} from 'react'

const GridContent = ({ data, title, headers, columnTypes, columnSortable, columnValues, initialSort}) => {
    const [dataArray, setDataArray] = useState([])
    const [columnOneToggle, setColumnOneToggle] = useState(true)
    const [columnTwoToggle, setColumnTwoToggle] = useState(true)
    const [columnThreeToggle, setColumnThreeToggle] = useState(true)
    const [headerColumn1, headerColumn2, headerColumn3] = headers
    const [colOneType, colTwoType, colThreeType] = columnTypes
    const [colOneSort, colTwoSort, colThreeSort] = columnSortable
    const [colOneVal, colTwoVal, colThreeVal] = columnValues
    const [initialColValSort, initialType] = initialSort


    const gridHeaderColOneOrderToggle = (title) => {
        const sorted = determineColTypeAndSort(colOneType, dataArray, columnOneToggle, "colOneValue")
        setDataArray(sorted)
        setSortArrows(1, columnOneToggle, title)

        setColumnOneToggle(!columnOneToggle)
    }

    const gridHeaderColTwoOrderToggle = (title) => {
        const sorted = determineColTypeAndSort(colTwoType, dataArray, columnTwoToggle, "colTwoValue")
        setDataArray(sorted)
        setSortArrows(2, columnTwoToggle, title)
        setColumnTwoToggle(!columnTwoToggle)

    }

    const gridHeaderColThreeOrderToggle = (title) => {
        const sorted = determineColTypeAndSort(colThreeType, dataArray, columnThreeToggle, "colThreeValue")
        setDataArray(sorted)
        setSortArrows(3, columnThreeToggle, title)
        setColumnThreeToggle(!columnThreeToggle)
    }

    const setSortArrows = (num, toggle, title) => {

        var current = document.getElementsByClassName(`${title}-arrow`);
        for(const cur of current) {
            cur.className = cur.className.replaceAll("hidden-arrow", "");
        }

        var triggerArrow = document.getElementsByClassName(`${title}-c${num}-arrow`);
        var pos = toggle ? 0 : 1


        triggerArrow[pos].className += "hidden-arrow"

        // current[0].className = current[0].className.replaceAll("hidden-arrow", "");
        // document.querySelector(`.cb${slideIndex}`).className += "carousel-button-active"
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
                className={`grid-header ${colOneSort ? "header-toggle-sort grid-header-hoverable ": null }`}
                onClick={colOneSort ? () => gridHeaderColOneOrderToggle(title) : null}
            >
                <b className="table-header">
                    {headerColumn1}
                </b>
                { colOneSort
                    ?   <div className="sortable-icons">
                            <div className={`
                                arrow 
                                ${title}-arrow
                                ${title}-c1-arrow 
                            `}>
                                &#9650;
                            </div>
                            <div className={`
                                arrow 
                                ${title}-arrow
                                ${title}-c1-arrow `
                            }>
                                &#9660;
                            </div>
                        </div>
                    : null
                }
            </div>
            <div
                className={`grid-header ${colTwoSort ? "header-toggle-sort grid-header-hoverable ": null }`}
                onClick={colTwoSort ? () => gridHeaderColTwoOrderToggle(title) : null}
            >
                <b>
                    {headerColumn2}
                </b>
                { colTwoSort
                    ?   <div className="sortable-icons">
                            <div className={`
                                arrow 
                                ${title}-arrow 
                                ${title}-c2-arrow 
                            `}>
                                &#9650;
                            </div>
                            <div className={`
                                arrow 
                                ${title}-arrow 
                                ${title}-c2-arrow 
                                hidden-arrow 
                            `}>
                                &#9660;
                            </div>
                        </div>
                    : null
                }
            </div>
            <div
                className={`grid-header ${colThreeSort ? "header-toggle-sort grid-header-hoverable ": null }`}
                onClick={colThreeSort ? () => gridHeaderColThreeOrderToggle(title) : null}
            >
                <b>
                    {headerColumn3}
                </b>
                { colThreeSort
                    ?   <div className="sortable-icons">
                            <div className={
                                `arrow 
                                ${title}-arrow 
                                ${title}-c3-arrow 
                            `}>
                                &#9650;
                            </div>
                            <div className={
                                `arrow 
                                ${title}-arrow 
                                ${title}-c3-arrow 
                            `}>
                                &#9660;
                            </div>
                        </div>
                    : null
                }
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
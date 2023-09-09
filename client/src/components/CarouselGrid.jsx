import React, { useState, useEffect} from 'react'
import { sortNumerically, sortAlphabetically } from "../helper/TableColumnHelperMethods"

const CarouselGrid = ({ grid }) => {
    const [dataArray, setDataArray] = useState([])
    const [columnToggles, setColumnToggles] = useState([])
    const headers = grid.headers
    const columnTypes = grid.columnTypes
    const columnSortable = grid.columnSortable
    const columnValues = grid.columnValues
    const initiallySortByColumn = grid.initiallySortByColumn
    const data = grid.data
    const title = grid.title

    useEffect(() => {
        // set number of columns
        document.getElementById(`gc-${title}`).style.setProperty('--headerLength',headers.length);

        var initialDataArray = []
        for (let [key, value] of Object.entries(data)) {
            var gridItem = {}
            for (let x = 0; x < headers.length; x++) {
                const currentColumnValue = columnValues[x]
                var item
                if(currentColumnValue == "useKey") {
                    item = key
                } else {
                    item = typeof(value[currentColumnValue]) == "number"
                            ? Number(value[currentColumnValue])
                            : value[currentColumnValue]
                    // sort array
                    if(Array.isArray(item)) {
                        item = item.sort((a,b) => a < b ? -1 : 1)
                    }

                }

                gridItem[`${x}`] = item
            }
            initialDataArray.push(gridItem)
        }

        // sort initial data array
        if (typeof(initialDataArray[0][initiallySortByColumn]) == "number") {
            initialDataArray = sortNumerically(initialDataArray, false, initiallySortByColumn)
        } else {
            initialDataArray = sortAlphabetically(initialDataArray, false, initiallySortByColumn)
        }
        //set columnToggles to match initial data array
        setColumnToggles([,true])
        setDataArray(initialDataArray)
    }, [data])


    const sortColumn = (columnIndex) => {
        var update = [...columnToggles]
        update[columnIndex] = !update[columnIndex]
        const columnType = typeof(dataArray[0][columnIndex])
        const sorted = determineColumnTypeAndSort(columnType, dataArray, columnToggles[columnIndex], columnIndex)
        
        setDataArray(sorted)
        setColumnToggles(update)
        toggleSortArrows(columnIndex, columnToggles[columnIndex], title)
    }

    const determineColumnTypeAndSort = (columnType, dataArray, columnToggle, colVal) => {
        if(columnType == "string") {
            return sortAlphabetically(dataArray, columnToggle, colVal)
        } else if (columnType == "number") {
            return sortNumerically(dataArray, columnToggle, colVal)
        } else { //array
            return null
        }
    }

    const toggleSortArrows = (num, toggle, title) => {
        var current = document.getElementsByClassName(`${title}-arrow`);
        for(const cur of current) {
            cur.className = cur.className.replaceAll("hidden-arrow", "");
        }

        var triggerArrow = document.getElementsByClassName(`${title}-c${num}-arrow`);
        var pos = toggle ? 0 : 1

        triggerArrow[pos].className += "hidden-arrow"
    }


  return (
    <>
        <div className="grid-container" id={`gc-${title}`}>
            {/* grid headers  */}
            {headers.map((header, index) => {
                return (
                    <div
                        className={`grid-header ${columnSortable[index] ? "header-toggle-sort grid-header-hoverable ": null }`}
                        onClick={() => sortColumn(index)}
                    >
                        <b className="table-header">
                            {header}
                        </b>
                        {columnSortable[index]
                            ?   <div className="sortable-icons">
                                    <div className={`
                                        arrow 
                                        ${title}-arrow
                                        ${title}-c${index}-arrow 
        
                                    `}>
                                        &#9650;
                                    </div>
                                    <div className={`
                                        arrow 
                                        ${title}-arrow
                                        ${title}-c${index}-arrow 
                                        ${index == 1 && 'hidden-arrow'} 
                                    `}>
                                        &#9660;
                                    </div>
                                </div>
                            : null
                        }
                    </div>
                )
            })}

            {dataArray.map((info, index) => (
                <React.Fragment key={index}>
                    {Object.values(info).map((infoTwo, infoIndex) => {
                        return (
                            <>
                                {Array.isArray(infoTwo)
                                    ? 
                                        <div className={`
                                            grid-item 
                                            grid-item-song-titles
                                            ${infoTwo.length > 5 ? "grid-item-song-titles-min-height" : "" }
                                        `}
                                        >
                                            <ul>
                                                {infoTwo.map((val, index) => (
                                                    <li key={index}>
                                                        {val}
                                                    </li>
                                                )
                                                )}
                                            </ul>
                                        </div>
                                    : 
                                        <div className="grid-item">
                                            {infoTwo}
                                        </div>
                                }
                            </>
                        )
                    })}
                </React.Fragment>
            ))}

        </div>
    </>
  )
}

export default CarouselGrid

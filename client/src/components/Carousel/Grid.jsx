import React, { useState, useEffect, useRef } from 'react'
import { sortNumerically, sortAlphabetically } from "../../helper/TableColumnHelperMethods"
import "./Grid.css"

const Grid = ({ grid }) => {
    const [dataArray, setDataArray] = useState([])
    const [columnToggles, setColumnToggles] = useState([])
    const gridRef = useRef(null);
    const columnRefs = []
    const headers = grid.headers
    const columnSortable = grid.columnSortable
    const columnValues = grid.columnValues
    const initiallySortByColumn = grid.initiallySortByColumn
    const data = grid.data

    useEffect(() => {
        // set number of columns - column count is different per grid
        gridRef.current.style.setProperty('--headerLength',headers.length);

        var initialDataArray = []
        for (let [key, value] of Object.entries(data)) {
            var gridItem = {}
            for (let x = 0; x < headers.length; x++) {
                const currentColumnValue = columnValues[x]
                var item
                if(currentColumnValue === "useKey") {
                    // keys are always converted to string so the years get confused as strings
                    var parsedKey = parseInt(key)
                    item = parsedKey ? parsedKey : key
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
        toggleSortArrows(columnIndex)
    }

    const determineColumnTypeAndSort = (columnType, dataArray, columnToggle, colVal) => {
        if(columnType === "string") {
            return sortAlphabetically(dataArray, columnToggle, colVal)
        } else if (columnType === "number") {
            return sortNumerically(dataArray, columnToggle, colVal)
        } else { //array
            return null
        }
    }

    const toggleSortArrows = (index) => {
        for(const [refIndex, ref] of Object.entries(columnRefs)) {
            if(refIndex === index) {
                // handle switching the arrows for column that was clicked
                for(const [ , child] of Object.entries(ref.children)) {
                    if(child.className.includes("grid__sortable-icons")) {
                        if(columnToggles[index] && columnToggles[index] !== null && columnToggles[index] !== undefined) {
                            child.children[0].className += " grid__hidden-arrow"
                            child.children[1].className = child.children[1].className.replaceAll("grid__hidden-arrow", "");
                        } else {
                            child.children[1].className += " grid__hidden-arrow"
                            child.children[0].className = child.children[0].className.replaceAll("grid__hidden-arrow", "");
                        }
                    }
                }
            } else {
                // handle clearing the arrows for other columns
                for(const [ , child] of Object.entries(ref.children)) {
                    if(child.className.includes("grid__sortable-icons")) {
                        for(const innerChild of child.children) {
                            innerChild.className = innerChild.className.replaceAll("grid__hidden-arrow", "");
                        }
                    }
                }
            }
        }
    }


  return (
    <>
        <div className="grid__container" ref={gridRef}>
            {headers.map((header, index) => {
                return (
                    <div
                        className={`grid__header ${columnSortable[index] ? "grid__header-toggle-sort " : ""}`}
                        onClick={columnSortable[index] ? () => sortColumn(index) : null}
                        ref={ref => columnRefs.push(ref) }
                        key={index}
                    >
                        <b className="grid__table-header">
                            {header}
                        </b>
                        {columnSortable[index]
                            ?   <div className="grid__sortable-icons">
                                    <div className="grid__arrow">
                                        &#9650;
                                    </div>
                                    <div className={`grid__arrow ${index === 1 ? 'grid__hidden-arrow' : ""}`}>
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
                            <React.Fragment key={infoIndex}>
                                {Array.isArray(infoTwo)
                                    ? 
                                        <div className={`
                                            grid__item
                                            grid__item-song-titles
                                            ${infoTwo.length > 5 ? "grid__item-song-titles-min-height" : "" }
                                            ${index % 2 === 0 ? "grid__item-even-column" : ""}
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
                                        <div className={`
                                            grid__item
                                            ${index % 2 === 0 ? "grid__item-even-column" : ""}
                                        `}>
                                            {infoTwo}
                                        </div>
                                }
                            </React.Fragment>
                        )
                    })}
                </React.Fragment>
            ))}
        </div>
    </>
  )
}

export default Grid

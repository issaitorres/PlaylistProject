const sortNumerically = (dataArray, toggle, colVal, reverse=false) => {
    const val = toggle ? -1 : 1
    const sortedData = [...dataArray].sort((a, b) => val * b[colVal] - val * a[colVal])
    if(reverse) {
        return sortedData.reverse()
    }
    return sortedData    
}


const sortAlphabetically = (dataArray, toggle, colVal, reverse=false) => {
    const val = toggle ? -1 : 1
    const sortedData = [...dataArray].sort((a,b) => a[colVal] < b[colVal] ? val * -1 : val * 1)
    if(reverse) {
        return sortedData.reverse()
    }
    return sortedData
}


export { sortNumerically, sortAlphabetically }
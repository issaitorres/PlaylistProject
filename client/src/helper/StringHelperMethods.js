const truncateString = (str, truncateLength) => {
    if( str.length <= truncateLength) {
        return str
    }
    return `${str.slice(0,truncateLength)}...`
}


export { truncateString }
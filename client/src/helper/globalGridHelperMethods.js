
const toggleSortArrows = (previousSortArrowsRef, newSortArrows, columnIndex, columnToggles) => {
    var oldSortArrows = previousSortArrowsRef.current
    var upArrow
    var downArrow

    // clear old sort arrows
    upArrow = oldSortArrows.children[1].children[0]
    downArrow = oldSortArrows.children[1].children[1]
    upArrow.className = upArrow.className.replaceAll(" hide-visibility", " ");
    downArrow.className = downArrow.className.replaceAll(" hide-visibility", " ");

    // update new arrows
    upArrow = newSortArrows.children[1].children[0]
    downArrow = newSortArrows.children[1].children[1]
    if(columnToggles[columnIndex] && columnToggles[columnIndex] !== null && columnToggles[columnIndex] !== undefined) {
        upArrow.className += " hide-visibility"
        downArrow.className = downArrow.className.replaceAll(" hide-visibility", " ");
    } else {
        downArrow.className += " hide-visibility"
        upArrow.className = upArrow.className.replaceAll(" hide-visibility", " ");
    }

    previousSortArrowsRef.current = newSortArrows
}

export { toggleSortArrows }
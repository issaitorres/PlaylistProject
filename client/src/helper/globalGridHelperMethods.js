
// include space in hidden arrow - " trackgrid__hidden-arrow"
const toggleSortArrows = (index, columnRefs, columnToggles, sortableIconsClassname, gridHiddenArrowClassname) => {
    for(const [refIndex, ref] of Object.entries(columnRefs)) {
        if(Number(refIndex) === index) {
            // handle switching the arrows for column that was clicked
            for(const [ , child] of Object.entries(ref.children)) {
                if(child.className.includes(sortableIconsClassname)) {
                    if(columnToggles[index] && columnToggles[index] !== null && columnToggles[index] !== undefined) {
                        child.children[0].className += gridHiddenArrowClassname
                        child.children[1].className = child.children[1].className.replaceAll(gridHiddenArrowClassname, " ");
                    } else {
                        child.children[1].className += gridHiddenArrowClassname
                        child.children[0].className = child.children[0].className.replaceAll(gridHiddenArrowClassname, " ");
                    }
                }
            }
        } else {
            // handle clearing the arrows for other columns
            for(const [ , child] of Object.entries(ref.children)) {
                if(child.className.includes(sortableIconsClassname)) {
                    for(const innerChild of child.children) {
                        innerChild.className = innerChild.className.replaceAll(gridHiddenArrowClassname, " ");
                    }
                }
            }
        }
    }
}

export { toggleSortArrows }
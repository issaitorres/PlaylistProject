import { convertMStoFormat } from "./PlaylistContainerHelperMethods"


const trackTableConversions = (value, convertType=false) => {
    if (!convertType) {
        return value
    } else if (convertType === "percent") {
        return Math.ceil(value * 100)

    } else if (convertType === "key") {
        const keyConversion = {
            0: "C",
            1: "C♯/D♭",
            2: "D",
            3: "D♯/F♭",
            4: "E",
            5: "F",
            6: "F♯/G♭",
            7: "G",
            8: "G♯/A♭",
            9: "A",
            10: "A♯/B♭",
            11: "B",
        }
        return keyConversion[value]

    } else if (convertType === "mode") {
        if(value === 1) {
            return "Major"
        }
        return "Minor"

    } else if (convertType === "db") {
        return Math.ceil(value)

    } else if (convertType === "time_signature") {
        return value

    } else if (convertType === "duration") {
        return convertMStoFormat(value, true, true)
    } else if (convertType === "bool") {
        return value.toString()
    } else {
        return 0
    }
}


const toggleSound = (e) => {
    var parent = e.target.parentNode
    var audioElem
    var playIcon
    var pauseIcon
    var newClass

    // get audio tag, play and pause svg tags
    for (const child of parent.children) {
        if(child.tagName === "BUTTON") {
            for(const innerChild of child.children) {
                if(innerChild.getAttribute("data-icon") === "play") {
                    playIcon = innerChild
                }
                if(innerChild.getAttribute("data-icon") === "pause") {
                    pauseIcon = innerChild
                }
            }
        }

        if(child.tagName === "AUDIO") {
            audioElem = child
        }
    }



    if (audioElem.paused) {
        audioElem.play();
        playIcon.setAttribute('class', (playIcon.getAttribute("class") || '') + "trackgrid__hidden-button")
        newClass = pauseIcon.getAttribute("class").replaceAll("trackgrid__hidden-button", "");
        pauseIcon.setAttribute('class', newClass)
    } else {
        audioElem.pause();
        pauseIcon.setAttribute('class', (pauseIcon.getAttribute("class") || '') + "trackgrid__hidden-button")
        newClass = playIcon.getAttribute("class").replaceAll("trackgrid__hidden-button", "");
        playIcon.setAttribute('class', newClass)
    }
}


export { trackTableConversions, toggleSound }
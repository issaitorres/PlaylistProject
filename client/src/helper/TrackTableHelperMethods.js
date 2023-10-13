import { convertMStoFormat } from "./PlaylistContainerHelperMethods"


const trackTableConversions = (value, convertType=false) => {
    if(value === -99) return -99 // handle missing

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


export { trackTableConversions }

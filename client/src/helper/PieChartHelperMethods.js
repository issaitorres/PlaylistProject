import { truncateString } from "../helper/StringHelperMethods"


const separateExplicitCleanTrackTitles = (trackTable) => {
    var explicitTrackTitles = []
    var cleanTrackTitles = []
    for(const track of Object.values(trackTable)) {
        if(track.trackExplicit) {
            explicitTrackTitles.push(track.trackName)
        } else {
            cleanTrackTitles.push(track.trackName)
        }
    }
    return [explicitTrackTitles, cleanTrackTitles]
}


const explicitPieChartProperties = (explicitTrackTitlesLength, cleanTrackTitlesLength, totalTrackCount) => {
    var dataTrack = []
    var labels = []
    var backgroundColor = []
    var borderWidth = 0
    var hoverBorderWidth = 0
    const blueColor = 'rgba(43, 130, 204, transparency)'
    const redColor = 'rgba(255, 99, 132, transparency)'

    if (explicitTrackTitlesLength == 0) {
        dataTrack.push(cleanTrackTitlesLength)
        labels.push("Clean")
        backgroundColor.push(blueColor)
    } else if (explicitTrackTitlesLength == totalTrackCount) {
        dataTrack.push(explicitTrackTitlesLength)
        labels.push("Explicit")
        backgroundColor.push(redColor)
    } else {
        dataTrack.push(explicitTrackTitlesLength)
        dataTrack.push(cleanTrackTitlesLength)
        labels.push("Explicit")
        labels.push("Clean")
        backgroundColor.push(redColor)
        backgroundColor.push(blueColor)
        borderWidth = 1
        hoverBorderWidth = 2
    }
    return [dataTrack, labels, backgroundColor, borderWidth, hoverBorderWidth]
}


const explicitTooltipCallbacks = (context, explicitTrackTitles, cleanTrackTitles, trackTitleDisplaylimit) => {
    const totalTrackTitlesLength = explicitTrackTitles.length + cleanTrackTitles.length
    var trackTitles = context[0].label == "Explicit" ? explicitTrackTitles : cleanTrackTitles

    const calculatePercentage = (trackTitlesLength, totalTrackTitlesLength) => {
        return Math.round((trackTitlesLength/(totalTrackTitlesLength)) * 100)
    }

    if(trackTitles.length > 0 && trackTitles.length < 50 ) {
        const addEllipses = trackTitles.length > trackTitleDisplaylimit ? true : false
        const limitedTitles = trackTitles.slice(0, trackTitleDisplaylimit)
        var songTitles = `${context[0].label} (${calculatePercentage(trackTitles.length, totalTrackTitlesLength)}%)\n`
        limitedTitles.forEach((trackTitle) => {
            songTitles += `\n${truncateString(trackTitle, 40)}`
        })
        if(addEllipses) songTitles += "\n..." 

        return songTitles
    }

    return `${context[0].label} (${calculatePercentage(trackTitles.length, totalTrackTitlesLength)}%)`
}


const explicitDataLabelsFormatter = (value, totalTrackCount) => {
    return "\n" + Math.round((value/totalTrackCount)*100) + "%"
}


const decadesPieChartProperties = (trackTable) => {
    var labels = []
    var dataTrack= []
    var decades = {}
    var backgroundColor = []
    var borderWidth = 0
    var hoverBorderWidth = 0
    const blueColor = 'rgba(43, 130, 204, transparency)'

    // color must now be the same as the background! ever!
    function random_rgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 'transparency' + ')';
    }
    
    for(const track of trackTable) {
        var decade = Math.floor(track.album.albumReleaseYear / 10) * 10

        if(decades[decade]) {
            // check for duplicate trackId too
            if(decades[decade][track.trackId]) {
                //null
            } else {
                decades[decade][track.trackId] = track.trackName
            }

        } else {
            var newDecade = {}
            newDecade[track.trackId] = track.trackName
            decades[decade] = newDecade
        }
    }

    if(Object.keys(decades).length > 1) {
        Object.keys(decades).forEach((decade) => {
            backgroundColor.push(random_rgba())
        })
        borderWidth = 1
        hoverBorderWidth = 2
    } else {
        backgroundColor.push(blueColor)
    }

    labels = Object.keys(decades)
    dataTrack = Object.values(decades).map(decade => Object.values(decade).length)

    return [decades, dataTrack, labels, backgroundColor, borderWidth, hoverBorderWidth]
}



const decadesToolTipCallbacks = (context, decades, trackTitleDisplaylimit, totalTrackCount) => {
    var trackTitles = Object.values(decades[context[0].label])
    if(trackTitles.length > 0 && trackTitles.length < 50 ) {
        const addEllipses = trackTitles.length > trackTitleDisplaylimit ? true : false
        const limitedTitles = trackTitles.slice(0, trackTitleDisplaylimit)
        var songTitles = `${context[0].label}s (${Math.round((trackTitles.length/totalTrackCount) * 100)}%)\n`
        limitedTitles.forEach((trackTitle) => {
            songTitles += `\n${truncateString(trackTitle, 40)}`
        })

        if(addEllipses) songTitles += "\n..." 
        return songTitles
    }
}


const decadesDataLabelsFormatter = (value, context) => {
    return context.chart.data.labels[context.dataIndex].slice(-2) + "s"
}


export { 
    separateExplicitCleanTrackTitles,
    explicitPieChartProperties,
    explicitTooltipCallbacks,
    explicitDataLabelsFormatter,
    decadesPieChartProperties,
    decadesToolTipCallbacks,
    decadesDataLabelsFormatter
}
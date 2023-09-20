import { truncateString } from "./StringHelperMethods"


// get the index of the nth time pat appears in a string
const nthIndex = (str, pat, n) => {
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}


const getRangeColors = (dataset) => {
    // top 10% - top 25% - top 50% - bottom 50% - bottom 10% relative to the max
    const bottomTenPercentColor = '#ffbb33'
    const bottomFiftyPercentColor = '#878dc1'
    const topFiftyPercentColor = '#b840dc'
    const topTwentyFivePrecentColor = '#559bea'
    const topTenPrecentColor = '#ed1f4f'

    var max = Math.max(...dataset)
    const rangeColors = dataset.map((amount) =>{
        var color
        if(amount < Math.ceil(max * .1)) {
            color = bottomTenPercentColor
        } else if ( amount >= Math.ceil(max * .1) && amount < Math.ceil(max * .5)) {
            color = bottomFiftyPercentColor
        } else if ( amount >= Math.ceil(max * .5) && amount < Math.ceil(max * .75)) {
            color = topFiftyPercentColor
        } else if ( amount >= Math.ceil(max * .75) && amount < Math.ceil(max * .9)) {
            color = topTwentyFivePrecentColor
        } else {
            color = topTenPrecentColor
        }
        return color
    })
    return rangeColors
}


//group the data for graph
const groupObjectValuesByFrequency = (object) => {
    const result = {}
    for (let [key, value] of Object.entries(object)) {
        if(result[value] != undefined) {
            result[value].push(key)
        } else {
            result[value] = [key]
        }
    }
    return result
}


const setLabelsAndDataset = (data, xData, yData,  useKeyForxData, useValueForLabels, groupData) => {
    var labels
    var dataset
    if (groupData) {
        var grouped = {}
        for (let [key, info] of Object.entries(data)) {
            if(useKeyForxData) {
                grouped[key] = info[yData]
            } else {
                grouped[info[xData]] = info[yData]
            }
        }

        var groupedData = groupObjectValuesByFrequency(grouped)
        labels = Object.values(groupedData)
        dataset = Object.keys(groupedData)
    } else {
        dataset = Object.values(data).map((info) => {
            return info[yData]
        })
        if(useValueForLabels) {
            labels = Object.values(data).map((obj) => {
                return obj[useValueForLabels]
            })
        } else {
            labels = Object.keys(data)
        }
    }
    return [labels, dataset]
}

const yearsTooltipCallbackTitle = (context, data) => {
        var songs = `${context[0].label}\n`
        for( const [index, track] of data[Number(context[0].label)].trackNames.entries()) {
            if(index > 25) {
                songs += "\n..."
                break
            } else {
                songs += `\n${truncateString(track, 40)}`
            }
        }
        return songs
}

const artistGenreTooltipCallbackTitle = (context) => {
    if(context[0].label.includes(",")) {
        var limit = nthIndex(context[0].label,',',25)
        if (limit !== -1) {
            var sub = context[0].label.substring(0, limit)
            sub += ",..."
            return sub.replaceAll(",", "\n")
        }
        return context[0].label.replaceAll(",", "\n")
    }
    return context.dataset
}


const minimizeTicksCallback = (data, label) => {
    var shortenXLabel = data.getLabelForValue(label).slice(0,4)
    if(shortenXLabel.length == 4) {
        shortenXLabel.push("...")
    }
    return shortenXLabel
}


const labelTooltipCallback = (context) => {
    return `${context.formattedValue} ${context.formattedValue > 1 ? 'songs' : 'song'}`
}


export {
    nthIndex,
    getRangeColors,
    setLabelsAndDataset,
    yearsTooltipCallbackTitle,
    artistGenreTooltipCallbackTitle,
    minimizeTicksCallback,
    labelTooltipCallback
}
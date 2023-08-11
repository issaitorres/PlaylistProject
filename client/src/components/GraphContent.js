import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';



const GraphContent = ({ 
        data, 
        graphTitle, 
        xTitleText, 
        YTitleText, 
        customTicks, 
        customTooltip, 
        groupData, 
        xData, 
        yData,
        useKeyForxData,
        useValueForLabels
    }) => {
    const lowColor = 'rgba(255, 99, 132, 0.5)'
    const midlLowColor = 'rgba(135, 141, 193, 1)'
    const midlHighColor = 'rgba(184, 64, 193, 1)'
    const highColor = 'rgba(85, 155, 234, 1)'
    var labels
    var dataset

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        SubTitle,
        Tooltip,
        Legend,
        zoomPlugin
    );


    const yearsTooltipCallback =  {
        title: (context) => {
            const truncateString = (str, truncateLength) => {
                if( str.length <= truncateLength) {
                    return str
                }
                return `${str.slice(0,truncateLength)}...`
            }

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
        },
        label: (context) => {
            return `${context.formattedValue} ${context.formattedValue > 1 ? 'songs' : 'song'}`
        },
    }

    const nthIndex = (str, pat, n) => {
        var L= str.length, i= -1;
        while(n-- && i++<L){
            i= str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }

    const artistGenreTooltipCallback = {
        title: (context) => {
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
        },
        label: (context) => {
            return `${context.formattedValue} ${context.formattedValue > 1 ? 'songs' : 'song'}`
        },
    }

    const artistGenreTicksCallback = {
        callback: function(label) {
            var shortenXLabel = this.getLabelForValue(label).slice(0,4)
            if(shortenXLabel.length == 4) {
                shortenXLabel.push("...")
            }
            return shortenXLabel
        },
        color: "black",
        font: {
            size: 12.5
        }
    }

    const customCallbacks = {
        "yearsTooltip": yearsTooltipCallback,
        "artistGenreTicks" : artistGenreTicksCallback,
        "artistGenreTooltip": artistGenreTooltipCallback
    }

    const options = {

        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: graphTitle,
                font: {
                    size: 25
                },
                color: "black"
            },
            subtitle: {
                display: true,
                text: "zoom with scroll wheel, pan with click and drag or pinch",
                font: {
                    size: 18
                },
                color: "black"
            },
            tooltip: {
                enabled: true,
                callbacks: customTooltip ? customCallbacks[customTooltip] : {}
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                    threshold: 1,
                    scaleMode: 'x'
                },
                zoom: {
                    pinch: {
                        enabled: true       // Enable pinch zooming
                    },
                    wheel: {
                        enabled: true       // Enable wheel zooming
                    },
                    mode: 'x',
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xTitleText,
                    font: {
                        size: 20
                    },
                    color: "black"
                },
                ticks: customTicks ? customCallbacks[customTicks] : {color: "black"},
            },
            y: {
                title: {
                    display: true,
                    text: YTitleText,
                    font: {
                        size: 20
                    },
                    color: "black"
                },
                ticks: {
                    color: "black"
                }
            },
        },
    };



    if (groupData) {
        var grouped = {}
        for (let [key, info] of Object.entries(data)) {
            if(useKeyForxData) {
                grouped[key] = info[yData]
            } else {
                grouped[info[xData]] = info[yData]
            }
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


    var max = Math.max(...dataset)
    const rangeColors = dataset.map((amount) =>{
        var color
        if(amount < Math.ceil(max * .2)) {
            color = lowColor
        } else if ( amount > Math.ceil(max * .2) && amount < Math.ceil(max * .4)) {
            color = midlLowColor
        } else if ( amount > Math.ceil(max * .4) && amount < Math.ceil(max * .6)) { 
            color = midlHighColor
        } else {
            color = highColor
        }
        return color
    })


    const barData = {
        labels: labels,
        datasets: [
            {
                data: dataset,
                backgroundColor: rangeColors,
                font: {
                    size: 20
                }
            },
        ],
    };

  return (
        <Bar options={options} data={barData}/>
  )
}

export default GraphContent
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


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
        Tooltip,
        Legend
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
            data[Number(context[0].label)].trackNames.forEach((name) => {
                songs += `\n${truncateString(name, 40)}`
            })
            return songs
        },
        label: (context) => {
            return `${context.formattedValue} ${context.formattedValue > 1 ? 'songs' : 'song'}`
        },
    }

    const artistGenreTooltipCallback = {
        title: (context) => {
            if(context[0].label.includes(",")) {
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
                text: "hover for more info",
                font: {
                    size: 14
                },
                color: "black"
            },
            tooltip: {
                enabled: true,
                callbacks: customTooltip ? customCallbacks[customTooltip] : {}
            },
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
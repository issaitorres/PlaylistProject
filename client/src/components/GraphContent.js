import { useRef } from 'react'
import { Bar } from 'react-chartjs-2';
import { nthIndex, getRangeColors, setLabelsAndDataset } from "../helper/GraphContentHelperMethods"
import "../ChartJS"
import { truncateString } from "../helper/StringHelperMethods"


const GraphContent = ({ graph }) => {
    const chartRef = useRef(null)
    const data = graph.data
    const graphTitle = graph.graphTitle
    const xAxisTitle = graph.xAxisTitle
    const yAxisTitle = graph.yAxisTitle
    const customTicks = graph.customTicks
    const customTooltip = graph.customTooltip
    const groupData = graph.groupData
    const xData = graph.xData
    const yData = graph.yData
    const useKeyForxData = graph.useKeyForxData
    const useValueForLabels = graph.useValueForLabels
    var [labels, dataset] = setLabelsAndDataset(data, xData, yData, useKeyForxData, useValueForLabels, groupData)
    const rangeColors = getRangeColors(dataset)

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
        ]
    };

    const handleResetZoom = () => {
        if(chartRef && chartRef.current) {
            chartRef.current.resetZoom()
        }
    }

    const yearsTooltipCallback =  {
        title: (context) => {
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
            customButton: {
                display: true,
                text: "hello"
            },
            legend: {
                display: false
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
                        enabled: true
                    },
                    wheel: {
                        enabled: true
                    },
                    mode: 'x',
                }
            },
            datalabels: {
                display: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisTitle,
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
                    text: yAxisTitle,
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

  return (
        <>
            <Bar id="myChart" ref={chartRef} options={options} data={barData}/>
            <button onClick={handleResetZoom}>Reset Zoom</button>
            {/* <button onClick={draw}>draw</button> */}
        </>
  )
}

export default GraphContent
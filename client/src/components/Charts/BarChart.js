import { useRef } from 'react'
import { Bar } from 'react-chartjs-2';
import {
    getRangeColors,
    setLabelsAndDataset,
    yearsTooltipCallbackTitle,
    artistGenreTooltipCallbackTitle,
    minimizeTicksCallback,
    labelTooltipCallback
} from "../../helper/BarChartHelperMethods"
import { truncateString } from "../../helper/StringHelperMethods"
import "../../ChartJS"


const BarChart = ({ graph }) => {
    const chartRef = useRef(null)
    const data = graph.data
    const graphTitle = graph.graphTitle
    const xAxisTitle = graph.xAxisTitle
    const yAxisTitle = graph.yAxisTitle
    const minimizeTicks = graph.minimizeTicks
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

    // const handleResetZoom = () => {
    //     if(chartRef && chartRef.current) {
    //         chartRef.current.resetZoom()
    //     }
    // }

    const yearsTooltipCallback =  {
        title: (context) => yearsTooltipCallbackTitle(context, data),
        label: (context) => labelTooltipCallback(context)
    }

    const artistGenreTooltipCallback = {
        title: (context) => artistGenreTooltipCallbackTitle(context),
        label: (context) => labelTooltipCallback(context)
    }


    const customCallbacks = {
        "yearsTooltip": yearsTooltipCallback,
        "artistGenreTooltip": artistGenreTooltipCallback
    }

    const options = {
        // keeps animation on tooltip instead of animation: false
        animation: {
            duration: 0
        },
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
                // "this" keyword is specific to where it is called
                // so this can only work here and function(label) is different from arrow function
                // this specific case needs function(label)
                ticks: {
                    callback: function(label) {
                        var newLabel = minimizeTicks
                            ? minimizeTicksCallback(this, label)
                            : truncateString(this.getLabelForValue(label), 20)
                        return newLabel
                    },
                    color: "black",
                    font: {
                        size: 12.5
                    }
                }

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
            {/* <button onClick={handleResetZoom}>Reset Zoom</button> */}
        </>
  )
}

export default BarChart
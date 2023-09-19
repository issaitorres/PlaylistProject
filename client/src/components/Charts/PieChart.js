import React from 'react'
import { Pie } from 'react-chartjs-2';
import { 
    separateExplicitCleanTrackTitles,
    explicitPieChartProperties,
    explicitTooltipCallbacks,
    explicitDataLabelsFormatter,
    decadesPieChartProperties,
    decadesToolTipCallbacks,
    decadesDataLabelsFormatter
} from "../../helper/PieChartHelperMethods"


const PieChart = ({trackTable, title, type}) => {
    const totalTrackCount = trackTable.length
    const trackTitleDisplaylimit = 16

    if (type == "explicit") {
        const [explicitTrackTitles, cleanTrackTitles] = separateExplicitCleanTrackTitles(trackTable)
        var [
            dataTrack, 
            labels, 
            backgroundColor, 
            borderWidth, 
            hoverBorderWidth
        ] = explicitPieChartProperties(explicitTrackTitles.length, cleanTrackTitles.length, totalTrackCount)
        var dataLabelsFormatter = (value, context) => {
            return explicitDataLabelsFormatter(value, totalTrackCount) 
        }
        var tooltipCallbacks = (context) => {
            return explicitTooltipCallbacks(context, explicitTrackTitles, cleanTrackTitles, trackTitleDisplaylimit)
        }
        var legendDisplay = true
        var subtitlePadding = {}

    } else if (type == "decades") {
        var [
            decades,
            dataTrack,
            labels,
            backgroundColor, 
            borderWidth, 
            hoverBorderWidth
        ] = decadesPieChartProperties(trackTable)

        var dataLabelsFormatter = (value, context) => {
            return decadesDataLabelsFormatter(value, context)
        }
        var tooltipCallbacks = (context) => {
            return decadesToolTipCallbacks(context, decades, trackTitleDisplaylimit, totalTrackCount)
        }
        var legendDisplay = false
        var subtitlePadding = {
            bottom: 26
        }
    }


    const data = {
        labels: labels,
        datasets: [
            {
                label: '# of songs',
                data: dataTrack,
                backgroundColor: backgroundColor.map((item) => item.replace("transparency", "0.5")),
                borderColor: backgroundColor.map((item) => item.replace("transparency", "1")),
                borderWidth: borderWidth,
                hoverBorderWidth: hoverBorderWidth,
                hoverBackgroundColor: backgroundColor.map((item) => item.replace("transparency", "0.7"))
            }
        ]
    }


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins : {
            legend: {
                display: legendDisplay,
                labels: {
                    color: "black",
                    font: {
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 26
                },
                color: "black"
            },
            subtitle: {
                display: true,
                text: "hover for more info",
                font: {
                    size: 14
                },
                padding: subtitlePadding,
                color: "black"
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    title: (context) => {
                        return tooltipCallbacks(context)
                    },
                    label: (context) => {
                        return `${context.formattedValue} ${context.formattedValue > 1 ? 'songs' : 'song'}`
                    }
                }
            },
            datalabels: {
                // display datalabel if percentage is greater than 10%
                display: function(context) {
                    const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val)
                    const curr = context.chart.data.datasets[0].data[context.dataIndex]
                    return curr > (Math.floor(total/10)) ? true : false
                  },
                color: 'black',
                align: "end",
                offset: 10,
                font: {
                    weight: "bold",
                    size: 14,
                    color: "black"
                },
                padding: {
                    right: 30,
                    bottom: 15
                },
                formatter: (value, context) => dataLabelsFormatter(value, context)
            }
        }
    }


    return (
        <Pie
            redraw={true}
            data={data} 
            options={options}
        />
    )
}

export default PieChart

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
import "../../ChartJS"


const PieChart = ({trackTable, title, type}) => {
    const totalTrackCount = trackTable.length
    const trackTitleDisplaylimit = 16
    var dataLabelsFormatter, tooltipCallbacks, legendDisplay, subtitlePadding, decades
    if (type === "explicit") {
        const [explicitTrackTitles, cleanTrackTitles] = separateExplicitCleanTrackTitles(trackTable);
        var [
            dataTrack, 
            labels, 
            backgroundColor, 
            borderWidth, 
            hoverBorderWidth
        ] = explicitPieChartProperties(explicitTrackTitles.length, cleanTrackTitles.length, totalTrackCount)
        dataLabelsFormatter = (value, context) => {
            return explicitDataLabelsFormatter(value, totalTrackCount) 
        }
        tooltipCallbacks = (context) => {
            return explicitTooltipCallbacks(context, explicitTrackTitles, cleanTrackTitles, trackTitleDisplaylimit)
        }
        legendDisplay = true
        subtitlePadding = {}

    } else if (type === "decades") {
        [
            decades,
            dataTrack,
            labels,
            backgroundColor, 
            borderWidth, 
            hoverBorderWidth
        ] = decadesPieChartProperties(trackTable)

        dataLabelsFormatter = (value, context) => {
            return decadesDataLabelsFormatter(value, context)
        }
        tooltipCallbacks = (context) => {
            return decadesToolTipCallbacks(context, decades, trackTitleDisplaylimit, totalTrackCount)
        }
        legendDisplay = false
        subtitlePadding = {
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
            data={data} 
            options={options}
        />
    )
}

export default PieChart

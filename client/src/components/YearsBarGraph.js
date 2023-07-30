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

const YearsBarGraph = ({ frequency, graphTitle, xTitleText, YTitleText }) => {

    const underFiveColor = 'rgba(255, 99, 132, 0.5)'
    const fiveToTenColor = 'rgba(135, 141, 193, 1)'
    const tenToTwentyFiveColor = 'rgba(184, 64, 193, 1)'
    const twentyFivePlusColor = 'rgba(85, 155, 234, 1)'

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

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
            }
        },
        tooltip: {
            enabled: true,
            callbacks: {
                title: (context) => {
                    const truncateString = (str, truncateLength) => {
                        if( str.length <= truncateLength) {
                            return str
                        }

                        return `${str.slice(0,truncateLength)}...`
                    }

                    var songs = `${context[0].label}\n`
                    frequency[Number(context[0].label)].tracks.forEach((name) => {
                        songs += `\n${truncateString(name, 40)}`
                    })

                    return songs
                },
                label: (context) => {
                    return `${context.formattedValue} ${context.formattedValue > 1 ? 'songs' : 'song'}`
                },
            }
        },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xTitleText,
                    font: {
                        size: 20
                    }
                },
                // ticks: {
                //     callback: function(label) {
                //         var shortenXLabel = this.getLabelForValue(label).slice(0,4)
                //         if(shortenXLabel.length == 4) {
                //             shortenXLabel.push("...")
                //         }
                //         return shortenXLabel
                //     }
                // }
            },
            y: {
                title: {
                    display: true,
                    text: YTitleText,
                    font: {
                        size: 20
                    }
                },
            },
        },
    };



    const labels = Object.keys(frequency)

    const rangeColors = Object.values(frequency).map((trackInfo) =>{
        var color
        var trackCount = trackInfo.trackCount
        if(trackCount < 5) {
            color = underFiveColor
        } else if ( trackCount > 5 && trackCount < 10) {
            color = fiveToTenColor
        } else if ( trackCount > 10 && trackCount < 25) { 
            color = tenToTwentyFiveColor
        } else {
            color = twentyFivePlusColor
        }
        return color
    })

    const trackCounts = Object.values(frequency).map((trackInfo) => {
        return trackInfo.trackCount
    })

    const data = {
        labels,
        datasets: [
            {
                data: trackCounts,
                backgroundColor: rangeColors,
                font: {
                size: 20
                }
            },
        ],
    };

  return (
        <Bar options={options} data={data}/>
  )
}

export default YearsBarGraph
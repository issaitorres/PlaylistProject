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

const ArtistPopularityGraph = ({ frequency, graphTitle, xTitleText, YTitleText }) => {

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
                // title: (context) => {
                //     const truncateString = (str, truncateLength) => {
                //         if( str.length <= truncateLength) {
                //             return str
                //         }

                //         return `${str.slice(0,truncateLength)}...`
                //     }

                //     var songs = `${context[0].label}\n`
                //     frequency[Number(context[0].label)].tracks.forEach((name) => {
                //         songs += `\n${truncateString(name, 40)}`
                //     })

                //     return songs
                // },
                // label: (context) => {
                //     return `${context.formattedValue} ${context.formattedValue > 1 ? 'songs' : 'song'}`
                // },
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



    const artistNames = frequency.map((obj) => {
        return obj.artistName
    })
    const artistPopularityScore = frequency.map((obj) => {
        return obj.popularity
    })
    const rangeColors = Object.values(artistPopularityScore).map((popularity) =>{
        var color
        if(popularity < 20) {
            color = underFiveColor
        } else if ( popularity > 20 && popularity < 40) {
            color = fiveToTenColor
        } else if ( popularity > 40 && popularity < 60) { 
            color = tenToTwentyFiveColor
        } else {
            color = twentyFivePlusColor
        }
        return color
    })



    const data = {
        labels: artistNames,
        datasets: [
            {
                data: artistPopularityScore,
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

export default ArtistPopularityGraph
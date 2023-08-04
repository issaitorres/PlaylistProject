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

const ArtistBarGraph = ({ artistData, graphTitle, xAxisTitle, yAxisTitle }) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        SubTitle,
        Tooltip,
        Legend
    );

    //name - number
    var onlyNameAndNumber = {}
    Object.values(artistData).map((artistInfo) => {
        onlyNameAndNumber[artistInfo.artistName] = artistInfo.songCount
    })

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

    var groupedData = groupObjectValuesByFrequency(onlyNameAndNumber)

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
            text: "hover for more info.",
            font: {
                size: 14
            },
            color: "black"

        },
        tooltip: {
            enabled: true,
            callbacks: {
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
        },
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
                ticks: {
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
                },
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

    var labels = Object.values(groupedData)
    // var labels = Object.values(artistData).map((artistInfo) => (
    //     artistInfo.artistName
    // ))


    console.log("\n label names")
    console.log(
        Object.values(artistData).map((artistInfo) => (
            artistInfo.artistName
        ))
    )


    console.log("\n artist songcount names")

    console.log(
        Object.values(artistData).map((artistInfo) => (
            artistInfo.songCount
        ))
    )


    var backgroundColor = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(135, 141, 193, 1)',
        'rgba(184, 64, 193, 1)',
        'rgba(85, 155, 234, 1)',
        'rgba(135, 190, 154, 1)',
        'rgba(85, 155, 234, 1)',
        'rgba(49, 208, 214, 1)',
        'rgba(220, 180, 251, 1)',
        'rgba(56, 172, 117, 1)',
        'rgba(70, 46, 130, 1)',
        'rgba(227, 56, 73, 1)'
    ]

    const data = {
        labels,
        datasets: [
        {
            data: Object.keys(groupedData),
            // data: Object.values(artistData).map((artistInfo) => (
            //     artistInfo.songCount
            // )),
            backgroundColor: backgroundColor,
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

export default ArtistBarGraph
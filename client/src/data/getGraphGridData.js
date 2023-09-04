const getGraphGridData = (artistSongsInfo, genreSongs, yearSongs ) => {
    return (
        [
            {
                title: "Artist",
                graph: {
                    data: artistSongsInfo,
                    graphTitle: 'Most common artists',
                    xAxisTitle: 'Artist',
                    yAxisTitle: '# of songs',
                    customTicks: "artistGenreTicks",
                    customTooltip: "artistGenreTooltip",
                    groupData: true,
                    xData: "artistName",
                    yData: 'trackCount',
                    useKeyForxData: false,
                    useValueForLabels: false
                },
                grid: {
                    title: "artist-information",
                    data: artistSongsInfo,
                    headers: ["Artist", "# of songs", "Songs"],
                    columnTypes: ["string", "number", ["string"]],
                    columnSortable: [true, true, false],
                    columnValues: ["artistName", "trackCount", "trackNames"],
                    initialSort: ["colTwoValue", "Number"]
                }
            },
            {
                title: "Genre",
                graph: {
                    data: genreSongs,
                    graphTitle: 'Most common genres',
                    xAxisTitle: 'Genre',
                    yAxisTitle: '# of songs',
                    customTicks: "artistGenreTicks",
                    customTooltip: "artistGenreTooltip",
                    groupData: true,
                    xData: "genre",
                    yData: 'trackCount',
                    useKeyForxData: true,
                    useValueForLabels: false
                },
                grid: {
                    title: "genre-information",
                    data: genreSongs,
                    headers: ["Genre", "# of songs", "Songs"],
                    columnTypes: ["string", "number", ["string"]],
                    columnSortable: [true, true, false],
                    columnValues: ["useKey", "trackCount", "trackNames"],
                    initialSort: ["colTwoValue", "Number"]
                }
            },
            {
                title: "Year",
                graph: {
                    data: yearSongs,
                    graphTitle: 'Most common years',
                    xAxisTitle: 'Year',
                    yAxisTitle: '# of songs',
                    customTicks: false,
                    customTooltip: "yearsTooltip",
                    groupData: false,
                    xData: "genre",
                    yData: 'trackCount',
                    useKeyForxData: false,
                    useValueForLabels: false
                },
                grid: {
                    title: "year-information",
                    data: yearSongs,
                    headers: ["Year", "# of songs", "Songs"],
                    columnTypes: ["number", "number", ["string"]],
                    columnSortable: [true, true, false],
                    columnValues: ["useKey", "trackCount", "trackNames"],
                    initialSort: ["colTwoValue", "Number"]
                }
            },
            {
                title: "Artist Popularity",
                graph: {
                    data: artistSongsInfo,
                    graphTitle: 'Artist Popularity',
                    xAxisTitle: 'Artist',
                    yAxisTitle: 'Popularity',
                    customTicks: false,
                    customTooltip: false,
                    groupData: false,
                    xData: "artistName",
                    yData: 'artistPopularity',
                    useKeyForxData: false,
                    useValueForLabels: "artistName"
                },
                grid: {
                    title: "artist-popularity-information",
                    data: artistSongsInfo,
                    headers: ["Artist", "Popularity", "# of songs"],
                    columnTypes: ["string", "number", "number"],
                    columnSortable: [true, true, true],
                    columnValues: ["artistName", "artistPopularity", "trackCount"],
                    initialSort: ["colTwoValue", "Number"]
                }
            }
        ]
    )
}
export default getGraphGridData

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
                    minimizeTicks: true,
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
                    columnSortable: [true, true, false],
                    columnValues: ["artistName", "trackCount", "trackNames"],
                    initiallySortByColumn: 1 // 0 indexed columns
                }
            },
            {
                title: "Genre",
                graph: {
                    data: genreSongs,
                    graphTitle: 'Most common genres',
                    xAxisTitle: 'Genre',
                    yAxisTitle: '# of songs',
                    minimizeTicks: true,
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
                    headers: ["Genre", "# of songs", "Songs", "Artists"],
                    columnSortable: [true, true, false, false],
                    columnValues: ["useKey", "trackCount", "trackNames", "trackArtists"],
                    initiallySortByColumn: 1 // 0 indexed columns

                }
            },
            {
                title: "Year",
                graph: {
                    data: yearSongs,
                    graphTitle: 'Most common years',
                    xAxisTitle: 'Year',
                    yAxisTitle: '# of songs',
                    minimizeTicks: false,
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
                    columnSortable: [true, true, false],
                    columnValues: ["useKey", "trackCount", "trackNames"],
                    initiallySortByColumn: 1 // 0 indexed columns

                }
            },
            {
                title: "Artist Popularity",
                graph: {
                    data: artistSongsInfo,
                    graphTitle: 'Artist Popularity',
                    xAxisTitle: 'Artist',
                    yAxisTitle: 'Popularity',
                    minimizeTicks: false,
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
                    columnSortable: [true, true, true],
                    columnValues: ["artistName", "artistPopularity", "trackCount"],
                    initiallySortByColumn: 1 // 0 indexed columns

                }
            }
        ]
    )
}
export default getGraphGridData

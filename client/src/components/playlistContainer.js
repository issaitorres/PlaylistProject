import axios from 'axios'
import { useCookies } from 'react-cookie'
import GridContent from './gridContent';
import GraphContent from './GraphContent';
import {
  convertMStoFormat,
  getArtistSongsInfo,
  getGenreSongs,
  getYearSongs,
  groupTopItemsByTrackcount,
  getShortestDuration,
  getLongestDuration
} from "../helper/PlaylistContainerHelperMethods"
import TrackGridContent from './TrackGridContent';
import "./playlistContainer.css"

const PlaylistContainer = ({ playlist, fetchPlaylists=null }) => {
  const { 
    _id: playlistObjectId,
    playlistId, 
    playlistName,
    playlistOwner,
    playlistImage,
    trackTable
   } = playlist

  const [cookies, setCookies] = useCookies(["access_token"])

  var artistSongsInfo = getArtistSongsInfo(trackTable)
  var genreSongs = getGenreSongs(trackTable)
  var yearSongs = getYearSongs(trackTable)

  const trackCount = Object.keys(trackTable).length
  const artistCount = Object.keys(artistSongsInfo).length
  const topArtists = groupTopItemsByTrackcount(artistSongsInfo, "artistName")
  const topGenres = groupTopItemsByTrackcount(genreSongs)
  const topYears = groupTopItemsByTrackcount(yearSongs)
  const [shortestDuration, shortestName] = getShortestDuration(trackTable)
  const [longestDuration, longestName] = getLongestDuration(trackTable)
  const totalPlaylistDuration = Object.values(trackTable).map((track) => track.trackDuration).reduce((acc, val) => acc + val)
  const avgTrackDuration = totalPlaylistDuration / trackCount

  const removePlaylist = async (playlistObjectId) => {
    const res = await axios.delete("http://localhost:3500/playlists" ,
     {
      headers: {
        authorization: `Bearer ${cookies.access_token}`
      },
      data: {
        "playlistObjectId": playlistObjectId
      }
    })

    // alert("remove successful")
    fetchPlaylists()
  }

  const graphGridData = [
    {
      title: "Artist Information",
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
        data: artistSongsInfo,
        headers: ["Artist", "# of songs", "Songs"],
        columnTypes: ["string", "number", ["string"]],
        columnSortable: [true, true, false],
        columnValues: ["artistName", "trackCount", "trackNames"],
        initialSort: ["colTwoValue", "Number"]
      }
    },
    {
      title: "Genre Information",
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
        data: genreSongs,
        headers: ["Genre", "# of songs", "Songs"],
        columnTypes: ["string", "number", ["string"]],
        columnSortable: [true, true, false],
        columnValues: ["useKey", "trackCount", "trackNames"],
        initialSort: ["colTwoValue", "Number"]
      }
    },
    {
      title: "Year Information",
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
        data: yearSongs,
        headers: ["Year", "# of songs", "Songs"],
        columnTypes: ["string", "number", ["string"]],
        columnSortable: [true, true, false],
        columnValues: ["useKey", "trackCount", "trackNames"],
        initialSort: ["colOneValue", "Number"]
      }
    },
    {
      title: "Artist Popularity Information",
      graph: {
        data: artistSongsInfo,
        graphTitle: 'Artist Popularity',
        xTitleText: 'Artist',
        YTitleText: 'Popularity',
        customTicks: false,
        customTooltip: false,
        groupData: false,
        xData: "artistName",
        yData: 'artistPopularity',
        useKeyForxData: false,
        useValueForLabels: "artistName"
      },
      grid: {
        data: artistSongsInfo,
        headers: ["Artist", "Popularity", "# of songs"],
        columnTypes: ["string", "number", "number"],
        columnSortable: [true, true, true],
        columnValues: ["artistName", "artistPopularity", "trackCount"],
        initialSort: ["colTwoValue", "Number"]
      }
    }
  ]

  return (
    <div className="container">
      <div className="flex-container">
        <div className="sidebar">
          <img src={playlistImage} alt="Playlist Image" height="200" widht="200"/>
        </div>
        <div className="sidebar">
          <div>
            <div>
              <h2 className="playlist-title">
                {playlistName}
              </h2>
            </div>
            <div className='playlist-author'>
              by <b>{playlistOwner}</b>
            </div>
            <div>
              <b>{trackCount}</b> tracks by <b>{artistCount}</b> artists
            </div>
            <div>
              <label> {`Top Artist${topArtists.length > 1 ? 's' : ''}:`} </label> <span><b>{topArtists.join(" & ")}</b></span>
            </div>
            <div>
              <label> {`Top Genre${topGenres.length > 1 ? 's' : ''}:`} </label> <span><b>{topGenres.join(" & ")}</b></span>
            </div>
            <div>
              <label> {`Top Year${topYears.length > 1 ? 's' : ''}:`} </label> <span><b>{topYears.join(" & ")}</b></span>
            </div>
            <div>
              <label> Total Duration: </label> <span><b>{convertMStoFormat(totalPlaylistDuration)}</b></span>
            </div>
            <div>
                <label> Avg. Track length: </label> <span><b>{convertMStoFormat(avgTrackDuration)}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div>
          <label> shortestTrack name: </label> <span>{shortestName}</span>
          <label> shortestTrack duration: </label> <span>{convertMStoFormat(shortestDuration, true)}</span>
      </div>
      <div>
          <label> longestTrack name: </label> <span>{longestName}</span>
          <label> longestTrack duration: </label> <span>{convertMStoFormat(longestDuration, true)}</span>

      </div>
      <div>
        <button onClick={() => removePlaylist(playlistObjectId)}>
          Remove
        </button>
      </div>

      {graphGridData.map((graphGrid) => {
        return (
          <div className="graph-container">
            <h2>
              {graphGrid.title}
            </h2>
            {graphGrid.graph.data
              ? <GraphContent
                  data={graphGrid.graph.data}
                  graphTitle={graphGrid.graph.graphTitle}
                  xAxisTitle={graphGrid.graph.xAxisTitle}
                  yAxisTitle={graphGrid.graph.yAxisTitle}
                  customTicks={graphGrid.graph.customTicks}
                  customTooltip={graphGrid.graph.customTooltip}
                  groupData={graphGrid.graph.groupData}
                  xData={graphGrid.graph.xData}
                  yData={graphGrid.graph.yData}
                  useKeyForxData={graphGrid.graph.useKeyForxData}
                  useValueForLabels={graphGrid.graph.useValueForLabels}
                />
              : "spinner"
            }
            {
              graphGrid.grid.data
              ? <GridContent
                  data={graphGrid.grid.data}
                  headers={graphGrid.grid.headers}
                  columnTypes={graphGrid.grid.columnTypes}
                  columnSortable={graphGrid.grid.columnSortable}
                  columnValues={graphGrid.grid.columnValues}
                  initialSort={graphGrid.grid.initialSort}
                />
              : "spinner"
            }

          </div>
        )})
      }

    <TrackGridContent trackTable={trackTable}/>



    </div>
  )
}

export default PlaylistContainer
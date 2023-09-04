import axios from 'axios'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import {
  getArtistSongsInfo,
  getGenreSongs,
  getYearSongs,
  getShortestTrack,
  getLongestTrack,
} from "../helper/PlaylistContainerHelperMethods"
import TrackGridContent from './TrackGridContent';
import Carousel from './Carousel';
import PieChart from './PieChart';
import SingleTrack from './singleTrack';
import getGraphGridData from "../data/getGraphGridData"
import getMoreQualityData from "../data/qualityData"
import PlaylistQuickFacts from './PlaylistQuickFacts';
import About from './About';
import "./playlistContainer.css"

import ShortestLongestTrack from './ShortestLongestTrack'; 


const PlaylistContainer = ({ playlist, fetchPlaylists=null }) => {
  const [cookies, setCookies] = useCookies(["access_token"])
  const [activate, setActivate] = useState(false)
  const { 
    _id: playlistObjectId,
    playlistId, 
    playlistName,
    playlistOwner,
    playlistImage,
    playlistDuplicates,
    trackTable
  } = playlist
  var artistSongsInfo = getArtistSongsInfo(trackTable)
  var genreSongs = getGenreSongs(trackTable)
  var yearSongs = getYearSongs(trackTable)


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
    // we want to update if we remove the playlist!
    fetchPlaylists(true)
  }


  return (
    <div className="container">
      <div className="flex-container">
        <PlaylistQuickFacts 
          playlistImage={playlistImage}
          playlistName={playlistName}
          playlistOwner={playlistOwner}
          playlistDuplicates={playlistDuplicates}
          artistSongsInfo={artistSongsInfo}
          genreSongs={genreSongs}
          yearSongs={yearSongs}
          trackTable={trackTable}
        />
      </div>
      <div>
        <Carousel 
          graphGridData={getGraphGridData(artistSongsInfo, genreSongs, yearSongs)}
          explicitPieChart={<PieChart trackTable={trackTable} title="Explicit" type="explicit" />}
          decadesPieChart={<PieChart trackTable={trackTable} title="Decades" type="decades" />}

          shortestTrack={<SingleTrack track={getShortestTrack(trackTable)} title="Shortest song" />}
          test={
            <ShortestLongestTrack 
              shortestTrack={getShortestTrack(trackTable)} 
              longestTrack={getLongestTrack(trackTable)} 
            />
          }
          
          longestTrack={<SingleTrack track={getLongestTrack(trackTable)} title="Longest song" />}
          qualityData={getMoreQualityData(trackTable, activate, setActivate)}
        />
      </div>
      <div>
        <button onClick={() => removePlaylist(playlistObjectId)}>
          Remove
        </button>
      </div>
      <TrackGridContent 
        trackTable={trackTable} 
        playlistDuplicates={playlistDuplicates}
      />
      <div>
        <About/>
      </div>
    </div>
  )
}

export default PlaylistContainer
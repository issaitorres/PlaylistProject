import axios from 'axios'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import {
  getArtistSongsInfo,
  getGenreSongs,
  getYearSongs,
  getShortestTrack,
  getLongestTrack,
} from "../../helper/PlaylistContainerHelperMethods"
import TrackGrid from '../TrackGrid/TrackGrid';
import Carousel from '../Carousel/Carousel';
import PieChart from '../Charts/PieChart';
import getGraphGridData from "../../data/getGraphGridData"
import getAudioFeaturesData from "../../data/audioFeaturesData"
import PlaylistQuickFacts from '../PlaylistQuickFacts/PlaylistQuickFacts';
import ShortestLongestTrack from '../ShortestLongestTrack/ShortestLongestTrack';
import About from '../About/About';
import "./PlaylistContainer.css"


const PlaylistContainer = ({ playlist }) => {
  const navigate = useNavigate()
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

    // remove playlist from localstorage
    if(window.localStorage.playlistInfo) {
      var newLocalStorage = JSON.parse(window.localStorage.playlistInfo).filter((info) => info._id != playlistObjectId)
      window.localStorage.setItem("playlistInfo", JSON.stringify(newLocalStorage))
    }

    alert("deleted")
    navigate('/')
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
          shortestLongestTrack={
            <ShortestLongestTrack 
              shortestTrack={getShortestTrack(trackTable)} 
              longestTrack={getLongestTrack(trackTable)} 
            />
          }
          audioFeaturesData={getAudioFeaturesData(trackTable, activate, setActivate)}
        />
      </div>
      <TrackGrid
        trackTable={trackTable} 
        playlistDuplicates={playlistDuplicates}
      />
      <div>
        <About removePlaylist={() => removePlaylist(playlistObjectId)}/>
      </div>
    </div>
  )
}

export default PlaylistContainer
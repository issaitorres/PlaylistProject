import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import {
  getArtistSongsInfo,
  getGenreSongs,
  getYearSongs,
} from "../../helper/PlaylistContainerHelperMethods"
import TrackGrid from '../TrackGrid/TrackGrid';
import Carousel from '../Carousel/Carousel';
import getGraphGridData from "../../data/getGraphGridData"
import PlaylistQuickFacts from '../PlaylistQuickFacts/PlaylistQuickFacts';
import About from '../About/About';
import "./PlaylistContainer.css"


const PlaylistContainer = ({ playlist, refreshPlaylist }) => {
  const navigate = useNavigate()
  const [cookies, setCookies, removeCookie] = useCookies(["access_token"])
  const [deleteLoader, setDeleteLoader] = useState(false)
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
    setDeleteLoader(!deleteLoader)
    try {
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

     setDeleteLoader(false)
     navigate('/')
    } catch (err) {
      if(err.response.status == 403) {
        removeCookie("access_token")
        navigate("/login", {state: { notice: "Access has expired. Please login to continue.", leftOffPath: "/" }})
        return
      }
      console.log(err)
    }

  }


  return (
    <>
      <div className="flex-container">
        <PlaylistQuickFacts 
          artistSongsInfo={artistSongsInfo}
          genreSongs={genreSongs}
          playlistDuplicates={playlistDuplicates}
          playlistImage={playlistImage}
          playlistName={playlistName}
          playlistOwner={playlistOwner}
          trackTable={trackTable}
          yearSongs={yearSongs}
          refreshPlaylist={refreshPlaylist}
        />
      </div>
      <div className="flex-container">
        <Carousel 
          graphGridData={getGraphGridData(artistSongsInfo, genreSongs, yearSongs)}
          trackTable={trackTable}
        />
      </div>
      <div className="flex-container">
        <TrackGrid
          playlistDuplicates={playlistDuplicates}
          trackTable={trackTable}
        />
      </div>
      <div className='flex-container'>
        <About removePlaylist={() => removePlaylist(playlistObjectId)} deleteLoader={deleteLoader}/>
      </div>
    </>
  )
}

export default PlaylistContainer
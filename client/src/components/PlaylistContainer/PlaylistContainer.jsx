import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import {
  getArtistSongsInfo,
  getGenreSongs,
  getYearSongs,
  filterTracktable
} from "../../helper/PlaylistContainerHelperMethods"
import TrackGrid from '../TrackGrid/TrackGrid';
import Carousel from '../Carousel/Carousel';
import getGraphGridData from "../../data/getGraphGridData"
import PlaylistQuickFacts from '../PlaylistQuickFacts/PlaylistQuickFacts';
import About from '../About/About';
import "./PlaylistContainer.css"


const PlaylistContainer = ({ playlist, refreshPlaylist }) => {
  const navigate = useNavigate()
  const [cookies, , removeCookie] = useCookies(["access_token"])
  const [deleteLoader, setDeleteLoader] = useState(false)
  const { 
    _id: playlistObjectId,
    playlistName,
    playlistOwner,
    playlistImage,
    playlistDuplicates,
    missingTracks,
    trackTable
  } = playlist
  var filteredTracktable = filterTracktable(trackTable) // remove missing tracks
  var artistSongsInfo = getArtistSongsInfo(filteredTracktable)
  var genreSongs = getGenreSongs(filteredTracktable)
  var yearSongs = getYearSongs(filteredTracktable)


  const removePlaylist = async (playlistObjectId) => {
    setDeleteLoader(!deleteLoader)
    try {
      const res = await axios.delete(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/playlists`,
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
       var newLocalStorage = JSON.parse(window.localStorage.playlistInfo).filter((info) => info._id !== playlistObjectId)
       window.localStorage.setItem("playlistInfo", JSON.stringify(newLocalStorage))
     }

     setDeleteLoader(false)
     navigate('/')
    } catch (err) {
      if(err.response.status === 403) {
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
          missingTracks={missingTracks}
          playlistImage={playlistImage}
          playlistName={playlistName}
          playlistOwner={playlistOwner}
          trackTable={filteredTracktable}
          yearSongs={yearSongs}
          refreshPlaylist={refreshPlaylist}
        />
      </div>
      <div className="flex-container">
        <Carousel 
          graphGridData={getGraphGridData(artistSongsInfo, genreSongs, yearSongs)}
          trackTable={filteredTracktable}
        />
      </div>
      <div className="flex-container">
        <TrackGrid
          playlistDuplicates={playlistDuplicates}
          missingTracks={missingTracks}
          trackTable={trackTable} // original tracktable
        />
      </div>
      <div className='flex-container'>
        <About removePlaylist={() => removePlaylist(playlistObjectId)} deleteLoader={deleteLoader}/>
      </div>
    </>
  )
}

export default PlaylistContainer
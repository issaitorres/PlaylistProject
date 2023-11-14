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
import {
  deletePlaylistInfoFromLocalStorage,
  environment
} from '../../utils/components'
import "./PlaylistContainer.css"


const PlaylistContainer = ({ playlist, refreshPlaylist }) => {
  const navigate = useNavigate()
  const [cookies, , removeCookie] = useCookies(["access_token"])
  const [deleteLoader, setDeleteLoader] = useState(false)
  const { 
    _id: playlistObjectId,
    playlistId,
    playlistName,
    playlistOwner,
    playlistImage,
    playlistDuplicates,
    missingTracks,
    trackTable
  } = playlist
  // filter out all missing tracks so they don't impact quick facts and carousel stats
  var filteredTracktable = filterTracktable(trackTable)
  var artistSongsInfo = getArtistSongsInfo(filteredTracktable)
  var genreSongs = getGenreSongs(filteredTracktable)
  var yearSongs = getYearSongs(filteredTracktable)


  const removePlaylist = async (playlistObjectId, playlistId) => {
    setDeleteLoader(!deleteLoader)
    try {
      if(playlistObjectId) {
        const res = await axios.delete(`${environment}/playlists`,
        {
         headers: {
           authorization: `Bearer ${cookies.access_token}`
         },
         data: {
           "playlistObjectId": playlistObjectId
         }
       })
      }

    // delete by playlistId since playlist isn't neccesarily saved by user in db
     deletePlaylistInfoFromLocalStorage(playlistId)
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
          playlistId={playlistId}
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
          trackTable={trackTable} // original tracktable including missing tracks
        />
      </div>
      <div className='flex-container'>
        <About
          removePlaylist={() => removePlaylist(playlistObjectId, playlistId)}
          deleteLoader={deleteLoader}
        />
      </div>
    </>
  )
}

export default PlaylistContainer
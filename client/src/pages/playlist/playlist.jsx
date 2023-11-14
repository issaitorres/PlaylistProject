import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PlaylistContainer from '../../components/PlaylistContainer/PlaylistContainer'
import {
  validPlaylistIdChecker,
  addNewPlaylistInfoToLocalStorage,
  updatePlaylistInfoInLocalStorage,
  playlistExistsInLocalStorage,
  removeItemFromLocalStorage,
  environment
} from '../../utils/components';
import "./playlist.css"


const Playlist = () => {
  const location = useLocation();
  const [playlist, setPlaylist] = useState(location?.state?.playlist)
  const [cookies] = useCookies(["access_token"])
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)

    // search the localstorage
    const playlistIdFromURL = window.location.pathname.split('/')[2]
    const foundPlaylist = playlistExistsInLocalStorage(playlistIdFromURL, true)
    if(!foundPlaylist) {
      // playlist was not in localstorage so fetch it
      const submitPlaylistId = async () => {
        const validPlaylistId = validPlaylistIdChecker(playlistIdFromURL)
        if(validPlaylistId) {
          try {
            const res = await axios.post(`${environment}/playlists`,
              {
                playlistId: playlistIdFromURL,
                savePlaylist: location?.state?.savePlaylist,
                useAccessTokenWithScope: location?.state?.useAccessTokenWithScope,
                likedSongsEndpoint: location?.state?.likedSongsEndpoint
              },
              {
                withCredentials: true,
                headers: {
                  authorization: `Bearer ${cookies.access_token}`
                }
              }
            )

            if(res.status === 204) {
              // couldn't find that playlist id
              alert("Could not find a playlist with that id. Please check that this playlist is public on Spotify and submit again.")
              navigate('/')
              return
            } else if(res.status === 205) {
              // both spotify user access and refresh tokens are expired
              removeItemFromLocalStorage("spotifyPlaylistUserData")
              navigate('/')
              alert("Spotify access has expired. Please Login with Spotify again to view this information.")
              return
            }

            if(!res.data.trackTable.length) {
              alert("This playlist does not have any tracks.")
              navigate("/")
              return
            }

            addNewPlaylistInfoToLocalStorage(res.data)
            setPlaylist(res.data)
          } catch (err) {
            console.log(err)
          }
        } else {
          alert("Invalid playlist id. Please submit valid playlist URL or playlist ID. Ex: https://open.spotify.com/playlist/3cT4tGoRr5eC3jGUZT5MTD or 3cT4tGoRr5eC3jGUZT5MTD")
          navigate('/')
        }
      }
      submitPlaylistId()

    } else {
      if(foundPlaylist.trackTable.length) {
        setPlaylist(foundPlaylist)
      } else {
        alert("This playlist does not have any tracks.")
        navigate("/")
      }
    }
  }, [navigate])

  // update playlist info in localstorage and then useEffect sets new data on page load
  const refreshPlaylist = async () => {
    const playlistIdFromURL = window.location.pathname.split('/')[2]
    const res = await axios.post(`${environment}/playlists/refresh`,
        {
            playlistId: playlistIdFromURL
        },
        {
            headers: {
                authorization: `Bearer ${cookies.access_token}`
            }
        }
    )

    if(res.status === 200) {
      const newPlaylistInfo = res.data
      const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
      if(localStoragePlaylistInfo) {
        updatePlaylistInfoInLocalStorage(newPlaylistInfo)
        setPlaylist(newPlaylistInfo)
        navigate(0, { replace: true }) // <-- redirect to current path w/o state
      }
    }
    return true
  }

  return (
    <div className="page-container">
      {playlist 
        ?       
          <PlaylistContainer
            playlist={playlist}
            refreshPlaylist={refreshPlaylist}
          />
        :
          <div className="loader playlist__loader-margins"></div>
      }
    </div>
  )
}

export default Playlist
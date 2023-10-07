import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PlaylistContainer from '../../components/PlaylistContainer/PlaylistContainer'
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
    const localStoragePlaylistInfo = window.localStorage.playlistInfo
    const currentPlaylists = JSON.parse(localStoragePlaylistInfo)
    const foundPlaylist = currentPlaylists.find((playlist) => {
      return playlist.playlistId === playlistIdFromURL
    })

    if(!foundPlaylist || foundPlaylist?.length === 0) {
      console.log("playlist was not in localstorage so fetch it")

      // playlist was not in localstorage so fetch it
      const submitPlaylistId = async () => {
        const playlistIdRegex1 = /playlist\/.{22}/
        const playlistIdRegex2 = /.{22}/
        if(playlistIdRegex1.test(playlistIdFromURL) || playlistIdRegex2.test(playlistIdFromURL)) {
          try {
            const res = await axios.post(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/playlists`,
              {
                playlistId: playlistIdFromURL
              },
              {
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
            }

            var newPlaylist = res.data
            var playlistInfo = JSON.parse(window.localStorage.playlistInfo)
            playlistInfo.push(newPlaylist)
            window.localStorage.setItem("playlistInfo", JSON.stringify(playlistInfo))
            setPlaylist(newPlaylist)
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
      setPlaylist(foundPlaylist)
    }
  }, [navigate])

  // replace playlist info in localstorage and then useEffect sets new data on page load
  const refreshPlaylist = async () => {
    const playlistIdFromURL = window.location.pathname.split('/')[2]
    const res = await axios.post(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/playlists/refresh`,
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
        const localStoragePlaylistInfo = window.localStorage.playlistInfo
        if(localStoragePlaylistInfo) {
            var parsedLocalStoragePlaylistInfo = JSON.parse(localStoragePlaylistInfo)
            var oldPlaylistIndex = parsedLocalStoragePlaylistInfo.findIndex((playlistInfo) => playlistInfo.playlistId === newPlaylistInfo.playlistId)
            parsedLocalStoragePlaylistInfo[oldPlaylistIndex] = newPlaylistInfo
            window.localStorage.setItem("playlistInfo", JSON.stringify(parsedLocalStoragePlaylistInfo))
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
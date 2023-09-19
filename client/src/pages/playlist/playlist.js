import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import PlaylistContainer from '../../components/PlaylistContainer/PlaylistContainer'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'


const Playlist = () => {
  const location = useLocation();
  // const [playlistId, setPlaylistId] = useState("")
  const [playlist, setPlaylist] = useState(location?.state?.playlist)
  const [cookies, setCookies] = useCookies(["access_token"])
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

    if(!foundPlaylist || foundPlaylist?.length == 0) {
      console.log("playlist was not in localstorage so fetch it")

      // playlist was not in localstorage so fetch it
      const submitPlaylistId = async () => {
        const playlistIdRegex1 = /playlist\/.{22}/
        const playlistIdRegex2 = /.{22}/
        if(playlistIdRegex1.test(playlistIdFromURL) || playlistIdRegex2.test(playlistIdFromURL)) {
          try {
            const res = await axios.post("http://localhost:3500/playlists",
              {
                playlistId: playlistIdFromURL
              },
              {
                headers: {
                  authorization: `Bearer ${cookies.access_token}`
                }
              }
            )

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
    const res = await axios.post("http://localhost:3500/playlists/refresh",
        {
            playlistId: playlistIdFromURL
        },
        {
            headers: {
                authorization: `Bearer ${cookies.access_token}`
            }
        }
    )

    if(res.status == 200) {
        const newPlaylistInfo = res.data
        const localStoragePlaylistInfo = window.localStorage.playlistInfo
        if(localStoragePlaylistInfo) {
            var parsedLocalStoragePlaylistInfo = JSON.parse(localStoragePlaylistInfo)
            var oldPlaylistIndex = parsedLocalStoragePlaylistInfo.findIndex((playlistInfo) => playlistInfo.playlistId == newPlaylistInfo.playlistId)
            parsedLocalStoragePlaylistInfo[oldPlaylistIndex] = newPlaylistInfo
            window.localStorage.setItem("playlistInfo", JSON.stringify(parsedLocalStoragePlaylistInfo))
            setPlaylist(newPlaylistInfo)
            navigate(`/playlist/${playlistIdFromURL}`, { replace: true }); // <-- redirect to current path w/o state

        }

    }
}


  return (
    <div className="page-container">
      {playlist 
        ?       
          <div key={playlist._id}>
            <PlaylistContainer 
              playlist={playlist}
              refreshPlaylist={refreshPlaylist}
            />
          </div>
        :
          <div className="loader loader-override-margins"></div>
      }
    </div>
  )
}

export default Playlist
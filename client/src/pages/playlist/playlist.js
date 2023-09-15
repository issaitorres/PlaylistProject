import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
import PlaylistContainer from '../../components/PlaylistContainer/PlaylistContainer'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'


const Playlist = () => {
  const location = useLocation();
  const [playlistId, setPlaylistId] = useState("")
  const [playlist, setPlaylist] = useState(location?.state?.playlist)
  const [cookies, setCookies] = useCookies(["access_token"])
  const navigate = useNavigate()

  useEffect(()=> {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if(!playlist) {
      const playlistIdFromURL = window.location.pathname.split('/')[2]
      const localStoragePlaylistInfo = window.localStorage.playlistInfo
      const currentPlaylists = JSON.parse(localStoragePlaylistInfo)
      const mainPlaylist = currentPlaylists.find((playlist) => {
        return playlist.playlistId === playlistIdFromURL
      })

      if(!mainPlaylist || mainPlaylist?.length == 0) {
        // playlist was not in localstorage
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
        setPlaylist(mainPlaylist)
      }
    }
  }, [])


  return (
    <div className="page-container">
      {playlist 
        ?       
          <div key={playlist._id}>
            <PlaylistContainer 
              playlist={playlist}
            />
          </div>
        :
          <div className="loader loader-override-margins"></div>
      }
    </div>
  )
}

export default Playlist
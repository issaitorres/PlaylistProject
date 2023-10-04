import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import AddPlaylist from '../../components/AddPlaylist/AddPlaylist'
import PlaylistTile from '../../components/PlaylistTile/PlaylistTile'
import AboutSPA from './AboutSPA'
import { useNavigate } from 'react-router-dom'
import DiscoverPlaylist from "../../components/DiscoverPlaylist/DiscoverPlaylist"


const Home = () => {
  const [cookies, setCookies] = useCookies(["access_token"])
  const [playlists, setPlaylists] = useState([])
  const userInfo = window?.localStorage?.userInfo
  const userID = userInfo ? JSON.parse(userInfo).id : null
  const navigate = useNavigate()


  const fetchPlaylists = React.useCallback(async (update=false, playlistId=false) => {
    // check if info already in localstorage
    if(window?.localStorage?.playlistInfo && !update) {
      setPlaylists(JSON.parse(window.localStorage.playlistInfo))
    } else {
      try {
        const res = await axios.get(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/playlists/user`, {
          headers: {
            authorization: `Bearer ${cookies.access_token}`,
          }
        })
        setPlaylists(res.data)
        if(playlistId) {
          navigate(`/playlist/${playlistId}`, {state: {playlist: res.data.find((playlist) => { return playlist.playlistId === playlistId })}})
        }
        window.localStorage.setItem("playlistInfo", Array.isArray(res.data) ? JSON.stringify(res.data) : JSON.stringify([]))
      } catch (error) {

        // get new access token if expired
        if(error?.response?.status === 403) {
          const refreshRes = await axios.get(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/refresh`, {
            withCredentials: true,
            credentials: 'include'
          })
          setCookies("access_token", refreshRes.data.accessToken, {
            maxAge: 900
          })

          const res = await axios.get(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/user`, {
            headers: {
              authorization: `Bearer ${refreshRes.data.accessToken}`,
            }
          })
          setPlaylists(res.data)
        }
        // else if(error?.response?.status === 500) {
        //   // console.log(error)

        // }
        console.log(error)

      }
    }
  }, [])

  useEffect(()=> {
    if(cookies.access_token && userID) {
      fetchPlaylists()
    }
  }, [])


  return (
    <div className="page-container">
      <AddPlaylist accessToken={cookies.access_token} />
      {
        !cookies.access_token
          ?
            <AboutSPA />
          :
            (
              !playlists.length
                ?
                  <DiscoverPlaylist />
                :
                  <div className="home__playlist-tile-wrapper">
                    <h1> Your Playlists</h1>
                    <div className="home__playlist-tile-container">
                      {playlists.map((playlist, index) => (
                        <PlaylistTile
                          key={index}
                          playlist={playlist}
                        />
                      ))}
                    </div>
                  </div>
            )
      }
    </div>
  )
}


export default Home

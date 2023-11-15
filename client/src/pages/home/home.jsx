import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AddPlaylist from '../../components/AddPlaylist/AddPlaylist'
import PlaylistTile from '../../components/PlaylistTile/PlaylistTile'
import AboutSPA from './AboutSPA'
import DiscoverPlaylist from "../../components/DiscoverPlaylist/DiscoverPlaylist"
import {
  setUserPlaylistInfoInLocalStorage,
  getPlaylistInfoFromLocalStorage,
  getSpotifyUserPlaylistDataInLocalStorage,
  setSpotifyUserPlaylistDataInLocalStorage,
  setSpotifyProfileDataInLocalStorage,
  environment
} from '../../utils/components'
import "./home.css"


const Home = () => {
  const [cookies, setCookies] = useCookies(["access_token"])
  const [playlists, setPlaylists] = useState([])
  const [spotifyUserPlaylists, setSpotifyUserPlaylists] = useState([])
  const userInfo = window?.localStorage?.userInfo
  const userID = userInfo ? JSON.parse(userInfo).id : null
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();


  const fetchPlaylists = React.useCallback(async (update=false, playlistId=false) => {
    // check if info already in localstorage
    const playlistInfo = getPlaylistInfoFromLocalStorage()
    if(playlistInfo.length && !update) {
      setPlaylists(playlistInfo)
    } else {
      try {
        const res = await axios.get(`${environment}/playlists/user`, {
          headers: {
            authorization: `Bearer ${cookies.access_token}`,
          }
        })
        setPlaylists(res.data)
        if(playlistId) {
          navigate(`/playlist/${playlistId}`, {state: {playlist: res.data.find((playlist) => { return playlist.playlistId === playlistId })}})
        }

        setUserPlaylistInfoInLocalStorage(Array.isArray(res.data) ? JSON.stringify(res.data) : JSON.stringify([]))
      } catch (error) {

        // get new access token if expired
        if(error?.response?.status === 403) {
          const refreshRes = await axios.get(`${environment}/refresh`, {
            withCredentials: true,
            credentials: 'include'
          })
          setCookies("access_token", refreshRes.data.accessToken, {
            maxAge: 900
          })

          const res = await axios.get(`${environment}/user`, {
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

  const generateAccessTokenAndGetSpotifyUserPlaylistData = async (spotifyCode, spotifyState) => {
    try {
      const res = await axios.post(`${environment}/spotify-login/accessToken`,
          {
              authorizationCode: spotifyCode,
              state: spotifyState
          },
          {
            withCredentials: true,
            headers: {
                authorization: `Bearer ${cookies.access_token}`
              }
          }
      )

      if(res.data.profileData){
        setSpotifyProfileDataInLocalStorage(JSON.stringify(res.data.profileData))
      }

      return res.data.userPlaylistData
    } catch (err) {
      console.log(err)
      return false
    }
  }

  const fetchSpotifyUserPlaylists = async (spotifyCode, spotifyState) => {
    const data = await generateAccessTokenAndGetSpotifyUserPlaylistData(spotifyCode, spotifyState)
    setSpotifyUserPlaylistDataInLocalStorage(Array.isArray(data) ? JSON.stringify(data) : JSON.stringify([]))
    setSpotifyUserPlaylists(data)
  }


  useEffect(()=> {
    if(cookies.access_token && userID) {
      fetchPlaylists()
    }

    // get spotify user playlists from redirect with code and state in url
    const spotifyCode = searchParams.get("code")
    const spotifyState = searchParams.get("state")
    const error = searchParams.get("error") // returns null if no error found in urlparams

    // maybe add a loader here for user spotify tile playlists
    if(spotifyCode && spotifyState) {
      fetchSpotifyUserPlaylists(spotifyCode, spotifyState)
      navigate("/")
    } else {
      const userPlaylistData = getSpotifyUserPlaylistDataInLocalStorage()
      if(userPlaylistData.length) {
        setSpotifyUserPlaylists(userPlaylistData)
      } else {
        console.log(error)
      }
    }
  }, [])


  return (
    <div className="page-container">
      <AddPlaylist
        accessToken={cookies.access_token}
        spotifyUserPlaylists={spotifyUserPlaylists}
        setSpotifyUserPlaylists={setSpotifyUserPlaylists}
      />
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
                <>
                  <div className="home__playlist-tile-wrapper">
                    <h1> Submitted Playlists</h1>
                    <div className="home__playlist-tile-container">
                      {playlists.map((playlist, index) => (
                        <PlaylistTile
                          key={index}
                          playlist={playlist}
                          savePlaylist={true}
                          useAccessTokenWithScope={false}
                          likedSongsEndpoint={false}
                        />
                      ))}
                    </div>
                  </div>
                  {spotifyUserPlaylists.length > 0 &&
                    <div className="home__playlist-tile-wrapper">
                      <h1> Your Spotify Playlists</h1>
                      <div className="home__playlist-tile-container">
                        <PlaylistTile
                          playlist={{playlistId: "likedSongs"}}
                          savePlaylist={false}
                          useAccessTokenWithScope={true}
                          likedSongsEndpoint={true}
                        />
                        {spotifyUserPlaylists.map((playlist, index) => (
                          <PlaylistTile
                            key={index}
                            playlist={playlist}
                            savePlaylist={false}
                            useAccessTokenWithScope={true}
                            likedSongsEndpoint={false}
                          />
                        ))}
                      </div>
                    </div>
                  }
                </>
            )
      }
    </div>
  )
}


export default Home

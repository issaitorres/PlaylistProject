import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import AddPlaylistId from '../components/addPlaylistId'
import PlaylistLinkContainer from '../components/playlistLinkContainer'


const Home = () => {
  const [cookies, setCookies] = useCookies(["access_token"])
  const [playlists, setPlaylists] = useState([])
  const userID = window.localStorage.userID


  const fetchPlaylists = React.useCallback(async (update=false) => {
    // all playlists
    // const res = await axios.get("http://localhost:3500/playlists" , {
    //   headers: {
    //     authorization: `Bearer ${cookies.access_token}`
    //   }
    // })

    // check if info already in localstorage
    if(window.localStorage.playlistInfo && !update) {
      setPlaylists(JSON.parse(window.localStorage.playlistInfo))
    } else {
      try {
        const res = await axios.get("http://localhost:3500/playlists/user" , {
          headers: {
            authorization: `Bearer ${cookies.access_token}`,
          }
        })
        setPlaylists(res.data)
        window.localStorage.setItem("playlistInfo", JSON.stringify(res.data))

      } catch (error) {

        // get new access token if expired
        if(error?.response?.status === 403) {
          const refreshRes = await axios.get("http://localhost:3500/refresh", {
            withCredentials: true,
            credentials: 'include'
          })
          setCookies("access_token", refreshRes.data.accessToken, {
            maxAge: 900
          })

          const res = await axios.get("http://localhost:3500/playlists/user" , {
            headers: {
              authorization: `Bearer ${refreshRes.data.accessToken}`,
            }
          })
          setPlaylists(res.data)

        }
        console.log(error)
      }
    }
  }, [])

  useEffect(()=> {
    if(cookies.access_token && userID) {
      fetchPlaylists()
    }
  }, [fetchPlaylists])


  return (
    <div className="page-container">
      <AddPlaylistId accessToken={cookies.access_token} fetchPlaylists={fetchPlaylists} />
      {
        !cookies.access_token && !userID 
          ? "Login to see playlist info" 
          : (!playlists.length 
            ? <div>
                Add a playlist to see info here!
              </div>
            : <div className="playlistLinksWrapper">
                <h1> Your Playlists</h1>
                <div className="playlistLinksContainer">
                  {playlists.map((playlist, index) => (
                    <PlaylistLinkContainer
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

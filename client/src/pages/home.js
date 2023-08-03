import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import PlaylistContainer from '../components/playlistContainer'
import AddPlaylistId from '../components/addPlaylistId'
import PlaylistLinkContainer from '../components/playlistLinkContainer'


const Home = () => {
  const [cookies, setCookies] = useCookies(["access_token"])
  const [playlists, setPlaylists] = useState([])
  const userID = window.localStorage.userID


  const fetchPlaylists = React.useCallback(async () => {
    // all playlists
    // const res = await axios.get("http://localhost:3500/playlists" , {
    //   headers: {
    //     authorization: `Bearer ${cookies.access_token}`
    //   }
    // })

    //my playlists
    try {
      const res = await axios.get("http://localhost:3500/playlists/user" , {
        headers: {
          authorization: `Bearer ${cookies.access_token}`,
        }
      })
      setPlaylists(res.data)
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
  }, [])

  useEffect(()=> {
    // need to figure out how to keep state between pages!
    // so we aren't calling to fetch playlists when the state never changed
    if(cookies.access_token && userID) {
      fetchPlaylists()
    }
  }, [fetchPlaylists])


  return (
    <div>
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
              {/* { playlists.map((playlist) => {
                  return (
                    <div key={playlist._id}>

                      <PlaylistContainer 
                        playlist={playlist}
                        fetchPlaylists={fetchPlaylists}
                      />
                    </div>
                  )
                })
              } */}
              </div> 
            )
      }
    </div>
  )
}

export default Home

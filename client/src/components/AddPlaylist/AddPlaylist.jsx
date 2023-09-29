import { useState } from 'react'
import axios from 'axios'
import FormInput from '../FormInput/FormInput'
import "./AddPlaylist.css"
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const AddPlaylist = ({ accessToken, fetchPlaylists }) => {
  const [playlistId, setPlaylistId] = useState("")
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  const [cookies, setCookies, removeCookie] = useCookies(["access_token"])


  const submitPlaylistId = async (event) => {
    event.preventDefault()

    const playlistIdRegex1 = /playlist\/.{22}/
    const playlistIdRegex2 = /.{22}/
    if(playlistIdRegex1.test(playlistId) || playlistIdRegex2.test(playlistId)) {

      var extractedPlaylistId = playlistIdRegex2.test(playlistId) ? playlistId.split('/').pop() : playlistId

      // compare with localstorage
      const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
      if(localStoragePlaylistInfo) {
        const currentPlaylistIds = JSON.parse(localStoragePlaylistInfo).map((info) => info.playlistId)
        if(currentPlaylistIds.includes(extractedPlaylistId)) {
          // navigate to playlist and exit - this would submit another playlist without this return
          navigate(`/playlist/${extractedPlaylistId}`)
          return
        }
      }

      setLoader(!loader)
      try {
        const res = await axios.post("http://localhost:3500/playlists", {
          playlistId: extractedPlaylistId
        }, 
        {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        })

        const newPlaylistInfo = res.data
        const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
        var parsedLocalStoragePlaylistInfo = localStoragePlaylistInfo ? JSON.parse(localStoragePlaylistInfo) : []
        parsedLocalStoragePlaylistInfo.push(newPlaylistInfo)
        window.localStorage.setItem("playlistInfo", JSON.stringify(parsedLocalStoragePlaylistInfo))
        navigate(`/playlist/${playlistId}`, {state: { playlist: newPlaylistInfo }})
      } catch (err) {
        if(err.response.status == 403) {
          // access token is expired - delete and return to login
          // navigate(0) // refresh to remove access_token - this didn't work because restricted route sent us back to home
          removeCookie("access_token")
          navigate("/login", {state: { notice: "Access has expired. Please login to continue." }})
          return
        }
        console.log(err)
      }
    } else {
      alert("Invalid playlist ID")
    }
  }

  return (
    <div>
      {
        accessToken
          ?
            <div>
              <form
                onSubmit={submitPlaylistId}
                className="add-playlist-form"
              >
                <h1> Submit a playlist!</h1>
                <FormInput
                  key={1}
                  value={playlistId}
                  onChange={(event) => setPlaylistId(event.target.value)}
                  pattern=".*playlist\/.{22}|.{22}"
                  placeholder="Playlist URL or playlist ID"
                  className="formInput add-playlist-formInput-overrides"
                  errorMessage="Please submit validplaylist URL or playlist ID. Ex: https://open.spotify.com/playlist/3cT4tGoRr5eC3jGUZT5MTD or  3cT4tGoRr5eC3jGUZT5MTD"
                  errMsgPos="topErrMsg"
                />
                <button
                  type="submit"
                  className="submit-button add-playlist-button-override">
                  <div className={`${loader && 'loader'}`}>{!loader && "Submit"}</div>
                </button>
              </form>
            </div>
          :
            null
      }
    </div>
  )
}

export default AddPlaylist
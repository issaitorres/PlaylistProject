import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import FormInput from '../FormInput/FormInput'
import Banner from "../../components/Banner/Banner"
import "./AddPlaylist.css"


const AddPlaylist = ({ accessToken }) => {
  const [playlistId, setPlaylistId] = useState("")
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  const [ , , removeCookie] = useCookies(["access_token"])
  const [notice, setNotice] = useState(false)
  var homeInterval

  const removeInterval = () => {
    clearInterval(homeInterval);
  }

  useEffect(()=> {
    return () => removeInterval();
  }, [])


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
        const res = await axios.post(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/playlists`, {
          playlistId: extractedPlaylistId
        }, 
        {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        })


        if(res.status === 204) {
          // couldn't find that playlist id
          setNotice("Could not find a playlist with that id. Please check that this playlist is public on Spotify and submit again.")
          setLoader(false)
          var time = 10;
          homeInterval = setInterval(() => {
            if (time === 0) {
              removeInterval()
              setNotice(false)
            }
            time--;
          }, 1000);

          return
        }

        const newPlaylistInfo = res.data
        const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
        var parsedLocalStoragePlaylistInfo = localStoragePlaylistInfo ? JSON.parse(localStoragePlaylistInfo) : []
        parsedLocalStoragePlaylistInfo.push(newPlaylistInfo)
        window.localStorage.setItem("playlistInfo", JSON.stringify(parsedLocalStoragePlaylistInfo))
        navigate(`/playlist/${playlistId}`, {state: { playlist: newPlaylistInfo }})
      } catch (err) {
        console.log(err)
        if(err.response.status === 403) {
          // access token is expired - delete and return to login
          // navigate(0) // refresh to remove access_token - this didn't work because restricted route sent us back to home
          removeCookie("access_token")
          navigate("/login", {state: { notice: "Access has expired. Please login to continue." }})
          return
        }
      }
    }
  }

  return (
    <div className="addplaylist__container">
      {
        notice &&
          <Banner
            notice={notice}
            bannerType="warning"
            bannerPosition="flex"
          />
      }
      {
        accessToken
          ?
              <form
                onSubmit={submitPlaylistId}
                className="addplaylist__form"
              >
                <h1> Spotify Playlist Analyzer</h1>
                <FormInput
                  id="playlistInput"
                  key={1}
                  value={playlistId}
                  onChange={(event) => setPlaylistId(event.target.value)}
                  pattern=".*playlist\/.{22}|.{22}"
                  placeholder="Playlist URL or playlist ID"
                  className="formInput addplaylist__formInput-overrides"
                  errorMessage="Please submit validplaylist URL or playlist ID. Ex: https://open.spotify.com/playlist/3cT4tGoRr5eC3jGUZT5MTD or  3cT4tGoRr5eC3jGUZT5MTD"
                  errMsgPos="topErrMsg"
                />
                <button
                  type="submit"
                  className="button submit-theme addplaylist__button-override"
                  formNoValidate
                >
                  <div className={`${loader && 'loader'}`}>{!loader && "Submit"}</div>
                </button>
              </form>
          :
            null
      }
    </div>
  )
}

export default AddPlaylist
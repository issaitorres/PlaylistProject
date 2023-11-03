import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import FormInput from '../FormInput/FormInput'
import Banner from "../../components/Banner/Banner"
import {
  validPlaylistIdChecker,
  addNewPlaylistInfoToLocalStorage,
  playlistExistsInLocalStorage,
  environment
} from '../../utils/components'
import "./AddPlaylist.css"


const AddPlaylist = ({ accessToken }) => {
  const [playlistId, setPlaylistId] = useState("")
  const [loader, setLoader] = useState(false)
  const [notice, setNotice] = useState(false)
  const displayNoticeRef = useRef(null)
  const [ , , removeCookie] = useCookies(["access_token"])
  const navigate = useNavigate()


  const displayNoticeInterval = (time=0) => {
    displayNoticeRef.current = setInterval(() => {
      if (time <= 0) {
        setNotice(false)
        clearInterval(displayNoticeRef.current)
      }
      time--;
    }, 1000)
  }

  useEffect(()=> {
    return () => {
      clearInterval(displayNoticeRef.current)
    }
  }, [])


  const submitPlaylistId = async (event) => {
    event.preventDefault()

    const validPlaylistId = validPlaylistIdChecker(playlistId)
    if(validPlaylistId) {
      if(playlistExistsInLocalStorage(validPlaylistId)) {
        navigate(`/playlist/${validPlaylistId}`)
        return
      }

      setLoader(!loader)
      try {
        const res = await axios.post(`${environment}/playlists`, {
            playlistId: validPlaylistId
          },
          {
            headers: {
              authorization: `Bearer ${accessToken}`
            }
          }
        )

        if(res.status === 204) {
          // couldn't find that playlist id
          setNotice("Could not find a playlist with that id. Please check that this playlist is public on Spotify and submit again.")
          setLoader(false)
          displayNoticeInterval(10)
          return
        }

        addNewPlaylistInfoToLocalStorage(res.data)
        navigate(`/playlist/${validPlaylistId}`, {state: { playlist: res.data }})
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
                <h1 className="addplaylist__form-title"> Spotify Playlist Analyzer</h1>
                <h4 className="addplaylist__form-subtitle"> Get information on any Spotify playlist!</h4>
                <FormInput
                  id="playlistInput"
                  key={1}
                  value={playlistId}
                  onChange={(event) => setPlaylistId(event.target.value)}
                  pattern=".*playlist\/.{22}|.{22}"
                  placeholder="Playlist URL or playlist ID"
                  className="addplaylist__formInput-overrides"
                  errorMessage={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: "Please submit validplaylist URL or playlist ID. Ex: \n <b> https://open.spotify.com/playlist/3cT4tGoRr5eC3jGUZT5MTD </b> \n or \n <b> 3cT4tGoRr5eC3jGUZT5MTD </b>"
                      }}
                    />
                  }
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
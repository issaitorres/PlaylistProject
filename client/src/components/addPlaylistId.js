import React, { useState } from 'react'
import axios from 'axios'
import FormInput from './FormInput'

const AddPlaylistId = ({ accessToken, fetchPlaylists }) => {
  const [playlistId, setPlaylistId] = useState("")


  const submitPlaylistId = async (event) => {
    event.preventDefault()

    const playlistIdRegex1 = /playlist\/.{22}/
    const playlistIdRegex2 = /.{22}/
    if(playlistIdRegex1.test(playlistId) || playlistIdRegex2.test(playlistId)) {

      var extractedPlaylistId = playlistIdRegex2.test(playlistId) ? playlistId.split('/').pop() : playlistId

      // compare with localstorage
      const localStoragePlaylistInfo = window.localStorage.playlistInfo
      if(localStoragePlaylistInfo) {
        const currentPlaylistIds = JSON.parse(localStoragePlaylistInfo).map((info) => info.playlistId)
        if(currentPlaylistIds.includes(extractedPlaylistId)) return alert("This playlist ID has already been submitted!")
      }

      try {
        const res = await axios.post("http://localhost:3500/playlists", {
          playlistId: extractedPlaylistId
        }, 
        {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        })
  
        alert("submit successful")
        fetchPlaylists(true)
  
      } catch (err) {
        console.log(err)
      }
    } else {
      alert("Invalid playlist ID")
    }
  }

  return (
    <div>
      {accessToken 
        ? <div>
            <form
              onSubmit={submitPlaylistId}
              // className="add-playlist-form"
              className="add-playlist-form"
            >
              <h1> Submit a playlist!</h1>
              {/* <label>playlistId</label> */}
              {/* <input type="text" value={playlistId} onChange={(event) => setPlaylistId(event.target.value)}/> */}
              {/* <input
                type="text"
                value={playlistId}
                onChange={(event) => setPlaylistId(event.target.value)}
                pattern="playlist\/.{22}|.{22}"
                errorMessage=""
              /> */}
              <FormInput
                key={1}
                value={playlistId}
                onChange={(event) => setPlaylistId(event.target.value)}
                pattern=".*playlist\/.{22}|.{22}"
                placeholder="Playlist URL or playlist ID"
                className="formInput add-playlist-formInput-overrides"
                errorMessage="Please submit playlist URL or playlist ID ex: https://open.spotify.com/playlist/3cT4tGoRr5eC3jGUZT5MTD or  3cT4tGoRr5eC3jGUZT5MTD"
              />

              <button
                type="submit"
                className="submit-button add-playlist-button-override">
                Submit
              </button>
            </form>
          </div>
        : null
      }
    </div>
  )
}

export default AddPlaylistId
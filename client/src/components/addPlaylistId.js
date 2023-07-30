import React, { useState } from 'react'
import axios from 'axios'

const AddPlaylistId = ({ accessToken, fetchPlaylists }) => {
  const [playlistId, setPlaylistId] = useState("")


  const submitPlaylistId = async (event) => {
    event.preventDefault()

    const playlistIdRegex1 = /playlist\/.{22}/
    const playlistIdRegex2 = /.{22}/
    if(playlistIdRegex1.test(playlistId) || playlistIdRegex2.test(playlistId)) {

      var extractedPlaylistId = playlistIdRegex2.test(playlistId) ? playlistId.split('/').pop() : playlistId
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
        fetchPlaylists()
  
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
        ? <form onSubmit={submitPlaylistId}>
            <label>playlistId</label>
            <input type="text" value={playlistId} onChange={(event) => setPlaylistId(event.target.value)}/>

            <button type="submit"> submit</button>
          </form>
        : null
      }
    </div>
  )
}

export default AddPlaylistId
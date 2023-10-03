import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import albumCover from "../../Assets/movie-soundtracks-cover.jpg"
import "./DiscoverPlaylist.css"


const DiscoverPlaylist = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const [loader, setLoader] = useState(false)
    const discoverPlaylistId = "3cT4tGoRr5eC3jGUZT5MTD"
    const navigate = useNavigate()

    const submitDiscoverPlaylist = async (event) => {
        event.preventDefault()

        const discoverPlaylistElement = document.getElementById("discoverPlaylist")
        discoverPlaylistElement.classList.add("discover-loading");
        setLoader(true)
        
        // compare with localstorage
        const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
        if(localStoragePlaylistInfo) {
            const currentPlaylistIds = JSON.parse(localStoragePlaylistInfo).map((info) => info.playlistId)
            if(currentPlaylistIds.includes(discoverPlaylistId)) {
                // navigate to playlist and exit - this would submit another playlist without this return
                navigate(`/playlist/${discoverPlaylistId}`)
                return
            }
        }
    
        setLoader(!loader)
        try {
            const res = await axios.post("http://localhost:3500/playlists", {
                playlistId: discoverPlaylistId
            }, 
            {
                headers: {
                authorization: `Bearer ${cookies.access_token}`
                }
            })

            const newPlaylistInfo = res.data
            const localStoragePlaylistInfo = window?.localStorage?.playlistInfo
            var parsedLocalStoragePlaylistInfo = localStoragePlaylistInfo ? JSON.parse(localStoragePlaylistInfo) : []
            parsedLocalStoragePlaylistInfo.push(newPlaylistInfo)
            window.localStorage.setItem("playlistInfo", JSON.stringify(parsedLocalStoragePlaylistInfo))
            navigate(`/playlist/${discoverPlaylistId}`, {state: { playlist: newPlaylistInfo }})
        } catch (err) {
            console.log(err)
        }
    }

  return (
    <div className="discover">
        <h2> Try submitting a playlist! </h2>
        <div className="dp-container">
            <button id="discoverPlaylist" className="discover-playlist" onClick={submitDiscoverPlaylist}>
                <div className='discover-main'>
                    <div>
                        <img src={albumCover} width="175px" height="175px" />
                    </div>
                    <div>
                        <h3> Movie Soundtracks</h3>
                        <h4> Learn about:</h4>
                        <ul>
                            <li> Popular Artists </li>
                            <li> Song Frequency </li>
                            <li> Audio Features </li>
                        </ul>
                    </div>
                </div>
            </button>
            <div className={`discover-loader ${loader && 'loader'}`}></div>
        </div>
    </div>
  )
}

export default DiscoverPlaylist
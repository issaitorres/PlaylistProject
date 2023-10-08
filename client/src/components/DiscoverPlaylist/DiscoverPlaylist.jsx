import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import albumCover from "../../Assets/movie-soundtracks-cover.jpg"
import "./DiscoverPlaylist.css"


const DiscoverPlaylist = () => {
    const [cookies] = useCookies(["access_token"])
    const [loader, setLoader] = useState(false)
    const discoverPlaylistRef = useRef(null);
    const discoverPlaylistId = "3cT4tGoRr5eC3jGUZT5MTD"
    const navigate = useNavigate()

    const submitDiscoverPlaylist = async (event) => {
        event.preventDefault()

        discoverPlaylistRef.current.classList.add("discoverplaylist__loading");
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
            const res = await axios.post(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/playlists`, {
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
    <div className="discoverplaylist__container">
        <h2> Try submitting a playlist! </h2>
        <div>
            <button ref={discoverPlaylistRef} className="discoverplaylist__button" onClick={submitDiscoverPlaylist}>
                <div className='discoverplaylist__main'>
                    <div>
                        <img src={albumCover} alt="discoveralbumart" width="175px" height="175px" />
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
            <div className={`discoverplaylist__loader ${loader && 'loader'}`}></div>
        </div>
    </div>
  )
}

export default DiscoverPlaylist

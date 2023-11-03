import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import albumCover from "../../Assets/movie-soundtracks-cover.jpg"
import "./DiscoverPlaylist.css"
import {
    addNewPlaylistInfoToLocalStorage,
    playlistExistsInLocalStorage,
    environment
} from '../../utils/components'

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
        // edge case: discover playlist can flash for like a second before the user's playlists are loaded
        //            in which they can submit the discover playlist and then have two copies in their local storage
        //            but this if statement won't catch it since the local storage was empty initially
        //            Recap: so LS is empty, user submits discoverplaylist, then LS gets populated with user's playlists
        //            which includes a copy of discoverplaylist
        //            maybe we can handle this when we load the playlists in
        if(playlistExistsInLocalStorage(discoverPlaylistId)) {
            // navigate to playlist and exit - this would submit another playlist without this return
            navigate(`/playlist/${discoverPlaylistId}`)
            return
        }
    
        setLoader(!loader)
        try {
            const res = await axios.post(`${environment}/playlists`, {
                playlistId: discoverPlaylistId
            }, 
            {
                headers: {
                authorization: `Bearer ${cookies.access_token}`
                }
            })

            addNewPlaylistInfoToLocalStorage(res.data)
            navigate(`/playlist/${discoverPlaylistId}`, {state: { playlist: res.data }})
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

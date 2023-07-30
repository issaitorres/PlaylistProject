import React from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import FrequencyBarGraph from './FrequencyBarGraph';
import YearsBarGraph from './YearsBarGraph';
import ArtistPopularityGraph from './ArtistPopularityGraph';


// const PlaylistContainer = ({ playlistId, playlistObjectId, fetchPlaylists }) => {
  const PlaylistContainer = ({ playlist, fetchPlaylists }) => {
  const { 
    _id: playlistObjectId,
    playlistId, 
    playlistName,
    playlistOwner,
    playlistImage,
    songCount,
    artistCount,
    topArtist,
    topGenre,
    topYear,
    playlistDuration,
    averageTrackDuration,
    shortestTrack,
    longestTrack,
    artistFrequency,
    genreFrequency,
    yearFrequency,
    artistPopularity
   } = playlist

  const [cookies, setCookies] = useCookies(["access_token"])


  const removePlaylist = async (playlistObjectId) => {
    const res = await axios.delete("http://localhost:3500/playlists" ,
     {
      headers: {
        authorization: `Bearer ${cookies.access_token}`
      },
      data: {
        "playlistObjectId": playlistObjectId
      }
    })

    // alert("remove successful")
    fetchPlaylists()
  }

  const convertMStoFormat = (durationInMs, keepSeconds=false) => {
    var durationInMs = Number(durationInMs)
    const seconds = Math.floor((durationInMs / 1000) % 60);

    const minutes = Math.floor((durationInMs / 1000 / 60) % 60);
    const hours = Math.floor((durationInMs / 1000 / 60 / 60) % 24);

    var res = ""
    if(!keepSeconds) res += "about "

    if(hours) res += `${hours} ${hours > 1 ? "hrs": "hr"} `
    if(minutes) res += `${minutes} ${minutes > 1 ? "mins": "min"} `
    if(keepSeconds && seconds) res += `${seconds} ${seconds > 1 ? "secs": "sec"} `
    
    return res
  }

  return (
    <div className="container">
        <div>
            <label> playlistObjectId: </label> <span>{playlistObjectId}</span>
        </div>
        <div>
            <label> playlistId: </label> <span>{playlistId}</span>
        </div>
        <div>
            <label> playlistName: </label> <span>{playlistName}</span>
        </div>
        <div>
            {/* <label> playlistImage: </label> <span>{playlistImage}</span> */}
            <img src={playlistImage} alt="Playlist Image" height="300" widht="300"/>
        </div>

        <div>
            <label> playlistOwner: </label> <span>{playlistOwner}</span>
        </div>
        <div>
            <label> songCount: </label> <span>{songCount}</span>
        </div>
        <div>
            <label> artistCount: </label> <span>{artistCount}</span>
        </div>
        {/* still need to account for multiple topyears, topgenres, topartists */}
        <div>
            <label> topArtist: </label> <span>{topArtist.join(" & ")}</span>
        </div>        
        <div>
            <label> topGenre: </label> <span>{topGenre.join(" & ")}</span>
        </div>
        <div>
            <label> topYear: </label> <span>{topYear.join(" & ")}</span>
        </div>
        <div>
            <label> playlistDuration: </label> <span>{convertMStoFormat(playlistDuration)}</span>
        </div>
        <div>
            <label> averageTrackDuration: </label> <span>{convertMStoFormat(averageTrackDuration)}</span>
        </div>
        <div>
            <label> shortestTrack name: </label> <span>{shortestTrack.name}</span>
            <label> shortestTrack duration: </label> <span>{convertMStoFormat(shortestTrack.duration, true)}</span>
        </div>
        <div>
            <label> longestTrack name: </label> <span>{longestTrack.name}</span>
            <label> longestTrack duration: </label> <span>{convertMStoFormat(longestTrack.duration, true)}</span>
        </div>
        <div>
          <button onClick={() => removePlaylist(playlistObjectId)}>
            Remove
          </button>
        </div>
        {artistFrequency ? 
                <FrequencyBarGraph
                frequency={artistFrequency}
                graphTitle={'Most common artists'}
                xTitleText={'Artist'}
                YTitleText={'# of songs'}
              />
              : "spinner"
        }

        {genreFrequency ? 
                  <FrequencyBarGraph
                  frequency={genreFrequency}
                  graphTitle={'Most common genres'}
                  xTitleText={'Genre'}
                  YTitleText={'# of songs'}
                />
                : "spinner"
        }

{/* update to the new playlist model where we can display the track names! */}
        {yearFrequency ? 
                <YearsBarGraph
                frequency={yearFrequency}
                graphTitle={'Most common years'}
                xTitleText={'Year'}
                YTitleText={'# of songs'}
              />
              : "spinner"
        }
        {yearFrequency ? 
                <ArtistPopularityGraph
                frequency={artistPopularity}
                graphTitle={'Artist Popularity'}
                xTitleText={'Artist'}
                YTitleText={'Popularity (Spotify algorithm)'}
              />
              : "spinner"
        }

    </div>
  )
}

export default PlaylistContainer
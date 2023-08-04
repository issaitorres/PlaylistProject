import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import FrequencyBarGraph from './FrequencyBarGraph';
import YearsBarGraph from './YearsBarGraph';
import ArtistBarGraph from './artistBarGraph';
import ArtistPopularityGraph from './ArtistPopularityGraph';
import GridContent from './gridContent';
import "./playlistContainer.css"


// const PlaylistContainer = ({ playlistId, playlistObjectId, fetchPlaylists }) => {
  const PlaylistContainer = ({ playlist, fetchPlaylists=null }) => {
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
    genreFrequency,
    yearFrequency,
    artistPopularity,
    artistSongsInfo
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
    if(!keepSeconds) res += "~ "
    if(hours) res += `${hours} ${hours > 1 ? "hrs": "hr"} `
    if(minutes) res += `${minutes} ${minutes > 1 ? "mins": "min"} `
    if(keepSeconds && seconds) res += `${seconds} ${seconds > 1 ? "secs": "sec"} `
    
    return res
  }

  return (
    <div className="container">
      <div className="flex-container">
        <div className="sidebar">
          <img src={playlistImage} alt="Playlist Image" height="200" widht="200"/>
        </div>
        <div className="sidebar">
          <div>
            <div>
              <h2 className="playlist-title">
                {playlistName}
              </h2>
            </div>
            <div className='playlist-author'>
              by <b>{playlistOwner}</b>
            </div>

            <div>
              <b>{songCount}</b> tracks by <b>{artistCount}</b> artists
            </div>
            <div>
              <label> {`Top Artist${topArtist.length > 1 ? 's' : ''}:`} </label> <span><b>{topArtist.join(" & ")}</b></span>
            </div>
            <div>
              <label> {`Top Genre${topGenre.length > 1 ? 's' : ''}:`} </label> <span><b>{topGenre.join(" & ")}</b></span>
            </div>
            <div>
              <label> {`Top Year${topYear.length > 1 ? 's' : ''}:`} </label> <span><b>{topYear.join(" & ")}</b></span>
            </div>
            <div>
              <label> Total Duration: </label> <span><b>{convertMStoFormat(playlistDuration)}</b></span>
            </div>
            <div>
                <label> Avg. Track length: </label> <span><b>{convertMStoFormat(averageTrackDuration)}</b></span>
            </div>
          </div>
        </div>
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

      <div className="graph-container">
        <h2>
          Artist Information
        </h2>
        {artistSongsInfo ?
          <ArtistBarGraph
            artistData={artistSongsInfo}
            graphTitle={'Most common artists'}
            xAxisTitle={'Artist'}
            yAxisTitle={'# of songs'}
          />
          : "spinner"
        }
        <GridContent
          data={artistSongsInfo}
          headers={["Artist", "# of songs", "Songs"]}
        />
      </div>

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
        <h3>
          More Details
        </h3>
        <p>
          Artist Popularity is calculated by the Spotify Algorithm
        </p>

    </div>
  )
}

export default PlaylistContainer
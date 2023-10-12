import React, { useContext, useRef, useState } from "react"
import { Outlet } from 'react-router-dom';


const AudioContext = React.createContext()

export function useAudio() {
    return useContext(AudioContext)
}

export function AudioProvider() {
    const previousAlbumartaudio = useRef(null)
    const [timerId, setTimerId] = useState(false)


    const toggleAudio = (newAlbumartaudio) => {

        const oldAlbumartaudio = previousAlbumartaudio.current
        var audioElem
        var playIcon
        var pauseIcon
        var newClass

        audioElem = newAlbumartaudio.children[1].children[1]
        playIcon = newAlbumartaudio.children[1].children[0].children[0]
        pauseIcon = newAlbumartaudio.children[1].children[0].children[1]

        if (audioElem.paused) {
            audioElem.play();
            playIcon.setAttribute('class', (playIcon.getAttribute("class") || '') + " hidden-button")
            newClass = pauseIcon.getAttribute("class").replaceAll("hidden-button", "");
            pauseIcon.setAttribute('class', newClass)
            autoPause(newAlbumartaudio)
        } else {
            audioElem.pause();
            pauseIcon.setAttribute('class', (pauseIcon.getAttribute("class") || '') + " hidden-button")
            newClass = playIcon.getAttribute("class").replaceAll("hidden-button", "");
            playIcon.setAttribute('class', newClass)
        }

        // second condition prevents not being able to toggle audio when clicking on same albumartaudio multiple times
        if(oldAlbumartaudio && newAlbumartaudio !== oldAlbumartaudio) {
            audioElem = oldAlbumartaudio.children[1].children[1]
            playIcon = oldAlbumartaudio.children[1].children[0].children[0]
            pauseIcon = oldAlbumartaudio.children[1].children[0].children[1]

            if (!audioElem.paused) {
                audioElem.pause();
                pauseIcon.setAttribute('class', (pauseIcon.getAttribute("class") || '') + " hidden-button")
                newClass = playIcon.getAttribute("class").replaceAll("hidden-button", "");
                playIcon.setAttribute('class', newClass)
            }
        }

        // clear autopause timer
        if(timerId) {
            clearTimeout(timerId)
        }

        previousAlbumartaudio.current = newAlbumartaudio
    }


    const autoPause = (newAlbumartaudio) => {
        var playIcon = newAlbumartaudio.children[1].children[0].children[0]
        var pauseIcon = newAlbumartaudio.children[1].children[0].children[1]
        var newClass

        const newTimerId = setTimeout(() => {
            pauseIcon.setAttribute('class', (pauseIcon.getAttribute("class") || '') + " hidden-button")
            newClass = playIcon.getAttribute("class").replaceAll("hidden-button", "");
            playIcon.setAttribute('class', newClass)
        }, 30000)

        setTimerId(newTimerId)
    }


    return (
        <AudioContext.Provider value={toggleAudio}>
            <Outlet/>
        </AudioContext.Provider>
    )
}

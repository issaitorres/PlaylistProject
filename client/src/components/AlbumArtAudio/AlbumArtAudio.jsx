import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { useAudio } from '../../AudioContext'
import missingAlbumImage from "../../Assets/missing-album-image.png"
import "./AlbumArtAudio.css"


const AlbumArtAudio = ({ track, size, className }) => {
    const handleAudio = useAudio()
    var albumImage = track?.album?.albumImage || track?.albumArt

    return (
            <div
                className={`albumartaudio__container ${className}`}
                onClick={track.trackPreview ? (e) => handleAudio(e.currentTarget) : null}
                style={{cursor: track.trackPreview ? "pointer" : "default"}}
            >
                {
                    albumImage
                        ? <img src={albumImage} alt="albumimage" width={size} height={size}/>
                        : <img src={missingAlbumImage} alt="albumimage" width={size} height={size}/>
                }
                {
                    track.trackPreview &&
                        <div className="albumartaudio__audio-container">
                            <button>
                                <FontAwesomeIcon icon={faPlay} />
                                <FontAwesomeIcon className="hidden-button" icon={faPause} />
                            </button>
                            <audio src={track.trackPreview}/>
                        </div>
                }
            </div>
    )
}

export default AlbumArtAudio

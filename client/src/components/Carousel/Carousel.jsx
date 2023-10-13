import React, { useState, useMemo, useRef } from 'react'
import BarChart from '../Charts/BarChart'
import PieChart from '../Charts/PieChart'
import AudioFeaturesContainer from '../AudioFeaturesContainer/AudioFeaturesContainer'
import Grid from './Grid';
import getAudioFeaturesData from "../../data/audioFeaturesData"
import ShortestLongestTrack from '../ShortestLongestTrack/ShortestLongestTrack'
import {
    getShortestTrack,
    getLongestTrack,
} from "../../helper/PlaylistContainerHelperMethods"
import "./carousel.css"

const Carousel = ({ 
    trackTable,
    graphGridData
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activateAnimation, setActivateAnimation] = useState(false)
    const audioFeaturesData = getAudioFeaturesData(trackTable, activateAnimation, setActivateAnimation)
    const carouselPreviousItem = useRef(null)

    // need useMemo since activateAnimation causes rerenders which changes the color for decades pie chart when scrolling
    const decadesPieChart = useMemo(
        () => <PieChart
                trackTable={trackTable}
                title={"Decades"}
                type={"decades"}
            />,
        [trackTable]
    );

    const goToSlide = (slideIndex, currentTarget) => {
        setCurrentIndex(slideIndex);
        activeSlide(currentTarget)
    };

    const activeSlide = (currentTarget) => {
        var prev = carouselPreviousItem.current
        prev.className = prev.className.replaceAll("carousel__button-active", "");
        currentTarget.className += " carousel__button-active"
        carouselPreviousItem.current = currentTarget
    }


  return (
        <>
            <div className="carousel__button-container">
                {graphGridData.map((data, slideIndex) => {
                    return (
                        <React.Fragment key={slideIndex}>
                            <button 
                                onClick={(e) => goToSlide(slideIndex, e.currentTarget)}
                                className={`carousel__button ${slideIndex === 0 ? "carousel__button-active" : ""}`}
                                ref={slideIndex === 0 ? carouselPreviousItem : null }
                            >
                                {data.title}
                            </button>
                            <div className="carousel__button-divider" ></div>
                        </React.Fragment>
                    )
                })}
                <button 
                    key={4}  
                    onClick={(e) => goToSlide(4, e.currentTarget)}
                    className={`carousel__button`}
                    ref={null}
                >
                    Extras
                </button>
            </div>
            <div className="carousel__container">
                {graphGridData.map((graphGrid, index) => {
                    return (
                    <div className='carousel__item' key={index} style={{transform: `translate(-${currentIndex * 100}%)`}}>
                        <div className="carousel__graph-container">
                            {
                                graphGrid.graph.data
                                    ? 
                                        <BarChart graph={graphGrid.graph} />
                                    : 
                                        "spinner"
                            }
                            {
                                graphGrid.grid.data
                                    ? 
                                        <Grid grid={graphGrid.grid} />
                                    : 
                                        "spinner"
                            }
                        </div>
                    </div>
                    )})
                }
                <div className='carousel__item' key={4} style={{transform: `translate(-${currentIndex * 100}%)`}}>
                    <div className="carousel__extra-container">
                        <div className="carousel__extras-top-section">
                            <div className="carousel__explicit-container">
                                <div className="carousel__piechart-container">
                                    <PieChart trackTable={trackTable} title="Explicit" type="explicit" />
                                </div>
                                <div className="carousel__piechart-container">
                                    {decadesPieChart}
                                </div>
                            </div>
                            <ShortestLongestTrack
                                shortestTrack={getShortestTrack(trackTable)}
                                longestTrack={getLongestTrack(trackTable)}
                            />
                        </div>
                        <div className="carousel__extras-bottom-section">
                            {audioFeaturesData.map((data, index) => {
                                return (
                                    <AudioFeaturesContainer {...data} key={index} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Carousel

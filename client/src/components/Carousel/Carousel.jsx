import React, { useState, useEffect, useMemo } from 'react'
import BarChart from '../Charts/BarChart';
import AudioFeaturesContainer from '../AudioFeaturesContainer/AudioFeaturesContainer';
import Grid from './Grid';
import PieChart from '../Charts/PieChart';
import getAudioFeaturesData from "../../data/audioFeaturesData"
import ShortestLongestTrack from '../ShortestLongestTrack/ShortestLongestTrack';
import {
    getShortestTrack,
    getLongestTrack,
} from "../../helper/PlaylistContainerHelperMethods"
import "./carousel.css"

const Carousel = ({ 
    trackTable,
    graphGridData, 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activateAnimation, setActivateAnimation] = useState(false)
    const audioFeaturesData = getAudioFeaturesData(trackTable, activateAnimation, setActivateAnimation)

    // need useMemo since activateAnimation causes rerenders which changes the color for decades pie chart
    const decadesPieChart = useMemo(
        () => <PieChart
                trackTable={trackTable}
                title={"Decades"}
                type={"decades"}
            />,
        [trackTable]
    );

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
        activeSlide(slideIndex)
    };

    const activeSlide = (slideIndex) => {
        var current = document.getElementsByClassName("carousel-button-active");
        current[0].className = current[0].className.replaceAll("carousel-button-active", "");
        document.querySelector(`.cb${slideIndex}`).className += "carousel-button-active"
    }

    // give active className to first carousel button on page load
    useEffect(() => {
        document.querySelector('.cb0').className += " carousel-button-active"
    }, [])


  return (
        <div className="flex-container">
            <div className="carousel-button-container">
                {graphGridData.map((data, slideIndex) => {
                    return (
                        <React.Fragment key={slideIndex}>
                            <button 
                                onClick={() => goToSlide(slideIndex)}
                                className={`carousel-button cb${slideIndex} `}
                            >
                                {data.title}
                            </button>
                            <div className="vl" ></div>
                        </React.Fragment>
                    )
                })}
                <button 
                    key={4}  
                    onClick={() => goToSlide(4)}
                    className={`carousel-button cb${4} `}
                >
                    Extras
                </button>
            </div>
            <div className="carousel-container">
                {graphGridData.map((graphGrid, index) => {
                    return (
                    <div className='carousel-item' key={index} style={{transform: `translate(-${currentIndex * 100}%)`}}>
                        <div className="graph-container">
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
                <div className='carousel-item' key={4} style={{transform: `translate(-${currentIndex * 100}%)`}}>
                    <div className="more-container">
                        <div className="more-top-container">
                            <div className="explicit-container">
                                <div className="piechart-container">
                                    <PieChart trackTable={trackTable} title="Explicit" type="explicit" />
                                </div>
                                <div className="piechart-container">
                                    {decadesPieChart}
                                </div>
                            </div>
                            <ShortestLongestTrack
                                shortestTrack={getShortestTrack(trackTable)}
                                longestTrack={getLongestTrack(trackTable)}
                            />
                        </div>
                        <div className="more-bottom-container">
                            {audioFeaturesData.map((data, index) => {
                                return (
                                    <AudioFeaturesContainer {...data} key={index} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carousel

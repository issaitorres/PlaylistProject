import React, { useState, useEffect } from 'react'
import GraphContent from './GraphContent';
import QualityContainer from './QualityContainer';
import CarouselGrid from './CarouselGrid';
import "./carousel.css"

const Carousel = ({ 
    graphGridData, 
    explicitPieChart,
    decadesPieChart,
    qualityData,
    shortestLongestTrack
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
        activeSlide(slideIndex)
    };

    const activeSlide = (slideIndex) => {
        var current = document.getElementsByClassName("carousel-button-active");
        current[0].className = current[0].className.replaceAll("carousel-button-active", "");
        document.querySelector(`.cb${slideIndex}`).className += "carousel-button-active"
    }

    // give active className to first button on load
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
                            {/* {slideIndex !== Object.keys(graphGridData).length-1 &&  <div class="vl"></div> } */}
                            <div className="vl" ></div>
                        </React.Fragment>
                    )
                })}
                <button 
                    key={4}  
                    onClick={() => goToSlide(4)}
                    className={`carousel-button cb${4} `}
                >
                    More
                </button>
            </div>
            <div className="carousel-container">
                {graphGridData.map((graphGrid, index) => {
                    return (
                    <div className='carousel-item' key={index} style={{transform: `translate(-${currentIndex * 100}%)`}}>
                        <div className="graph-container">
                            {graphGrid.graph.data
                                ? 
                                    <GraphContent
                                        graph={graphGrid.graph}
                                    />
                                : "spinner"
                            }
                            {
                            graphGrid.grid.data
                                ? 
                                    <CarouselGrid grid={graphGrid.grid}/>
                                : "spinner"
                            }
                        </div>
                    </div>
                    )})
                }
                <div className='carousel-item' key={4} style={{transform: `translate(-${currentIndex * 100}%)`}}>
                    <div className="more-container">
                        <div className="more-top-container">
                            <div className="explicit-container">
                                {/* <div style={{width: "400px", height: "300px"}}> */}
                                <div className="piechart-container">
                                    {explicitPieChart}
                                </div>
                                <div className="piechart-container">
                                    {decadesPieChart}
                                </div>

                                {/* </div>  */}
                            </div>
                            {/* <div className="explicit-container">
                                    {piechartTwo}
                            </div> */}
                            {/* <div className="shortest-longest-container">
                                {shortestTrack}
                                {longestTrack}
                            </div> */}
                            {shortestLongestTrack}
                        </div>
                        <div className="more-bottom-container">
                            {qualityData.map((data, index) => {
                                return (
                                    <QualityContainer {...data} key={index} />
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





{/* <div className="happiness-container">
    {happinessFill}
</div> */}

{/* <div className="energy-container">
    {lightningFill}
</div> */}
{/* <div className="dance-container">
    {discoFill}
</div> */}



    // window.onload = () =>  {
    //     document.querySelector('.cb0').className += " carousel-button-active"
    //   };


        {/* <div className="carousel-button-container">
            {graphGridData.map((data, slideIndex) => (
                <div 
                    key={slideIndex}  
                    onClick={() => goToSlide(slideIndex)}
                >
                    <button className="carousel-button">
                        {data.title}
                    </button>
                </div>
            ))}
        </div> */}


                            // <div 
                    //     key={slideIndex}  
                    //     onClick={() => goToSlide(slideIndex)}
                    // >
                    //     <button className="carousel-button">
                    //         {data.title}
                    //     </button>
                    // </div>


// working buttons
{/* <div className="carousel-button-container">
{graphGridData.map((data, slideIndex) => (
    <div 
        key={slideIndex}  
        onClick={() => goToSlide(slideIndex)}
    >
        <button className="carousel-button">
            {data.title}
        </button>
    </div>
))}
</div> */}




{/* <div classsName="carousel-item">
    Item 1 
</div>
<div classsName="carousel-item">
    Item 2
</div> */}



            {/* {data.map((item, index) => {
    return (
        <h1 
            className='carousel-item'
            style={{transform: `translate(-${currentIndex * 100}%)`}}
            // style={{transform: `translate(-100%)`}}

            key={index}
        >
            {item}
        </h1>
    )
})} */}


// const goToPrevious = () => {
//     const isFirstSlide = currentIndex === 0;
//     const newIndex = isFirstSlide ? data.length - 1 : currentIndex - 1;
//     setCurrentIndex(newIndex);
//   };
// const goToNext = () => {
// const isLastSlide = currentIndex === data.length - 1;
// const newIndex = isLastSlide ? 0 : currentIndex + 1;
// setCurrentIndex(newIndex);
// };



// const carouselInfiniteScroll = () => {
//     if(currentIndex === data.length-1) {
//         setCurrentIndex(0)
//     }
//     return setCurrentIndex(currentIndex+1)
// }


    // automatically loop after a couple seconds 
    // useEffect(()=> {
    //     const interval = setInterval(() => {carouselInfiniteScroll()}, 3000)
    //     return () => clearInterval(interval)
    // })
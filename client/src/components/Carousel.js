import React, {useState, useEffect} from 'react'
import GridContent from './gridContent';
import GraphContent from './GraphContent';
import "./carousel.css"

const Carousel = ({ graphGridData }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
        setActive(slideIndex)
    };

    const setActive = (slideIndex) => {
        var current = document.getElementsByClassName("carousel-button-active");
        current[0].className = current[0].className.replaceAll("carousel-button-active", "");
        document.querySelector(`.cb${slideIndex}`).className += "carousel-button-active"
    }

    // give active className to first button on load
    useEffect(() => {
        document.querySelector('.cb0').className += " carousel-button-active"
    }, [])


  return (
    <>
        <div className="flex-container">
            <div className="carousel-button-container">
                {graphGridData.map((data, slideIndex) => (
                    <>
                        <button 
                            key={slideIndex}  
                            onClick={() => goToSlide(slideIndex)}
                            className={`carousel-button cb${slideIndex} `}
                        >
                            {data.title}
                        </button>
                        {slideIndex !== Object.keys(graphGridData).length-1 &&  <div class="vl"></div> }
                    </>
                ))}
            </div>
            <div className="carousel-container">
                {graphGridData.map((graphGrid, index) => {
                    return (
                    <div className='carousel-item' key={index} style={{transform: `translate(-${currentIndex * 100}%)`}}>
                        <div className="graph-container">
                            {/* <h2>
                            {graphGrid.title}
                            </h2> */}
                            {graphGrid.graph.data
                                ? <GraphContent
                                    data={graphGrid.graph.data}
                                    graphTitle={graphGrid.graph.graphTitle}
                                    xAxisTitle={graphGrid.graph.xAxisTitle}
                                    yAxisTitle={graphGrid.graph.yAxisTitle}
                                    customTicks={graphGrid.graph.customTicks}
                                    customTooltip={graphGrid.graph.customTooltip}
                                    groupData={graphGrid.graph.groupData}
                                    xData={graphGrid.graph.xData}
                                    yData={graphGrid.graph.yData}
                                    useKeyForxData={graphGrid.graph.useKeyForxData}
                                    useValueForLabels={graphGrid.graph.useValueForLabels}
                                    />
                                : "spinner"
                            }
                            {
                            graphGrid.grid.data
                                ? <GridContent
                                    title={graphGrid.grid.title}
                                    data={graphGrid.grid.data}
                                    headers={graphGrid.grid.headers}
                                    columnTypes={graphGrid.grid.columnTypes}
                                    columnSortable={graphGrid.grid.columnSortable}
                                    columnValues={graphGrid.grid.columnValues}
                                    initialSort={graphGrid.grid.initialSort}
                                    />
                                : "spinner"
                            }

                        </div>
                    </div>
                    )})
                }
            </div>
        </div>
    </>
  )
}

export default Carousel



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
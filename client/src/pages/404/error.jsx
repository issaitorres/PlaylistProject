import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import errorIcon from "../../Assets/404.png"
import "./error.css"


const Error = () => {
  const [time, setTime] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    if (time <= 0) {
      clearInterval(intervalId)
      navigate('/')
    }

    // clear interval on re-render to avoid memory leaks
    return () => {
      // the interval from 10 - 9 gets deleted and then a new gets created that
      //  goes from 9 - 8 and so on
      clearInterval(intervalId)
    };
    // add time as a dependency to re-rerun the effect when we update it
  }, [time, navigate]);

  return (
    <div className="full-page" style={{alignItems: "start"}}>
      <div className="error-container">
        <h1> 404</h1>
        <img src={errorIcon} alt="missingpageimage" width="300px"/>
        <p> Dude where's my page?</p>
        <div className="time">
          Redirecting back
          &thinsp;
          <Link to="/" className="link">
              home
          </Link>
          &thinsp;
          in... {time}
        </div>
      </div>
    </div>
  )
}

export default Error
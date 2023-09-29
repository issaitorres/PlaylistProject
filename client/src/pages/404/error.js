import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import { useEffect } from 'react'


const Error = () => {
  const navigate = useNavigate()

  var time = 10;
  const homeInterval = setInterval(() => {
    document.getElementById("time").innerHTML = time;
    if (time == 0) {
      removeInterval()
      navigate('/')
    }
    time--;

  }, 1000);

  const removeInterval = () => {
    clearInterval(homeInterval);
  }

  // remove interval if user leaves page by clicking on any link
  useEffect(() => {
    return () => removeInterval();
  }, [])

  return (
    <div className="full-page" style={{alignItems: "start"}}>
      <div className="error-container">
        <h1> 404</h1>
        <p> Dude where's my page?</p>
        <div className="time">
          Redirecting back
          &thinsp;
          <Link to="/" className="link" onClick={removeInterval}>
              home
          </Link>
          &thinsp;
          in... <span id="time"></span>
        </div>
      </div>
    </div>
  )
}

export default Error
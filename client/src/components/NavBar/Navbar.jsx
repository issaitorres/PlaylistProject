import { NavLink } from "react-router-dom"
import { useCookies } from 'react-cookie'
import './NavBar.css'


const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"])
  const userInfo = window?.localStorage?.userInfo
  const username = userInfo ? JSON.parse(userInfo).username : "user"

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div>
          <NavLink to="/" activeclassname="active">Home </NavLink>
        </div>
      </div>
      {/* <div> */}
        {!cookies.access_token
          ?
            <div className="navbar-right">
              <div>
                <NavLink to="/register" activeclassname="active">Register </NavLink>
              </div>
              <div>
                <NavLink to="/login" activeclassname="active">Login </NavLink>
              </div>
            </div>
          :
            <div className="navbar-right">
              <div>
                <NavLink to="/user" activeclassname="active"> {username} </NavLink>
              </div>
              <div>
                <NavLink to="/logout" activeclassname="active">Logout </NavLink>
              </div>
            </div>
        }
      {/* </div> */}
    </div>
  )
}


export default Navbar
import { NavLink } from "react-router-dom"
import { useCookies } from 'react-cookie'
import './NavBar.css'


const Navbar = () => {
  const [cookies] = useCookies(["access_token"])
  const userInfo = window?.localStorage?.userInfo
  const username = userInfo ? JSON.parse(userInfo).username : "user"

  return (
    <div className="navbar">
      <div className="navbar-flex">
        <div className="navbar-section">
          <NavLink to="/" activeclassname="active">Home </NavLink>
        </div>
        <div className="navbar-section">
          {
            !cookies.access_token
              ?
                <>
                  <NavLink to="/register" activeclassname="active">Register </NavLink>
                  <NavLink to="/login" activeclassname="active">Login </NavLink>
                </>
              :
                <>
                  <NavLink to="/user" activeclassname="active"> Account: {username} </NavLink>
                  <NavLink to="/logout" activeclassname="active">Logout </NavLink>
                </>
          }
        </div>
      </div>
    </div>
  )
}


export default Navbar
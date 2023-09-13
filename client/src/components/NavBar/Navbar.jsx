import { NavLink } from "react-router-dom"
import { useCookies } from 'react-cookie'
import './NavBar.css'


const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"])

  return (
    <div className="navbar">
      <div>
        <NavLink to="/" activeclassname="active">Home </NavLink>
      </div>
      <div>
        {!cookies.access_token
          ? <div>
              <NavLink to="/register" activeclassname="active">Register </NavLink>
              <NavLink to="/login" activeclassname="active">Login </NavLink>
            </div>
          : <div>
              <NavLink to="/logout" activeclassname="active">Logout </NavLink>
            </div>
        }
      </div>
    </div>
  )
}


export default Navbar
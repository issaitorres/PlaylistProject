import React from 'react'
import { useNavigate } from 'react-router-dom'
import { NavLink } from "react-router-dom"
import { useCookies} from 'react-cookie'



const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

  return (
    <div className="NavBar">
      <div>
        <NavLink exact to="/" activeClassName="active">Home </NavLink>
      </div>
      <div>
        {!cookies.access_token
            ? <div>
                <NavLink exact to="/register" activeClassName="active">Register </NavLink>
                <NavLink exact to="/auth" activeClassName="active">Login </NavLink>
              </div>
            : <div>
                <NavLink exact to="/logout" activeClassName="active">Logout </NavLink>
              </div>
        }
      </div>
    </div>
  )
}

export default Navbar
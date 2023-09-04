import { useNavigate } from 'react-router-dom'
import { NavLink } from "react-router-dom"
import { useCookies} from 'react-cookie'


const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

  return (
    <div className="NavBar">
      <div>
        <NavLink to="/" activeclassname="active">Home </NavLink>
      </div>
      <div>
        {!cookies.access_token
          ? <div>
              <NavLink to="/register" activeclassname="active">Register </NavLink>
              <NavLink to="/auth" activeclassname="active">Login </NavLink>
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
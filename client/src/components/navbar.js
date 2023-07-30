import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import { useCookies} from 'react-cookie'



const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

  return (
    <div>
        <Link to="/">Home </Link>
        <Link to="/register">Register </Link>
        {!cookies.access_token
            ? <Link to="/auth">Login </Link>

            : <Link to="/logout">Logout </Link>
        }
        
    </div>
  )
}

export default Navbar
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const Logout = () => {
    const navigate = useNavigate()
    const [cookies, setCookies, removeCookie] = useCookies(["access_token"])

    useEffect(() => {
        removeCookie("access_token", { path: '/' })
        // removeCookie("access_token")
        //jwt http only cookie - can only be changed from server, not frontend
        window.localStorage.removeItem("userInfo")
        window.localStorage.removeItem("playlistInfo")
        navigate("/")
    })

  return (
    <div>Logout</div>
  )
}

export default Logout
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const Logout = () => {
    const navigate = useNavigate()
    const [cookies, setCookies, removeCookie] = useCookies(["access_token"])

    useEffect(() => {
        removeCookie("access_token", { path: '/' }) // idk if we need this
        removeCookie("access_token") // we need this
        //jwt cookie -  http only cookie - can only be changed from server, not frontend
        window.localStorage.removeItem("userInfo")
        window.localStorage.removeItem("playlistInfo")
        navigate("/")
        navigate(0) // refresh needed to clear access_token
    },[])

  return (
    <div>Logout</div>
  )
}

export default Logout
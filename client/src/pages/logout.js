import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies} from 'react-cookie'



const Logout = () => {
    const navigate = useNavigate()
    const [cookies, setCookies] = useCookies(["access_token"])

    useEffect(() => {
        setCookies("access_token", "")
        window.localStorage.removeItem("userID")
        navigate("/")
    })

  return (
    <div>Logout</div>
  )
}

export default Logout
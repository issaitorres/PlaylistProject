import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { clearAppInfo } from '../../utils/components'
import axios from 'axios'
import {
  environment
} from '../../utils/components'

const Logout = () => {
    const navigate = useNavigate()
    const [ , , removeCookie] = useCookies(["access_token"])

    useEffect(() => {
      try {
        const res = axios.get(`${environment}/logout`,
          {
            withCredentials: true
          }
        )
      } catch (err) {
        console.log(err)
      }

      removeCookie("access_token", { path: '/' }) // idk if we need this
      removeCookie("access_token") // we need this
      clearAppInfo()
      navigate("/")
      navigate(0) // refresh needed to clear access_token

      //jwt cookie -  http only cookie - can only be changed from server, not frontend
      //spotifyPlaylistUserData - we will not remove this data in localstorage when user signs out
      //  - this data is only removed when user manually logouts of spotify from addplaylist component
    },[])

  return (
    <div>Logout</div>
  )
}

export default Logout
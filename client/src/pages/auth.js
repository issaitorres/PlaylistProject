import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'




const Auth = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cookies, setCookies] = useCookies(["access_token"])
  const navigate = useNavigate()



  const onSubmit = async (event) => {
    event.preventDefault()

    try {
      const res = await axios.post("http://localhost:3500/auth", {
        email,
        password
      },
      {
        withCredentials: true
      })

      setCookies("access_token", res.data.accessToken, {
        maxAge: 900
      })
      window.localStorage.setItem("userID", res.data.userID)
      alert("successful login")

      navigate('/')


    } catch (err) {
      console.log(err)
    }

  }


  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>email</label>
        <input type="text" value={email} onChange={(event) => setEmail(event.target.value)}/>

        <label>password</label>
        <input type="text" value={password} onChange={(event) => setPassword(event.target.value)}/>
      
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Auth
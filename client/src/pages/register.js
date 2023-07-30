import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const Register = () => {

    const [registerUserData, setRegisterUserData] = useState({
        email: "",
        firstname: "",
        lastname: "",
        password: ""
    })
    const navigate = useNavigate()


    const handleSubmit = async (event) => {
      event.preventDefault()

      try {
        const result = await axios.post("http://localhost:3500/register", registerUserData)
        alert("Registration completed now login!")
         navigate('/auth')

      } catch (err) {
        alert(err.response.data.message)
      }
    }


  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="email"> Email: </label>
        <input 
            onChange={(event) => setRegisterUserData({...registerUserData, email: event.target.value})}
            value={registerUserData.email} 
            type="text" 
            name="email"
            id="email" 
        />

        <label htmlFor="firstname"> First name: </label>
        <input 
          onChange={(event) => setRegisterUserData({...registerUserData, firstname: event.target.value})}
          value={registerUserData.firstname} 
          type="text" 
          name="firstname" 
          id="firstname" 
        />

        <label htmlFor="lastname"> Last Name: </label>
        <input 
          onChange={(event) => setRegisterUserData({...registerUserData, lastname: event.target.value})}
          value={registerUserData.lastname} 
          type="text" 
          name="lastname" 
          id="lastname" 
        />

        <label htmlFor="password"> Password: </label>
        <input 
          onChange={(event) => setRegisterUserData({...registerUserData, password: event.target.value})}
          value={registerUserData.password} 
          type="text" 
          name="password" 
          id="password" 
        />

        <button type="submit"> Register</button>
    </form>
  )
}

export default Register
import { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import FormInput from '../../components/FormInput/FormInput'
import {useLocation} from 'react-router-dom';


const Login = () => {
  const location = useLocation();

  const [loginData, setLoginData] = useState({
    email: location?.state?.email || "",
    password: ""
  })

  const [cookies, setCookies] = useCookies(["access_token"])
  const [displayWarning, setDisplayWarning] = useState(false)

  const navigate = useNavigate()


  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const res = await axios.post("http://localhost:3500/login", loginData,
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
      if(err.response.status === 401){
        setDisplayWarning(true)
      }
      console.log(err)
    }
  }

  const onChange = (e) => {
    setDisplayWarning(false)
    setLoginData({...loginData, [e.target.name]: e.target.value})
  }

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: true,
      errorMessage: "Email cannot be empty and must have valid format ex: test@gmail.com"
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
      required: true,
      errorMessage: ""
    }
  ]


  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="form">
        <h1> Login</h1>
        {displayWarning &&
          <div className="warning">
            Username or password is incorrect
          </div>}
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            value={loginData[input.name]}
            onChange={onChange}
            className="formInput formInput-register-login-width"
            {...input} // pass all other key: values
          />
        ))}
        <button className="submit-button">
          Submit
        </button>
      </form>
    </div>
  )
}

export default Login
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import FormInput from '../../components/FormInput/FormInput'
import './auth.css'


const Register = () => {
  const [registerUserData, setRegisterUserData] = useState({
      email: "",
      username: "",
      password: ""
  })
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)
  const [warning, setWarning] = useState(false)


  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoader(!loader)
    try {
      const result = await axios.post(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/register`, registerUserData)
      navigate('/login', {state: {email: registerUserData.email}})

    } catch (err) {
      setLoader(false)
      setWarning(err.response.data.message)
    }
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
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
      required: true,
      pattern: "[A-Za-z0-9]{3,16}", // can use regex
      errorMessage: "Username must be 2-16 characters and cannot include any special characters"
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
      required: true,
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      errorMessage: "Password should be 8-20 characters and include at least 1 letter, 1 number, and 1 special character",

    },
  ]

  const onChange = (e) => {
    setWarning(false)
    setRegisterUserData({...registerUserData, [e.target.name]: e.target.value})
  }

  return (
    <div className="full-page auth-background">
      <form onSubmit={handleSubmit} className="form">
        <h1> Register</h1>
        {warning &&
          <div className="formInputwarning">
            &#x26A0; {warning}
          </div>
        }
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            value={registerUserData[input.name]}
            onChange={onChange}
            className="formInput formInput-register-login-width"
            password={`${input.type == "password" ? true : false}`}
            {...input} // pass all other key: values
          />
        ))}
        <button className="button submit-theme">
          <div className={`${loader && 'loader'}`}>{!loader && "Submit"}</div>
        </button>
      </form>
    </div>
  )
}

export default Register
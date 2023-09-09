import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'


const Register = () => {
  const [registerUserData, setRegisterUserData] = useState({
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      passwordConfirmation: ""
  })
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const result = await axios.post("http://localhost:3500/register", registerUserData)
      alert("Registration completed now login!")
      navigate('/auth', {state: {email: registerUserData.email}})

    } catch (err) {
      alert(err.response.data.message)
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
      name: "firstname",
      type: "text",
      placeholder: "First Name",
      label: "First Name",
      required: true,
      pattern: "[A-Za-z0-9]{3,16}", // can use regex
      errorMessage: "First name must be 2-16 characters and cannot include any special characters"
    },
    {
      id: 3,
      name: "lastname",
      type: "text",
      placeholder: "Last Name",
      label: "Last Name",
      required: true,
      pattern: "[A-Za-z0-9]{3,16}", // can use regex
      errorMessage: "Last name must be 2-16 characters and cannot include any special characters"
    },
    {
      id: 4,
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
      required: true,
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      errorMessage: "password should be 8-20 characters and include at least 1 letter, 1 number, and 1 special character",

    },
    {
      id: 5,
      name: "passwordConfirmation",
      type: "password",
      placeholder: "Confirm Password",
      label: "Password",
      required: true,
      pattern: registerUserData.password,
      errorMessage: "passwords must match"
    }
  ]

  const onChange = (e) => {
    setRegisterUserData({...registerUserData, [e.target.name]: e.target.value})
  }

  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="form">
        <h1> Register</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            value={registerUserData[input.name]}
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

export default Register
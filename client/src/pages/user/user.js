import { useState } from 'react'
import axios from 'axios'
import FormInput from '../../components/FormInput/FormInput'
import { useCookies } from 'react-cookie'



const User = () => {
  // const location = useLocation();
  const [cookies, setCookies] = useCookies(["access_token"])
  const [loader, setLoader] = useState(false)
  const [warning, setWarning] = useState(false)
  const [successfulUpdate, setSuccessfulUpdate] = useState(false)


  var localStorage
  if(window?.localStorage?.userInfo) {
    localStorage = JSON.parse(window.localStorage.userInfo)
  }

  const [updatedUserData, setUpdatedUserData] = useState({
    email: localStorage?.email || "",
    username: localStorage?.username || "",
    oldPassword: "",
    newPassword: ""
  })


  
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoader(!loader)
    try {
      const result = await axios.patch("http://localhost:3500/user", updatedUserData, {
        headers: {
          authorization: `Bearer ${cookies.access_token}`
        }
      })
      const newUsername = result.data.newusername
      const newEmail = result.data.newemail

      var userInfo
      if(window?.localStorage?.userInfo) {
        userInfo = JSON.parse(window.localStorage.userInfo)

        if(userInfo.email != newEmail) {
          userInfo.email = newEmail
        }
  
        if(userInfo.username != newUsername) {
          userInfo.username = newUsername
        }
  
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo))
      }
      
      setLoader(false)
      setSuccessfulUpdate(true)
      setTimeout(() => {
        setSuccessfulUpdate(false)
      }, 5000);


    } catch (err) {
      setLoader(false)
      setWarning(err.response.data.message)
    }
  }

  const deleteAllUserPlaylists = async () => {
    try {
      const result = await axios.delete("http://localhost:3500/user/deletemyplaylists", {
        headers: {
          authorization: `Bearer ${cookies.access_token}`
        }
      })

      console.log("\n\n\n back to user")
      console.log(result)

      // if success - just clear the localstorage
      window.localStorage.removeItem("playlistInfo")

      setSuccessfulUpdate(true)
      setTimeout(() => {
        setSuccessfulUpdate(false)
      }, 5000);



    } catch (err) {
      console.log("\n\n some err")
      console.log(err)
    }

  }

  // passswords depend on one another, so if we submit old password, new password is required
  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: false,
      errorMessage: "Email cannot be empty and must have valid format ex: test@gmail.com"
    },
    {
      id: 2,
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
      required: false,
      pattern: "[A-Za-z0-9]{3,16}", // can use regex
      errorMessage: "Username must be 2-16 characters and cannot include any special characters"
    },
    {
      id: 3,
      name: "oldPassword",
      type: "password",
      placeholder: "Password",
      label: "Old Password",
      required: false,
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      errorMessage: "password should be 8-20 characters and include at least 1 letter, 1 number, and 1 special character",

    },
    {
      id: 4,
      name: "newPassword",
      type: "password",
      placeholder: "Password",
      label: "New Password",
      required: false,
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      errorMessage: "password should be 8-20 characters and include at least 1 letter, 1 number, and 1 special character",

    },
  ]

  const onChange = (e) => {
    setWarning(false)
    setUpdatedUserData({...updatedUserData, [e.target.name]: e.target.value})
  }

  return (
    <div>
      {successfulUpdate && <div> success </div> }
      <div>
        <form onSubmit={handleSubmit} className="form">
          <h1> Update Credentials</h1>
          {warning ? <div className="warning">{warning}</div> : null}
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              value={updatedUserData[input.name]}
              onChange={onChange}
              className="formInput formInput-register-login-width"
              password={`${input.type == "password" ? true : false}`}
              inputName={input.name}
              {...input} // pass all other key: values
            />
          ))}
          <button className="submit-button">
            <div className={`${loader && 'loader'}`}>{!loader && "Update"}</div>
          </button>
        </form>
      </div>

      <div>
      <h1> Delete My Playlists</h1>
      <button onClick={() => deleteAllUserPlaylists()}>
            Delete My Playlists
      </button>

      </div>

    </div>
  )
}

export default User
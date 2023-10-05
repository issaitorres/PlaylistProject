import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import FormInput from '../../components/FormInput/FormInput'
import Banner from "../../components/Banner/Banner"
import './auth.css'


const Login = () => {
  const location = useLocation();
  const [loader, setLoader] = useState(false)
  const [notice, setNotice] = useState(location?.state?.notice || false)
  const [loginData, setLoginData] = useState({
    email: location?.state?.email || "",
    password: ""
  })
  const [ , setCookies] = useCookies(["access_token"])
  const [displayWarning, setDisplayWarning] = useState(false)
  const navigate = useNavigate()

  useEffect(()=> {
    var homeInterval
    if(notice) {
      var time = 5;
      homeInterval = setInterval(() => {
        if (time === 0) {
          removeInterval()
          setNotice(false)
          navigate("/login", { replace: true }); // remove location state
        }
        time--;
      }, 1000);
    }

    const removeInterval = () => {
      clearInterval(homeInterval);
    }

    return () => removeInterval();
  }, [])


  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoader(!loader)
    try {
      const res = await axios.post(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BACKEND : process.env.REACT_APP_PROD_BACKEND}/login`, loginData,
      {
        withCredentials: true
      })

      // must match time in seconds for accessToken in loginController - maxAge uses seconds
      setCookies("access_token", res.data.accessToken, {
        maxAge: 7 * 24 * 60 * 60
      })
      window.localStorage.setItem("userInfo", JSON.stringify({
        id: res.data.userID,
        email: res.data.userEmail,
        username: res.data.username
      }))
      navigate('/')

    } catch (err) {
      if(err?.response?.status === 401){
        setDisplayWarning(true)
      }
      setLoader(false)
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
      errorMessage: "Password cannot be empty"
    }
  ]


  return (
    <div className="full-page auth-background">
      {
        notice &&
          <Banner
            notice={notice}
            bannerType="warning"
            bannerPosition="fixed"
          />
      }
      <form onSubmit={handleSubmit} className="form">
        <h1> Login</h1>
        {displayWarning &&
          <div className="formInputwarning">
            &#x26A0; Username or password is incorrect
          </div>}
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            value={loginData[input.name]}
            onChange={onChange}
            className="formInput formInput-register-login-width"
            password={`${input.type === "password" ? true : false}`}
            {...input} // pass all other key: values
          />
        ))}
        <button className="button submit-theme">
          <div className={`${loader && 'loader'}`}>{!loader && "Submit"}</div>
        </button>
        <Link to="/register" className="link">
          Don't have an account?
        </Link>
      </form>
    </div>
  )
}

export default Login
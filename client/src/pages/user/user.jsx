import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import FormInput from '../../components/FormInput/FormInput'
import Banner from "../../components/Banner/Banner"
import InputWarning from '../../components/InputWarning/InputWarning'
import {
  getUserInfoFromLocalStorage,
  setUserInfoInLocalStorage,
  getPlaylistInfoFromLocalStorage,
  deleteAllPlaylistInfoFromLocalStorage,
  environment
} from '../../utils/components'
import likedSongsAlbumCover from "../../Assets/liked-songs-album-art.png"
import "./user.css"


const User = () => {
  const [cookies, , removeCookie] = useCookies(["access_token"])
  const [updateLoader, setUpdateLoader] = useState(false)
  const [deleteLoader, setDeleteLoader] = useState(false)
  const [warning, setWarning] = useState(false)
  const [successfulUpdate, setSuccessfulUpdate] = useState(false)
  const playlistInfo = getPlaylistInfoFromLocalStorage()
  const navigate = useNavigate()

  var userInfo = getUserInfoFromLocalStorage()
  const [updatedUserData, setUpdatedUserData] = useState({
    email: userInfo?.email || "",
    username: userInfo?.username || "",
    oldPassword: "",
    newPassword: ""
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  },[])


  const handleSubmit = async (event) => {
    event.preventDefault()

    if((updatedUserData.oldPassword && !updatedUserData.newPassword) 
        || (!updatedUserData.oldPassword && updatedUserData.newPassword)) {
          setWarning("Both password fields must be filled to update to new password")
          return
      }

      setUpdateLoader(!updateLoader)
    try {
      const result = await axios.patch(`${environment}/user`, updatedUserData, {
        headers: {
          authorization: `Bearer ${cookies.access_token}`
        }
      })
      const newUsername = result.data.newUsername
      const newEmail = result.data.newEmail

      var userInfo = getUserInfoFromLocalStorage()
      if(userInfo) {
        if(userInfo.email !== newEmail) {
          userInfo.email = newEmail
        }
  
        if(userInfo.username !== newUsername) {
          userInfo.username = newUsername
        }
        setUserInfoInLocalStorage(userInfo)
      }
      
      setUpdateLoader(false)
      setSuccessfulUpdate(true)
      setTimeout(() => {
        setSuccessfulUpdate(false)
      }, 5000);
    } catch (err) {
      if(err.response.status === 403) {
        removeCookie("access_token")
        navigate("/login", {state: { notice: "Access has expired. Please login to continue.", leftOffPath: "/" }})
        return
      }
      setUpdateLoader(false)
      setWarning(err.response.data.message)
      console.log(err)
    }
  }

  const deleteAllUserPlaylists = async () => {
    setDeleteLoader(!deleteLoader)
    try {
      const result = await axios.delete(`${environment}/user/deletemyplaylists`, {
        headers: {
          authorization: `Bearer ${cookies.access_token}`
        }
      })

      deleteAllPlaylistInfoFromLocalStorage()
      setSuccessfulUpdate(true)
      setDeleteLoader(false)
      setTimeout(() => {
        setSuccessfulUpdate(false)
      }, 5000);
    } catch (err) {
      if(err.response.status === 403) {
        removeCookie("access_token")
        navigate("/login", {state: { notice: "Access has expired. Please login to continue.", leftOffPath: "/" }})
        return
      }
      setDeleteLoader(false)
      console.log("\n\n some err")
      console.log(err)
    }
  }

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
      errorMessage: "Password should be 8-20 characters and include at least 1 letter, 1 number, and 1 special character"
    },
    {
      id: 4,
      name: "newPassword",
      type: "password",
      placeholder: "Password",
      label: "New Password",
      required: false,
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      errorMessage: "Password should be 8-20 characters and include at least 1 letter, 1 number, and 1 special character"
    },
  ]

  const onChange = (e) => {
    setWarning(false)
    setUpdatedUserData({...updatedUserData, [e.target.name]: e.target.value})
  }

  const playlistDisplayedCount = 4
  // css dependency - .user__playlist-list li:nth-child(n+(playlistDisplayedCount+2)) {
  const viewToggle = (e) => {
    var listinfo = e.target.parentNode.children
    for (var i = 0; i < listinfo.length - 1; i++) {
      if(i > playlistDisplayedCount) {
        if(listinfo[i].style.display === "grid") {
          listinfo[i].style.display = "none"
        } else {
          listinfo[i].style.display = "grid"
        }
      }
    }

    if(e.target.innerText === "see more...") {
      e.target.innerText = "see less..."
    } else {
      e.target.innerText = "see more..."
    }
  }

  return (
    <div className="page-container">
      {
        successfulUpdate &&
          <Banner
            notice={"success"}
            bannerType="success"
            bannerPosition="flex"
        />
      }
      <div className="user__section">
        <form onSubmit={handleSubmit} className="form user__form-overrides">
          <h1> Update Credentials</h1>
          {warning &&
            <InputWarning warning={warning} />
          }
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              value={updatedUserData[input.name]}
              onChange={onChange}
              className="formInput__default-width"
              password={`${input.type === "password" ? true : false}`}
              inputName={input.name}
              {...input} // pass all other key: values
            />
          ))}
          <button className="button submit-theme">
            <div className={`${updateLoader && 'loader'}`}>{!updateLoader && "Update"}</div>
          </button>
        </form>
      </div>

      <div className="user__section">
        <div className="form user__form-overrides">
          <h1> Delete My Playlists</h1>
          <div>
            {playlistInfo.length > 0 
              ?
                <>
                  <ul className="user__playlist-list">
                  <p> Playlists count: {playlistInfo.length}</p>

                    {playlistInfo.map((playlist, index) => {
                      return (
                        <li key={index} className="user__grid">

                          <div className="user__grid-item">
                            <img
                              src={playlist.playlistId === "likedSongs"
                                ? likedSongsAlbumCover
                                : playlist.playlistImage}
                              alt="playlistimage"
                              width="65px"
                              height="65px"
                            />
                          </div>

                          <div className="user__grid-item">
                            <span>
                              <b>{playlist.playlistName}</b>
                            </span>
                          </div>
                        </li>
                      )
                    })}
                  {
                    playlistInfo.length > playlistDisplayedCount
                    ?
                      <div className="user__playlist-list-viewtoggle" onClick={(e) => viewToggle(e)}>
                        see more...
                      </div>
                    :
                      null
                  }
                  </ul>
                  <button className="button danger-theme" onClick={() => deleteAllUserPlaylists()}>
                    <div className={`${deleteLoader && 'loader'}`}>{!deleteLoader && "Delete My Playlists"}</div>
                  </button>
                </>
              :
                <div>No playlists to delete</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default User

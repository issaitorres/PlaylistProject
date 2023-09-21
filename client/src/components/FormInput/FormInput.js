import "./FormInput.css"
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const FormInput = (props) => {
  const { label, errorMessage, onChange, className, id, errMsgPos="", password=false, ...inputProps } = props
  const [focused, setFocused] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const handleFocus = (e) => {
    setFocused(true)

    if(errMsgPos) {
      var input = document.getElementsByClassName(errMsgPos)[0]
      if(input.validity.patternMismatch) {
        var topErrMsg = document.getElementById("top-err-msg")
        topErrMsg.style.display = "block";
      } else {
        var topErrMsg = document.getElementById("top-err-msg")
        topErrMsg.style.display = "none";
      }
    }
  }

  const revealPassword = () => {
    var passwordInput = document.getElementById("password-input")
    passwordInput.type = passwordVisible ? "password" : "text"
    setPasswordVisible(!passwordVisible)
  }

  return (
    <div className={className}>
        {errMsgPos && <span id="top-err-msg">{errorMessage}</span>}
        <label>{label}</label>
          <input
            id={password == "true" ? "password-input" : null}
            className={errMsgPos}
            onChange={onChange}
            onBlur={handleFocus}
            onFocus={() => inputProps.name === "passwordConfirmation" && setFocused(true)}
            focused={focused.toString()}
            {...inputProps}
          />
            {password == "true"
              ?
                <span
                  className="field-icon"
                  style={{display: "block", color: "black"}}
                  onClick={() => revealPassword()}
                >
                  {
                    passwordVisible
                      ? <FontAwesomeIcon icon={faEye} className="password-icon"/>
                      : <FontAwesomeIcon icon={faEyeSlash} className="password-icon"/>
                  }
                </span>
              :
                  null
            }
        {!errMsgPos && <span>{errorMessage}</span>}
    </div>
  )
}

export default FormInput
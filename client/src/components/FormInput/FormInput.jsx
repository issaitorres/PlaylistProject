import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import "./FormInput.css"


const FormInput = (props) => {
  const { label, errorMessage, onChange, className, id, errMsgPos="", password=false, inputName, ...inputProps } = props
  const [focused, setFocused] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState([])
  const errorMsg = useRef(null);
  const passwordField = useRef(null);
  const inputField = useRef(null);

  const handleFocus = (e) => {
    setFocused(true)

    if(errMsgPos) {
      if(inputField.current.validity.patternMismatch) {
        errorMsg.current.style.display = "block";
      } else {
        errorMsg.current.style.display = "none";
      }
    }
  }

  const revealPassword = () => {
    passwordField.current.type = passwordVisible[id] ? "password" : "text"
    var update = [...passwordVisible]
    update[id] = !update[id]
    setPasswordVisible(update)
  }

  useEffect(()=> {
    // Need to get ref.current here
    // The problem is that someRef.current is mutable, so by the time the cleanup function runs,
    // it may have been set to null.
    // The solution is to capture any mutable values inside the useeffect and then use them in cleanup function (return)
    const field = password === "true" ? passwordField.current : inputField.current
    const enterOnInput = (event) => {
      if (event.key === "Enter") {
        handleFocus()
      }
    }
    field.addEventListener('keypress', enterOnInput);
    return () => field.removeEventListener('keypress', enterOnInput)
  }, [])

  return (
    <div className={className}>
        {errMsgPos && <span ref={errorMsg}>{errorMessage}</span>}
        <label>{label}</label>
          <input
            ref={password === "true" ? passwordField : inputField}
            className={errMsgPos}
            onChange={onChange}
            onBlur={handleFocus}
            onFocus={() => inputName === "passwordConfirmation" && setFocused(true)}
            focused={focused.toString()}
            {...inputProps}
          />
            {password === "true"
              ?
                <span
                  className="field-icon"
                  style={{display: "block", color: "black"}}
                  onClick={() => revealPassword()}
                >
                  {
                    passwordVisible[id]
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
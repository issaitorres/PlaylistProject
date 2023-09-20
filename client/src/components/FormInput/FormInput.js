import "./FormInput.css"
import { useState } from "react"

const FormInput = (props) => {
  const { label, errorMessage, onChange, className, id, errMsgPos=false, ...inputProps } = props
  const [focused, setFocused] = useState(false)

  const handleFocus = (e) => {
    setFocused(true)

    if(errMsgPos) {
      var input = document.getElementsByClassName(errMsgPos)[0]
      console.log("\n here is input")
      console.log(input)
      if(input.validity.patternMismatch) {
        var topErrMsg = document.getElementById("top-err-msg")
        topErrMsg.style.display = "block";
      } else {
        var topErrMsg = document.getElementById("top-err-msg")
        topErrMsg.style.display = "none";
      }
    }
  }

  return (
    <div className={className}>
        {errMsgPos && <span id="top-err-msg">{errorMessage}</span>}
        <label>{label}</label>
        <input
          className={errMsgPos}
          {...inputProps}
          onChange={onChange}
          onBlur={handleFocus}
          onFocus={() => inputProps.name === "passwordConfirmation" && setFocused(true)}
          focused={focused.toString()}
        />
        {!errMsgPos && <span>{errorMessage}</span>}
    </div>
  )
}

export default FormInput
import "./FormInput.css"
import { useState } from "react"

const FormInput = (props) => {
  const { label, errorMessage, onChange, className, id, ...inputProps } = props
  const [focused, setFocused] = useState(false)

  const handleFocus = (e) => {
    setFocused(true)
  }

  return (
    // <div className="formInput">
    <div className={className}>
        <label>{label}</label>
        <input
          {...inputProps}
          onChange={onChange}
          onBlur={handleFocus}
          onFocus={() => inputProps.name === "passwordConfirmation" && setFocused(true)}
          focused={focused.toString()}
        />
        <span>{errorMessage}</span>
    </div>
  )
}

export default FormInput
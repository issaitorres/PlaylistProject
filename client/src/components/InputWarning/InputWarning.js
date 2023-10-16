import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import "./InputWarning.css"

const InputWarning = ({ warning }) => {
    return (
        <div className="forminputwarning">
            <div>
                <FontAwesomeIcon icon={faExclamationTriangle} className="banner__icon" /> 
            </div>
            <div>
                {warning}
            </div>
            
        </div>
    )
}

export default InputWarning
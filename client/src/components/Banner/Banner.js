import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons'
import "./Banner.css"


const Banner = ({ notice, bannerType, bannerPosition }) => {
    const bannerStyle = bannerType === "success" ? "banner__success" : "banner__warning"
    const bannerIcon = bannerType === "success" ?  faCheck : faExclamationTriangle
    const bannerPos = bannerPosition === "fixed" ? "banner__fixed-container" : "banner__flex-container"

  return (
    <div className={bannerPos}>
        <div className={`banner ${bannerStyle}`}> 
            <div>
                <FontAwesomeIcon icon={bannerIcon} className="banner__icon" />
            </div>
            <div className="banner__notice">
                {notice}
            </div>
        </div>
    </div>  
        )
}

export default Banner
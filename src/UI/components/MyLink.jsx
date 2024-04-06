import StyleLinkManager from "../../managers/StyleLinkManager.jsx";
import {Link} from "react-router-dom";
import {useEffect} from "react";
import gsap from "gsap";

const MyLink = ({url, text = "", style, parentClass, isTarget = true}) => {


    const linkClass = StyleLinkManager(style)


    const handleClick = () => {
        if (url && url.startsWith('#')) {

            gsap.to(window, {
                scrollTo: url
            })
        }
    };

    return (<>
        {url ? (<div className={`${parentClass}-link ${linkClass}`}>
            <Link className={`${parentClass}-link--url  ${linkClass}--url`} to={url}
                  target={isTarget ? "_blank" : ""} rel="noopener noreferrer" onClick={handleClick}>
                {text}
            </Link>
            <span className={`${parentClass}-link--decoration  ${linkClass}--decoration`}></span>
        </div>) : (<></>)}
    </>);
};
export default MyLink

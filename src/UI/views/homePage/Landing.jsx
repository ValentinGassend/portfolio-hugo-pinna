import Loader from "../../components/Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useEffect, useState} from "react";
import Link from "../../components/Link.jsx";
import AssetNames from "./AssetNames.js";

const Landing = ({assetsUrl}) => {
    const [mousePosition, setMousePosition] = useState({x: null, y: null});
    const [size, setSize] = useState(null);

    const handleMouseMove = (event) => {
        const {clientX, clientY} = event;
        setMousePosition({x: clientX - (size / 2), y: clientY - (size / 2)});
    };

    useEffect(() => {
        // Add event listener to track mouse movement
        if (document.getElementsByClassName('Landing')) {
            if (document.getElementsByClassName('Landing')[0]) {
                document.getElementsByClassName('Landing')[0].addEventListener("mousemove", handleMouseMove);
            }
            if (document.getElementsByClassName('Landing')[1]) {
                document.getElementsByClassName('Landing')[1].addEventListener("mousemove", handleMouseMove);
            }
        }
        setSize(200)
        // Clean up event listener when component unmounts
        return () => {
            if (document.getElementsByClassName('Landing')) {
                if (document.getElementsByClassName('Landing')[0]) {
                    document.getElementsByClassName('Landing')[0].removeEventListener("mousemove", handleMouseMove);
                }
                if (document.getElementsByClassName('Landing')[1]) {
                    document.getElementsByClassName('Landing')[1].removeEventListener("mousemove", handleMouseMove);
                }
            }
        };
    }, []);

    return (<section className={`Landing`} style={{
        '--size': size + "px",
        '--mousePY': mousePosition.y + "px",
        '--mousePX': mousePosition.x + "px"
    }}>
        <div className={`Landing-grid`}>
            <div className={`Landing-grid-name`}>
                <span className={`Landing-grid--element uppercase italic bold miller`}>Hugo</span>
                <span className={`Landing-grid--element uppercase`}>Pinna</span>
                <span className={`Landing-grid--element uppercase italic bold miller`}>Cuillère</span>
            </div>
            <div className={`Landing-grid-domain`}>
                <span className={`Landing-grid--element uppercase`}>Art director</span>
                <span className={`Landing-grid--element uppercase`}>Graphic designer</span>
                <span className={`Landing-grid--element uppercase italic bold miller`}>3d artist</span>
            </div>
            <div className={`Landing-grid-location`}>
                <span className={`Landing-grid--element uppercase`}>Genève</span>

                {assetsUrl[AssetNames.ARROW] ? (<img
                    className={`Landing-grid--element`}
                    src={assetsUrl[AssetNames.ARROW]}
                    alt={`${AssetNames.ARROW}`}
                />) : (<></>)}
                <span className={`Landing-grid--element uppercase`}>Annecy</span>
            </div>
            <div className={`Landing-grid-baseline`}>
                <span className={`Landing-grid--element uppercase italic bold miller`}>“Baseline un peu cool”</span>
            </div>
            <div className={`Landing-grid-support`}>
                <span className={`Landing-grid--element`}>Portfolio</span>
            </div>
            <div className={`Landing-grid-instagram`}>
                <span className={`Landing-grid--element`}>@hugocuillère</span>
            </div>
            <div className={`Landing-grid-work`}>
                    <span className={`Landing-grid--element uppercase italic bold miller`}>
                        {assetsUrl[AssetNames.DOT_AVAILABLE] ? (<img
                            className={`Landing-grid--element`}
                            src={assetsUrl[AssetNames.DOT_AVAILABLE]}
                            alt={`${AssetNames.DOT_AVAILABLE}`}
                        />) : (<></>)}
                        Open to work</span>
                {assetsUrl[AssetNames.ARROW] ? (<img
                    className={`Landing-grid--element`}
                    src={assetsUrl[AssetNames.ARROW]}
                    alt={`${AssetNames.ARROW}`}
                />) : (<></>)}
                <span className={`Landing-grid--element`}>hugopinna@free.fr</span>
            </div>
            <div className={`Landing-grid-status`}>
                <span className={`Landing-grid--element uppercase italic`}>Freelance</span>
                <span
                    className={`Landing-grid--element uppercase italic bold miller`}>{new Date().getFullYear()}</span>
            </div>
        </div>
        <div className={`Landing-scroll`}>
            <Link style={1} text={"scroll to discover"} parentClass={"Landing-scroll"} url={'#projects'}
                  isTarget={false}></Link>
        </div>
    </section>)
}

export default Landing
import Loader from "../../components/Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useEffect, useState} from "react";
import Link from "../../components/Link.jsx";
import AssetNames from "./AssetNames.js";
import gsap from "gsap";

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
            document.querySelector('.Landing-scroll-link').addEventListener('click', (evt) => {
                evt.preventDefault()
                gsap.to(window, {
                    scrollTo: {y: document.querySelector('.Landing-scroll-link--url').hash, autoKill: false},
                    duration: 1,
                    overwrite: true,
                });
            });
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
        '--size': size + "px", '--mousePY': mousePosition.y + "px", '--mousePX': mousePosition.x + "px"
    }}>
        <div className={`Landing-grid`}>
            <div className={`Landing-grid-line`}>
                <div className={`Landing-grid-line--subgrid`}>
                <span className={`Landing-grid--element`}></span>
                <span className={`Landing-grid--element `}>je suis</span>
                </div>
                <span className={`Landing-grid--element bold miller bigText`}>HUGO</span>
                <div className={`Landing-grid-line--subgrid`}>
                    <span className={`Landing-grid--element`}>directeur artistique</span>
                    <span className={`Landing-grid--element`}>designer graphique</span>
                </div>
            </div>
            <div className={`Landing-grid-line`}>
                <img className={`Landing-grid--element img`} src={``}/>
                <span className={`Landing-grid--element bigText`}>Pinna</span>
            </div>
            <div className={`Landing-grid-line`}>
                <span className={`Landing-grid--element bold miller bigText`}>cuillère</span>

                <div className={`Landing-grid-line--subgrid`}>
                    <span className={`Landing-grid--element bold miller `}>designer 3d</span>
                    <span className={`Landing-grid--element`}>freelance</span>
                </div>
            </div>
            <div className={`Landing-grid-line`}>
                    <span className={`Landing-grid--element`}>

                        genève</span>
                {assetsUrl[AssetNames.ARROW] ? (<img
                    className={`Landing-grid--element`}
                    src={assetsUrl[AssetNames.ARROW]}
                    alt={`${AssetNames.ARROW}`}
                />) : (<></>)}
                <span className={`Landing-grid--element`}>Annecy</span>
                <span className={`Landing-grid--element`}> </span>
            </div>
        </div>
        <div className={`Landing-scroll`}>
            <Link style={1} text={"scroll to discover"} parentClass={"Landing-scroll"} url={'#projects'}
                  isTarget={false}></Link>
        </div>
    </section>)
}

export default Landing
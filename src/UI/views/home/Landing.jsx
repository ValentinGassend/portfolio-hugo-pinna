import Loader from "./Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useEffect, useState} from "react";
import Link from "../../components/Link.jsx";
import AssetNames from "./AssetNames.js";

const Landing = ({assetsUrl}) => {


    return (<>
        <script>//console.log(assetsUrl)</script>
        <div className={`Landing`}>
            <div className={`Landing-grid`}>
                <div className={`Landing-grid-name`}>
                    <span className={`Landing-grid--element uppercase italic bold`}>Hugo</span>
                    <span className={`Landing-grid--element uppercase`}>Pinna</span>
                    <span className={`Landing-grid--element uppercase italic bold`}>Cuillère</span>
                </div>
                <div className={`Landing-grid-domain`}>
                    <span className={`Landing-grid--element uppercase`}>Art director</span>
                    <span className={`Landing-grid--element uppercase`}>Graphic designer</span>
                    <span className={`Landing-grid--element uppercase italic bold`}>3d artist</span>
                </div>
                <div className={`Landing-grid-location`}>
                    <span className={`Landing-grid--element uppercase`}>Genève</span>

                    {assetsUrl[AssetNames.ARROW] ? (
                        <img
                            className={`Landing-grid--element`}
                            src={assetsUrl[AssetNames.ARROW]}
                            alt={`${AssetNames.ARROW}`}
                        />
                    ) : (
                        <></>
                    )}
                    <span className={`Landing-grid--element uppercase`}>Annecy</span>
                </div>
                <div className={`Landing-grid-baseline`}>
                    <span className={`Landing-grid--element uppercase italic bold`}>“Baseline un peu cool”</span>
                </div>
                <div className={`Landing-grid-support`}>
                    <span className={`Landing-grid--element`}>Portfolio</span>
                </div>
                <div className={`Landing-grid-instagram`}>
                    <span className={`Landing-grid--element`}>@hugocuillère</span>
                </div>
                <div className={`Landing-grid-work`}>
                    <span className={`Landing-grid--element uppercase italic bold`}>
                        {assetsUrl[AssetNames.DOT_AVAILABLE] ? (
                            <img
                                className={`Landing-grid--element`}
                                src={assetsUrl[AssetNames.DOT_AVAILABLE]}
                                alt={`${AssetNames.DOT_AVAILABLE}`}
                            />
                        ) : (
                            <></>
                        )}
                        Open to work</span>
                    {assetsUrl[AssetNames.ARROW] ? (
                        <img
                            className={`Landing-grid--element`}
                            src={assetsUrl[AssetNames.ARROW]}
                            alt={`${AssetNames.ARROW}`}
                        />
                    ) : (
                        <></>
                    )}
                    <span className={`Landing-grid--element`}>hugopinna@free.fr</span>
                </div>
                <div className={`Landing-grid-status`}>
                    <span className={`Landing-grid--element uppercase`}>Freelance</span>
                    <span
                        className={`Landing-grid--element uppercase italic bold`}>{new Date().getFullYear()}</span>
                </div>
            </div>
            <div className={`Landing-scroll`}>
                <Link style={1} text={"scroll to discover"} parentClass={"Landing-scroll"} url={'#projects'}
                      isTarget={false}></Link>
            </div>
        </div>
    </>)
}

export default Landing
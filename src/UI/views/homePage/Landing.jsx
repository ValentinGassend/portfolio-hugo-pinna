import Loader from "../../components/Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useEffect, useState} from "react";
import MyLink from "../../components/MyLink.jsx";
import AssetNames from "./AssetNames.js";
import gsap from "gsap";
import {IsMobile, IsWidthLessThanOrEqualToHeight} from "../../../utils/utils.jsx";


const Landing = ({assetsUrl, landingData}) => {



    // si Landing video existe déjà alors
    // video2.currentTime = video.currentTime;


    return (<section className={`Landing`}>
        {landingData && landingData.media ? <>
            <div className={`Landing-background`}>
                {landingData.media.type === 'image' ? (<img className={`Landing-background--img`} src={`${landingData.url}`}
                                               alt={`Illustration of Landing"`}/>) : (
                    <video className={`Landing-background--video`} autoPlay loop muted playsInline>
                        <source className={`Landing-background--video--source`} src={`${landingData.url}`}
                                type={`video/${landingData.media.extension === 'mp4' ? 'mp4' : 'ogg'}`}/>
                        Your browser does not support the video tag.
                    </video>)}            </div>
            <div className={`Landing-scroll`}>
                <MyLink style={1} text={landingData.link} parentClass={"Landing-scroll"} url={'#projects'}
                        isTarget={false}></MyLink>
            </div>
        </> : <></>}
        <div className={`Landing-grid`}>
            {IsMobile() && IsWidthLessThanOrEqualToHeight() ? <>
                <div className={`Landing-grid-line`}>
                    <div className={`Landing-grid-line--subgrid`}>
                        <span className={`Landing-grid--element`}></span>
                        <span className={`Landing-grid--element `}>je suis</span>
                    </div>
                    <span className={`Landing-grid--element bold miller bigText`}>HUGO</span>
                </div>
                <div className={`Landing-grid-line`}>
                    <img className={`Landing-grid--element img`} src={``}/>
                    <div className={`Landing-grid-line--subgrid`}>
                        <div className={`Landing-grid-line--subgrid`}>
                            <span className={`Landing-grid--element`}>directeur artistique</span>
                            <span className={`Landing-grid--element`}>designer graphique</span>
                        </div>
                        <span className={`Landing-grid--element bigText`}>Pinna</span>
                    </div>

                </div>
                <div className={`Landing-grid-line`}>
                    <span className={`Landing-grid--element bold miller bigText`}>cuillère</span>
                </div>
                <div className={`Landing-grid-line`}>
                    <div className={`Landing-grid-line--subgrid`}>
                        <span className={`Landing-grid--element bold miller `}>3D Designer</span>
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
            </> : <>
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
                        <span className={`Landing-grid--element bold miller `}>3D Designer</span>
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
            </>}
        </div>


    </section>)
}

export default Landing
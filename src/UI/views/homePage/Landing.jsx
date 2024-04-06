import Loader from "../../components/Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import MyLink from "../../components/MyLink.jsx";
import AssetNames from "./AssetNames.js";
import gsap from "gsap";
import {IsMobile, IsWidthLessThanOrEqualToHeight} from "../../../utils/utils.jsx";


const Landing = ({assetsUrl, landingData}) => {


    const videoRef = useRef(null);

    useEffect(() => {
        if (landingData && videoRef.current) {
            // Your logic here
            console.log(landingData);
            const currentVideo = videoRef.current;
            console.log(currentVideo);

            const handleVideoLoaded = () => {
                console.log("canplay");
                console.log(currentVideo);
                if (currentVideo) {
                    currentVideo.pause();
                    currentVideo.currentTime = 0;
                    // currentVideo.play();
                    if (currentVideo.pause) {
                        currentVideo.play()
                        currentVideo.removeEventListener('canplay', handleVideoLoaded);

                    }
                    if (currentVideo.play) {
                        currentVideo.removeEventListener('canplay', handleVideoLoaded);

                    }

                }
            };

            currentVideo.addEventListener('canplay', handleVideoLoaded);

        }
    }, [landingData, videoRef.current]);


    return (<section className={`Landing`}>
        {landingData && landingData.background ? <>
            <div className={`Landing-background`}>
                {landingData.background.media.type === 'image' ? (
                    <img className={`Landing-background--img`} src={`${landingData.background.url}`}
                         alt={`Illustration of Landing"`}/>) : (
                    <video ref={videoRef} className={`Landing-background--video`} autoPlay loop muted playsInline>
                        <source className={`Landing-background--video--source`} src={`${landingData.background.url}`}
                                type={`video/${landingData.background.media.extension}`}/>
                        Your browser does not support the video tag.
                    </video>)}
            </div>
            <div className={`Landing-container`}>

                <div className={`Landing-scroll`}>
                    <MyLink style={1} text={landingData.link} parentClass={"Landing-scroll"} url={'#projects'}
                            isTarget={false}></MyLink>
                </div>

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
                            {landingData && landingData.imageGrid ? <>
                                {landingData.imageGrid.media.type === 'image' ? (
                                    <img className={`Landing-grid--element img`} src={`${landingData.imageGrid.url}`}
                                         alt={`Illustration of Landing"`}/>) : (
                                    <video ref={videoRef} className={`Landing-grid--element video`} autoPlay loop muted
                                           playsInline>
                                        <source className={`Landing-grid--element source`}
                                                src={`${landingData.imageGrid.url}`}
                                                type={`video/${landingData.imageGrid.media.extension}`}/>
                                        Your browser does not support the video tag.
                                    </video>)}
                            </> : <></>}
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
                            {landingData && landingData.imageGrid ? <>
                                {landingData.imageGrid.media.type === 'image' ? (
                                    <img className={`Landing-grid--element img`} src={`${landingData.imageGrid.url}`}
                                         alt={`Illustration of Landing"`}/>) : (
                                    <video ref={videoRef} className={`Landing-grid--element video`} autoPlay loop muted
                                           playsInline>
                                        <source className={`Landing-grid--element source`}
                                                src={`${landingData.imageGrid.url}`}
                                                type={`video/${landingData.imageGrid.media.extension}`}/>
                                        Your browser does not support the video tag.
                                    </video>)}
                            </> : <></>}
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
            </div>
        </> : <></>}


    </section>)
}

export default Landing
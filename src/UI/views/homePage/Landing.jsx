import React, {useEffect, useRef, useState} from "react";
import {useGLTF} from "@react-three/drei";
import MyLink from "../../components/MyLink.jsx";
import {Player} from "@lottiefiles/react-lottie-player";
import {IsMobile, IsWidthLessThanOrEqualToHeight} from "../../../utils/utils.jsx";
import Scene from "./Scene.jsx";
const Landing = ({ landingData, instanceId}) => {


    const handleModelLoad = () => {
        console.log("Model loaded successfully");
    };

    useEffect(() => {
        if(landingData)
        // Préchargement du modèle
        if (!IsMobile() && !IsWidthLessThanOrEqualToHeight()) {
            useGLTF.preload(landingData.model.url);
        }
    }, [IsMobile(), IsWidthLessThanOrEqualToHeight(), landingData]);
    const videoRef = useRef(null);

    return (

        <section key={instanceId} className={`Landing`}>
            {landingData && landingData.background ? <>
                <div className={`Landing-background`}>

                    {IsMobile() && IsWidthLessThanOrEqualToHeight() ? <>
                            {landingData.background.media.type === 'image' ? (
                                <img className={`Landing-background--img`} loading={"lazy"} src={`${landingData.background.url}`}
                                     alt={`Illustration of Landing"`}/>) : (
                                <video ref={videoRef} className={`Landing-background--video`} autoPlay loop muted playsInline>
                                    <source className={`Landing-background--video--source`} src={`${landingData.background.url}`}
                                            type={`video/${landingData.background.media.extension}`}/>
                                    Your browser does not support the video tag.
                                </video>)}
                        </> :

                        <Scene onLoad={handleModelLoad} landingData={landingData}/>

                        }

                </div>

                <div className={`Landing-container`}>
                    {IsMobile() && IsWidthLessThanOrEqualToHeight() ? <div className={`Landing-grid`}>
                        <>
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
                                        <img className={`Landing-grid--element img`} loading={"lazy"}
                                             src={`${landingData.imageGrid.url}`}
                                             alt={`Illustration of Landing"`}/>) : (
                                        <video ref={videoRef} loading={"lazy"} className={`Landing-grid--element video`}
                                               autoPlay loop muted
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
                                <Player
                                    src='./lotties/Header.json'
                                    className={'Landing-grid--element'}
                                    loop
                                    autoplay
                                />

                                <span className={`Landing-grid--element`}>Annecy</span>
                                <span className={`Landing-grid--element`}> </span>
                            </div>

                        </>
                    </div> : <>

                    </>}

                    <div className={`Landing-scroll`}>
                        <MyLink style={1} text={landingData.link} parentClass={"Landing-scroll"} url={'#projects'}
                                isTarget={false}></MyLink>
                    </div>


                </div>
            </> : <></>}


        </section>)
}
export default Landing
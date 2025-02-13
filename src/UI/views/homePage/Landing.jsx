import React, {useEffect, useMemo, useRef, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {Html, OrbitControls, PerspectiveCamera, useAnimations, useGLTF} from "@react-three/drei";
import {useControls} from 'leva';
import MyLink from "../../components/MyLink.jsx";
import {Player} from "@lottiefiles/react-lottie-player";
import {IsMobile, IsWidthLessThanOrEqualToHeight} from "../../../utils/utils.jsx";
import * as THREE from "three";
import LandingGrid3D from "./LandingGrid3D.jsx";


// Optimize model loading and management
const Model = React.memo(({onLoad, instanceId}) => {
    const modelPath = '/models/landing.glb';
    const {scene: originalScene, animations} = useGLTF(modelPath);

    // Optimize scene cloning and materials
    const scene = useMemo(() => {
        const clonedScene = originalScene.clone();
        clonedScene.traverse((object) => {
            if (object.isMesh) {
                // Optimize materials
                object.material = new THREE.MeshStandardMaterial({
                    ...object.material,
                    roughness: 0.0,
                    metalness: 1.0
                });
                // Enable frustum culling
                object.frustumCulled = false;
                object.renderOrder = 1;
            }
        });
        return clonedScene;
    }, [originalScene]);

    const {actions} = useAnimations(animations, scene);
    const activeAnimations = useRef([]);

    useEffect(() => {
        if (scene) {
            onLoad();
        }

        // Optimize animation management
        const animationNames = ['CircleAction', 'Circle.001Action', 'Circle.002Action'];
        animationNames.forEach(name => {
            if (actions[name]) {
                actions[name].play();
                activeAnimations.current.push(actions[name]);
            }
        });

        return () => {
            // Cleanup animations
            activeAnimations.current.forEach(animation => animation.stop());
            activeAnimations.current = [];
        };
    }, [scene, onLoad, actions]);

    return (
        <primitive
            object={scene}
            scale={2.33 / 2}
            position={[0.0, 0.0, 0.0]}
            rotation={[0, 0, 0]}
            renderOrder={1}
        />
    );
});

// Optimize scene rendering
const Scene = React.memo(({onLoad, landingData, instanceId}) => {
    // Configure optimal WebGL parameters
    const glConfig = useMemo(() => ({
        antialias: true,
        alpha: true,
        depth: true,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
    }), []);

    // Optimize camera settings
    const cameraSettings = useMemo(() => ({
        position: [6, 6, -14],
        fov: 50,
        near: 1,
        far: 100,
    }), []);

    return (
        <Canvas
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'visible',
                pointerEvents: 'none',
                isolation: 'isolate',
                transform: 'translateZ(0)',
                willChange: 'transform'
            }}
            // frameloop="demand"
            frameloop="always"
            dpr={Math.min(window.devicePixelRatio, 2)}
            onCreated={({gl}) => {
                gl.setClearColor(0xffffff, 0);
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                gl.physicallyCorrectLights = true;
            }}
            gl={glConfig}
        >
            <PerspectiveCamera makeDefault {...cameraSettings} />

            <ambientLight intensity={0.2} />
            <directionalLight
                position={[0, 1, -1]}
                intensity={1.0}
                castShadow
                shadow-mapSize-width={256}
                shadow-mapSize-height={256}
            />
            {/*<pointLight position={[0, 0, 0]} intensity={1} />*/}

            <group position={[0, 0, 0]} rotation={[0.0, 2.7, 0.0]}>
                <Model onLoad={onLoad} instanceId={instanceId} />
                <LandingGrid3D
                    landingData={landingData}
                    isMobile={IsMobile()}
                    isWidthLessThanHeight={IsWidthLessThanOrEqualToHeight()}
                />
            </group>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
                target={[0.0, 0.0, 0.0]}
            />
        </Canvas>
    );
});
const Landing = ({assetsUrl, landingData, instanceId}) => {

    const [isModelLoaded, setIsModelLoaded] = useState(false);

    const handleModelLoad = () => {
        console.log("Model loaded successfully");
        setIsModelLoaded(true);
    };

    useEffect(() => {
        if(landingData)
        // Préchargement du modèle
        if (!IsMobile() && !IsWidthLessThanOrEqualToHeight()) {
            useGLTF.preload(landingData.model.url);
        }
    }, [IsMobile(), IsWidthLessThanOrEqualToHeight(), landingData]);
    const videoRef = useRef(null);

    // useEffect(() => {
    //     if (landingData && videoRef.current && IsMobile() && IsWidthLessThanOrEqualToHeight()) {
    //         // Your logic here
    //         // console.log(landingData);
    //         const currentVideo = videoRef.current;
    //         // console.log(currentVideo);
    //
    //         const handleVideoLoaded = () => {
    //             // console.log("canplay");
    //             // console.log(currentVideo);
    //             if (currentVideo) {
    //                 currentVideo.pause();
    //                 currentVideo.currentTime = 0;
    //                 // currentVideo.play();
    //                 if (currentVideo.pause) {
    //                     currentVideo.play()
    //                     currentVideo.removeEventListener('canplay', handleVideoLoaded);
    //
    //                 }
    //                 if (currentVideo.play) {
    //                     currentVideo.removeEventListener('canplay', handleVideoLoaded);
    //
    //                 }
    //
    //             }
    //         };
    //
    //         currentVideo.addEventListener('canplay', handleVideoLoaded);
    //
    //     }
    // }, [landingData, videoRef.current]);


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
                        <Scene onLoad={handleModelLoad} landingData={landingData}/>}

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
import React, {useEffect, useMemo, useRef, useState} from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, PerspectiveCamera, useAnimations, useGLTF } from "@react-three/drei";
import { useControls } from 'leva';
import MyLink from "../../components/MyLink.jsx";
import {Player} from "@lottiefiles/react-lottie-player";
import {IsMobile, IsWidthLessThanOrEqualToHeight} from "../../../utils/utils.jsx";
import * as THREE from "three";
import LandingGrid3D from "./LandingGrid3D.jsx";


const Model = ({onLoad, instanceId}) => {
    const modelPath = '/models/landing.glb';
    const {scene: originalScene, animations} = useGLTF(modelPath);
    const scene = useMemo(() => originalScene.clone(), [originalScene]);
    const {actions} = useAnimations(animations, scene);

    useEffect(() => {
        if (scene) {
            // Set the renderOrder for the entire scene
            scene.traverse((object) => {
                if (object.isMesh) {
                    object.renderOrder = 1; // Ensure all meshes render before HTML
                    object.material.depthTest = true; // Enable depth testing
                    object.material.depthWrite = true; // Enable depth writing
                }
            });
            onLoad();
        }

        // Play all the circle animations
        if (actions['CircleAction']) {
            actions['CircleAction'].play();
        }
        if (actions['Circle.001Action']) {
            actions['Circle.001Action'].play();
        }
        if (actions['Circle.002Action']) {
            actions['Circle.002Action'].play();
        }

        return () => {
            // Clean up animations on unmount
            if (actions['CircleAction']) {
                actions['CircleAction'].stop();
            }
            if (actions['Circle.001Action']) {
                actions['Circle.001Action'].stop();
            }
            if (actions['Circle.002Action']) {
                actions['Circle.002Action'].stop();
            }
            useGLTF.preload(modelPath);
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
};
const Scene = ({onLoad, landingData, instanceId}) => {



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
            frameloop="always"
            dpr={window.devicePixelRatio}
            onCreated={({gl}) => {
                gl.setClearColor(0xffffff, 0);
                gl.getContext().enable(gl.getContext().DEPTH_TEST);
                gl.getContext().depthFunc(gl.getContext().LEQUAL);
                gl.setScissorTest(false);
            }}
            gl={{
                antialias: true,
                alpha: true,
                depth: true,
                premultipliedAlpha: false,
                preserveDrawingBuffer: true,
                autoClear: true,
            }}
        >

            <PerspectiveCamera
                makeDefault
                position={[6, 6, -14]}
                fov={50}
                near={0.1}
                far={2000}
            />

            <ambientLight intensity={1}/>
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <group position={[0, 0, 0]} rotation={[0.0, 2.7, 0.0]} >
            <Model onLoad={onLoad}  instanceId={instanceId}/>

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
};
const Landing = ({assetsUrl, landingData, instanceId}) => {

    const [isModelLoaded, setIsModelLoaded] = useState(false);

    const handleModelLoad = () => {
        console.log("Model loaded successfully");
        setIsModelLoaded(true);
    };

    useEffect(() => {
        // Préchargement du modèle
        useGLTF.preload('/models/landing.glb');
    }, []);
    // const videoRef = useRef(null);
    //
    // useEffect(() => {
    //     if (landingData && videoRef.current) {
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
                {/*{landingData.background.media.type === 'image' ? (*/}
                {/*    <img className={`Landing-background--img`} loading={"lazy"} src={`${landingData.background.url}`}*/}
                {/*         alt={`Illustration of Landing"`}/>) : (*/}
                {/*    <video ref={videoRef} className={`Landing-background--video`} autoPlay loop muted playsInline>*/}
                {/*        <source className={`Landing-background--video--source`} src={`${landingData.background.url}`}*/}
                {/*                type={`video/${landingData.background.media.extension}`}/>*/}
                {/*        Your browser does not support the video tag.*/}
                {/*    </video>)}*/}

                <Scene onLoad={handleModelLoad} landingData={landingData}/>

            </div>
            <div className={`Landing-container`}>
                <div className={`Landing-scroll`}>
                    <MyLink style={1} text={landingData.link} parentClass={"Landing-scroll"} url={'#projects'}
                            isTarget={false}></MyLink>
                </div>


            </div>
        </> : <></>}


    </section>)
}

export default Landing
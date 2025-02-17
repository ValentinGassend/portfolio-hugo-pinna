import React, {useMemo} from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import LandingGrid3D from "./LandingGrid3D.jsx";
import {IsMobile, IsWidthLessThanOrEqualToHeight} from "../../../utils/utils.jsx";
import Model from "./Model.jsx";

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
        near: 11,
        far: 22,
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
export default Scene;
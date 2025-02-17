
import React, {useEffect, useMemo, useRef} from "react";
import {useAnimations, useGLTF} from "@react-three/drei";
import * as THREE from "three";

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
            scale={2.45 / 2}
            position={[0.0, 0.0, 0.0]}
            rotation={[0, 0, 0]}
            renderOrder={1}
        />
    );
});
export default Model;
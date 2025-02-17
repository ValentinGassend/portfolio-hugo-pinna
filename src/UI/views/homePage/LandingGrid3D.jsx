import React, { useEffect, useRef, useState, useMemo } from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import lottie from 'lottie-web';
import json from '../../../assets/lotties/Header.json';

const planeGeometry = new THREE.PlaneGeometry();
const sharedMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    alphaTest: 0.01,
    depthWrite: true,
    depthTest: true
});

// Instance réutilisable pour les transformations
const tempMatrix = new THREE.Matrix4();
const tempVector = new THREE.Vector3();
const tempQuaternion = new THREE.Quaternion();
const tempScale = new THREE.Vector3();

const LandingGrid3D = ({ landingData, isMobile, isWidthLessThanHeight }) => {
    const { gl, camera } = useThree();
    const groupRef = useRef();
    const lottieContainerRef = useRef(null);
    const [lottieTexture, setLottieTexture] = useState(null);
    const frameRef = useRef(0);
    // Mémoriser la texture de l'image pour éviter les rechargements inutiles
    // const imageTexture = useTexture(landingData.imageGrid.url);


    useEffect(() => {
        gl.powerPreference = "high-performance";
        gl.antialias = false; // Désactiver l'antialiasing pour de meilleures performances

        // Optimiser les paramètres de rendu
        gl.setPixelRatio(1); // Forcer un pixel ratio de 1 pour de meilleures performances

        return () => {
            gl.setPixelRatio(window.devicePixelRatio);
        };
    }, [gl]);
    // Optimisation de la texture de l'image
    const imageTexture = useMemo(() => {
        const texture = new THREE.TextureLoader().load(landingData.imageGrid.url, (tex) => {
            tex.minFilter = THREE.NearestFilter;
            tex.magFilter = THREE.NearestFilter;
            tex.generateMipmaps = false;
            tex.needsUpdate = true;

            // Compression de texture si disponible
            if (gl.extensions.get('WEBGL_compressed_texture_astc')) {
                // Utiliser la compression ASTC si disponible
                tex.format = THREE.RGBAFormat;
            }
        });
        return texture;
    }, [landingData.imageGrid.url, gl]);
    // Mémoriser les styles de texte pour éviter les recréations inutiles
    const textStyles = useMemo(() => ({
        normal: {
            size: 0.7,
            color: '#E70000',
            font: '/font/NeueHaasDisplayMedium.ttf'
        },
        italic: {
            size: 0.7,
            color: '#E70000',
            font: '/font/NeueHaasDisplayMediumItalic.ttf'
        },
        big: {
            size: 2.4,
            color: '#E70000',
            font: '/font/NeueHaasDisplayBold.ttf'
        },
        bigItalic: {
            size: 2.0,
            color: '#E70000',
            font: '/font/NeueHaasDisplayBoldItalic.ttf'
        },
        miller: {
            size: 0.7,
            color: '#E70000',
            font: '/font/MillerTextRoman.ttf'
        },
        millerBoldBig: {
            size: 2.4,
            color: '#E70000',
            font: '/font/MillerTextBold.ttf'
        },
        millerBold: {
            size: 0.7,
            color: '#E70000',
            font: '/font/MillerTextBold.ttf'
        },
        millerBoldItalicBig: {
            size: 2.4,
            color: '#E70000',
            font: '/font/MillerTextBoldItalic.ttf'
        },
        millerBoldItalic: {
            size: 0.7,
            color: '#E70000',
            font: '/font/MillerTextBoldItalic.ttf'
        }
    }), []);

    // Mémoriser les éléments de texte pour éviter les recalculs inutiles
    const textElements = useMemo(() => ([
        { text: 'JE SUIS', position: [-5.3, 3.3, 0.0], style: 'italic' },
        { text: 'HUGO', position: [0.0, 4.0, 0.0], style: 'millerBoldItalicBig' },
        { text: 'DIRECTEUR ARTISTIQUE', position: [8.0, 4.4, 0.0], style: 'italic' },
        { text: 'DESIGNER GRAPHIQUE', position: [7.8, 3.3, 0.0], style: 'italic' },
        { text: 'PINNA', position: [7.2, 1.9, 0.0], style: 'bigItalic' },
        { text: 'CUILLÈRE', position: [0.2, 0.2, 0.0], style: 'millerBoldItalicBig' },
        { text: 'DESIGNER 3D', position: [9.2, 0.65, 0.0], style: 'millerBoldItalic' },
        { text: 'FREELANCE', position: [8.7, -0.4, 0.0], style: 'italic' },
        { text: 'GENÈVE', position: [-5.2, -1.4, 0.0], style: 'italic' },
        { text: 'LYON', position: [5.3, -1.4, 0.0], style: 'italic' }
    ]), []);

    // Optimisation de l'animation Lottie
    useEffect(() => {
        if (!lottieContainerRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = 1024; // Réduire encore la taille
            canvas.height = 215;
            const context = canvas.getContext('2d', {
                alpha: true,
                desynchronized: true, // Optimisation pour les contextes 2D
                willReadFrequently: false
            });
            lottieContainerRef.current = canvas;

            const animation = lottie.loadAnimation({
                container: document.getElementById('bm'),
                renderer: 'canvas',
                rendererSettings: {
                    context,
                    clearCanvas: true,
                    progressiveLoad: true,
                    hideOnTransparent: true // Chargement progressif
                },
                loop: true,
                autoplay: true,
                animationData: json
            });

            // Créer et optimiser la texture Three.js
            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
            texture.needsUpdate = true;
            texture.premultiplyAlpha = true;
            setLottieTexture(texture);

            // Optimiser la fréquence de mise à jour
            animation.setSpeed(0.5); // Réduire la vitesse d'animation
            let lastUpdate = 0;

            animation.addEventListener('enterFrame', () => {
                const now = performance.now();
                if (now - lastUpdate > 32) { // Limiter à ~30fps
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    texture.needsUpdate = true;
                    lastUpdate = now;
                }
            });

            return () => {
                animation.destroy();
                texture.dispose();
                canvas.width = 0;
                canvas.height = 0;
            };
        }
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;

        frameRef.current++;
        if (frameRef.current % 2 !== 0) return; // Skip frames

        // Optimisation des transformations
        tempMatrix.copy(groupRef.current.matrix);
        tempVector.setFromMatrixPosition(tempMatrix);
        tempQuaternion.setFromRotationMatrix(tempMatrix);
        tempScale.setFromMatrixScale(tempMatrix);

        // Mettre à jour seulement si nécessaire
        if (tempVector.lengthSq() > 0.001 || tempQuaternion.lengthSq() > 0.001) {
            groupRef.current.updateMatrix();
        }
    });
    // Optimiser le rendu du texte
    const renderText = useMemo(() => (text, position, styleName) => {
        const style = textStyles[styleName];
        return (
            <Text
                position={position}
                fontSize={style.size}
                color={style.color}
                font={style.font}
                anchorX="center"
                anchorY="middle"
                depthTest={true}
                depthWrite={true}
                renderOrder={0}
                characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.'\éèêëÈÉÊË"
                textAlign="center"
                lineHeight={1}
            >
                {text}
                <primitive object={sharedMaterial} attach="material" />
            </Text>
        );
    }, [textStyles]);

    return (
        <group ref={groupRef} rotation={[0, 0, 0]} position={[-3/2, -1/2, 0]} scale={0.5}>
            {textElements.map((element, index) => (
                <group key={index}>
                    {renderText(element.text, element.position, element.style)}
                </group>
            ))}

            <mesh position={[0.0, 1.9, 0]} scale={[7.6, 1.76, 1]}>
                <primitive object={planeGeometry}/>
                <meshBasicMaterial
                    map={imageTexture}
                    transparent={true}
                    alphaTest={0.01}
                    depthWrite={true}
                    depthTest={true}
                />
            </mesh>

            {lottieTexture && (
                <mesh position={[0.2, -1.4, 0]} scale={[7.5, 7 * (32 / 152), 1]} matrixAutoUpdate={true}>
                    <primitive object={planeGeometry}/>
                    <meshBasicMaterial
                        map={lottieTexture}
                        transparent={true}
                        side={THREE.DoubleSide}
                        alphaTest={0.01}
                        depthWrite={false}
                        depthTest={false}
                    />
                </mesh>
            )}
        </group>
    );
};

export default LandingGrid3D;
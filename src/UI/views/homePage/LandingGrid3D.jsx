import React, {useEffect, useRef, useState} from 'react';
import {useThree} from '@react-three/fiber';
import {useControls, folder} from 'leva';
import {Text, useTexture, useVideoTexture} from '@react-three/drei';
import * as THREE from 'three';
import lottie from 'lottie-web';
import json from '../../../assets/lotties/Header.json';

const LandingGrid3D = ({landingData, isMobile, isWidthLessThanHeight}) => {
    const {camera} = useThree();

    const lottieContainerRef = useRef(null);
    const [lottieTexture, setLottieTexture] = useState(null);
    // Load image texture for the element before PINNA
    const imageTexture = useTexture(landingData.imageGrid.url);
    useEffect(() => {
        if (!lottieContainerRef.current) {
            console.log('Initializing Lottie animation...');
            const canvas = document.createElement('canvas');
            canvas.width = 4096;
            canvas.height = 862;
            const context = canvas.getContext('2d', {
                alpha: true  // Activer le canal alpha
            });
            lottieContainerRef.current = canvas;

            const animation = lottie.loadAnimation({
                container: document.getElementById('bm'), renderer: 'canvas', rendererSettings: {
                    context: context, clearCanvas: true,  // Nettoyer le canvas à chaque frame
                }, loop: true, autplay: true, animationData: json
            });

            // Ajouter des écouteurs d'événements pour le débogage
            animation.addEventListener('data_ready', () => {
                console.log('Lottie data loaded successfully');
            });

            animation.addEventListener('data_failed', (error) => {
                console.error('Failed to load Lottie animation:', error);
            });

            animation.addEventListener('error', (error) => {
                console.error('Lottie animation error:', error);
            });

            // Créer la texture Three.js
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            texture.premultiplyAlpha = true;
            console.log('Three.js texture created:', texture);
            setLottieTexture(texture);

            // Mettre à jour la texture à chaque frame
            animation.addEventListener('enterFrame', () => {
                context.clearRect(0, 0, canvas.width, canvas.height);  // Nettoyer le canvas
                texture.needsUpdate = true;
            });

            return () => {
                console.log('Cleaning up Lottie animation');
                animation.destroy();
            };
        }
    }, []);
    // Load video texture for the animation between cities
    // const videoTexture = useVideoTexture('/path-to-your-video.mp4');

    const textStyles = {
        normal: {
            size: 0.7, color: '#E70000', font: '/font/NeueHaasDisplayMedium.ttf'
        }, italic: {
            size: 0.7, color: '#E70000', font: '/font/NeueHaasDisplayMediumItalic.ttf'
        }, big: {
            size: 2.4, color: '#E70000', font: '/font/NeueHaasDisplayBold.ttf'
        }, bigItalic: {
            size: 2.0, color: '#E70000', font: '/font/NeueHaasDisplayBoldItalic.ttf'
        }, miller: {
            size: 0.7, color: '#E70000', font: '/font/MillerTextRoman.ttf'
        }, millerBoldBig: {
            size: 2.4, color: '#E70000', font: '/font/MillerTextBold.ttf'
        }, millerBold: {
            size: 0.7, color: '#E70000', font: '/font/MillerTextBold.ttf'
        }, millerBoldItalicBig: {
            size: 2.4, color: '#E70000', font: '/font/MillerTextBoldItalic.ttf'
        }, millerBoldItalic: {
            size: 0.7, color: '#E70000', font: '/font/MillerTextBoldItalic.ttf'
        }
    };


    const textElements = [{
        text: 'JE SUIS', get position() {
            return [-5.3, 3.3, 0.0]
        }, style: 'italic'
    }, {
        text: 'HUGO', get position() {
            return [0.0, 4.0, 0.0]
        }, style: 'millerBoldItalicBig'
    }, {
        text: 'DIRECTEUR ARTISTIQUE', get position() {
            return [8.0, 4.4, 0.0]
        }, style: 'italic'
    }, {
        text: 'DESIGNER GRAPHIQUE', get position() {
            return [7.8, 3.3, 0.0]
        }, style: 'italic'
    }, {
        text: 'PINNA', get position() {
            return [7.2, 1.9, 0.0]
        }, style: 'bigItalic'
    }, {
        text: 'CUILLÈRE', get position() {
            return [0.2, 0.2, 0.0]
        }, style: 'millerBoldItalicBig'
    }, {
        text: 'DESIGNER 3D', get position() {
            return [9.2, 0.65, 0.0]
        }, style: 'millerBoldItalic'
    }, {
        text: 'FREELANCE', get position() {
            return [8.7, -0.4, 0.0]
        }, style: 'italic'
    }, {
        text: 'GENÈVE', get position() {
            return [-5.2, -1.4, 0.0]
        }, style: 'italic'
    }, {
        text: 'LYON', get position() {
            return [5.3, -1.4, 0.0]
        }, style: 'italic'
    }];

    const renderText = (text, position, styleName) => {
        const style = textStyles[styleName];

        return (<Text
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
            <meshBasicMaterial
                attach="material"
                color={style.color}
                transparent={false}
                side={THREE.DoubleSide}
                depthTest={true}
                depthWrite={true}
            />
        </Text>);
    };

    return (<group rotation={[0, 0, -0.0]} position={[-3/2, -1/2, 0]} scale={0.5}>
        {textElements.map((element, index) => (<group key={index}>

            {renderText(element.text, element.position, element.style)}
        </group>))}
        <mesh position={[0.0, 1.9, 0]} scale={[7.6, 1.76, 1]}>
            <planeGeometry/>
            <meshBasicMaterial map={imageTexture} transparent={true}
                               alphaTest={0.01}
                               depthWrite={true}
            />
        </mesh>

        {lottieTexture && (<mesh position={[0.2, -1.4, 0]} scale={[7.5, 7 * (32 / 152), 1]}>
            <planeGeometry/>
            <meshBasicMaterial
                map={lottieTexture}
                transparent={true}
                side={THREE.DoubleSide}
                alphaTest={0.01}  // Ajuster selon vos besoins
                depthWrite={false}  // Important pour la transparence
            />
        </mesh>)}
    </group>);
};

export default LandingGrid3D;
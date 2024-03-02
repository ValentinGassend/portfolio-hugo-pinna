import React, {useEffect, useRef, useState} from 'react';
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

const PanelsContainer = ({isPageReady}) => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const snapTriggers = useRef([]);
    const scrollTween = useRef(null);
    const main = useRef(null); // Assuming you have a ref for the main container
    const [isScrollDisabled, setScrollDisabled] = useState(false);
    const [panels, setPanels] = useState([]);
    const [panelIndex, setPanelIndex] = useState(0);
    const [lastVisibleContainer, setLastVisibleContainer] = useState(0);
    const [consecutiveVisibleCount, setConsecutiveVisibleCount] = useState(null);
    const [lastGoToSectionTime, setLastGoToSectionTime] = useState(0); // Nouvel état pour suivre le temps du dernier goToSection

    const goToSection = (i, force, deltaY) => {

        var supportsPassive = false;
        var keys = {37: 1, 38: 1, 39: 1, 40: 1};
        var wheelOpt = supportsPassive ? {passive: false} : false;
        var wheelEvent = 'wheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

        function preventDefault(e) {
            e.preventDefault();
        }

        function preventDefaultForScrollKeys(e) {
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        }

// call this to Disable
        function disableScroll() {
            setScrollDisabled(true)
        }

// call this to Enable
        function enableScroll(deltaY) {
            setScrollDisabled(false)
            checkForOthers(deltaY)
        }

        function checkForOthers(deltaY) {
            if (isPageReady) {
                let partTitleContainer = document.getElementsByClassName('partTitle');
                let containers = [];
                let overlay = document.getElementsByClassName('Overlay')[0]
                let overlayLowerItems = document.getElementsByClassName('Overlay-wrapper-lower--text')

                for (let i = 0; i < partTitleContainer.length; i++) {
                    let container = partTitleContainer[i].closest('section').classList[0];
                    containers = [].concat(containers, container);
                }

                for (let i = 0; i < containers.length; i++) {
                    let container = containers[i];

                    if (ScrollTrigger.isInViewport("." + container + "-headline")) {
                        console.log(document.getElementsByClassName(container)[0].offsetTop / window.innerHeight)
                        console.log(parseInt(document.getElementsByClassName("Home")[0].style.top) / -100)
                        // Vérifie si le container est visible deux fois consécutives
                        console.log(document.getElementsByClassName(container + "-headline")[0].getBoundingClientRect())

                        if (deltaY > 0 /* verifie si c'est dans le sens de la descente */) {
                            // setConsecutiveVisibleCount(consecutiveVisibleCount + 1);
                            if (overlay.classList.contains("hidden")) {
                                overlay.classList.remove("hidden")
                                overlay.classList.add("visible")
                            }
                            if (!overlay.classList.contains("hidden") && container === containers[containers.length - 1]) {
                                overlay.classList.remove("visible")
                                overlay.classList.add("hidden")
                            }
                            for (let k = 0; k < containers.length; k++) {
                                if (overlay.classList.contains(containers[k])) {
                                    overlay.classList.remove(containers[k])
                                }
                            }

                            overlay.classList.add(container)

                            for (let j = 0; j < overlayLowerItems.length; j++) {
                                if (overlayLowerItems[j].textContent === container) {
                                    overlayLowerItems[j].classList.add("currentSection");
                                    overlayLowerItems[j].classList.add("transitioning");
                                } else {
                                    if (overlayLowerItems[j].classList.contains("currentSection")) {
                                        overlayLowerItems[j].classList.remove("currentSection");
                                        overlayLowerItems[j].classList.remove("transitioning");
                                        overlayLowerItems[j].classList.remove("transitioning-reverse");
                                    }
                                }

                            }
                            if (container === lastVisibleContainer) {
                                // Incrémenter le compteur
                                if (consecutiveVisibleCount === 1) {
                                    document.getElementsByClassName(container + "-headline")[0].classList.add("blur");
                                }
                                console.log(consecutiveVisibleCount)
                                // Si le compteur atteint 2, ajouter la classe blur
                            } else {
                                // Réinitialiser le compteur si le container n'est pas le même que précédemment
                                if (document.getElementsByClassName(container + "-headline")[0].classList.contains("blur")) {
                                    document.getElementsByClassName(container + "-headline")[0].classList.remove("blur");

                                }

                                setLastVisibleContainer(container);
                                setConsecutiveVisibleCount(1);
                            }

                            if (document.getElementsByClassName(container)[0].offsetTop / window.innerHeight === parseInt(document.getElementsByClassName("Home")[0].style.top) / -100) {
                                if (document.getElementsByClassName(container + "-headline")[0].classList.contains("blur")) {
                                    document.getElementsByClassName(container + "-headline")[0].classList.remove("blur");
                                }
                                setConsecutiveVisibleCount(1);
                            } else {
                                document.getElementsByClassName(container + "-headline")[0].classList.add("blur");
                            }
                        } else {
                            console.log("onReverseComplete", container)
                            document.getElementsByClassName(container + "-headline")[0].classList.remove("blur");

                            if (!overlay.classList.contains("hidden")) {
                                if (container === containers[0]) {
                                    overlay.classList.remove("visible")
                                    overlay.classList.add("hidden")
                                }
                            }
                            if (overlay.classList.contains("hidden") && container === containers[containers.length - 1]) {
                                overlay.classList.add("visible")
                                overlay.classList.remove("hidden")
                            }
                            overlay.classList.remove(container)

                            for (let k = 0; k < containers.length; k++) {
                                if (container !== containers[0]) {
                                    overlay.classList.add(containers[k - 1])
                                }
                            }
                            for (let j = 0; j < overlayLowerItems.length; j++) {

                                if (overlayLowerItems[j].classList.contains("currentSection")) {
                                    overlayLowerItems[j].classList.remove("currentSection")
                                    overlayLowerItems[j].classList.remove("transitioning");

                                }
                                if (overlayLowerItems[j].classList.contains("transitioning-reverse")) {
                                    overlayLowerItems[j].classList.remove("transitioning-reverse")
                                }
                                if (container !== containers[0] && container !== containers[containers.length - 1]) {
                                    if (overlayLowerItems[j].textContent === containers[i]) {
                                        overlayLowerItems[j].classList.add("currentSection")
                                        overlayLowerItems[j].classList.add("transitioning-reverse");
                                    }
                                } else {

                                    if (overlay.classList.contains("visible")) {
                                        overlay.classList.add("visible")
                                    }

                                }
                            }
                            if (document.getElementsByClassName(container)[0].offsetTop / window.innerHeight === parseInt(document.getElementsByClassName("Home")[0].style.top) / -100) {
                                if (document.getElementsByClassName(container + "-headline")[0].classList.contains("blur")) {
                                    document.getElementsByClassName(container + "-headline")[0].classList.remove("blur");
                                }
                                setConsecutiveVisibleCount(1);
                            } else {
                                document.getElementsByClassName(container + "-headline")[0].classList.add("blur");
                            }
                        }


                    }
                    if (((document.getElementsByClassName("Home")[0].offsetTop * -1 + document.getElementsByClassName("Home")[0].offsetHeight) === document.getElementsByClassName("Home")[0].scrollHeight) || document.getElementsByClassName("Home")[0].offsetTop === 0) {
                        if (overlay.classList.contains("visible")) {
                            overlay.classList.remove("visible")
                            overlay.classList.add("hidden")
                        }
                    }
                }
            }
        }

        if (document.getElementsByClassName("PanelsContainer").length > 0) {

            if (!isScrollDisabled) {
                if (i === panels.length - 1 && force) {
                    // User has scrolled to the bottom, smoothly scroll to the first panel without duration
                    gsap.fromTo(document.getElementsByClassName('Home')[0], {
                        top: -100 * (i) + "vh",
                    }, {
                        top: -100 * (i - 1) + "vh",
                        onStart: disableScroll,
                        onCompleteParams: [deltaY],
                        onComplete: (deltaY) => {
                            enableScroll(deltaY)
                        },
                        duration: 1,
                        overwrite: true,
                    });

                } else if (i === 0 && force) {
                    gsap.fromTo(document.getElementsByClassName('Home')[0], {
                        top: 0,
                    }, {
                        top: "-100vh", onStart: disableScroll, onCompleteParams: [deltaY], onComplete: (deltaY) => {
                            enableScroll(deltaY)
                        }, duration: 1, overwrite: true,
                    });
                } else {
                    gsap.fromTo(document.getElementsByClassName('Home')[0], {
                        top: -100 * panelIndex + "vh",
                    }, {
                        top: -100 * i + "vh",
                        onStart: disableScroll,
                        onCompleteParams: [deltaY],
                        onComplete: (deltaY) => {
                            enableScroll(deltaY)
                        },
                        duration: force ? 0 : 1,
                        overwrite: false,
                    });
                }

                // Réactiver ScrollTrigger après l'animation
                ScrollTrigger.refresh();
            }
        }
    };

    useEffect(() => {
        if (isPageReady) {
            const windowHeight = window.innerHeight;
            const HomeHeight = document.getElementsByClassName('Home')[0].scrollHeight;
            console.log(document.body)
            const numberOfPanels = Math.ceil(HomeHeight / windowHeight);
            const panelsArray = [];
            for (let i = 0; i < numberOfPanels; i++) {
                panelsArray.push(<div className="PanelsContainer-item panel" key={i}></div>);
            }
            setPanels(panelsArray);
        }
    }, [isPageReady]);

    useEffect(() => {
        if (!isPageReady) return
        let scrollListenerRemoved = false; // Flag to track if the listener is removed

        const handleScroll = (event) => {

            event.preventDefault(); // Prevent default scroll behavior during animation

            if (!isScrollDisabled) {
                const currentTime = Date.now();
                const timeSinceLastGoToSection = currentTime - lastGoToSectionTime;
                setLastGoToSectionTime(Date.now());

                const scrollY = panelIndex * window.innerHeight;
                const windowHeight = window.innerHeight;
                const bottomOffset = document.getElementsByClassName('PanelsContainer')[0].offsetHeight - (scrollY + windowHeight);
                let deltaY = event.deltaY;
                if (timeSinceLastGoToSection > 500) { // 500 millisecondes
                    if (deltaY < 0) {
                        deltaY = -1
                        // Bottom of the window hits the bottom of the website
                        if (panelIndex === 0) {
                            goToSection(panels.length - 1, true, deltaY);
                            setPanelIndex(panels.length - 2)
                        } else {
                            goToSection(panelIndex - 1, false, deltaY);
                            setPanelIndex(panelIndex - 1)
                        }
                    } else {

                        if (bottomOffset <= 0) {
                            // Bottom of the window hits the bottom of the website
                            goToSection(0, true, deltaY); // Go to the first panel
                            setPanelIndex(1)
                        } else {
                            goToSection(panelIndex + 1, false, deltaY);
                            setPanelIndex(panelIndex + 1)
                        }
                    }
                }
            }
            console.log(event)

        };


        document.addEventListener("wheel", handleScroll)
        return () => {
            if (!scrollListenerRemoved) {
                document.removeEventListener("wheel", handleScroll);
            }
        };
    }, [isPageReady, panels, panelIndex, isScrollDisabled, consecutiveVisibleCount]);


    return (<> {isPageReady ? <div className="PanelsContainer">{panels}</div> : null}</>)
}

export default PanelsContainer;

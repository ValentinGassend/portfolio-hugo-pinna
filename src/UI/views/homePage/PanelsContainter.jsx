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

    const goToSection = (i, force) => {

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
        function enableScroll() {
            setScrollDisabled(false)

        }


        if (document.getElementsByClassName("PanelsContainer").length > 0) {

            if (!isScrollDisabled) {
                if (i === panels.length - 1 && force) {
                    // User has scrolled to the bottom, smoothly scroll to the first panel without duration
                    gsap.fromTo(document.getElementsByClassName('Home')[0], {
                        top: -100 * (i) + "vh",
                    }, {
                        top: -100 * (i - 1) + "vh", onStart: disableScroll, onComplete: () => {
                            enableScroll()
                        }, duration: 1, overwrite: true,
                    });

                } else if (i === 0 && force) {
                    gsap.fromTo(document.getElementsByClassName('Home')[0], {
                        top: 0,
                    }, {
                        top: "-100vh", onStart: disableScroll, onComplete: () => {
                            enableScroll()
                        }, duration: 1, overwrite: true,
                    });
                } else {
                    gsap.fromTo(document.getElementsByClassName('Home')[0], {
                        top: -100 * panelIndex + "vh",
                    }, {
                        top: -100 * i + "vh", onStart: disableScroll, onComplete: () => {
                            enableScroll()
                        }, duration: force ? 0 : 1, overwrite: false,
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
        if (!isPageReady) return;

        let scrollStarts = [0];
        let snapScroll = value => value;


        const refreshScrollTriggers = () => {
            scrollStarts = snapTriggers.current.map(trigger => trigger.start);
            snapScroll = ScrollTrigger.snapDirectional(scrollStarts);
        };

        const handleScroll = (event) => {

            event.preventDefault(); // Prevent default scroll behavior during animation

            if (!isScrollDisabled) {
                const scrollY = panelIndex * window.innerHeight;
                const windowHeight = window.innerHeight;
                const bottomOffset = document.getElementsByClassName('PanelsContainer')[0].offsetHeight - (scrollY + windowHeight);
                const deltaY = event.deltaY;

                if (deltaY < 0) {
                    // Bottom of the window hits the bottom of the website
                    if (panelIndex === 0) {
                        goToSection(panels.length - 1, true);
                        setPanelIndex(panels.length - 2)
                    } else {
                        goToSection(panelIndex - 1, false);
                        setPanelIndex(panelIndex - 1)
                    }
                } else {
                    if (bottomOffset <= 0) {
                        // Bottom of the window hits the bottom of the website
                        goToSection(0, true); // Go to the first panel
                        setPanelIndex(1)
                    } else {
                        goToSection(panelIndex + 1, false);
                        setPanelIndex(panelIndex + 1)
                    }
                }
            }
        };


        document.addEventListener("wheel", handleScroll)
        return () => {
            document.removeEventListener("wheel", handleScroll);
        };
    }, [isPageReady, panels, panelIndex, isScrollDisabled]);

    return (<> {isPageReady ? <div className="PanelsContainer">{panels}</div> : null}</>)
}

export default PanelsContainer;

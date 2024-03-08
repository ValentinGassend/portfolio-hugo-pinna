import React, {useEffect, useRef, useState} from 'react';
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

const PanelsContainer = ({isPageReady}) => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const snapTriggers = useRef([]);
    const scrollTween = useRef(null);
    const main = useRef(null); // Assuming you have a ref for the main container

    const [panels, setPanels] = useState([]);

    const goToSection = (i, force) => {

        var supportsPassive = false;
        var keys = {37: 1, 38: 1, 39: 1, 40: 1};
        var wheelOpt = supportsPassive ? {passive: false} : false;
        var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
        var isScrollDisabled = false; // Variable to track whether scrolling is disabled
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
            isScrollDisabled = true;
            window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
            window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
            window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
            window.addEventListener('keydown', preventDefaultForScrollKeys, false);
        }

// call this to Enable
        function enableScroll() {
            isScrollDisabled = false;
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
            window.removeEventListener('touchmove', preventDefault, wheelOpt);
            window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
        }


        if (document.getElementsByClassName("PanelsContainer").length > 0) {
            let elm, scrollX, scrollY, newX, newY, direction, target;
            /* stash current Window Scroll */
            scrollX = window.pageXOffset;
            scrollY = window.pageYOffset;
            /* scroll to element */
            window.scrollTo(0,snapTriggers.current[i].trigger.offsetTop);
            /* calculate new relative element coordinates */
            newX = 0 - window.pageXOffset;
            newY = snapTriggers.current[i].trigger.offsetTop - window.pageYOffset;
            /* grab the element */
            elm = document.elementFromPoint(newX,newY);
            /* revert to the previous scroll location */
            window.scrollTo(scrollX,scrollY);
            console.log("now", elm)

            if (snapTriggers.current[i].direction) {
                direction = snapTriggers.current[i].direction
            }
                if (elm.classList.contains('pin-spacer')) {
                    // target the children
                    target = elm.children[0];
                } else {
                    target = elm
                }
            if (i === panels.length - 1 && force) {
                // User has scrolled to the bottom, smoothly scroll to the first panel without duration
                gsap.to(window, {
                    scrollTo: {y: snapTriggers.current[i].start, autoKill: false},
                    duration: 0,
                    onStart: disableScroll,
                    onComplete: () => {
                        scrollTween.current = null
                        scrollTween.current = gsap.to(window, {
                            scrollTo: {y: snapTriggers.current[i - 1].start, autoKill: true},
                            duration: 1,
                            onComplete: () => {
                                scrollTween.current = null;
                                enableScroll
                            },
                            overwrite: true,
                        });
                    },
                    overwrite: true,
                });

            } else if (i === 0 && force) {
                // User has scrolled to the bottom, smoothly scroll to the first panel without duration
                gsap.to(window, {
                    scrollTo: {y: 1, autoKill: true}, duration: 0, onStart: disableScroll, onComplete: () => {
                        scrollTween.current = null
                        // if (target.classList.contains('EnterSmoothScroll')) {
                            scrollTween.current = gsap.to(window, {
                                scrollTo: {y: snapTriggers.current[i].start, autoKill: true},
                                duration: 1,
                                onComplete: () => {
                                    scrollTween.current = null;
                                    enableScroll

                                },
                                overwrite: true,
                            });
                        // }
                    }, overwrite: true,
                });
            } else {
                // Scroll to the specified panel with a duration
                if (target.classList.contains('EnterSmoothScroll')) {

                    scrollTween.current = gsap.to(window, {
                        scrollTo: {
                            y: snapTriggers.current[i].start,
                            autoKill: false,
                            onStart: disableScroll,
                            onComplete: () => {
                                // console.log(document.getElementsByClassName("PanelsContainer"))
                                if (document.getElementsByClassName("PanelsContainer").length <= 0) {

                                    snapTriggers.current = null
                                }
                                enableScroll

                            }
                        }, duration: force ? 0 : 1, onComplete: () => (scrollTween.current = null), overwrite: false,
                    });
                }

            }
        }
    };

    useEffect(() => {
        if (isPageReady) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;
            const numberOfPanels = Math.ceil(documentHeight / windowHeight);
            const panelsArray = [];
            for (let i = 0; i < numberOfPanels; i++) {
                panelsArray.push(<div className="PanelsContainer-item panel" key={i}></div>);
            }
            setPanels(panelsArray);
        }
    }, [isPageReady]);

    useEffect(() => {
        if (!isPageReady) return;

        const panelsArray = gsap.utils.toArray('.panel');
        let scrollStarts = [0];
        let snapScroll = value => value;

        panelsArray.forEach((panel, i) => {
            snapTriggers.current[i] = ScrollTrigger.create({
                trigger: panel, start: "top top"
            });
        });

        const refreshScrollTriggers = () => {
            scrollStarts = snapTriggers.current.map(trigger => trigger.start);
            snapScroll = ScrollTrigger.snapDirectional(scrollStarts);
            // console.log(snapTriggers.current)
        };

        const handleScroll = self => {
            console.log(self)

            // si self.event.target à la class "smoothScrollToMe" alors scroll d'une traite vers lui de facon smooth sinon laisse moi scroll normalement

            if (!scrollTween.current) {
                const scrollY = self.scrollY();
                const windowHeight = window.innerHeight;
                const documentHeight = document.body.scrollHeight;
                const bottomOffset = documentHeight - (scrollY + windowHeight);
                const deltaY = self.deltaY;
                const scroll = snapScroll(scrollY + deltaY, deltaY > 0 ? 1 : -1);
                console.log(snapTriggers.current)
                console.log(scrollStarts.indexOf(scroll))
                if (scrollY === 0 && deltaY < 0 && scroll !== undefined) {
                    goToSection(snapTriggers.current.length - 1, true); // Go to the last panel
                } else if (bottomOffset <= 0 && deltaY > 0) {
                    // Bottom of the window hits the bottom of the website
                    goToSection(0, true); // Go to the first panel
                } else {
                    goToSection(scrollStarts.indexOf(scroll), false);
                }
            }
        };

        ScrollTrigger.addEventListener("refresh", refreshScrollTriggers);

        ScrollTrigger.observe({
            type: "wheel,touch", onChangeY: handleScroll
        });
        ScrollTrigger.refresh();

        return () => {
            ScrollTrigger.removeEventListener("refresh", refreshScrollTriggers);
        };
    }, [isPageReady, panels]);

    return (<> {isPageReady ? <div className="PanelsContainer">{panels}</div> : null}</>)
}

export default PanelsContainer;

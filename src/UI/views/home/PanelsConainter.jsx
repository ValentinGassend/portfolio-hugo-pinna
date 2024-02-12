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
        if (i === panels.length - 1 && force) {
            // User has scrolled to the bottom, smoothly scroll to the first panel without duration
            gsap.to(window, {
                scrollTo: {y: snapTriggers.current[i].start, autoKill: false}, duration: 0, onComplete: () => {
                    scrollTween.current = null
                    scrollTween.current = gsap.to(window, {
                        scrollTo: {y: snapTriggers.current[i - 1].start, autoKill: false},
                        duration: 1,
                        onComplete: () => (scrollTween.current = null),
                        overwrite: true,
                    });
                }, overwrite: true,
            });

        } else if (i === 0 && force) {
            // User has scrolled to the bottom, smoothly scroll to the first panel without duration
            gsap.to(window, {
                scrollTo: {y: 1, autoKill: false}, duration: 0, onComplete: () => {
                    scrollTween.current = null
                    scrollTween.current = gsap.to(window, {
                        scrollTo: {y: snapTriggers.current[i + 1].start, autoKill: false},
                        duration: 1,
                        onComplete: () => (scrollTween.current = null),
                        overwrite: true,
                    });
                }, overwrite: true,
            });
        } else {
            // Scroll to the specified panel with a duration
            scrollTween.current = gsap.to(window, {
                scrollTo: {y: snapTriggers.current[i].start, autoKill: false},
                duration: force ? 0 : 1,
                onComplete: () => (scrollTween.current = null),
                overwrite: true,
            });
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
            if (!scrollTween.current) {
                const scrollY = self.scrollY();
                const windowHeight = window.innerHeight;
                const documentHeight = document.body.scrollHeight;
                const bottomOffset = documentHeight - (scrollY + windowHeight);
                const deltaY = self.deltaY;
                const scroll = snapScroll(scrollY + deltaY, deltaY > 0 ? 1 : -1);
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

import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

const PanelsContainer = ({ isPageReady }) => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const snapTriggers = useRef([]);
    const scrollTween = useRef(null);
    const main = useRef(null); // Assuming you have a ref for the main container

    const [panels, setPanels] = useState([]);

    const goToSection = i => {
        //console.log("scroll to", i);
        scrollTween.current = gsap.to(window, {
            scrollTo: { y: snapTriggers.current[i].start, autoKill: false },
            duration: 1,
            onComplete: () => (scrollTween.current = null),
            overwrite: true,
        });
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
        };

        const handleScroll = self => {
            if (!scrollTween.current) {
                const scroll = snapScroll(self.scrollY() + self.deltaY, self.deltaY > 0 ? 1 : -1);
                goToSection(scrollStarts.indexOf(scroll));
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

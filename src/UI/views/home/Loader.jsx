import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {SplitText} from "gsap/SplitText";
import {useGSAP} from "@gsap/react";


gsap.registerPlugin(SplitText);


const Loader = ({isPageReady}) => {
    const loader = useRef();
    const [isAppeared, setIsAppeared] = useState(false)
    const [isDisappeared, setIsDisappeared] = useState(false)


    useGSAP(() => {
        const title = new SplitText(".Loader-title--content", {types: "words", linesClass: "wordChild"});
        const subtitle = new SplitText(".Loader-subtitle--content", {types: "words", linesClass: "wordChild"});

        if (isPageReady === true) {
            gsap.to(title.words, { // <- selector text, scoped to this component!
                opacity: 0,
                y: -100,
                ease: "power4.inOut",
                duration: 1,
                stagger: 0.1
            });
            gsap.to(subtitle.words, { // <- selector text, scoped to this component!
                opacity: 0,
                y: -100,
                ease: "power4.inOut",
                delay: 0.5,
                duration: 1,
                stagger: 0.1,
            });gsap.to(".Loader", { // <- selector text, scoped to this component!
                y: "-100%",
                ease: "power4.inOut",
                delay: 0.75,
                duration: 1,
                stagger: 0.1,
                onComplete: () => {
                    setIsDisappeared(true)
                }
            });
        } else {
            gsap.from(title.words, { // <- selector text, scoped to this component!
                opacity: 0,
                y: 100,
                ease: "power4.inOut",
                duration: 1,
                stagger: 0.1
            });
            gsap.from(subtitle.words, { // <- selector text, scoped to this component!
                opacity: 0,
                y: 100,
                ease: "power4.inOut",
                delay: 0.5,
                duration: 1,
                stagger: 0.1
            });
        }
    },[isPageReady], {scope: loader})


    return (<>
        {!isDisappeared ? (<>
        <div ref={loader} className={`Loader ${isAppeared ? "" : "appear"} `}>
            <div className={`Loader-title`}>
                <h1 className={`Loader-title--content`}>Hugo Pinna</h1>
            </div>
            <div className={`Loader-subtitle`}>
                <h2 className={`Loader-subtitle--content`}>Art director, Graphic designer, 3d Artist</h2>
            </div>
        </div>
        </>) : (<></>)

        }
    </>)
}

export default Loader
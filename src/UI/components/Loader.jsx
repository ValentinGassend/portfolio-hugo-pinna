import {useEffect, useLayoutEffect, useRef, useState} from "react";
import gsap from "gsap";
import {SplitText} from "gsap/SplitText";
import {useGSAP} from "@gsap/react";


gsap.registerPlugin(SplitText);


const Loader = ({isPageReady}) => {
    const loader = useRef();
    const [isAppeared, setIsAppeared] = useState(false)
    const [isDisappeared, setIsDisappeared] = useState(false)
    const [title, setTitle] = useState(false)
    const [subtitle, setSubtitle] = useState(false)

    useEffect(() => {

            const title = new SplitText(".Loader-title--content", {
                types: "words", wordsClass: "wordChild", linesClass: "lineChild", wordDelimiter: ''
            });
            const subtitle = new SplitText(".Loader-subtitle--content", {
                types: "words", wordsClass: "wordChild", linesClass: "lineChild", wordDelimiter: ''
            })
            setTitle(title)
            setSubtitle(subtitle)
    }, []);
    useGSAP(() => {

        if (isPageReady === true) {
            gsap.to(title.words, { // <- selector text, scoped to this component!
                opacity: 0, y: -100, ease: "power4.inOut", duration: 1, stagger: 0.1
            });
            gsap.to(subtitle.words, { // <- selector text, scoped to this component!
                opacity: 0, y: -100, ease: "power4.inOut", delay: 0.5, duration: 1, stagger: 0.1,
            });
            gsap.to(".Loader", { // <- selector text, scoped to this component!
                y: "-100%", ease: "power4.inOut", delay: 0.75, duration: 1, stagger: 0.1, onComplete: () => {
                    setIsDisappeared(true)
                }
            });
        } else {

            gsap.from(title.words, { // <- selector text, scoped to this component!
                opacity: 0, y: 100, ease: "power4.inOut",  duration: 1, stagger: 0.1
            });
            gsap.from(subtitle.words, { // <- selector text, scoped to this component!
                opacity: 0, y: 100, ease: "power4.inOut", delay: 0.5, duration: 1, stagger: 0.1
            });
        }
    }, [isPageReady, title, subtitle])


    return (<>
        <div ref={loader} className={`Loader ${isAppeared ? "" : "appear"} `}>
            <div className={`Loader-title`}>
                <h1 className={`Loader-title--content`}>Hugo Pinna</h1>
            </div>
            <div className={`Loader-subtitle`}>
                <h2 className={`Loader-subtitle--content`}>Art director, Graphic designer, 3d Artist</h2>
            </div>
        </div>
    </>)
}

export default Loader
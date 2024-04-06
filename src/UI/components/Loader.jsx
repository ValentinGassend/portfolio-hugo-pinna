import {useEffect, useLayoutEffect, useRef, useState} from "react";
import gsap from "gsap";
import {SplitText} from "gsap/SplitText";
import {useGSAP} from "@gsap/react";


gsap.registerPlugin(SplitText);


const Loader = ({isPageReady}) => {
    const loader = useRef();
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
            gsap.to(".Loader", { // <- selector text, scoped to this component!
                y: "-100%", ease: "power4.inOut", delay: 0.75, duration: 1, stagger: 0.1,
            });
        }
    }, [isPageReady, title, subtitle])


    return (<>
        <div ref={loader} className={`Loader ${isPageReady ? "appear" : ""} `}>
        </div>
    </>)
}

export default Loader
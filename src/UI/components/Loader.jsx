import {useEffect, useLayoutEffect, useRef, useState} from "react";
import gsap from "gsap";
import {SplitText} from "gsap/SplitText";
import {useGSAP} from "@gsap/react";
import {Player} from "@lottiefiles/react-lottie-player";


gsap.registerPlugin(SplitText);


const Loader = ({isPageReady}) => {
    const loader = useRef();
    const loaderBar = useRef();
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
            loaderBar.current.setPlayerSpeed(2)

        } else {
            loaderBar.current.setPlayerSpeed(0.01)
        }

    }, [isPageReady, title, subtitle])


    let playerRef;
    return (<>
        <div ref={loader} className={`Loader ${isPageReady ? "appear" : ""} `}>
            <Player
                src='./lotties/loaderBar.json'
                className="player"
                keepLastFrame={true}
                autoplay
                ref={loaderBar}
            />
        </div>
    </>)
}

export default Loader
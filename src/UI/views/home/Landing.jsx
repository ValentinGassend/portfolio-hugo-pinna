import Loader from "./Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useEffect, useState} from "react";


const Landing = () => {
    const manager = LoadingManager
    const [isPageReady, setIsPageReady] = useState(false)
    manager.FakeLoading().then(() => {
        setIsPageReady(true)
    })

    return (
        <>
            <div className={`Landing`}>
                <div className={`Landing-grid`}>
                    <div className={`Landing-grid-name`}>
                        <span className={`Landing-grid--element uppercase`}>Hugo</span>
                        <span className={`Landing-grid--element uppercase`}>Pinna</span>
                        <span className={`Landing-grid--element uppercase`}>Cuillère</span>
                    </div>
                    <div className={`Landing-grid-domain`}>
                        <span className={`Landing-grid--element uppercase`}>Art director</span>
                        <span className={`Landing-grid--element uppercase`}>Graphic designer</span>
                        <span className={`Landing-grid--element uppercase`}>3d artist</span>
                    </div>
                    <div className={`Landing-grid-location`}>
                        <span className={`Landing-grid--element uppercase`}>Genève</span>
                        <span className={`Landing-grid--element`}>[[arrow]]</span>
                        <span className={`Landing-grid--element uppercase`}>Annecy</span>
                    </div>
                    <div className={`Landing-grid-baseline`}>
                        <span className={`Landing-grid--element uppercase`}>“Baseline un peu cool”</span>
                    </div>
                    <div className={`Landing-grid-support`}>
                        <span className={`Landing-grid--element`}>Portfolio</span>
                    </div>
                    <div className={`Landing-grid-instagram`}>
                        <span className={`Landing-grid--element`}>@hugocuillère</span>
                    </div>
                    <div className={`Landing-grid-work`}>
                    <span className={`Landing-grid--element uppercase`}>[[GreenDot]]Open to work</span>
                    <span className={`Landing-grid--element`}>[[arrow]]</span>
                    <span className={`Landing-grid--element`}>hugopinna@free.fr</span>
                    </div>
                    <div className={`Landing-grid-status`}>
                    <span className={`Landing-grid--element uppercase`}>Freelance</span>
                    <span className={`Landing-grid--element uppercase`}>{new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
            <Loader isPageReady={isPageReady}/>
        </>
    )
}

export default Landing
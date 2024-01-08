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
            <div style={{backgroundColor: "black", width: "100%", height: "100%"}}></div>
            <Loader isPageReady={isPageReady}/>
        </>
    )
}

export default Landing
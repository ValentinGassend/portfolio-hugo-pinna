import Landing from "./Landing.jsx";
import Loader from "./Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useState} from "react";
import ProjectsPartView from "../projects/ProjectsPartView.jsx";
import AboutPartView from "../about/AboutPartView.jsx";
import ContactPartView from "../contact/ContactPartView.jsx";

const Home = () => {
    const loadingManager = LoadingManager
    const [isPageReady, setIsPageReady] = useState(false)
    loadingManager.FakeLoading().then(() => {
        setIsPageReady(true)
    })
    return (
        <>
            <Landing/>
            <ProjectsPartView/>
            <AboutPartView/>
            <ContactPartView/>
            <Loader isPageReady={isPageReady}/>

        </>
    )
}
export default Home
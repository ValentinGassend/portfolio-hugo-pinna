import Landing from "./Landing.jsx";
import Loader from "./Loader.jsx";
import LoadingManager from "../../../managers/LoadingManager.jsx";
import {useEffect, useState} from "react";
import ProjectsPartView from "../projects/ProjectsPartView.jsx";
import AboutPartView from "../about/AboutPartView.jsx";
import ContactPartView from "../contact/ContactPartView.jsx";
import ProjectManager from "../../../managers/ProjectManager.jsx";
import ProjectsView from "../projects/ProjectsView.jsx";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

    const projectManager = ProjectManager
    const loadingManager = LoadingManager
    const [isPageReady, setIsPageReady] = useState(false)
    loadingManager.FakeLoading().then(() => {
        setIsPageReady(true)
    })


    useEffect(() => {
        projectManager.getProjectsFromFirebase('projects').then((projectsData) => {
                setProjects(projectsData);
                setAnalyticsInitialized(true);
            }
        );
    }, []);
    return (
        <>
            <Landing/>
            <ProjectsPartView projects={projects} projectManager={projectManager}/>
            <AboutPartView/>
            <ContactPartView/>
            <Loader isPageReady={isPageReady}/>

        </>
    )
}
export default Home
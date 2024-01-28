import Landing from "./Landing.jsx";
import Loader from "./Loader.jsx";
import {useEffect, useRef, useState} from "react";
import ProjectsPartView from "../projects/ProjectsPartView.jsx";
import AboutPartView from "../about/AboutPartView.jsx";
import ContactPartView from "../contact/ContactPartView.jsx";
import ProjectManager from "../../../managers/ProjectManager.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

    const projectManager = ProjectManager
    const [isPageReady, setIsPageReady] = useState(false)
    const elapsedTimeRef = useRef(0);


    useEffect(() => {
        const startTime = Date.now(); // Enregistrez le temps de début
        projectManager.getProjectsFromFirebase('projects').then((projectsData) => {
            setProjects(projectsData);
            setAnalyticsInitialized(true);

            const elapsedTime = Date.now() - startTime;
            elapsedTimeRef.current = elapsedTime;

            setTimeout(() => {
                setIsPageReady(true);
            }, 2000 - elapsedTime); // Utilisez la différence pour ajuster le délai restant
        });
    }, []); // Le tableau de dépendances est vide, donc le useEffect s'exécute une seule fois après le montage

    // Fonction pour obtenir le temps écoulé
    const getElapsedTime = () => {
        return elapsedTimeRef.current;
    };

    // Utilisation de getElapsedTime pour obtenir le temps écoulé dans votre composant
    const elapsedMilliseconds = getElapsedTime();

    useEffect(() => {
        if (isPageReady) {
            let partTitleContainer = document.getElementsByClassName('partTitle')

            console.log(partTitleContainer)

            let containers = []
            let container;
            gsap.registerPlugin(ScrollTrigger);

            for (let i = 0; i < partTitleContainer.length; i++) {
                console.log(partTitleContainer[i])
                container = partTitleContainer[i].closest('section').classList[0]

                containers = [].concat(containers, container)
            }

            for (let i = 0; i < containers.length; i++) {
                console.log(containers)

                container = document.getElementsByClassName(containers[i] + "-headline")[0].closest("section").classList[0]
                gsap.to("." + container + "-headline", {
                    filter: "blur(32px)", scrollTrigger: {
                        pinSpacing: false,
                        endTrigger: "." + container,
                        pin: "." + container + "-headline",
                        scrub: 0.2,
                        start: "center center",
                        end: "bottom center",
                    }
                })
            }
        }
    }, [isPageReady]);
    return (<>
        <div className={`Home ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>
            <Landing/>
            <ProjectsPartView projects={projects} projectManager={projectManager}/>
            <AboutPartView/>
            <ContactPartView/>
            <Loader isPageReady={isPageReady}/>
        </div>
    </>)
}
export default Home
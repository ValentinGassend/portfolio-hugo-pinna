import Landing from "./Landing.jsx";
import Loader from "./Loader.jsx";
import {useEffect, useRef, useState} from "react";
import ProjectsPartView from "../projects/ProjectsPartView.jsx";
import AboutPartView from "../about/AboutPartView.jsx";
import ContactPartView from "../contact/ContactPartView.jsx";
import ProjectManager from "../../../managers/ProjectManager.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import AssetNames from "./AssetNames.js";
import Overlay from "../../components/Overlay.jsx";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

    const projectManager = ProjectManager
    const [isProjectReady, setIsProjectReady] = useState(false)
    const [isAssetReady, setIsAssetReady] = useState(false)
    const [isPageReady, setIsPageReady] = useState(false)
    const elapsedTimeRef = useRef(0);

    const [assetsUrl, setAssetsUrl] = useState({})
    const addAssetUrl = (name, url) => {
        setAssetsUrl(assetsUrl => ({
            ...assetsUrl, [name]: url,
        }));
        console.log(assetsUrl)
    };

    useEffect(() => {
        if (assets && Array.isArray(assets) && assets.length > 0) {
            const promises = Object.values(AssetNames).map((name) => {
                return Promise.resolve(projectManager.getSpecificAsset(assets, name))
                    .then(asset => {
                        let assetPath = asset[0].asset_img;

                        return projectManager.getUrlOfImage(assetPath)
                            .then((url) => {
                                if (url) {
                                    console.log("URL de l'asset:" + name, url);
                                    addAssetUrl(name, url);
                                    return {name, url}; // Return the result for Promise.all
                                } else {
                                    console.log("L'image n'existe pas ou une erreur s'est produite.");
                                    return null; // Return null for failed promises
                                }
                            })
                            .catch((error) => {
                                console.error("Erreur générale:", error);
                                return null; // Return null for failed promises
                            });
                    });
            });

            Promise.all(promises)
                .then(results => {
                    results.forEach(result => {
                        addAssetUrl(result.name, result.url);

                    });
                    setIsAssetReady(true)

                })
                .catch(error => {
                    // Handle any errors during the Promise.all
                    console.error("Error in Promise.all:", error);
                });
        }
    }, [assets])

    useEffect(() => {
        const startTime = Date.now(); // Enregistrez le temps de début
        projectManager.getProjectsFromFirebase('projects').then((projectsData) => {
            setProjects(projectsData);
            setAnalyticsInitialized(true);

            const elapsedTime = Date.now() - startTime;
            elapsedTimeRef.current = elapsedTime;

            setTimeout(() => {
                setIsProjectReady(true);
            }, 2000 - elapsedTime); // Utilisez la différence pour ajuster le délai restant
        });
        projectManager.getProjectsFromFirebase('assets').then((assetsData) => {
            setAssets(assetsData);
        });
    }, []);

    const getElapsedTime = () => {
        return elapsedTimeRef.current;
    };
    getElapsedTime();


    useEffect(() => {
        if (isAssetReady && isProjectReady) {
            setIsPageReady(true)
        }
    }, [isAssetReady, isProjectReady]);
    useEffect(() => {
        if (isPageReady) {
            let partTitleContainer = document.getElementsByClassName('partTitle')
            let overlay = document.getElementsByClassName('Overlay')[0]
            let overlayLowerItems = document.getElementsByClassName('Overlay-wrapper-lower--text')

            let containers = []
            let container;
            gsap.registerPlugin(ScrollTrigger);

            for (let i = 0; i < partTitleContainer.length; i++) {
                container = partTitleContainer[i].closest('section').classList[0]

                containers = [].concat(containers, container)
            }

            for (let i = 0; i < containers.length; i++) {

                container = document.getElementsByClassName(containers[i] + "-headline")[0].closest("section").classList[0]

                gsap.to("." + container + "-headline", {
                    filter: "blur(32px)",
                    scrollTrigger: {
                        pinSpacing: false,
                        endTrigger: "." + container,
                        pin: "." + container + "-headline",
                        scrub: 0.2,
                        start: "center center",
                        end: "bottom center",
                    },
                    onReverseCompleteParams: [containers, overlay, container, overlayLowerItems],
                    onStartParams: [containers, overlay, container, overlayLowerItems],
                    onStart: (containers, overlay, container, overlayLowerItems) => {
                        if (overlay.classList.contains("hidden")) {
                            overlay.classList.remove("hidden")
                            overlay.classList.add("visible")
                        }
                        for (let k = 0; k < containers.length; k++) {
                            if (overlay.classList.contains(containers[k])) {
                                overlay.classList.remove(containers[k])
                            }
                        }

                        overlay.classList.add(container)

                        for (let j = 0; j < overlayLowerItems.length; j++) {
                            if (overlayLowerItems[j].textContent === container) {
                                overlayLowerItems[j].classList.add("currentSection")
                            } else {
                                if (overlayLowerItems[j].classList.contains("currentSection")) {
                                    overlayLowerItems[j].classList.remove("currentSection")
                                }
                            }
                        }
                    },
                    onReverseComplete: (containers, overlay, container, overlayLowerItems) => {
                        if (!overlay.classList.contains("hidden")) {
                            if (container === containers[0]) {
                                overlay.classList.remove("visible")
                                overlay.classList.add("hidden")
                            }
                        }
                        overlay.classList.remove(container)

                        for (let k = 0; k < containers.length; k++) {
                            if (container !== containers[0]) {
                                overlay.classList.add(containers[k - 1])
                            }
                        }
                        for (let j = 0; j < overlayLowerItems.length; j++) {

                            if (overlayLowerItems[j].classList.contains("currentSection")) {
                                overlayLowerItems[j].classList.remove("currentSection")
                            }
                            if (container !== containers[0]) {
                                if (overlayLowerItems[j].textContent === containers[i - 1]) {
                                    overlayLowerItems[j].classList.add("currentSection")
                                }
                            }
                        }

                    }
                })
            }
        }
    }, [isPageReady]);


    useEffect(() => {
        console.log("assetsUrl ", assetsUrl)
    }, [assetsUrl]);
    return (<>
        <div className={`Home ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>
            <Landing assetsUrl={assetsUrl}/>
            <ProjectsPartView projects={projects} projectManager={projectManager}/>
            <AboutPartView/>
            <ContactPartView/>
            <Overlay/>
            <Loader isPageReady={isPageReady}/>
        </div>
    </>)
}
export default Home
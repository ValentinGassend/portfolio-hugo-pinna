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
                    // All promises resolved, do something with the results if needed
                    console.log("All promises resolved:", results);
                    results.forEach(result => {
                        console.log("Result:", result);
                        addAssetUrl(result.name, result.url);

                    });
                    console.log(assetsUrl)
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
        console.log("isAssetReady ", isAssetReady)
        console.log("isProjectReady ", isProjectReady)
        console.log("isPageReady ", isPageReady)
        if (isAssetReady && isProjectReady) {
            setIsPageReady(true)
        }
    }, [isAssetReady, isProjectReady]);
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
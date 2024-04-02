import Landing from "./Landing.jsx";
import Loader from "../../components/Loader.jsx";
import React, {useEffect, useRef, useState} from "react";
import ProjectsPartView from "../projects/ProjectsPartView.jsx";
import AboutPartView from "../about/AboutPartView.jsx";
import ContactPartView from "../contact/ContactPartView.jsx";
import ProjectManager from "../../../managers/ProjectManager.jsx";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import AssetNames from "./AssetNames.js";
import Overlay from "../../components/Overlay.jsx";
import PanelsContainer from "./PanelsContainter.jsx";
import GalleryPartView from "../gallery/GalleryPartView.jsx";
import projectManager from "../../../managers/ProjectManager.jsx";
import {IsMobile} from "../../../utils/utils.jsx";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [contactData, setContact] = useState([]);
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);
    const [galleryData, setGalleryData] = useState(null);
    const [galleryPartData, setGalleryPartData] = useState(null);
    const [aboutData, setAboutData] = useState(null);
    const [landingData, setLandingData] = useState(null);

    const projectManager = ProjectManager
    const [isProjectReady, setIsProjectReady] = useState(false)
    const [isLandingReady, setIsLandingReady] = useState(false)
    const [isGalleryReady, setIsGalleryReady] = useState(false)
    const [isGalleryPartReady, setIsGalleryPartReady] = useState(false)
    const [isAboutReady, setIsAboutReady] = useState(false)
    const [isAssetReady, setIsAssetReady] = useState(false)
    const [isPageReady, setIsPageReady] = useState(false)
    const elapsedTimeRef = useRef(0);

    const [assetsUrl, setAssetsUrl] = useState({})
    const addAssetUrl = (name, url) => {
        setAssetsUrl(assetsUrl => ({
            ...assetsUrl, [name]: url,
        }));
        ////console.log(assetsUrl)
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
                                    ////console.log("URL de l'asset:" + name, url);
                                    addAssetUrl(name, url);
                                    return {name, url}; // Return the result for Promise.all
                                } else {
                                    ////console.log("L'image n'existe pas ou une erreur s'est produite.");
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
        projectManager.getProjectsFromFirebase("gallery").then((galleryData) => {
            setGalleryData(galleryData);
            const elapsedTime = Date.now() - startTime;
            elapsedTimeRef.current = elapsedTime;

            setTimeout(() => {
                setIsGalleryReady(true);
            }, 2000 - elapsedTime); // Utilisez la différence pour ajuster le délai restant
        });
        projectManager.getProjectsFromFirebase('projects').then((projectsData) => {
            setProjects(projectsData);
            setAnalyticsInitialized(true);

            const elapsedTime = Date.now() - startTime;
            elapsedTimeRef.current = elapsedTime;

            setTimeout(() => {
                setIsProjectReady(true);
            }, 2000 - elapsedTime); // Utilisez la différence pour ajuster le délai restant
        });
        projectManager.getProjectsFromFirebase('landing').then((landingData) => {

            if (landingData && landingData.length > 0) {
                const landingItem = landingData[0];
                if (landingItem.image && landingItem.image.length > 0) {
                    const imagePath = landingItem.image;
                    // Use projectManager to get the URL of the image
                    projectManager.getUrlOfImage(imagePath)
                        .then((url) => {
                            landingItem.url = url;
                            landingItem.media = projectManager.getMediaType(url);
                            setLandingData(landingItem);
                        })
                        .catch((error) => {
                            console.error("Error getting URL of image:", error);
                            setLandingData(landingItem);
                        });
                } else {
                    setLandingData(landingItem);
                }

                const elapsedTime = Date.now() - startTime;
                elapsedTimeRef.current = elapsedTime;

                setTimeout(() => {
                    setIsLandingReady(true);
                }, 2000 - elapsedTime);
            }
            setLandingData(landingData[0]);
            setAnalyticsInitialized(true);

            const elapsedTime = Date.now() - startTime;
            elapsedTimeRef.current = elapsedTime;

            setTimeout(() => {
                setIsLandingReady(true);
            }, 2000 - elapsedTime); // Utilisez la différence pour ajuster le délai restant
        });
        projectManager.getProjectsFromFirebase('assets').then((assetsData) => {
            setAssets(assetsData);
        });
        projectManager.getProjectsFromFirebase('contact').then((contactData) => {
            setContact(contactData);

        });
        projectManager.getProjectsFromFirebase('gallery_part').then((galleryPartData) => {
            setGalleryPartData(galleryPartData[0]);
            const elapsedTime = Date.now() - startTime;
            elapsedTimeRef.current = elapsedTime;

            setTimeout(() => {
                setIsGalleryPartReady(true);
            }, 2000 - elapsedTime);
        });
        projectManager.getProjectsFromFirebase('about').then((aboutData) => {
            if (aboutData && aboutData.length > 0) {
                const aboutItem = aboutData[0];
                // Check if aboutData has an image property and if it has a URL
                if (aboutItem.image && aboutItem.image.length > 0) {
                    const assetPath = aboutItem.image;
                    // Use projectManager to get the URL of the image
                    projectManager.getUrlOfImage(assetPath)
                        .then((url) => {
                            // Add the URL to aboutData
                            aboutItem.url = url;
                            setAboutData(aboutItem);
                        })
                        .catch((error) => {
                            console.error("Error getting URL of image:", error);
                            setAboutData(aboutItem); // Set aboutData even if URL fetch fails
                        });
                } else {
                    setAboutData(aboutItem);
                }

                const elapsedTime = Date.now() - startTime;
                elapsedTimeRef.current = elapsedTime;

                setTimeout(() => {
                    setIsAboutReady(true);
                }, 2000 - elapsedTime);
            }
        });
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            const newData = await Promise.all(galleryData.map(async (item) => {
                if (item.visual) {
                    try {
                        const url_visual = await projectManager.getUrlOfImage(item.visual);

                        if (item.home_gallery_part && item.home_gallery_part.home_visual) {
                            const url_home_visual = await projectManager.getUrlOfImage(item.home_gallery_part.home_visual);
                            return {...item, url_visual, url_home_visual};
                        } else {
                            return {...item, url_visual};
                        }
                    } catch (error) {
                        console.error("Erreur lors de la récupération de l'URL de l'image:", error);
                        return item;
                    }
                } else {
                    return item;
                }
            }));
            setGalleryData(newData);
        };

        if (galleryData) {
            fetchData();
        }

    }, [isPageReady]);
    const getElapsedTime = () => {
        return elapsedTimeRef.current;
    };
    getElapsedTime();


    useEffect(() => {
        if (isAssetReady && isProjectReady && isGalleryReady && isGalleryPartReady && isAboutReady && isLandingReady) {
            setIsPageReady(true)
        }
    }, [isAssetReady, isProjectReady, isGalleryReady, isGalleryPartReady, isAboutReady, isLandingReady]);
    useEffect(() => {
        if (isPageReady) {
            let partTitleContainer = document.getElementsByClassName('partTitle')
            let overlay = document.getElementsByClassName('Overlay')[0]
            let overlayLowerItems = IsMobile() ? document.getElementsByClassName('Overlay-wrapper-upper--text') : document.getElementsByClassName('Overlay-wrapper-lower--text')

            let containers = []
            let container;
            gsap.registerPlugin(ScrollTrigger);

            for (let i = 0; i < partTitleContainer.length; i++) {
                container = partTitleContainer[i].closest('section').classList[0]

                containers = [].concat(containers, container)
            }

            for (let i = 0; i < containers.length; i++) {

                container = document.getElementsByClassName(containers[i] + "-headline")[0].closest("section").classList[0]
                // //console.log(document.getElementsByClassName(containers[i] + "-headline")[0].classList.contains('disable'))
                gsap.to("." + container + "-headline", {
                    filter: "blur(32px)",
                    scrollTrigger: {
                        pinSpacing: false,
                        endTrigger: "." + container,
                        pin: "." + container + "-headline",
                        scrub: 0.2,
                        start: "center 51%",
                        end: "bottom 90%",
                    },
                    onReverseCompleteParams: [containers, overlay, container, overlayLowerItems],
                    onCompleteParams: [containers, overlay, container, overlayLowerItems],
                    onStartParams: [containers, overlay, container, overlayLowerItems],
                    onStart: (containers, overlay, container, overlayLowerItems) => {
                        // //console.log("onStart",container)

                        if (overlay.classList.contains("hidden")) {
                            overlay.classList.remove("hidden")
                            overlay.classList.add("visible")
                        }
                        if (!overlay.classList.contains("hidden") && container === containers[containers.length - 1]) {
                            overlay.classList.remove("visible")
                            overlay.classList.add("hidden")
                        }
                        for (let k = 0; k < containers.length; k++) {
                            if (overlay.classList.contains(containers[k])) {
                                overlay.classList.remove(containers[k])
                            }
                        }

                        overlay.classList.add(container)

                        for (let j = 0; j < overlayLowerItems.length; j++) {
                            if (overlayLowerItems[j].textContent === container) {
                                overlayLowerItems[j].classList.add("currentSection");
                                overlayLowerItems[j].classList.add("transitioning");
                            } else {
                                if (overlayLowerItems[j].classList.contains("currentSection")) {
                                    overlayLowerItems[j].classList.remove("currentSection");
                                    overlayLowerItems[j].classList.remove("transitioning");
                                    overlayLowerItems[j].classList.remove("transitioning-reverse");
                                }
                            }

                        }
                    },
                    onReverseComplete: (containers, overlay, container, overlayLowerItems) => {
                        // //console.log("onReverseComplete",container)

                        if (!overlay.classList.contains("hidden")) {
                            if (container === containers[0]) {
                                overlay.classList.remove("visible")
                                overlay.classList.add("hidden")
                            }
                        }
                        if (overlay.classList.contains("hidden") && container === containers[containers.length - 1]) {
                            overlay.classList.add("visible")
                            overlay.classList.remove("hidden")
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
                                overlayLowerItems[j].classList.remove("transitioning");

                            }
                            if (overlayLowerItems[j].classList.contains("transitioning-reverse")) {
                                overlayLowerItems[j].classList.remove("transitioning-reverse")
                            }
                            if (container !== containers[0]) {
                                if (overlayLowerItems[j].textContent === containers[i - 1]) {
                                    overlayLowerItems[j].classList.add("currentSection")
                                    overlayLowerItems[j].classList.add("transitioning-reverse");
                                }
                            }
                        }

                    }
                })
            }


        }
    }, [isPageReady]);
    useEffect(() => {
        ////console.log("assetsUrl ", assetsUrl)
    }, [assetsUrl]);


    return (<>
        <div className={`Home ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>

            <PanelsContainer isPageReady={isPageReady}/>
            <Landing assetsUrl={assetsUrl} landingData={landingData}/>
            <ProjectsPartView projects={projects} projectManager={projectManager}/>
            <AboutPartView aboutData={aboutData}/>
            <ContactPartView contactManager={projectManager} contactData={contactData} assetsUrl={assetsUrl}/>
            <GalleryPartView galleryData={galleryData} galleryPartData={galleryPartData}/>
            <Overlay/>
            <Loader isPageReady={isPageReady}/>
            <Landing assetsUrl={assetsUrl} landingData={landingData}/>

        </div>
    </>)
}
export default Home
import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import {useParams} from "react-router-dom";
import projectManager from "../../../managers/ProjectManager.jsx";

import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {Swiper, SwiperSlide} from 'swiper/react';
import gsap from "gsap";

// Import Swiper styles
import 'swiper/css';
import Loader from "../../components/Loader.jsx";
import Overlay from "../../components/Overlay.jsx";

const SingleProjectView = (props) => {
    const {id} = useParams();
    const [projectData, setProjectData] = useState(null);
    const elapsedTimeRef = useRef(0);
    const [isPageReady, setIsPageReady] = useState(false)
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(() => {
        if (id) {
            const startTime = Date.now(); // Enregistrez le temps de début

            const fetchProject = async () => {
                try {
                    const project = await projectManager.getProjectByID(id, "projects");
                    setProjectData(project);
                    const elapsedTime = Date.now() - startTime;
                    elapsedTimeRef.current = elapsedTime;
                    setTimeout(() => {
                        setIsPageReady(true);

                    }, 2000 - elapsedTime);

                } catch (error) {
                    console.error("Error fetching project:", error);
                    // Handle error appropriately, e.g., show an error message
                }
            };

            fetchProject();
        }
    }, [id]);

    useEffect(() => {
        if (projectData) {
            projectManager
                .getUrlOfImage(projectData.header_image)
                .then((url) => {
                    if (url) {
                        ////console.log("URL de l'image:", url);
                        setImageUrl(url);
                    } else {
                        ////console.log("L'image n'existe pas ou une erreur s'est produite.");
                    }
                })
                .catch((error) => console.error("Erreur générale:", error));
        }
    }, [projectData]);

    useEffect(() => {
        const textContent = document.getElementsByClassName("SingleProject-content-wrapper")[0]
        const sliderContent = document.getElementsByClassName("SingleProject-slider")[0]

        let textContentheight = textContent.getBoundingClientRect().height
        sliderContent.style.height = "calc(100% - " + textContentheight + "px)"
    }, [projectData]);
    useEffect(() => {

        gsap.registerPlugin(ScrollTrigger);

        const panels = gsap.utils.toArray(".SingleProject-slider-slide");
        const contentContainer = document.querySelector(".SingleProject-content");
        const panelsContainer = document.getElementsByClassName("SingleProject-slider-container")[0];
        const ImageContainer = document.querySelector(".SingleProject-banner--img");
        if (isPageReady) {

            gsap.to(panels, {
                x: () => -1 * (panelsContainer.scrollWidth - window.innerWidth), ease: "none", scrollTrigger: {
                    trigger: contentContainer,
                    start: `bottom bottom`, // end: "bottom top",
                    endTrigger: panelsContainer,
                    pin: contentContainer,
                    end: () => "+=" + (panelsContainer.scrollWidth - innerWidth),
                    scrub: 1,
                    onUpdate: (self) => {
                        const scrollY = self.scroll();
                        const progress = scrollY / (contentContainer.offsetHeight - window.innerHeight);
                        const targetScroll = (panelsContainer.scrollWidth - window.innerWidth) * progress;
                        panelsContainer.scrollLeft = targetScroll;
                    },
                }
            });
        }
    }, [isPageReady]);


    return (<>
        <section className={`SingleProject  ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>

            <div className={"SingleProject-banner"}>
                <img className={"SingleProject-banner--img"} src={`${imageUrl}`}
                     alt={`image d'illustration du projet ${projectData ? projectData.name : ''}`}/>
            </div>
            <div className={"SingleProject-content"}>
                <div className={"SingleProject-content-wrapper"}>
                    <div className={"SingleProject-content-data"}>
                        <div className={"SingleProject-content-data-item"}>
                            <h1 className={"SingleProject-content-data-item--name"}>{projectData ? projectData.name : ''}</h1>
                        </div>
                        <div className={"SingleProject-content-data-item"}>
                            <p className={"SingleProject-content-data-item--date"}>{projectData ? projectData.year : ''}</p>
                            <p className={"SingleProject-content-data-item--client"}>{projectData ? projectData.client : ''}</p>
                        </div>
                        <div className={"SingleProject-content-data-item"}>
                            <p className={"SingleProject-content-data-item--type"}>{projectData ? projectData.project_type : ''}</p>
                        </div>
                        <div className={"SingleProject-content-data-item"}>
                            {projectData ? projectData.tags.map((tag, index) => (<span key={index}
                                                                                       className={"SingleProject-content-data-item--tag"}>[{tag}]</span>)) : ''}
                        </div>
                    </div>
                    <div className={"SingleProject-content-info"}>
                        {projectData ? projectData.contents.map((content, index) => {
                            if (content.type === 'title') {
                                return <h3 key={index}
                                           className={"SingleProject-content-info--title"}>{content.value}</h3>;
                            } else if (content.type === 'description') {
                                return <p key={index}
                                          className={"SingleProject-content-info--description"}>{content.value}</p>;
                            } else {
                                return null; // Handle other types if needed
                            }
                        }) : ''}
                    </div>
                </div>
                <div className={"SingleProject-slider"}>
                    <div className={"SingleProject-slider-container"}>
                        <div className={"SingleProject-slider-slide"}>
                            <img className={"SingleProject-slider-slide--img"} src={`${imageUrl}`}
                                 alt={`image d'illustration du projet ${projectData ? projectData.name : ''}`}/>
                        </div>
                        <div className={"SingleProject-slider-slide"}>
                            <img className={"SingleProject-slider-slide--img"} src={`${imageUrl}`}
                                 alt={`image d'illustration du projet ${projectData ? projectData.name : ''}`}/>
                        </div>
                        <div className={"SingleProject-slider-slide"}>
                            <img className={"SingleProject-slider-slide--img"} src={`${imageUrl}`}
                                 alt={`image d'illustration du projet ${projectData ? projectData.name : ''}`}/>
                        </div>
                        <div className={"SingleProject-slider-slide"}>
                            <img className={"SingleProject-slider-slide--img"} src={`${imageUrl}`}
                                 alt={`image d'illustration du projet ${projectData ? projectData.name : ''}`}/>
                        </div>
                    </div>
                </div>
            </div>

        </section>
        <Overlay isHome={false} isDiff={false}/>
        {/*<Loader isPageReady={isPageReady}/>*/}

    </>);
};

export default SingleProjectView;

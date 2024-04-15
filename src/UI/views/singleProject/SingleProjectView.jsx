import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import {useParams} from "react-router-dom";
import projectManager from "../../../managers/ProjectManager.jsx";

import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {Swiper, SwiperSlide} from 'swiper/react';
import gsap from "gsap";
import {IsMobile, IsWidthLessThanOrEqualToHeight} from "../../../utils/utils.jsx";

// Import Swiper styles
import 'swiper/css';
import HomeLoader from "../../components/HomeLoader.jsx";
import Overlay from "../../components/Overlay.jsx";
import MyLink from "../../components/MyLink.jsx";

const SingleProjectView = (props) => {
    const {id} = useParams();
    const [projectData, setProjectData] = useState(null);
    const elapsedTimeRef = useRef(0);
    const [isPageReady, setIsPageReady] = useState(false)
    const [imageUrl, setImageUrl] = useState(null);
    const [mediaType, setMediaType] = useState("image"); // Default media type is image
    const [sliderImagesInfo, setSliderImagesInfo] = useState([]);

// Utilisez la méthode map pour créer un tableau d'objets avec les informations nécessaires pour chaque image

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

                        projectData.url = url;
                        projectData.media = projectManager.getMediaType(url);

                        setProjectData(projectData)


                    } else {
                        //////console.log("L'image n'existe pas ou une erreur s'est produite.");
                    }
                })
                .catch((error) => console.error("Erreur générale:", error));
        }
    }, [projectData]);
    useEffect(() => {

        if (projectData) {

            const fetchSliderImagesInfo = async () => {
                // console.log(projectData)
                const imagesInfo = await Promise.all(projectData.slider_image.map(async imageUrl => {
                    const imageNameMatch = imageUrl.match(/\/([^_]+)_(.+)\.(\w+)$/);
                    const imageName = imageNameMatch ? imageNameMatch[2] : '';

                    try {
                        const url = await projectManager.getUrlOfImage(imageUrl);
                        return {
                            name: imageName, url: url, mediaType: projectManager.getMediaType(url)
                        };
                    } catch (error) {
                        console.error("Error fetching image URL:", error);
                        return {
                            name: imageName, url: imageUrl, mediaType: 'image'
                        };
                    }
                }));
                setSliderImagesInfo(imagesInfo);
            };
            fetchSliderImagesInfo()
        }


    }, [projectData]);


    useEffect(() => {

        gsap.registerPlugin(ScrollTrigger);

        const panels = gsap.utils.toArray(".SingleProject-slider-slide");
        const contentContainer = document.querySelector(".SingleProject-content");
        const panelsContainer = document.getElementsByClassName("SingleProject-slider-container")[0];
        const ImageContainer = document.querySelector(".SingleProject-banner--img");
        if (isPageReady) {
            if (!IsMobile()) {
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
        }
    }, [isPageReady]);


    return (<>
        <section className={`SingleProject  ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>

            {projectData && projectData.media ? <div className={"SingleProject-banner"}>
                {projectData.media.type === 'image' ? (

                    <img className={"SingleProject-banner--img"} loading={"lazy"} src={projectData.url}
                         alt={`image d'illustration du projet ${projectData ? projectData.name : ''}`}/>) : (
                    <video className={`SingleProject-banner--video`} autoPlay loop muted playsInline>
                        <source className={`SingleProject-banner--video--source`} src={projectData.url}
                                type={`video/${projectData.media.extension}`}/>
                        Your browser does not support the video tag.
                    </video>)}

            </div> : <></>}
            <div className={"SingleProject-content"}>
                <div className={"SingleProject-content-wrapper"}>
                    <div className={"SingleProject-content-header"}>
                        <div className={"SingleProject-content-header-data"}>
                            <div className={"SingleProject-content-header-data-item"}>
                                <h1 className={"SingleProject-content-header-data-item--name"}>{projectData ? projectData.name : ''}</h1>
                            </div>
                            <div className={"SingleProject-content-header-data-item"}>
                                <p className={"SingleProject-content-header-data-item--date"}>{projectData ? projectData.year : ''}</p>
                                <p className={"SingleProject-content-header-data-item--client"}>{projectData ? projectData.client : ''}</p>
                            </div>
                            <div className={"SingleProject-content-header-data-item"}>
                                <p className={"SingleProject-content-header-data-item--type"}>{projectData ? projectData.project_type : ''}</p>
                            </div>


                        </div>
                        <div className={"SingleProject-content-header-tags"}>
                            <h1 className={"SingleProject-content-header-data-item--name"}>{projectData ? projectData.name : ''}</h1>
                            {projectData ? projectData.tags.map((tag, index) => (<span key={index}
                                                                                       className={"SingleProject-content-header-tags--tag"}>[{tag}]</span>)) : ''}
                        </div>
                    </div>
                    {console.log(projectData)}

                    <div className={"SingleProject-content-info"}>
                        {projectData ? projectData.contents.map((content, index) => {
                            if (content.type === 'title') {
                                return <h3 key={index}
                                           className={"SingleProject-content-info--title"}>{content.value}</h3>;
                            } else if (content.type === 'description') {
                                return <p key={index}
                                          className={"SingleProject-content-info--description"}>{content.value}</p>;
                                // } else if (content.type === 'link') {
                                //     return <p key={index}
                                //               className={"SingleProject-content-info--description"}>{content.value}</p>;
                            } else {
                                return null; // Handle other types if needed
                            }
                        }) : ''}
                        {projectData && projectData.site && projectData.site.link && projectData.site.link_text ?
                            <MyLink style={1} text={`${projectData.site.link_text}`}
                                    parentClass={"SingleProject-content-info"}
                                    url={`${projectData.site.link}`}
                                    isTarget={true}></MyLink> : <></>}
                    </div>
                </div>
                <div className={"SingleProject-slider"}>
                    <div className={"SingleProject-slider-container"}>

                        {/*<div className={"SingleProject-slider-slide"}>*/}
                        {/*    {mediaType === 'image' ? (*/}
                        {/*        <img className={"SingleProject-slider-slide--img"} src={`${imageUrl}`}*/}
                        {/*             alt={`image d'illustration du projet ${projectData ? projectData.name : ''}`}/>) : (*/}
                        {/*        <video className={`SingleProject-slider-slide--video`} autoPlay loop muted*/}
                        {/*               playsInline>*/}
                        {/*            <source className={`SingleProject-slider-slide--video--source`}*/}
                        {/*                    src={`${imageUrl}`}*/}
                        {/*                    type={`video/${mediaType === 'mp4' ? 'mp4' : 'ogg'}`}/>*/}
                        {/*            Your browser does not support the video tag.*/}
                        {/*        </video>)}*/}

                        {/*</div>*/}
                        {sliderImagesInfo.length > 0 ? sliderImagesInfo && sliderImagesInfo.map((image, index) => (
                            <div key={index} className={"SingleProject-slider-slide"}>
                                {image.mediaType.type === 'image' ? (
                                    <img className={"SingleProject-slider-slide--img"} loading={"lazy"} src={image.url}
                                         alt={`Image ${index}`}/>) : (
                                    <video className={"SingleProject-slider-slide--video"} autoPlay loop muted
                                           playsInline>
                                        <source src={image.url}
                                                type={`video/${image.mediaType.extension}`}/>
                                        Your browser does not support the video tag.
                                    </video>)}
                            </div>)) : (<>
                        </>)}

                    </div>
                </div>
            </div>

        </section>
        <Overlay isHome={false} isGallery={false} backID={"#projects"}/>
        {/*<Loader isPageReady={isPageReady}/>*/}

    </>);
};

export default SingleProjectView;

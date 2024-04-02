import ProjectData from "../../../models/project/ProjectData.jsx";
import ProjectsView from "./ProjectsView.jsx";
import {useEffect, useLayoutEffect, useState} from "react";
import {Link} from "react-router-dom";

const ProjectPromoteView = ({index, project, manager}) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [mediaType, setMediaType] = useState("image"); // Default media type is image
    const timeout = setTimeout(() => {
        setIsScrolling(false)
    }, 500);
    // This useEffect listens for scrolling events and sets isScrolling to true
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);

            // Clear the timeout when scrolling occurs
            clearTimeout(timeout);
        };

        // Attach scroll event listener to document
        document.addEventListener('scroll', handleScroll);
        let elements = document.querySelectorAll('.Projects-promote-card');

        for (let element of elements) {
            element.addEventListener('click', handleClick);
        }

        // Clean up event listeners when component unmounts
        return () => {
            elements.forEach(element => {
                element.removeEventListener('click', handleClick);
            });
        };

    }, [isScrolling]);

    // This useLayoutEffect listens for click events on .Projects-promote-card elements
    useEffect(() => {

    }, []);

    // Function to handle click events on .Projects-promote-card elements
    const handleClick = (e) => {
        // Check if scrolling is happening
        if (isScrolling) {
            e.preventDefault(); // Prevent default behavior if scrolling is occurring
        } else {
            // Add 'selected' class if not already present
            if (!e.currentTarget.classList.contains('selected')) {
                e.currentTarget.classList.add('selected');
            }
        }
    };
    useEffect(() => {
        // //console.log(project)
        manager
            .getUrlOfImage(project.header_image)
            .then((url) => {
                if (url) {
                    ////console.log("URL de l'image:", url);
                    setImageUrl(url);
                    setMediaType(manager.getMediaType(url));
                } else {
                    ////console.log("L'image n'existe pas ou une erreur s'est produite.");
                }
            })
            .catch((error) => console.error("Erreur générale:", error));
    }, [project.header_image]);

    return (<div className={"Projects-promote-item"}>
        <Link refresh="false" data-id={project.id} className={`Projects-promote-card`} to={'/project/' + project.id}>
            {mediaType === 'image' ? (<img className={`Projects-promote-card--img`} src={`${imageUrl}`}
                                           alt={`Illustration of ${project.name}`}/>) : (
                <video className={`Projects-promote-card--video`} autoPlay loop muted playsInline>
                    <source className={`Projects-promote-card--video--source`} src={`${imageUrl}`}
                            type={`video/${mediaType === 'mp4' ? 'mp4' : 'ogg'}`}/>
                    Your browser does not support the video tag.
                </video>)}
            <div className={`Projects-promote-card-content`}>
                <h2 className={`Projects-promote-card-content--date`}>{project.year}</h2>
                <h1 className={`Projects-promote-card-content--title`}>{project.name}</h1>
                <h3 className={`Projects-promote-card-content--type`}>{project.project_type}</h3>
            </div>
        </Link></div>)
}
export default ProjectPromoteView
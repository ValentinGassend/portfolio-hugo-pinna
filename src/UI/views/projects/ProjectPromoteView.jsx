import ProjectData from "../../../models/project/ProjectData.jsx";
import ProjectsView from "./ProjectsView.jsx";
import {useEffect, useLayoutEffect, useState} from "react";
import {Link} from "react-router-dom";

const ProjectPromoteView = ({index, project, manager}) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [mediaType, setMediaType] = useState("image"); // Default media type is image


    useLayoutEffect(() => {
        let elements = document.querySelectorAll('.Projects-promote-card');
        // console.log(elements);
        for (let element of elements) {
            element.addEventListener('click', function () {
                if (!element.classList.contains('selected')) {
                    element.classList.add('selected');
                }
            });
        }


    }, []);
    useEffect(() => {
        // console.log(project)
        manager
            .getUrlOfImage(project.header_image)
            .then((url) => {
                if (url) {
                    //console.log("URL de l'image:", url);
                    setImageUrl(url);
                    setMediaType(getMediaType(url));
                } else {
                    //console.log("L'image n'existe pas ou une erreur s'est produite.");
                }
            })
            .catch((error) => console.error("Erreur générale:", error));
    }, [project.header_image]);

    const getMediaType = (url) => {
        // Using regular expression to extract file extension
        const extensionMatch = url.match(/\.([^.?#]+)(?:[?#]|$)/i);

        // Checking if a valid extension is found
        if (extensionMatch && extensionMatch[1]) {
            const extension = extensionMatch[1].toLowerCase();

            // Logging for debugging purposes
            console.log('Extension:', extension);
            console.log('Original URL:', url);

            // Checking if the extension corresponds to a video format
            if (extension === 'mp4' || extension === 'mov' || extension === 'avi' || extension === 'wmv') {
                return 'video';
            } else {
                return 'image';
            }
        } else {
            // If no extension is found, default to 'image'
            return 'image';
        }
    };
    return (<div className={"Projects-promote-item"}>
        <Link refresh="true" data-id={project.id} className={`Projects-promote-card`} to={'/project/' + project.id}>
            {mediaType === 'image' ? (
                <img className={`Projects-promote-card--img`} src={`${imageUrl}`} alt={`Illustration of ${project.name}`} />
            ) : (
                <video className={`Projects-promote-card--video`} autoPlay loop muted>
                    <source src={`${imageUrl}`} type={`video/${mediaType === 'mp4' ? 'mp4' : 'ogg'}`} />
                    Your browser does not support the video tag.
                </video>
            )}
            <div className={`Projects-promote-card-content`}>
                <h2 className={`Projects-promote-card-content--date`}>{project.year}</h2>
                <h1 className={`Projects-promote-card-content--title`}>{project.name}</h1>
                <h3 className={`Projects-promote-card-content--type`}>{project.project_type}</h3>
            </div>
        </Link></div>)
}
export default ProjectPromoteView
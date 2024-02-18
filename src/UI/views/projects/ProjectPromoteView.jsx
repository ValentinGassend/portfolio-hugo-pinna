import ProjectData from "../../../models/project/ProjectData.jsx";
import ProjectsView from "./ProjectsView.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const ProjectPromoteView = ({index, project, manager}) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        manager
            .getUrlOfImage(project.header_image)
            .then((url) => {
                if (url) {
                    //console.log("URL de l'image:", url);
                    setImageUrl(url);
                } else {
                    //console.log("L'image n'existe pas ou une erreur s'est produite.");
                }
            })
            .catch((error) => console.error("Erreur générale:", error));
    }, [project.header_image]);
    return (<Link data-id={project.id} className={`Projects-promote-card`} to={'/project/' + project.id}>
        <img className={`Projects-promote-card--img`} src={`${imageUrl}`}
             alt={`image d'illustration du projet ${project.name}`}></img>
        <div className={`Projects-promote-card-content`}>
            <h2 className={`Projects-promote-card-content--date`}>{project.year}</h2>
            <h1 className={`Projects-promote-card-content--title`}>{project.name}</h1>
            <h3 className={`Projects-promote-card-content--type`}>{project.name}</h3>
        </div>
    </Link>)
}
export default ProjectPromoteView
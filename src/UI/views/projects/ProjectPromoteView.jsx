import ProjectData from "../../../models/project/ProjectData.jsx";
import ProjectsView from "./ProjectsView.jsx";
import {useEffect, useLayoutEffect, useState} from "react";
import {Link} from "react-router-dom";

const ProjectPromoteView = ({index, project, manager}) => {
    const [imageUrl, setImageUrl] = useState(null);


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
                } else {
                    //console.log("L'image n'existe pas ou une erreur s'est produite.");
                }
            })
            .catch((error) => console.error("Erreur générale:", error));
    }, [project.header_image]);
    return (<div className={"Projects-promote-item"}>
        <Link refresh="true" data-id={project.id} className={`Projects-promote-card`} to={'/project/' + project.id}>
            <img className={`Projects-promote-card--img`} src={`${imageUrl}`}
                 alt={`image d'illustration du projet ${project.name}`}></img>
            <div className={`Projects-promote-card-content`}>
                <h2 className={`Projects-promote-card-content--date`}>{project.year}</h2>
                <h1 className={`Projects-promote-card-content--title`}>{project.name}</h1>
                <h3 className={`Projects-promote-card-content--type`}>{project.project_type}</h3>
            </div>
        </Link></div>)
}
export default ProjectPromoteView
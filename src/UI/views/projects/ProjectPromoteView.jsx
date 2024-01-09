import ProjectData from "../../../models/project/ProjectData.jsx";
import ProjectsView from "./ProjectsView.jsx";

const ProjectPromoteView = ({index, project}) => {
    return (<a data-id={project.id} className={`Projects-promote-card`} href={project.link}>
        <img className={`Projects-promote-card--img`} src="./vite.svg"
             alt={`image d'illustration du projet ${project.name}`}></img>
        <div className={`Projects-promote-card-content`}>
            <h2 className={`Projects-promote-card-content--date`}>{project.name}</h2>
            <h1 className={`Projects-promote-card-content--title`}>{project.name}</h1>
            <h3 className={`Projects-promote-card-content--type`}>{project.name}</h3>
        </div>
    </a>)
}
export default ProjectPromoteView
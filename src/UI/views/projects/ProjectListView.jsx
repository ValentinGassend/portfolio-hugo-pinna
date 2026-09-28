import ProjectsView from "./ProjectsView.jsx";
import { useEffect, useState } from "react";

const ProjectListView = ({ projects, manager }) => {
    const [projectData, setProjectData] = useState([]);

    useEffect(() => {
        // Reconstruit la liste à chaque changement (au lieu d'ajouter à l'ancienne, ce qui créait des doublons)
        Promise.all(projects.map(project => manager
            .getUrlOfImage(project.header_image)
            .then((url) => ({...project, url, media: manager.getMediaType(url)}))
            .catch((error) => {
                console.error("Erreur générale:", error);
                return project;
            })))
            .then(setProjectData);
    }, [projects, manager]);

    return (
        <div className={`Projects-list EnterSmoothScroll`}>
            {projectData.map((project, index) => (
                <ProjectsView key={project.id} index={index} project={project} />
            ))}
        </div>
    );
};

export default ProjectListView;

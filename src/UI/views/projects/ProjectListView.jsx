import ProjectsView from "./ProjectsView.jsx";
import { useEffect, useState } from "react";

const ProjectListView = ({ projects, manager }) => {
    const [projectData, setProjectData] = useState([]);

    useEffect(() => {
        projects.forEach(project => {
            manager
                .getUrlOfImage(project.header_image)
                .then((url) => {
                    if (url) {
                        project.url = url;
                        project.media = manager.getMediaType(url);
                        setProjectData(prevState => [...prevState, project]);
                    } else {
                        console.log("L'image n'existe pas ou une erreur s'est produite.");
                    }
                })
                .catch((error) => console.error("Erreur générale:", error));
        });
    }, [projects]);

    return (
        <div className={`Projects-list EnterSmoothScroll`}>
            {projectData.map((project, index) => (
                <ProjectsView key={project.id} index={index} project={project} />
            ))}
        </div>
    );
};

export default ProjectListView;

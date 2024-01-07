import ProjectView from "./ProjectView.jsx";
import ProjectData from "../../models/project/ProjectData.jsx";

const ProjectListView = () => {



    return (
        <div>
            {ProjectData.map((project) => (
                <ProjectView key={project.id} project={project}/>
            ))}
        </div>
    );
};

export default ProjectListView;

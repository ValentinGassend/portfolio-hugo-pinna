import ProjectsView from "./ProjectsView.jsx";
import ProjectData from "../../../models/project/ProjectData.jsx";

const ProjectListView = () => {


    return (
        <div className={`Projects-list`}>
            {ProjectData.map((project, index) => (
                <>
                    <ProjectsView key={project.id} index={index} project={project}/></>
            ))}
        </div>
    );
};

export default ProjectListView;

import ProjectData from "../../../models/project/ProjectData.jsx";

import ProjectPromoteView from "./ProjectPromoteView.jsx";

const ProjectsPromoteView = () => {
    return (<div className={`Projects-promote`}>
        {ProjectData.map((project, index) => (<>
            {project.is_promoted == true ? (
                <ProjectPromoteView key={project.id} index={index} project={project}/>) : (<></>)}
        </>))}
    </div>)
}
export default ProjectsPromoteView
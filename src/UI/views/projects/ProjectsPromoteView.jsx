import ProjectPromoteView from "./ProjectPromoteView.jsx";

const ProjectsPromoteView = ({projectsPromoted, manager}) => {
    return (<div className={`Projects-promote`}>
        {projectsPromoted.map((project, index) => (
            <ProjectPromoteView key={project.id} index={index} project={project} manager={manager}/>))}
    </div>)
}
export default ProjectsPromoteView
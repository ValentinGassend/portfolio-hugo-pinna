import ProjectPromoteView from "./ProjectPromoteView.jsx";

const ProjectsPromoteView = ({projectsPromoted, manager}) => {
    //console.log(projectsPromoted)

    return (<div className={`Projects-promote EnterSmoothScroll`}  style={{ '--PromotedProjectLength': projectsPromoted.length }}>
        {projectsPromoted.map((project, index) => (

            <ProjectPromoteView key={project.id} index={index} project={project} manager={manager}/>))}
    </div>)
}
export default ProjectsPromoteView
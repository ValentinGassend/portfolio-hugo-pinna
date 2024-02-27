import ProjectsView from "./ProjectsView.jsx";

const ProjectListView = ({projects}) => {


    return (<div className={`Projects-list`}>
        {projects.map((project, index) => (
            <ProjectsView key={project.id} index={index} project={project}/>))}
    </div>);
};

export default ProjectListView;

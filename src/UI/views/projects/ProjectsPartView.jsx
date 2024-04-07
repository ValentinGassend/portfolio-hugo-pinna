import PartTitle from "../../components/PartTitle.jsx";
import ProjectListView from "./ProjectListView.jsx";
import ProjectsPromoteView from "./ProjectsPromoteView.jsx";
import {useEffect, useState} from "react";

const ProjectsPartView = ({projects, projectManager}) => {
    const [projectsPromoted, setProjectsPromoted] = useState([]);

    useEffect(() => {
        setProjectsPromoted(projectManager.getPromotedProjects(projects));

    }, [projectManager, projects]);
    return (<section className={`Projects`} id={`projects`}>

        <PartTitle ParentClass={"Projects"} titleText={"Projects"}/>
        <ProjectsPromoteView projectsPromoted={projectsPromoted} manager={projectManager}/>
        <ProjectListView projects={projects} manager={projectManager}/>


    </section>)
}
export default ProjectsPartView
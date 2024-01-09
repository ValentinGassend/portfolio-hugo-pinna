import PartTitle from "../../components/PartTitle.jsx";
import ProjectListView from "./ProjectListView.jsx";
import ProjectsPromoteView from "./ProjectsPromoteView.jsx";

const ProjectsPartView = (ProjectData) => {


    return (
        <section className={`Projects`} id={`projects`}>
            <PartTitle ParentClass={"Projects"} titleText={"Projects"}/>
            <ProjectsPromoteView/>
            <ProjectListView/>


        </section>
    )
}
export default ProjectsPartView
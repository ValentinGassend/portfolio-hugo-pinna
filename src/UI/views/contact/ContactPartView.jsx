import PartTitle from "../../components/PartTitle.jsx";
import ContactContentView from "./ContactContentView.jsx";

const ProjectsPartView = (ProjectData) => {


    return (
        <section className={`Contact`} id={`contact`}>
            <PartTitle ParentClass={"Contact"} titleText={"Contact"}/>
            <ContactContentView/>




        </section>
    )
}
export default ProjectsPartView
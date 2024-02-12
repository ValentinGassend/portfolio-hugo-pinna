import PartTitle from "../../components/PartTitle.jsx";
import ContactContentView from "./ContactContentView.jsx";

const ProjectsPartView = ({contactManager,contactData}) => {


    return (
        <section className={`Contact`} id={`contact`}>
            <PartTitle ParentClass={"Contact"} titleText={"Contact"}/>
            <ContactContentView contactManager={contactManager} contactData={contactData}/>




        </section>
    )
}
export default ProjectsPartView
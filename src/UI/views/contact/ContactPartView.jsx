import PartTitle from "../../components/PartTitle.jsx";
import ContactContentView from "./ContactContentView.jsx";

const ProjectsPartView = ({contactManager,contactData, assetsUrl}) => {


    return (
        <section className={`Contact`} id={`contact`}>
            <PartTitle ParentClass={"Contact"} isEnterSmooth={true} titleText={"Contact"}/>
            <ContactContentView contactManager={contactManager} contactData={contactData} assetsUrl={assetsUrl}/>




        </section>
    )
}
export default ProjectsPartView
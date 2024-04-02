import PartTitle from "../../components/PartTitle.jsx";
import AboutContentView from "./AboutContentView.jsx";

const AboutPartView = ({aboutData}) => {


    return (<section className={`About`} id={`about`}>{aboutData ? <>
        <PartTitle ParentClass={"About"} isEnterSmooth={true} titleText={aboutData.title}/>
        <AboutContentView aboutData={aboutData}/>


    </> : <></>}
    </section>)
}
export default AboutPartView
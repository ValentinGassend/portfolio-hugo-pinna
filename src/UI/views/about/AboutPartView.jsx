import PartTitle from "../../components/PartTitle.jsx";
import AboutContentView from "./AboutContentView.jsx";

const AboutPartView = () => {


    return (
        <section className={`About`} id={`about`}>
            <PartTitle ParentClass={"About"} isEnterSmooth={true} titleText={"à propos"}/>
            <AboutContentView/>



        </section>
    )
}
export default AboutPartView
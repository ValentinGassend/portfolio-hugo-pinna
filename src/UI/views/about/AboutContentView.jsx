import ProjectManager from "../../../managers/ProjectManager.jsx";
const AboutContentView = ({aboutData}) => {

    return (
        <div className={`About-content`}>
            <img className={`About-content--img`} {...ProjectManager.imageProps(aboutData.url, "(max-width: 768px) 182px, 420px")} loading={"lazy"} alt={`image de la page ${aboutData.title}`}/>
            <p className={`About-content--text`}>{aboutData.content}</p>
        </div>
    )
}

export default AboutContentView

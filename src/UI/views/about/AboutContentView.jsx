const AboutContentView = ({aboutData}) => {

    return (
        <div className={`About-content`}>
            <img className={`About-content--img`} src={aboutData.url} loading={"lazy"} alt={`image de la page ${aboutData.title}`}/>
            <p className={`About-content--text`}>{aboutData.content}</p>
        </div>
    )
}

export default AboutContentView

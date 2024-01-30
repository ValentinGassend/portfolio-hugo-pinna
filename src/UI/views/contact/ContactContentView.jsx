const ContactContentView = () => {
    return (

        <div className={`Contact-content`}>
            <div className={`Contact-content-wrapper`}>
                <div className={`Contact-content-wrapper-upper`}>
                    <div className={`Contact-content-wrapper-upper-texts`}>
                        <p className={`Contact-content-wrapper-upper-texts--item`}>interested in my profile?</p>
                        <p className={`Contact-content-wrapper-upper-texts--item`}>you can contact me at bla
                            bla </p>
                    </div>
                    <img className={`Contact-content-wrapper-upper--stamp`} src={`./images/content/timbre.png`} alt={`image d'illustration d'un timbre`}/>
                </div>
                <a className={`Contact-content-wrapper--email`} rel="noreferrer" href={`mailto:Hello@hugopinna.com`}
                   target={"_blank"}>Hello@hugopinna.com</a>
            </div>
        </div>
    )
}
export default ContactContentView
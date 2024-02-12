import {useEffect, useState} from "react";

const ContactContentView = ({contactManager, contactData}) => {
    const [letter, setLetter] = useState(null);

    useEffect(() => {
        // console.log(contactData)

        if (contactData && contactData.length > 0) {
            const data = contactData[0];
            // console.log(contactData);
            // console.log(data);
            contactManager.getUrlOfImage(data.letter_part.timbre).then((url) => {
                if (url) {
                    //console.log("URL de l'asset:" + name, url);
                    data.letter_part.timbre = url
                    setLetter(data.letter_part);
                } else {
                    console.log("L'image n'existe pas ou une erreur s'est produite.");
                }
            })
                .catch((error) => {
                    console.error("Erreur générale:", error);
                    return null; // Return null for failed promises
                });
        }
    }, [contactData]);
    return (

        <div className={`Contact-content`}>
            <div className={`Contact-content-wrapper`}>
                <div className={`Contact-content-wrapper-upper`}>
                    <div className={`Contact-content-wrapper-upper-texts`}>
                        <p className={`Contact-content-wrapper-upper-texts--item`}>{letter ? letter.title : ''}</p>
                        <p className={`Contact-content-wrapper-upper-texts--item`}>{letter ? letter.sub_title : ''}</p>
                    </div>
                    <img className={`Contact-content-wrapper-upper--stamp`} src={`${letter ? letter.timbre : ''}`}
                         alt={`image d'illustration d'un timbre`}/>
                </div>
                <a className={`Contact-content-wrapper--email`} rel="noreferrer"
                   href={`mailto:${letter ? letter.email : ''}`}
                   target={"_blank"}>{letter ? letter.email : ''}</a>
            </div>
        </div>)
}
export default ContactContentView
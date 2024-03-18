import {useEffect, useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const ContactContentView = ({contactManager, contactData}) => {
    const [contactInfo, setContactInfo] = useState(null);
    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {
        // //console.log(contactData)

        if (contactData && contactData.length > 0) {
            const data = contactData[0];
            contactManager.getUrlOfImage(data.letter.timbre).then((url) => {
                if (url) {
                    ////console.log("URL de l'asset:" + name, url);
                    data.letter.timbre = url
                    // //console.log(contactInfo)
                    // //console.log(data)

                } else {
                    // //console.log("L'image n'existe pas ou une erreur s'est produite.");
                }
            })
                .catch((error) => {
                    console.error("Erreur générale:", error);
                    return null; // Return null for failed promises
                });

            setContactInfo(data)
        }
    }, [contactData]);

    useEffect(() => {


    }, []);

    return (

        <div className={`Contact-content EnterSmoothScroll`}>
            <div className={`Contact-content-wrapper`}>
                <div className={`Contact-content-wrapper-upper`}>
                    <div className={`Contact-content-wrapper-upper-texts`}>
                        <h2 className={`Contact-content-wrapper-upper-texts--subtitle`}>{contactInfo ? contactInfo.letter.subtitle : ''}</h2>
                        <a className={`Contact-content-wrapper-upper-texts--email`} rel="noreferrer"
                           href={`mailto:${contactInfo ? contactInfo.letter.email : ''}`}
                           target={"_blank"}>{contactInfo ? contactInfo.letter.email : ''}</a>
                        <a className={`Contact-content-wrapper-upper-texts--social`} rel="noreferrer"
                           href={`${contactInfo ? contactInfo.social.link : ''}`}
                           target={"_blank"}>{contactInfo ? contactInfo.social.tag : ''}</a>
                    </div>

                </div>
                <div className={`Contact-content-wrapper-lower`}>
                    <h2 className={`Contact-content-wrapper-lower--title`}>{contactInfo ? contactInfo.letter.title : ''}</h2>
                </div>
            </div>
            <div className={`Contact-content-stamps`}>
                <img className={`Contact-content-stamps--item`}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
                <img className={`Contact-content-stamps--item`}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
                <img className={`Contact-content-stamps--item`}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
                <img className={`Contact-content-stamps--item`}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
            </div>
        </div>)
}
export default ContactContentView
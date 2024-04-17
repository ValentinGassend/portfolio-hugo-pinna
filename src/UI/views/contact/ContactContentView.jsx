import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import AssetNames from "../homePage/AssetNames.js";
import {Player} from "@lottiefiles/react-lottie-player";

const ContactContentView = ({contactManager, contactData, assetsUrl}) => {
    const [contactInfo, setContactInfo] = useState(null);
    const LottieEmailOn = useRef()
    const LottieEmailOff = useRef()
    const LottieSocialOn = useRef()
    const LottieSocialOff = useRef()
    gsap.registerPlugin(ScrollTrigger);


    useEffect(() => {
        // //console.log(contactData)

        if (contactData && contactData.length > 0) {
            const data = contactData[0];
            contactManager.getUrlOfImage(data.letter.timbre).then((url) => {
                if (url) {
                    ////console.log("URL de l'asset:" + name, url);
                    data.letter.timbre = url
                    let email = document.getElementsByClassName("Contact-content-wrapper-upper-texts--email")[0]
                    let emailLottieOn = document.getElementsByClassName("Contact-content-wrapper-upper-texts--email---element-On")[0]
                    let emailLottieOff = document.getElementsByClassName("Contact-content-wrapper-upper-texts--email---element-Off")[0]
                    email.addEventListener('mouseenter', (e) => {
                        if (LottieEmailOn.current && LottieEmailOff.current) {

                            LottieEmailOff.current.setLoop(true);
                            LottieEmailOff.current.setSeeker(1);
                            LottieEmailOff.current.pause();
                            LottieEmailOff.current.setLoop(false);
                            emailLottieOff.style.display = 'none'
                            emailLottieOn.style.display = 'block'
                            LottieEmailOn.current.play();

                        }
                        //     stop le play à 90%
                    })
                    email.addEventListener('mouseleave', (e) => {

                        LottieEmailOn.current.setLoop(true);
                        LottieEmailOn.current.setSeeker(1);
                        LottieEmailOn.current.pause();
                        LottieEmailOn.current.setLoop(false);
                        emailLottieOn.style.display = 'none'
                        emailLottieOff.style.display = 'block'

                        LottieEmailOff.current.play();

                    })

                    let social = document.getElementsByClassName("Contact-content-wrapper-upper-texts--social")[0]
                    let SocialLottieOn = document.getElementsByClassName("Contact-content-wrapper-upper-texts--social---element-On")[0]
                    let SocialLottieOff = document.getElementsByClassName("Contact-content-wrapper-upper-texts--social---element-Off")[0]
                    social.addEventListener('mouseenter', (e) => {
                        if (LottieSocialOn.current && LottieSocialOff.current) {

                            LottieSocialOff.current.setLoop(true);
                            LottieSocialOff.current.setSeeker(1);
                            LottieSocialOff.current.pause();
                            LottieSocialOff.current.setLoop(false);
                            SocialLottieOff.style.display = 'none'
                            SocialLottieOn.style.display = 'block'
                            LottieSocialOn.current.play();

                        }
                        //     stop le play à 90%
                    })
                    social.addEventListener('mouseleave', (e) => {

                        LottieSocialOn.current.setLoop(true);
                        LottieSocialOn.current.setSeeker(1);
                        LottieSocialOn.current.pause();
                        LottieSocialOn.current.setLoop(false);
                        SocialLottieOn.style.display = 'none'
                        SocialLottieOff.style.display = 'block'

                        LottieSocialOff.current.play();

                    })
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
                           target={"_blank"}>
                            <Player
                                src='./lotties/Hover_On.json'
                                className={`Contact-content-wrapper-upper-texts--email---element-On`}
                                ref={LottieEmailOn}
                                keepLastFrame={true}

                            />
                            <Player
                                src='./lotties/Hover_Off.json'
                                className={`Contact-content-wrapper-upper-texts--email---element-Off`}
                                ref={LottieEmailOff}
                                keepLastFrame={true}

                            />
                            {contactInfo ? contactInfo.letter.email : ''}</a>

                        <a className={`Contact-content-wrapper-upper-texts--social`} rel="noreferrer"
                           href={`${contactInfo ? contactInfo.social.link : ''}`}
                           target={"_blank"}>
                            <Player
                                src='./lotties/Hover_On.json'
                                className={`Contact-content-wrapper-upper-texts--social---element-On`}
                                ref={LottieSocialOn}
                                keepLastFrame={true}

                            />
                            <Player
                                src='./lotties/Hover_Off.json'
                                className={`Contact-content-wrapper-upper-texts--social---element-Off`}
                                ref={LottieSocialOff}
                                keepLastFrame={true}

                            />{contactInfo ? contactInfo.social.tag : ''}</a>
                    </div>

                </div>
                <div className={`Contact-content-wrapper-lower`}>
                    <h2 className={`Contact-content-wrapper-lower--title`}>{contactInfo ? contactInfo.letter.title : ''}</h2>
                </div>
            </div>
            <div className={`Contact-content-stamps`}>
                <img className={`Contact-content-stamps--item`}
                     loading={"lazy"}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
                <img className={`Contact-content-stamps--item`}
                     loading={"lazy"}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
                <img className={`Contact-content-stamps--item`}
                     loading={"lazy"}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
                <img className={`Contact-content-stamps--item`}
                     loading={"lazy"}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
                <img className={`Contact-content-stamps--item`}
                     loading={"lazy"}
                     src={`${contactInfo ? contactInfo.letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
            </div>
        </div>)
}
export default ContactContentView
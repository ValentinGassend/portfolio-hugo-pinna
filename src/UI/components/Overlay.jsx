import {Link} from "react-router-dom";
import gsap from "gsap";
import {useEffect} from "react";

const Overlay = ({isHome = true, isGallery = false}) => {

    if (document.querySelector('.SingleProject')) {
        gsap.to(document.querySelector('.Overlay.Others'), {
            opacity: 0, duration: 0.3, scrollTrigger: {
                trigger: '.SingleProject-content', start: 'top top', end: "bottom bottom", overwrite: true, scrub: true,
            },
        });
    }
    let overlayTexts = document.querySelectorAll('.Overlay-wrapper-lower--text');

    overlayTexts.forEach(function (element) {
        element.addEventListener('click', evt => {
            //console.log(element)
            evt.preventDefault()
            gsap.to(window, {
                scrollTo: {y: element.hash, autoKill: false}, duration: 1, overwrite: true,
            });
        });
    });
    let overlayUpperTexts = document.querySelectorAll('p.Overlay-wrapper-upper--text');

    overlayUpperTexts.forEach(function (element) {
        element.addEventListener('click', evt => {
            evt.preventDefault()
            gsap.to(window, {
                scrollTo: {y: 0, autoKill: false}, duration: 1, overwrite: true,
            });
        });
    });


    return (<div
        className={`Overlay ${isHome ? "hidden" : "visible"} ${isHome ? "Home" : "Others"} ${isGallery ? "Diff" : ""}`}>
        {isHome ? (<div className={`Overlay-wrapper`}>
            <div className={`Overlay-wrapper-upper`}>
                <p className={`Overlay-wrapper-upper--text uppercase`}>Hugo Pinna</p>
                <p className={`Overlay-wrapper-upper--text ff2 italic bold`}>Cuillère</p>

            </div>
            <div className={`Overlay-wrapper-lower`}>
                <div className={`Overlay-wrapper-lower-item`}>
                    <a className={`Overlay-wrapper-lower--text uppercase`} href={'#projects'}>Projects</a>
                </div>
                <div className={`Overlay-wrapper-lower-item`}>
                    <a className={`Overlay-wrapper-lower--text uppercase`} href={'#about'}>About</a>
                </div>
                <div className={`Overlay-wrapper-lower-item`}>
                    <a className={`Overlay-wrapper-lower--text uppercase`} href={'#contact'}>Contact</a>
                </div>
                <div className={`Overlay-wrapper-lower-item`}>
                    <p className={`Overlay-wrapper-lower--text`}>Portfolio</p>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`https://www.instagram.com/hugocuillere/`}>@hugocuilliere</a>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`mailto:hello@hugopinna.com`}>hello@hugopinna.com</a>
                    <p className={`Overlay-wrapper-lower--text italic bold miller`}>2024</p>
                </div>
            </div>
        </div>) : (<div className={`Overlay-wrapper`}>
            <div className={`Overlay-wrapper-upper`}>


                <div className={`Overlay-wrapper-upper-item`}>
                    <Link className={`Overlay-wrapper-upper--text uppercase`} to={`../`}>Hugo Pinna {isGallery ? (
                        <span className={"Overlay-wrapper-upper--text-span italic bold"}>
                        the wall</span>) : (<></>)}</Link>
                    <Link className={`Overlay-wrapper-upper--text miller italic bold`} to={`../`}>Cuillère</Link>
                </div>

                <div className={`Overlay-wrapper-upper-item`}>
                    <Link refresh="true" className={`Overlay-wrapper-upper--text uppercase`} to={"../"}>back to the
                        home</Link>
                </div>
            </div>
            <div className={`Overlay-wrapper-lower`}>
                <div className={`Overlay-wrapper-lower-item`}>
                    <p className={`Overlay-wrapper-lower--text`}>Portfolio</p>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`https://www.instagram.com/hugocuillere/`}>@hugocuilliere</a>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`mailto:hello@hugopinna.com`}>hello@hugopinna.com</a>
                    <p className={`Overlay-wrapper-lower--text italic bold miller`}>2024</p>
                </div>
            </div>
        </div>)}

    </div>);
};
export default Overlay
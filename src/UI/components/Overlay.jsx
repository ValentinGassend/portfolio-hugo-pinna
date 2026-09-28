import {Link} from "react-router-dom";
import gsap from "gsap";
import {useEffect} from "react";
import {IsMobile} from "../../utils/utils.jsx";

const Overlay = ({isHome = true, isGallery = false, backID=""}) => {


    useEffect(() => {
        // Liens internes (#projects, #about...) : scroll animé. Les liens externes (Instagram, mailto) restent natifs.
        const onAnchorClick = (evt) => {
            const element = evt.currentTarget;
            if (!element.hash || element.getAttribute('href') !== element.hash) return;
            evt.preventDefault()
            gsap.to(window, {
                scrollTo: {y: element.hash, autoKill: false}, duration: 1, overwrite: true,
            });
        };
        const onTitleClick = (evt) => {
            evt.preventDefault()
            gsap.to(window, {
                scrollTo: {y: 0, autoKill: false}, duration: 1, overwrite: true,
            });
        };

        const anchors = document.querySelectorAll('a.Overlay-wrapper-lower--text, a.Overlay-wrapper-upper--text');
        const titles = document.querySelectorAll('p.Overlay-wrapper-upper--text');
        anchors.forEach(element => element.addEventListener('click', onAnchorClick));
        titles.forEach(element => element.addEventListener('click', onTitleClick));
        return () => {
            anchors.forEach(element => element.removeEventListener('click', onAnchorClick));
            titles.forEach(element => element.removeEventListener('click', onTitleClick));
        };
    }, [isHome]);


    return (<div
        className={`Overlay ${isHome ? "hidden" : "visible"} ${isHome ? "Home" : "Others"}`}>
        {isHome ? (<div className={`Overlay-wrapper`}>
            <div className={`Overlay-wrapper-upper`}>
                <div className={`Overlay-wrapper-upper-item`}>
                    <p className={`Overlay-wrapper-upper--text uppercase`}>Hugo Pinna</p>
                    <p className={`Overlay-wrapper-upper--text miller italic bold`}>Cuillère</p>
                </div>
                {IsMobile() ? <>
                    <div className={`Overlay-wrapper-upper-item`}>
                        <a className={`Overlay-wrapper-upper--text uppercase`} href={'#projects'}>Projets</a>
                    </div>
                    <div className={`Overlay-wrapper-upper-item`}>
                        <a className={`Overlay-wrapper-upper--text uppercase`} href={'#about'}>À propos</a>
                    </div>
                    <div className={`Overlay-wrapper-upper-item`}>
                        <a className={`Overlay-wrapper-upper--text uppercase`} href={'#contact'}>Contact</a>
                    </div>
                </> : <></>}
            </div>
            <div className={`Overlay-wrapper-lower`}>
                {!IsMobile() ? <>
                    <div className={`Overlay-wrapper-lower-item`}>
                        <a className={`Overlay-wrapper-lower--text uppercase`} href={'#projects'}>Projets</a>
                    </div>
                    <div className={`Overlay-wrapper-lower-item`}>
                        <a className={`Overlay-wrapper-lower--text uppercase`} href={'#about'}>À propos</a>
                    </div>
                    <div className={`Overlay-wrapper-lower-item`}>
                        <a className={`Overlay-wrapper-lower--text uppercase`} href={'#contact'}>Contact</a>
                    </div>
                </> : <></>}
                <div className={`Overlay-wrapper-lower-item`}>
                    <p className={`Overlay-wrapper-lower--text`}>Portfolio</p>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`https://www.instagram.com/hugocuillere/`}>@hugocuillere</a>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`mailto:hello@hugopinna.com`}>hello@hugopinna.com</a>
                    <p className={`Overlay-wrapper-lower--text italic bold miller`}>2024</p>
                </div>
            </div>
        </div>) : (<div className={`Overlay-wrapper`}>
            <div className={`Overlay-wrapper-upper`}>


                <div className={`Overlay-wrapper-upper-item`}>
                    <Link className={`Overlay-wrapper-upper--text uppercase`} to={`../${backID}`}>Hugo Pinna
                        {isGallery && !IsMobile() ? (
                            <span className={"Overlay-wrapper-upper--text-span italic bold uppercase"}>
                        the wall</span>) : (<></>)}
                    </Link>
                    <Link className={`Overlay-wrapper-upper--text miller italic bold`} to={`../${backID}`}>Cuillère</Link>
                    {isGallery && IsMobile() ? (
                        <span className={"Overlay-wrapper-upper--text-span italic bold uppercase"}>
                        the wall</span>) : (<></>)}
                </div>

                <div className={`Overlay-wrapper-upper-item`}>

                    <Link refresh="true" className={`Overlay-wrapper-upper--text uppercase AlignR`} to={`../${backID}`}>Retour</Link>


                </div>
            </div>
            <div className={`Overlay-wrapper-lower`}>
                <div className={`Overlay-wrapper-lower-item`}>
                    <p className={`Overlay-wrapper-lower--text`}>Portfolio</p>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`https://www.instagram.com/hugocuillere/`}>@hugocuillere</a>
                    <a className={`Overlay-wrapper-lower--text`}
                       href={`mailto:hello@hugopinna.com`}>hello@hugopinna.com</a>
                    <p className={`Overlay-wrapper-lower--text italic bold miller`}>2024</p>
                </div>
            </div>
        </div>)}

    </div>);
};
export default Overlay
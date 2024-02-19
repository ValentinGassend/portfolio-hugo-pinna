import {Link} from "react-router-dom";

const Overlay = ({isHome = true, isDiff =false}) => {

    return (<div className={`Overlay ${isHome ? "hidden" : "visible"} ${isHome ? "Home" : "Others"} ${isDiff ? "Diff" : ""}`}>
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
                    <p className={`Overlay-wrapper-lower--text`}>@hugocuilliere</p>
                    <p className={`Overlay-wrapper-lower--text`}>hello@hugopinna.com</p>
                    <p className={`Overlay-wrapper-lower--text`}>2024</p>
                </div>
            </div>
        </div>) : (<div className={`Overlay-wrapper`}>
            <div className={`Overlay-wrapper-upper`}>
                <p className={`Overlay-wrapper-upper--text uppercase`}>Hugo Pinna</p>
                <p className={`Overlay-wrapper-upper--text ff2 italic bold`}>Cuillère</p>

            </div>
            <div className={`Overlay-wrapper-lower`}>
                <div className={`Overlay-wrapper-lower-item`}>
                    <Link className={`Overlay-wrapper-lower--text`}  to={"../"}>back to the home</Link>
                </div>
                <div className={`Overlay-wrapper-lower-item`}>
                    <p className={`Overlay-wrapper-lower--text`}>Portfolio</p>
                    <p className={`Overlay-wrapper-lower--text`}>@hugocuilliere</p>
                    <p className={`Overlay-wrapper-lower--text`}>hello@hugopinna.com</p>
                    <p className={`Overlay-wrapper-lower--text`}>2024</p>
                </div>
            </div>
        </div>)}

    </div>);
};
export default Overlay
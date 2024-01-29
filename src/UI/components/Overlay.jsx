const Overlay = ({}) => {

    return (
        <div className={`Overlay hidden`}>
            <div className={`Overlay-wrapper`}>
                <div className={`Overlay-wrapper-upper`}>
                    <p className={`Overlay-wrapper-upper--text uppercase`}>Hugo Pinna</p>
                    <p className={`Overlay-wrapper-upper--text ff2 italic bold`}>Cuillère</p>

                </div>
                <div className={`Overlay-wrapper-lower`}>
                    <div className={`Overlay-wrapper-lower-item`}>
                        <p className={`Overlay-wrapper-lower--text uppercase`}>Projects</p>
                    </div>
                    <div className={`Overlay-wrapper-lower-item`}>
                        <p className={`Overlay-wrapper-lower--text uppercase`}>About</p>
                    </div>
                    <div className={`Overlay-wrapper-lower-item`}>
                        <p className={`Overlay-wrapper-lower--text uppercase`}>Contact</p>
                    </div>
                    <div className={`Overlay-wrapper-lower-item`}>
                        <p className={`Overlay-wrapper-lower--text`}>Portfolio</p>
                        <p className={`Overlay-wrapper-lower--text`}>@hugocuilliere</p>
                        <p className={`Overlay-wrapper-lower--text`}>hello@hugopinna.com</p>
                        <p className={`Overlay-wrapper-lower--text`}>2024</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Overlay
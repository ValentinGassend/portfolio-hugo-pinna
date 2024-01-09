import StyleLinkManager from "../../managers/StyleLinkManager.jsx";

const Link = ({url, text = "", style, parentClass, isTarget = true}) => {

    const linkClass = StyleLinkManager(style)
    return (
        <>
            {url ? (
                <div className={`${parentClass}-link ${linkClass}`}>
                    <a className={`${parentClass}-link--url  ${linkClass}--url`} href={url}
                       target={isTarget ? "_blank" : ""} rel="noopener noreferrer">
                        {text}
                    </a>
                    <span className={`${parentClass}-link--decoration  ${linkClass}--decoration`}></span>
                </div>
            ) : (
                <></>
            )
            }
        </>
    );
};
export default Link

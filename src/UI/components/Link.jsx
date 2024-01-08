import StyleLinkManager from "../../managers/StyleLinkManager.jsx";

const Link = ({url, text = "", style, parentClass}) => {

    const linkClass = StyleLinkManager(style)
    return (
        <>
            {url ? (
                <div className={`${parentClass}-link ${linkClass}`}>
                    <a className={`${parentClass}-link--url`} href={url} target="_blank" rel="noopener noreferrer">
                        {text}
                    </a>
                    <span className={`${parentClass}-link--decoration`}></span>
                </div>
            ) : (
                <></>
            )
            }
        </>
    );
};
export default Link

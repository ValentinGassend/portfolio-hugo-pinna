import Link from "../../components/Link.jsx";

const GalleryContentView = () => {

    return (
        <div className={`Gallery-content`}>
            <div className={`Gallery-content-scroll`}>
                <Link style={1} text={"Check my gallery"} parentClass={"Gallery-content-scroll"} url={'/gallery'}
                      isTarget={false}></Link>
            </div>
        </div>
    )
}

export default GalleryContentView

import PartTitle from "../../components/PartTitle.jsx";
import GalleryContentView from "./GalleryContentView.jsx";

const GalleryPartView = ({galleryData}) => {


    return (
        <section className={`Gallery`} id={`gallery`}>
            <PartTitle ParentClass={"Gallery"} titleText={"Want to see more of my works ?"} scrollable={false}/>
            <GalleryContentView galleryData={galleryData}/>



        </section>
    )
}
export default GalleryPartView
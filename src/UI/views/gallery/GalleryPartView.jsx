import PartTitle from "../../components/PartTitle.jsx";
import GalleryContentView from "./GalleryContentView.jsx";

const GalleryPartView = ({galleryData}) => {


    return (
        <section className={`Gallery`} id={`gallery`}>
            <PartTitle ParentClass={"Gallery"} titleText={"Tu veux voir plus de mes travaux ?"} scrollable={false}/>
            <GalleryContentView galleryData={galleryData}/>



        </section>
    )
}
export default GalleryPartView
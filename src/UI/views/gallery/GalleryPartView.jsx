import PartTitle from "../../components/PartTitle.jsx";
import GalleryContentView from "./GalleryContentView.jsx";

const GalleryPartView = ({galleryData, galleryPartData}) => {


    return (<section className={`Gallery`} id={`gallery`}>
            {galleryPartData && galleryData ? <>
                <PartTitle ParentClass={"Gallery"} titleText={galleryPartData.title} scrollable={false}/>
                <GalleryContentView galleryData={galleryData} galleryPartData={galleryPartData}/>
            </> : <></>}


        </section>)
}
export default GalleryPartView
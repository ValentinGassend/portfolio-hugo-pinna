import Link from "../../components/Link.jsx";
import {useEffect} from "react";

const GalleryContentView = () => {
    useEffect(() => {
        const handleMouseMove = (e) => {
            const items = document.querySelectorAll('.Gallery-content-cards-column--item');

            items.forEach(item => {
                const rect = item.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;

                const angleX = -deltaY * 0.02;
                const shadowPX = -deltaX * 0.02;
                const angleY = deltaX * 0.02;
                const shadowPY = -deltaY * 0.02;

                item.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
                item.style.boxShadow = `${shadowPX}px ${shadowPY}px 24px rgba(0,0,0,0.12)`;
            });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    return (<div className={`Gallery-content`}>
        <div className={`Gallery-content-cards`}>
            <div className={'Gallery-content-cards-column'}>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}>
                    <span className={`Gallery-content-cards-column--item-img`}/>
                    <span className={`Gallery-content-cards-column--item-overlay`}/>
                </div>
            </div>
            <div className={'Gallery-content-cards-column'}>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
            </div>
            <div className={'Gallery-content-cards-column'}>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
            </div>
            <div className={'Gallery-content-cards-column'}>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
            </div>
            <div className={'Gallery-content-cards-column'}>
                <div className={`Gallery-content-cards-column--item`}
                     style={{"--url": 'url("https://picsum.photos/200/300")'}}><span
                    className={`Gallery-content-cards-column--item-img`}/><span
                    className={`Gallery-content-cards-column--item-overlay`}/></div>
            </div>
        </div>

        <div className={`Gallery-content-scroll`}>
            <Link style={1} text={"Check my gallery"} parentClass={"Gallery-content-scroll"} url={'/gallery'}
                  isTarget={false}></Link>
        </div>
    </div>)
}

export default GalleryContentView

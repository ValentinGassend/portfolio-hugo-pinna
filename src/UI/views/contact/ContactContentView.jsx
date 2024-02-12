import {useEffect, useState} from "react";

const ContactContentView = ({contactManager, contactData}) => {
    const [letter, setLetter] = useState(null);

    const [mousePosition, setMousePosition] = useState({x: null, y: null});
    const [mouseForRotation, setMouseForRotation] = useState({x: null, y: null});
    const [shadowPosition, setShadowPosition] = useState({x: null, y: null});

    const handleMouseMove = (event) => {
        const {clientX, clientY} = event;
        setMousePosition({x: clientX, y: clientY});
    };
    const handleMouseGridMove = (event) => {
        console.log(event)
        const {clientX, layerY} = event;
    };

    const calculateTheRotation = () => {
        let rotationY = (mousePosition.y / window.innerHeight) * 20 - 20 / 2;
        let rotationX = (mousePosition.x / window.innerWidth) * 20 - 20 / 2;
        return {x: rotationX, y: rotationY};
    };
    const calculateThePositionShadow = () => {
        let rotationY = (mousePosition.y - (window.innerHeight / 2)) *-0.01;
        let rotationX = (mousePosition.x - (window.innerWidth / 2)) *-0.01;
        return {x: rotationX, y: rotationY};
    };

    useEffect(() => {
        const rotation = calculateTheRotation();
        const positionShadow = calculateThePositionShadow();
        setMouseForRotation(rotation);
        setShadowPosition(positionShadow);
    }, [mousePosition]);

    useEffect(() => {
        // Add event listener to track mouse movement
        document.getElementsByClassName('Contact-content')[0].addEventListener("mousemove", handleMouseMove);
        // Clean up event listener when component unmounts
        return () => {
            document.getElementsByClassName('Contact-content')[0].removeEventListener("mousemove", handleMouseMove);
        };
    }, []);
    useEffect(() => {
        // console.log(contactData)

        if (contactData && contactData.length > 0) {
            const data = contactData[0];
            // console.log(contactData);
            // console.log(data);
            contactManager.getUrlOfImage(data.letter_part.timbre).then((url) => {
                if (url) {
                    //console.log("URL de l'asset:" + name, url);
                    data.letter_part.timbre = url
                    setLetter(data.letter_part);
                } else {
                    console.log("L'image n'existe pas ou une erreur s'est produite.");
                }
            })
                .catch((error) => {
                    console.error("Erreur générale:", error);
                    return null; // Return null for failed promises
                });
        }
    }, [contactData]);
    return (<div className={`Contact-content`} style={{
        '--mouseRY': mouseForRotation.y + "deg",
        '--mouseRX': mouseForRotation.x + "deg",
        '--shadowPY': shadowPosition.y + "px",
        '--shadowPX': shadowPosition.x + "px"
    }}>
        <div className={`Contact-content-wrapper`}>
            <div className={`Contact-content-wrapper-upper`}>
                <div className={`Contact-content-wrapper-upper-texts`}>
                    <p className={`Contact-content-wrapper-upper-texts--item`}>{letter ? letter.title : ''}</p>
                    <p className={`Contact-content-wrapper-upper-texts--item`}>{letter ? letter.sub_title : ''}</p>
                </div>
                <img className={`Contact-content-wrapper-upper--stamp`} src={`${letter ? letter.timbre : ''}`}
                     alt={`image d'illustration d'un timbre`}/>
            </div>
            <a className={`Contact-content-wrapper--email`} rel="noreferrer"
               href={`mailto:${letter ? letter.email : ''}`}
               target={"_blank"}>{letter ? letter.email : ''}</a>
        </div>
    </div>)
}
export default ContactContentView
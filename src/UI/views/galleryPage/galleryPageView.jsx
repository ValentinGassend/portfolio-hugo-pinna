import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import projectManager from "../../../managers/ProjectManager.jsx";

import gsap from "gsap";

// Import Swiper styles
import 'swiper/css';
import Loader from "../../components/Loader.jsx";
import Overlay from "../../components/Overlay.jsx";
import {IsMobile} from "../../../utils/utils.jsx";

const GalleryPageView = () => {
    const [galleryData, setGalleryData] = useState(null);
    const elapsedTimeRef = useRef(0);
    const [isPageReady, setIsPageReady] = useState(false)
    const [isAtRightEdge, setIsAtRightEdge] = useState(false);
    let [scaleValue, setScaleValue] = useState(1)

    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [containerPosition, setContainerPosition] = useState({x: 0, y: 0});
    useEffect(() => {
        const startTime = Date.now(); // Enregistrez le temps de début
        //
        const fetchProject = async () => {
            try {
                const projects = await projectManager.getProjectsFromFirebase("gallery");
                setGalleryData(projects);
                const elapsedTime = Date.now() - startTime;
                elapsedTimeRef.current = elapsedTime;
                setTimeout(() => {
                    setIsPageReady(true);

                }, 2000 - elapsedTime);
                //
            } catch (error) {
                console.error("Error fetching project:", error);
                // Handle error appropriately, e.g., show an error message
            }
        };
        fetchProject();

    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const newData = await Promise.all(galleryData.map(async (item) => {
                console.log(item)
                if (item.visual) {
                    try {
                        const url = await projectManager.getUrlOfImage(item.visual);

                        const media = projectManager.getMediaType(url);
                        console.log(url)
                        console.log(media)
                        return {...item, url, media};
                    } catch (error) {
                        console.error("Erreur lors de la récupération de l'URL de l'image:", error);
                        return item;
                    }
                } else {
                    return item;
                }
            }));
            setGalleryData(newData);
        };

        if (galleryData) {
            fetchData();
        }

    }, [isPageReady]);
    useEffect(() => {
        const handleMouseMove = (event) => {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            setMousePosition({x: -mouseX, y: -mouseY});
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {

        const handleWindowResize = () => {
            const container = containerRef.current;
            if (container) {
                const newX = (window.innerWidth - container.offsetWidth) / 2;
                const newY = (window.innerHeight - container.offsetHeight) / 2;
                setContainerPosition({x: newX, y: newY});
            }
        };

        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);
    useEffect(() => {
        if (isPageReady && !IsMobile()) {
            // Calculate new position based on mouse position
            const container = document.querySelector('.GalleryPage-container');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const {x, y} = mousePosition;
                const newX = x / window.innerWidth * 50 + 25;
                const newY = y / window.innerHeight * 80 + 40;
                setContainerPosition({x: newX, y: newY});
            }
        }
    }, [isPageReady, mousePosition]);
    useEffect(() => {
        const updateContainerPosition = () => {
            if (isPageReady && !IsMobile()) {
                gsap.to(containerRef.current, {
                    x: containerPosition.x + "%", y: containerPosition.y + "%", ease: "power1.out", duration: 0.5
                });
            }
            // requestAnimationFrame(updateContainerPosition);
        };
        updateContainerPosition();
    }, [isPageReady, containerPosition]);
    useEffect(() => {
        if (isPageReady && galleryData[0].media) {

            if (scaleValue >= 0.25 && scaleValue <= 2.5 && !IsMobile()) {
                document.addEventListener('wheel', toogleZoom)
                document.querySelector('.GalleryPage-container').style.scale = scaleValue
            }
        }

    }, [scaleValue, isPageReady, galleryData]);

    function from4To8(total) {
        let middle;
        let sides;
        const half = total / 2;
        let quart;

        if (Number.isInteger(half)) {
            quart = total / 4;
            if (Number.isInteger(quart)) {
                middle = half;
                sides = quart;
            } else {
                middle = Math.trunc(half) + 1; // Adjust middle for odd numbers
                sides = Math.floor((total - (Math.trunc(half) + 1)) / 2);
            }
        } else {
            quart = Math.trunc(half) / 2;
            if (Number.isInteger(quart)) {
                middle = Math.trunc(half) + 1;
                sides = quart;
            } else {
                middle = Math.trunc(half); // Adjust middle for odd numbers
                sides = Math.floor((total - middle) / 2); // Adjust sides for even numbers
            }
        }
        return [middle, sides, half, quart];

    }


    const generateGrid = (totalItems) => {
        let grid = [];

        let ImageIndex = 0;
        grid.push([], [], []);
        if (totalItems <= 10) {

            const returnValues = from4To8(totalItems);
            let middle = returnValues[0];
            let firstSides = returnValues[1];
            let middleGrid
            // Check if half is modulable by (number of columns in grid + 2)
            if (middle / (grid.length + 2) >= 1) {
                grid.unshift([], []);
                middleGrid = Math.trunc(grid.length / 2)

                const returnValues = from4To8(middle);
                middle = returnValues[0];
                let sides = returnValues[1];
                for (let i = 0; i < sides; i++) {
                    grid[0].push("item");
                    grid[grid.length - 1].push("item"); // Push to the last column as well
                }
                for (let j = 0; j < middle; j++) {
                    grid[middleGrid].push("item");
                }
            } else {
                middleGrid = Math.trunc(grid.length / 2)

                for (let j = 0; j < middle; j++) {
                    grid[middleGrid].push("item");

                }
            }

            for (let i = 0; i < firstSides; i++) {
                grid[middleGrid - 1].push("item");
                grid[middleGrid + 1].push("item"); // Push to the last column as well
            }

            // //console.log("=========================");
            // //console.log("résultat pour ", totalItems);
            // //console.log("middle", middle);
            // //console.log("sides", firstSides);
            // //console.log("grille de " + totalItems, grid);
            // //console.log("=========================");
        } else {

            const returnValues = from4To8(totalItems);
            let middle = returnValues[0];
            let firstSides = returnValues[1];
            let sides
            let middleGrid
            // Check if half is modulable by (number of columns in grid + 2)
            if (middle / (grid.length + 2) > 1) {
                grid.unshift([], []);
                middleGrid = Math.trunc(grid.length / 2)

                const returnValues = from4To8(middle);
                middle = returnValues[0];
                sides = returnValues[1];


                if (middle <= firstSides) {

                    if ((middle - firstSides) >= (middle - sides)) {
                        middle = middle + 2
                        sides--
                    } else {

                        middle = middle + 2
                        firstSides--
                    }

                    if (middle / (grid.length) > 1) {
                        let secondSides = sides;

                        grid.unshift([], []);
                        middleGrid = Math.trunc(grid.length / 2)

                        const returnValues = from4To8(middle);
                        middle = returnValues[0];
                        sides = returnValues[1];

                        // //console.log("middle", middle);
                        // //console.log("firstSides", firstSides);
                        // //console.log("secondSides", secondSides);
                        if (middle <= firstSides) {

                            if ((middle - firstSides) >= (middle - secondSides)) {
                                middle = middle + 2
                                secondSides--
                            } else {

                                middle = middle + 2
                                sides--
                            }


                        }


                        for (let i = 0; i < sides; i++) {
                            grid[0].push("item");
                            grid[grid.length - 1].push("item"); // Push to the last column as well
                        }

                        for (let i = 0; i < firstSides; i++) {
                            grid[middleGrid - 1].push("item");
                            grid[middleGrid + 1].push("item");  // Push to the last column as well
                        }
                        for (let i = 0; i < secondSides; i++) {
                            grid[middleGrid - 2].push("item");
                            grid[middleGrid + 2].push("item");  // Push to the last column as well
                        }
                        for (let j = 0; j < middle; j++) {
                            grid[middleGrid].push("item");
                        }

                        // //console.log("=========================");
                        // //console.log("résultat pour ", totalItems);
                        // //console.log("middle", middle);
                        // //console.log("firstSides", firstSides);
                        // //console.log("secondSides", secondSides);
                        // //console.log("sides", sides);
                        // //console.log("grille de " + totalItems, grid);
                        // //console.log("=========================");
                    }

                } else {
                    if (middle <= firstSides) {
                        // //console.log("before twist ")
                        // //console.log("middle", middle);
                        // //console.log("firstSides", firstSides);
                        // //console.log("sides", sides);

                        if ((middle - firstSides) >= (middle - sides)) {
                            middle = middle + 2
                            sides--
                        } else {

                            middle = middle + 2
                            firstSides--
                        }

                        // //console.log("after twist ")
                        // //console.log("middle", middle);
                        // //console.log("firstSides", firstSides);
                        // //console.log("sides", sides);

                    }

                    for (let i = 0; i < sides; i++) {
                        grid[0].push("item");
                        grid[grid.length - 1].push("item"); // Push to the last column as well
                    }
                    for (let j = 0; j < middle; j++) {
                        grid[middleGrid].push("item");
                    }

                    for (let i = 0; i < firstSides; i++) {
                        grid[middleGrid - 1].push("item");
                        grid[middleGrid + 1].push("item"); // Push to the last column as well
                    }

                    // //console.log("=========================");
                    // //console.log("résultat pour ", totalItems);
                    // //console.log("middle", middle);
                    // //console.log("firstSides", firstSides);
                    // //console.log("sides", sides);
                    // //console.log("grille de " + totalItems, grid);
                    // //console.log("=========================");
                }
            } else {
                middleGrid = Math.trunc(grid.length / 2)

                for (let j = 0; j < middle; j++) {
                    grid[middleGrid].push("item");

                }
            }
        }
        return (<>
            {grid.map((subArray, subIndex) => (<div key={subIndex} className="GalleryPage-container-column">
                {subArray.map((item, index) => {
                    let url = galleryData[ImageIndex].url
                    let media = galleryData[ImageIndex].media
                    ImageIndex++
                    return (<div key={index} className="GalleryPage-container-column-item">
                        {media.type === "image" ? (<img
                            className={`GalleryPage-container-column-item--img`}
                            src={url}
                            alt={'image de la page contenu'}
                        />) : media.type === "video" ? (<video
                            className={`GalleryPage-container-column-item--video`}
                            autoPlay loop muted playsInline
                        >
                            <source src={url} type={`video/${media.extension}`}/>
                            Your browser does not support the video tag.
                        </video>) : (<></>)}
                    </div>);
                })}
            </div>))}
        </>);
    };

    function toogleZoom(e) {
        const decreaseFactor = 1000 / (scaleValue); // Plus la valeur de scaleValue est grande, plus le facteur de diminution est petit
        const increaseFactor = 1000 / (scaleValue); // Plus la valeur de scaleValue est grande, plus le facteur de diminution est petit

        if (e.deltaY > 0) {
            setScaleValue(scaleValue - e.deltaY / increaseFactor)
        } else if (e.deltaY < 0) {
            setScaleValue(scaleValue - e.deltaY / decreaseFactor)
        }
    }

    return (<> {galleryData && galleryData[0].media ? <>
        {IsMobile() ? <section className={`GalleryPage Mobile ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>
            <div ref={containerRef}
                 className={`GalleryPage-container Mobile`}>
                {galleryData ? galleryData.map((item, index) => (
                    <div key={index} className="GalleryPage-container-item">

                        {item.media.type === "image" ? (<img
                            className={`GalleryPage-container-item--img`}
                            src={item.url}
                            alt={'image de la page contenu'}
                        />) : item.media.type === "video" ? (<video
                            className={`GalleryPage-container-item--video`}
                            autoPlay loop muted playsInline
                        >
                            <source src={item.url} type={`video/${item.media.extension}`}/>
                            Your browser does not support the video tag.
                        </video>) : (<></>)}
                    </div>)) : <> </>}
            </div>
        </section> : <section className={`GalleryPage ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>
            <div ref={containerRef} className={`GalleryPage-container`}
                 style={{left: `${containerPosition.x}%`, top: `${containerPosition.y}%`}}>
                {galleryData ? generateGrid(galleryData.length) : <></>}
            </div>


        </section>}</> : <></>}
        <Overlay isHome={false} isGallery={true}/>

    </>);
};

export default GalleryPageView;

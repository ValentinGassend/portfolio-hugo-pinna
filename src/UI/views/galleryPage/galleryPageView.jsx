import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import {useParams} from "react-router-dom";
import projectManager from "../../../managers/ProjectManager.jsx";

import {ScrollTrigger} from "gsap/ScrollTrigger";
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';
import {Swiper, SwiperSlide} from 'swiper/react';
import gsap from "gsap";

// Import Swiper styles
import 'swiper/css';
import Loader from "../../components/Loader.jsx";
import Overlay from "../../components/Overlay.jsx";

const GalleryPageView = () => {
    const [projectData, setProjectData] = useState(null);
    const elapsedTimeRef = useRef(0);
    const [isPageReady, setIsPageReady] = useState(false)
    const [imageUrl, setImageUrl] = useState(null);
    const [isAtRightEdge, setIsAtRightEdge] = useState(false);

    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [containerPosition, setContainerPosition] = useState({x: 0, y: 0});
    useEffect(() => {
        const startTime = Date.now(); // Enregistrez le temps de début
        //
        const fetchProject = async () => {
            try {
                const project = await projectManager.getProjectsFromFirebase("gallery");
                setProjectData(project);
                console.log(project)
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
        if (projectData) {
            projectManager
                .getUrlOfImage(projectData.visual)
                .then((url) => {
                    if (url) {
                        //// console.log("URL de l'image:", url);
                        setImageUrl(url);
                    } else {
                        //// console.log("L'image n'existe pas ou une erreur s'est produite.");
                    }
                })
                .catch((error) => console.error("Erreur générale:", error));
        }
    }, [projectData]);
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
        if (isPageReady) {
            // Calculate new position based on mouse position
            const container = document.querySelector('.GalleryPage-container');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const {x, y} = mousePosition;
                const newX = x / window.innerWidth * 50 + 50;
                const newY = y / window.innerHeight * 80 + 40;
                setContainerPosition({x: newX, y: newY});
            }
        }
    }, [isPageReady, mousePosition]);
    useEffect(() => {
        const updateContainerPosition = () => {
            if (isPageReady) {
                gsap.to(containerRef.current, {
                    x: containerPosition.x + "%", y: containerPosition.y + "%", ease: "power1.out", duration: 5
                });
            }
            // requestAnimationFrame(updateContainerPosition);
        };
        updateContainerPosition();
    }, [isPageReady, containerPosition]);

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

            // console.log("=========================");
            // console.log("résultat pour ", totalItems);
            // console.log("middle", middle);
            // console.log("sides", firstSides);
            // console.log("grille de " + totalItems, grid);
            // console.log("=========================");
        } else if (totalItems <= 32) {

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

                        // console.log("middle", middle);
                        // console.log("firstSides", firstSides);
                        // console.log("secondSides", secondSides);
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

                        // console.log("=========================");
                        // console.log("résultat pour ", totalItems);
                        // console.log("middle", middle);
                        // console.log("firstSides", firstSides);
                        // console.log("secondSides", secondSides);
                        // console.log("sides", sides);
                        // console.log("grille de " + totalItems, grid);
                        // console.log("=========================");
                    }

                } else {
                    if (middle <= firstSides) {
                        // console.log("before twist ")
                        // console.log("middle", middle);
                        // console.log("firstSides", firstSides);
                        // console.log("sides", sides);

                        if ((middle - firstSides) >= (middle - sides)) {
                            middle = middle + 2
                            sides--
                        } else {

                            middle = middle + 2
                            firstSides--
                        }

                        // console.log("after twist ")
                        // console.log("middle", middle);
                        // console.log("firstSides", firstSides);
                        // console.log("sides", sides);

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

                    // console.log("=========================");
                    // console.log("résultat pour ", totalItems);
                    // console.log("middle", middle);
                    // console.log("firstSides", firstSides);
                    // console.log("sides", sides);
                    // console.log("grille de " + totalItems, grid);
                    // console.log("=========================");
                }
            } else {
                middleGrid = Math.trunc(grid.length / 2)

                for (let j = 0; j < middle; j++) {
                    grid[middleGrid].push("item");

                }
            }

        }
        return (<>
            {/* Generate grid items */}
            {grid.map((subArray, subIndex) => (<div key={subIndex} className="GalleryPage-container-column">
                {subArray.map((item, index) => (<div key={index} className="GalleryPage-container-column-item">
                    <img className={`GalleryPage-container-column-item--img`}
                         src={'https://picsum.photos/600/1000'} alt={'image de la page contenu'}/>
                </div>))}
            </div>))}
        </>);
    };

    return (<>
        <section className={`GalleryPage ${isPageReady ? ("isPageReady") : ("isNotPageReady")}`}>
            <div ref={containerRef} className={`GalleryPage-container`}
                 style={{left: `${containerPosition.x}%`, top: `${containerPosition.y}%`}}>
                {generateGrid(projectData.length)}
            </div>


            <Overlay isHome={false} isDiff={true}/>
        </section>

        <Loader isPageReady={isPageReady}/>

    </>);
};

export default GalleryPageView;

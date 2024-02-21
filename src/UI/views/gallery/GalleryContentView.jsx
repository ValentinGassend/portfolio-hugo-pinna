import Link from "../../components/Link.jsx";
import React, {useEffect} from "react";

const GalleryContentView = ({galleryData}) => {
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
            {grid.map((subArray, subIndex) => (
                <div key={subIndex} className="Gallery-content-cards-column">
                {subArray.map((item, index) => {
                        let url = galleryData[ImageIndex].url
                        ImageIndex++
                        return (
                            <div key={ImageIndex} className={`Gallery-content-cards-column--item`}
                                 style={{"--url": `url("${url}")`}}>
                                <span className={`Gallery-content-cards-column--item-img`}/>
                                <span className={`Gallery-content-cards-column--item-overlay`}/>
                            </div>
                        )
                    }
                )}
            </div>))}
        </>);
    };





    return (<div className={`Gallery-content`}>
        <div className={`Gallery-content-cards`}>
            {galleryData ? generateGrid(9) : <></>}
        </div>

        <div className={`Gallery-content-scroll`}>
            <Link style={1} text={"Check my gallery"} parentClass={"Gallery-content-scroll"} url={'/gallery'}
                  isTarget={false}></Link>
        </div>
    </div>)
}

export default GalleryContentView

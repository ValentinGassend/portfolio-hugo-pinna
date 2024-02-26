import Link from "../../components/Link.jsx";
import React, {useEffect, useRef, useState} from "react";

const GalleryContentView = ({galleryData}) => {
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [urls, setUrls] = useState([]);


    useEffect(() => {
        // Collect data first and then update state once

        if (galleryData) {

            let newNumberOfItems = 0;
            const newUrls = [];

            console.log(galleryData)
            galleryData.forEach(item => {
                // console.log(item)

                if (item.url_home_visual) {
                    newUrls.push(item.url_home_visual);
                    newNumberOfItems++;
                    console.log(newNumberOfItems)
                }
            });

            // Update state once with the collected data
            setNumberOfItems(newNumberOfItems);
            setUrls(newUrls);
        }

    }, [galleryData]);


    useEffect(() => {
        console.log("urls", urls)
        console.log("numberOfItems", numberOfItems)
    }, [urls, numberOfItems]);
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


    useEffect(() => {
        console.log(galleryData)

    }, [galleryData]);

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

    const generateGrid = (totalItems, urls) => {
        let grid = [];

        let ImageIndex = 0;
        grid.push([], [], []);
        if (totalItems > 9) {
            totalItems = 9
        }

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


        return (<>
            {/* Generate grid items */}
            {grid.map((subArray, subIndex) => (<div key={subIndex} className="Gallery-content-cards-column">
                {subArray.map((item, index) => {
                    let url = urls[ImageIndex]
                    ImageIndex++
                    return (<div key={ImageIndex} className={`Gallery-content-cards-column--item`}
                                 style={{"--url": `url("${url}")`}}>
                        <span className={`Gallery-content-cards-column--item-img`}/>
                        <span className={`Gallery-content-cards-column--item-overlay`}/>
                    </div>)

                })}
            </div>))}
        </>);
    };


    return (<div className={`Gallery-content`}>
        <div className={`Gallery-content-cards`}>
            {numberOfItems > 3 ? generateGrid(numberOfItems, urls) : <></>}

        </div>


        <div className={`Gallery-content-scroll`}>
            <Link  refresh="true" style={1} text={"Check my gallery"} parentClass={"Gallery-content-scroll"} url={'/gallery'}
                  isTarget={false}></Link>
        </div>
    </div>)
}

export default GalleryContentView

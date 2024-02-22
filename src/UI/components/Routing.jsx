import React, {useRef} from "react";
import {TransitionGroup, Transition} from "react-transition-group";
import {useLocation, useParams} from "react-router-dom";
import {gsap} from "gsap";
import GalleryPageView from "../views/galleryPage/galleryPageView.jsx";
import SingleProjectView from "../views/singleProject/SingleProjectView.jsx";
import Home from "../views/homePage/Home.jsx";

const Routing = () => {
    const parentNode = useRef(null);
    const location = useLocation();
    const params = useParams(); // Accessing route parameters

    const onEnterHandler = (node) => {
        // console.log("onEnter");
        // console.log(node);
        gsap.killTweensOf(node);
        gsap.killTweensOf(window);
        gsap.killTweensOf(document);
        // // Set initial position and styles
        // // gsap.set(node, {
        // //     autoAlpha: 0, opacity:0,
        // // });
        // // Create the animation for the incoming component
        // gsap.to(node, {
        //     duration: 0.4,
        //     autoAlpha: 1,
        //     opacity: 1,
        // });
    };

    const onExitHandler = (node) => {
        console.log("onExit");
        console.log(node);
        let projectCard = node.querySelector(".Projects-promote-card.selected");
        let elementsToHide = document.body.querySelectorAll(":not(.Projects-promote-card--img)");
        elementsToHide.forEach(element => {
            if (!element.contains(projectCard) && !element.classList.contains('Projects-promote-card--img')) {
                if (element.classList.contains('home') || element.closest('.Home')) {
                    gsap.killTweensOf(element);
                    gsap.set(element, {
                        autoAlpha: 1, opacity: 1,
                    });
                    gsap.to(element, {
                        duration: 1, autoAlpha: 0, opacity: 0,
                    });
                }
            }
        });
        // Set initial position and styles
        // Create the animation for the incoming component
        // gsap.to(node, {
        //     duration: 0.4, autoAlpha: 1, opacity: 1,
        // });


        gsap.set(projectCard, {
            scale: 1
        });
        let cardTop = projectCard.getBoundingClientRect().y;
        let cardLeft = projectCard.getBoundingClientRect().x;
        let cardB = projectCard.getBoundingClientRect();
        console.log(cardB)
        gsap.to(projectCard, {
            transform: `translateY(-` + cardTop + `px) translateX(-` + cardLeft + `px)`,
            width: "100vw",
            height: "50vh",
            onStart: function () {
                projectCard.classList.add('transitioning');
            },
            onComplete: () => {
                window.scrollTo(0, 0)
                gsap.killTweensOf(projectCard);
                // node.parentNode.removeChild(node);
            }
        });

    };

    let componentToRender;
    switch (location.pathname) {
        case "/":
            componentToRender = <Home/>;
            break;
        case "/gallery":
            componentToRender = <GalleryPageView/>;
            break;
        case `/project/${params.id}`: // Use the id parameter from the route
            componentToRender = <SingleProjectView/>;
            break;
        default:
            componentToRender = <NotFoundPage/>;
    }

    return (<>
        <TransitionGroup component={null}>
            <Transition
                timeout={1500}
                key={location.pathname}
                onExit={onExitHandler}
                onEnter={onEnterHandler}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                {componentToRender}
            </Transition>
        </TransitionGroup>
    </>);
};

export default Routing;

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

        console.log("onEnter");
        console.log(node);

        // jouer sur l'opacity en arrivé quand le get à la BDD est bon


    };

    const onExitHandler = (node) => {
        console.log("onExit");
        console.log(node);

        if (node === document.getElementsByClassName('Home')[0] && node.querySelector(".Projects-promote-card.selected")) {
            let projectCard = node.querySelector(".Projects-promote-card.selected");
            console.log(projectCard)
            let elementsToHide = document.body.querySelectorAll(":not(.Projects-promote-card--img)");
            elementsToHide.forEach(element => {
                if (!element.contains(projectCard) && !element.classList.contains('Projects-promote-card--img')) {
                    if (element.classList.contains('home') || element.closest('.Home')) {
                        gsap.killTweensOf(element);
                        gsap.set(element, {
                            opacity: 1,
                        });
                        gsap.to(element, {
                            duration: 1, opacity: 0, onCompleteParams: [node], onComplete: (node) => {
                                gsap.killTweensOf(node);
                                gsap.killTweensOf(window);
                                gsap.killTweensOf(document);
                            }
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
            gsap.to(projectCard, {
                transform: `translateY(-` + cardTop + `px)`, // y:0,
                x: 0, width: "100vw", height: "50vh", onStart: function () {
                    projectCard.classList.add('transitioning');
                }, onUpdateParams: [projectCard], onUpdate: () => {
                    let cardB = projectCard.getBoundingClientRect();
                    if (cardB.y <= 0) {
                        // Animation terminée, position y est inférieure ou égale à zéro
                        window.scrollTo(0, 0);
                        gsap.killTweensOf(projectCard);
                        // Effectuez ici d'autres actions si nécessaire
                    }
                }, onComplete: () => {
                    window.scrollTo(0, 0)
                    gsap.killTweensOf(projectCard);
                    // node.parentNode.removeChild(node);
                }
            });
        } else {
            gsap.fromTo(node, {
                autoAlpha: 1, opacity: 1,
            }, {
                duration: 0.3, autoAlpha: 0, opacity: 0
            });
            //     creat ".loader-firstPart" & ".loader-secondPart"
            // Create ".loader-firstPart" element
            // Créer les éléments de transition
            if (document.querySelector('.Transition-firstPart')) {
                // Supprimer l'élément s'il existe déjà
                document.querySelector('.Transition-firstPart').remove();
            }
            if (document.querySelector('.Transition-secondPart')) {
                // Supprimer l'élément s'il existe déjà
                document.querySelector('.Transition-secondPart').remove();
            }
            if (document.querySelector('.Transition-thirdPart')) {
                // Supprimer l'élément s'il existe déjà
                document.querySelector('.Transition-thirdPart').remove();
            }
            var transitionFirstPart = document.createElement('div');
            var transitionSecondPart = document.createElement('div');
            var transitionThirdPart = document.createElement('div');

// Ajouter les classes aux éléments de transition
            transitionFirstPart.className = 'Transition-firstPart';
            transitionSecondPart.className = 'Transition-secondPart';
            transitionThirdPart.className = 'Transition-thirdPart';

// Ajouter les éléments de transition à la div de transition
            var transition = document.createElement('div');
            transition.className = 'Transition';
            transition.appendChild(transitionFirstPart);
            transition.appendChild(transitionSecondPart);
            transition.appendChild(transitionThirdPart);

// Ajouter la div de transition au body du document
            document.body.appendChild(transition);

// Utiliser GSAP pour créer une animation stagger
            gsap.fromTo([transitionFirstPart, transitionSecondPart, transitionThirdPart], {
                y: "100%"
            }, {
                y: "-100%", duration: 0.8, stagger: 0.1, // Délai entre chaque élément
                ease: "power4.linear" // Animation easing
            });

        }
        // if (document.getElementsByClassName("Overlay")[0]) {
        //     const overlay = document.getElementsByClassName("Overlay")[0];
        //     gsap.fromTo(overlay, {
        //         autoAlpha: 1, opacity: 1,
        //     }, {
        //         duration: 0.3, autoAlpha: 0, opacity: 0
        //     });
        // }
    };

    let componentToRender;
    switch (location.pathname) {
        case "/":
            componentToRender = <Home/>;
            break;
        case "/gallery":
            componentToRender = <GalleryPageView/>;
            break;
        case `/project/${params.id}`:
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

import React, {useRef} from "react";
import {TransitionGroup, Transition} from "react-transition-group";
import {useLocation, useParams} from "react-router-dom";
import {gsap} from "gsap";
import GalleryPageView from "../views/galleryPage/galleryPageView.jsx";
import SingleProjectView from "../views/singleProject/SingleProjectView.jsx";
import Home from "../views/homePage/Home.jsx";
import {IsMobile} from "../../utils/utils.jsx";

const Routing = () => {
    const parentNode = useRef(null);
    const location = useLocation();
    const params = useParams(); // Accessing route parameters

    const onEnterHandler = (node) => {

        //console.log("onEnter");
        //console.log(node);
        // if (node === document.getElementsByClassName('SingleProject')[0]) {
        //     gsap.set(node, {
        //         opacity: 0,
        //     });
        //     // jouer sur l'opacity en arrivé quand le get à la BDD est bon
        //     //     attendre ça :
        //     if (node.classList.contains('isPageReady')) {
        //         gsap.to(node, {
        //             duration: 1, opacity: 1, delay: 2
        //         });
        //     }
        // }

    };

    const onExitHandler = (node) => {
        //console.log("onExit");
        //console.log(node);

        if (node === document.getElementsByClassName('Home')[0] && node.querySelector(".Projects-promote-card.selected") && !IsMobile()) {
            let projectCard = node.querySelector(".Projects-promote-card.selected");
            let projectItem = null;
            //console.log(projectCard)
            if (projectCard.querySelectorAll(".Projects-promote-card--img").length > 0) {
                //console.log("isImage")
                //console.log("projectCard.querySelectorAll(\".Projects-promote-card--img\").length > 0", projectCard.querySelectorAll(".Projects-promote-card--img").length > 0)
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
                    } else if(element.contains(projectCard) && element.classList.contains('Projects-promote-item')) {
                        projectItem = element
                    }
                });
            } else if (projectCard.querySelectorAll(".Projects-promote-card--video--source").length > 0) {
                //console.log("projectCard", projectCard)
                //console.log("isVideo")

                let elementsToHide = document.body.querySelectorAll(":not(.Projects-promote-card--video--source)");
                elementsToHide.forEach(element => {
                    //console.log("element", element)
                    if (!element.contains(projectCard) && !element.classList.contains('Projects-promote-card--video') && !element.classList.contains('Projects-promote-card--video--source')) {
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
            }
            // Set initial position and styles
            // Create the animation for the incoming component
            // gsap.to(node, {
            //     duration: 0.4, autoAlpha: 1, opacity: 1,
            // });
            gsap.set(projectCard, {
                scale: 1
            });
            if (projectItem) {
                gsap.to(window, { duration: 0.3, scrollTo: projectItem, ease: "power2.easeOut" });

            }
            let cardTop = projectCard.getBoundingClientRect().y;
            let cardLeft = projectCard.getBoundingClientRect().x;
            let cardB = projectCard.getBoundingClientRect();
            gsap.to(projectCard, {
                transform: `translateY(0%)`,
                top: 0,
                x: 0,
                width: "100vw",
                height: "50vh",
                duration: 1,
                delay:0.3,
                onStartParams: [projectCard],
                onStart: function () {
                    projectCard.classList.add('transitioning');
                    if (projectCard.querySelector(".Projects-promote-card--img")) {
                        let image = projectCard.querySelector(".Projects-promote-card--img")
                        //console.log("isImage", image)

                        if (document.querySelector(".SingleProject-banner--img")) {
                            document.querySelector(".SingleProject-banner--img").src = image.src
                        }
                    } else if (projectCard.querySelector(".Projects-promote-card--video") && projectCard.querySelector(".Projects-promote-card--video--source")) {
                        let video = projectCard.querySelector(".Projects-promote-card--video--source")
                        //console.log("isVideo", video)

                        if (document.querySelector(".SingleProject-banner--video") && document.querySelector(".SingleProject-banner--video--source")) {
                            document.querySelector(".SingleProject-banner--video--source").src = video.src
                        }
                    }
                },
                onComplete: () => {
                    window.scrollTo(0, 0)
                    gsap.killTweensOf(projectCard);
                    if (document.getElementsByClassName('SingleProject')[0]) {
                        gsap.set(document.getElementsByClassName('SingleProject-content')[0], {
                            opacity: 0,
                        });
                        // jouer sur l'opacity en arrivé quand le get à la BDD est bon
                        //     attendre ça :

                        gsap.set(document.getElementsByClassName('SingleProject-banner')[0], {
                            opacity: 1
                        });

                        gsap.to(document.getElementsByClassName('SingleProject-content')[0], {
                            duration: 1, opacity: 1
                        });
                    }
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
                y: "-100%", duration: 0.8, stagger: 0.1, ease: "power4.linear", onComplete: () => {
                    window.scrollTo(0, 0)
                    gsap.killTweensOf([transitionFirstPart, transitionSecondPart, transitionThirdPart]);
                }
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
            >
                {componentToRender}
            </Transition>
        </TransitionGroup>
    </>);
};

export default Routing;

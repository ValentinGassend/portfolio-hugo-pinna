import ProjectManager from "../../../managers/ProjectManager.jsx";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const ProjectsView = ({index, project}) => {
    const [imagePosition, setImagePosition] = useState({x: 0, y: 0});

    useEffect(() => {
        const links = document.querySelectorAll('.Projects-list-project--title');

        const handleMouseEnter = (event) => {
            event.target.parentElement.parentElement.classList.add('active');

            const rect = event.target.getBoundingClientRect();
            // setImagePosition({x: rect.left, y: rect.top});
        };

        const handleMouseMove = (event) => {
            const rect = event.target.getBoundingClientRect();
            setImagePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        };

        const handleMouseLeave = (event) => {
            event.target.parentElement.parentElement.classList.remove('active');

            setImagePosition({x: 0, y: 0});
        };

        links.forEach(link => {
            link.addEventListener('mouseenter', handleMouseEnter);
            link.addEventListener('mousemove', handleMouseMove);
            link.addEventListener('mouseleave', handleMouseLeave);
        });
        return () => {
            links.forEach((link) => {
                link.removeEventListener("mouseenter", handleMouseEnter);
                link.removeEventListener("mousemove", handleMouseMove);
                link.removeEventListener("mouseleave", handleMouseLeave);
            });
        };

    }, []); // Empty dependency array ensures that this effect runs only once after the initial render

    return (
        <>
            {index % 2 === 1 ? <span className={`Projects-list--separator`}></span> : null}
            <div style={index % 2 === 0 ? {textAlign: "right"} : {textAlign: "left"}} className="Projects-list-project">
                <Link data-id={project.id} className={`Projects-list-project--title`}
                      to={'/project/' + project.id}>
                    {project.media && project.media.type === "video"  ? (
                        <video className="Projects-list-project--video" autoPlay muted playsInline loop poster={ProjectManager.videoProps(project.url).poster} style={{ transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)` }}>
                            <source src={ProjectManager.videoProps(project.url).src} type={ProjectManager.videoProps(project.url).type || `video/${project.media.extension}`} />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img {...ProjectManager.imageProps(project.url, "(max-width: 768px) 60vw, 640px")} loading="lazy" alt={project.name} className="Projects-list-project--img" style={{ transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)` }}/>
                    )}
                    {project.name}


                </Link>

            </div>
        </>
    );
};

export default ProjectsView;

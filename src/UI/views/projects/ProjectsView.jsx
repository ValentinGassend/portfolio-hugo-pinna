import React from "react";

const ProjectsView = ({index, project}) => {
    return (
        <>
            {index % 2 === 1 ? <span className={`Projects-list--separator`}></span> : null}
            <div style={index % 2 === 0 ? { textAlign: "right" } : {textAlign: "left" }} className="Projects-list-project">
            <a className={`Projects-list-project--title`} href={project.url}>{project.name}</a>
            </div>
        </>
    );
};

export default ProjectsView;

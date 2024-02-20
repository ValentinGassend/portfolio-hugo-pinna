import React from "react";
import {Link} from "react-router-dom";

const ProjectsView = ({index, project}) => {
    return (
        <>
            {index % 2 === 1 ? <span className={`Projects-list--separator`}></span> : null}
            <div style={index % 2 === 0 ? { textAlign: "right" } : {textAlign: "left" }} className="Projects-list-project">
                <Link data-id={project.id} className={`Projects-list-project--title`} to={'/project/' + project.id}>{project.name}</Link>
            </div>
        </>
    );
};

export default ProjectsView;

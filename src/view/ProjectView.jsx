import React from "react";

const ProjectView = ({ project }) => {
  return (
    <div>
      <h1>{project.name}</h1>
      <img src={project.header_image} alt={project.name} style={{ maxWidth: "100%" }} />

      <div>
        <h2>Content:</h2>
        {project.content.map((item, index) => (
          <div key={index}>
            {item.type === "text" && <p>{item.value}</p>}
            {item.type === "quote" && <blockquote>{item.value}</blockquote>}
          </div>
        ))}
      </div>

      <div>
        <h2>Tags:</h2>
        <ul>
          {project.tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Status: {project.status}</h2>
        <p>Reviewed: {project.reviewed ? "Yes" : "No"}</p>
        <p>Publish Date: {project.publish_date ? new Date(project.publish_date).toLocaleDateString() : "Not specified"}</p>
      </div>
    </div>
  );
};

export default ProjectView;

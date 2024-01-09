import {useEffect, useState} from "react";
import ProjectsView from "../projects/ProjectsView.jsx"
import ProjectManager from "../../../managers/ProjectManager.jsx"

const FirebaseView = () => {
    const [projects, setProjects] = useState([]);
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);
    const manager = ProjectManager


    useEffect(() => {
        manager.getProjectsFromFirebase('projects').then((projectsData) => {
                setProjects(projectsData);
                setAnalyticsInitialized(true);
            }
        );
    }, []);

    return (
        <div>
            <h1>Firebase View</h1>
            {analyticsInitialized ? (
                <div>
                    {projects.map((project) => (
                        <ProjectsView key={project.id} project={project}/>
                    ))}
                </div>
            ) : (
                <p>Initializing Firebase...</p>
            )}
        </div>
    );
};

export default FirebaseView;

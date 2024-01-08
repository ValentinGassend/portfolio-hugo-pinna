import {useEffect, useState} from "react";
import ProjectView from "../project/ProjectView.jsx"
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
                        <ProjectView key={project.id} project={project}/>
                    ))}
                </div>
            ) : (
                <p>Initializing Firebase...</p>
            )}
        </div>
    );
};

export default FirebaseView;

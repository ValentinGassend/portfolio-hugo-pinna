import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import ProjectView from "./ProjectView"
import 'firebase/firestore';
import {db, app} from "../assets/js/firebase.js";

const FirebaseView = () => {
    const [projects, setProjects] = useState([]);
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsCollection = collection(db, "projects");
                const projectsSnapshot = await getDocs(projectsCollection);
                const projectsData = projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setAnalyticsInitialized(true);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Firebase View</h1>
            {analyticsInitialized ? (
                <div>
                    {projects.map((project) => (
                        <ProjectView key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <p>Initializing Firebase...</p>
            )}
        </div>
    );
};

export default FirebaseView;

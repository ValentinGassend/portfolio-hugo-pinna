import {collection, getDocs} from "firebase/firestore";
import {db} from "../assets/js/firebase.js";

const ProjectManager = {

    getProjectsFromFirebase: async (DatabaseName = "") => {
        try {
            const projectsCollection = collection(db, DatabaseName);
            const projectsSnapshot = await getDocs(projectsCollection);
            const projectsData = projectsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            return projectsData;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}
export default ProjectManager
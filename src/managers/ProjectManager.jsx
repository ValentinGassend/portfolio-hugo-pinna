import {collection, getDocs} from "firebase/firestore";
import {db, storage} from "../assets/js/firebase.js";
import {getDownloadURL, ref} from "firebase/storage";

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
    },
    getPromotedProjects: (projects) => {
        return projects.filter((project) => project.is_promoted);
    },
    getUrlOfImage: async (path) => {
        try {
            // Créez une référence à l'image dans Firebase Storage
            const storageRef = ref(storage, path);

            // Obtenez l'URL de téléchargement de l'image
            const downloadURL = await getDownloadURL(storageRef);

            return downloadURL;
        } catch (error) {
            // Gérez les erreurs, par exemple si le fichier n'existe pas
            console.error("Erreur lors de la récupération de l'URL de l'image:", error);
            throw error; // Renvoyez l'erreur pour que l'appelant puisse la gérer
        }

    }

}
export default ProjectManager
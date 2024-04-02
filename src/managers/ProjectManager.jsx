import {collection,doc, getDoc, getDocs} from "firebase/firestore";
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
    getProjectByID: async (projectId, DatabaseName = "") => {
        try {
            const projectDocRef = doc(db, DatabaseName, projectId);
            const projectDocSnapshot = await getDoc(projectDocRef);
            if (projectDocSnapshot.exists()) {
                return { id: projectDocSnapshot.id, ...projectDocSnapshot.data() };
            } else {
                throw new Error("No such document exists!");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            throw error;
        }
    },
    getPromotedProjects: (projects) => {
        return projects.filter((project) => project.is_promoted);
    },

    getSpecificAsset: (assets, name) => {
        return assets.filter((asset) => asset.asset_name===name);
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

    },
    getMediaType: (url) => {
        // Using regular expression to extract file extension
        const extensionMatch = url.match(/\.([^.?#]+)(?:[?#]|$)/i);

        // Checking if a valid extension is found
        if (extensionMatch && extensionMatch[1]) {
            const extension = extensionMatch[1].toLowerCase();

            // Logging for debugging purposes
            //console.log('Extension:', extension);
            //console.log('Original URL:', url);

            // Checking if the extension corresponds to a video format
            if (extension === 'mp4' || extension === 'mov' || extension === 'avi' || extension === 'wmv') {
                return { type: 'video', extension: extension };
            } else {
                return { type: 'image', extension: extension };
            }
        } else {
            // If no extension is found, default to 'image'
            return { type: 'image', extension: null };
        }
    }

}
export default ProjectManager
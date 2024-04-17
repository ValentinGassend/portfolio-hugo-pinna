import {collection, doc, getDoc, getDocs} from "firebase/firestore";
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
    }, getProjectByID: async (projectId, DatabaseName = "") => {
        try {
            const projectDocRef = doc(db, DatabaseName, projectId);
            const projectDocSnapshot = await getDoc(projectDocRef);
            if (projectDocSnapshot.exists()) {
                return {id: projectDocSnapshot.id, ...projectDocSnapshot.data()};
            } else {
                throw new Error("No such document exists!");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            throw error;
        }
    }, getPromotedProjects: (projects) => {
        return projects.filter((project) => project.is_promoted);
    },

    getSpecificAsset: (assets, name) => {
        return assets.filter((asset) => asset.asset_name === name);
    }, getUrlOfImage: async (path) => {
        try {
            // Create a reference to the image in Firebase Storage
            const storageRef = ref(storage, path);

            // Get the download URL of the image
            const downloadURL = await getDownloadURL(storageRef);

            // console.log(downloadURL)
            // Extract query parameters from the download URL
            const url = new URL(downloadURL);
            const queryParams = url.search;
            // Modify the download URL to use ImageKit's URL format
            const newBucket = "https://ik.imagekit.io/ValentinGassend2/o/";
            const encodedPath = encodeURIComponent(path); // Encode the full path
            const imageURL = newBucket + encodedPath + queryParams;

            return imageURL;
        } catch (error) {
            // Handle errors, for example, if the file does not exist
            console.error("Error while retrieving the image URL:", error);
            throw error; // Throw the error so that the caller can handle it
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
                return {type: 'video', extension: extension};
            } else {
                return {type: 'image', extension: extension};
            }
        } else {
            // If no extension is found, default to 'image'
            return {type: 'image', extension: null};
        }
    }

}
export default ProjectManager
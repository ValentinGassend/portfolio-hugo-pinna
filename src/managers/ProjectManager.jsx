import content from "../data/content.json";

// Base URL des médias : par défaut les fichiers de public/media (servis gratuitement par Vercel).
// Peut pointer vers un autre hébergement (Cloudflare R2, Cloudinary...) via VITE_MEDIA_BASE_URL.
const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL || "/media").replace(/\/$/, "");

const ProjectManager = {

    getProjectsFromFirebase: async (DatabaseName = "") => {
        return (content[DatabaseName] || []).map((doc) => structuredClone(doc));
    }, getProjectByID: async (projectId, DatabaseName = "") => {
        const project = (content[DatabaseName] || []).find((doc) => doc.id === projectId);
        if (!project) {
            throw new Error("No such document exists!");
        }
        return structuredClone(project);
    }, getPromotedProjects: (projects) => {
        return projects.filter((project) => project.is_promoted);
    },

    getSpecificAsset: (assets, name) => {
        return assets.filter((asset) => asset.asset_name === name);
    }, getUrlOfImage: async (path) => {
        if (!path) {
            throw new Error("Empty media path");
        }
        return MEDIA_BASE_URL + "/" + path.split("/").map(encodeURIComponent).join("/");
    },

    getMediaType: (url) => {
        // Using regular expression to extract file extension
        const extensionMatch = url.match(/\.([^.?#]+)(?:[?#]|$)/i);

        // Checking if a valid extension is found
        if (extensionMatch && extensionMatch[1]) {
            const extension = extensionMatch[1].toLowerCase();

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

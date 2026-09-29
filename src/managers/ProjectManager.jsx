import bundledContent from "../data/content.json";

// Base URL des médias : par défaut /media sur le même domaine.
// Peut pointer vers un autre hébergement via VITE_MEDIA_BASE_URL.
const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL || "/media").replace(/\/$/, "");

// Contenu : en production, /data/content.json (géré par le CMS /admin) est lu à chaque visite,
// les modifications sont donc visibles sans rebuild. En dev, ou si le fichier est injoignable,
// on utilise le snapshot intégré au build.
const CONTENT_URL = import.meta.env.VITE_CONTENT_URL || "/data/content.json";
// Manifeste des médias optimisés (variantes WebP responsive, vidéos compressées, posters),
// généré sur le serveur par /admin (cf. public/admin/lib/optimizer.php).
const MANIFEST_URL = import.meta.env.VITE_MEDIA_MANIFEST_URL || "/data/media.json";
let manifest = {images: {}, videos: {}};

let contentPromise = null;
const loadContent = () => {
    if (!contentPromise) {
        const content = import.meta.env.DEV
            ? Promise.resolve(bundledContent)
            : fetch(CONTENT_URL, {cache: "no-cache"})
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .catch((error) => {
                    console.error("Contenu en ligne injoignable, utilisation du snapshot :", error);
                    return bundledContent;
                });
        // Sans manifeste, le site fonctionne avec les fichiers d'origine
        const media = fetch(MANIFEST_URL, {cache: "no-cache"})
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
            .then((data) => {
                if (data && data.images) manifest = {images: data.images, videos: data.videos || {}};
            });
        contentPromise = Promise.all([content, media]).then(([data]) => data);
    }
    return contentPromise;
};

const encodePath = (path) => path.split("/").map(encodeURIComponent).join("/");
const mediaPathFromUrl = (url) => {
    const prefix = MEDIA_BASE_URL + "/";
    if (typeof url !== "string" || !url.startsWith(prefix)) return null;
    try {
        return url.slice(prefix.length).split("/").map(decodeURIComponent).join("/");
    } catch {
        return null;
    }
};
const variantUrl = (path, width) =>
    `${MEDIA_BASE_URL}/_optimized/${encodePath(path.replace(/\.[^./]+$/, ""))}-${width}.webp`;

const ProjectManager = {

    getProjectsFromFirebase: async (DatabaseName = "") => {
        const content = await loadContent();
        return (content[DatabaseName] || []).map((doc) => structuredClone(doc));
    }, getProjectByID: async (projectId, DatabaseName = "") => {
        const content = await loadContent();
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

    // Attributs d'une <img> responsive : le navigateur choisit la variante WebP adaptée à l'écran.
    // sizes : largeur d'affichage de l'image (ex. "(max-width: 768px) 100vw, 50vw").
    imageProps: (url, sizes = "100vw") => {
        const path = mediaPathFromUrl(url);
        const entry = path && manifest.images[path];
        if (!entry || !entry.widths || entry.widths.length === 0) {
            return {src: url, decoding: "async"};
        }
        const fallback = entry.widths.find((w) => w >= 1280) || entry.widths[entry.widths.length - 1];
        return {
            src: variantUrl(path, fallback),
            srcSet: entry.widths.map((w) => `${variantUrl(path, w)} ${w}w`).join(", "),
            sizes,
            decoding: "async",
        };
    },

    // Vidéo compressée (si disponible) + poster affiché pendant le chargement
    videoProps: (url) => {
        const path = mediaPathFromUrl(url);
        const entry = path && manifest.videos[path];
        return {
            src: entry && entry.src ? `${MEDIA_BASE_URL}/${encodePath(entry.src)}` : url,
            poster: entry && entry.poster ? `${MEDIA_BASE_URL}/${encodePath(entry.poster)}` : undefined,
            type: entry && entry.src ? "video/mp4" : undefined,
        };
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

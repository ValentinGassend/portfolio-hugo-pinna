// Schéma des collections du CMS (repris de la configuration FireCMS d'origine, déduit des données).
// Types de champ : string, text, number, boolean, select, file, files, tags, blocks, map
// storage : dossier de /media où ranger les fichiers envoyés.

export const COLLECTIONS = [
    {
        id: "projects",
        name: "Projets",
        singular: "Projet",
        columns: ["header_image", "name", "year", "project_type", "visible", "is_promoted", "order"],
        sortBy: "order",
        fields: {
            name: {type: "string", label: "Nom", required: true},
            year: {type: "string", label: "Année"},
            client: {type: "string", label: "Client"},
            project_type: {type: "string", label: "Type de projet"},
            header_image: {type: "file", label: "Visuel principal", storage: "images", description: "Image ou vidéo affichée en bannière et sur l'accueil"},
            slider_image: {type: "files", label: "Slider", storage: "images", description: "Images et vidéos du slider de la page projet"},
            tags: {type: "tags", label: "Tags"},
            contents: {
                type: "blocks", label: "Contenu",
                blockTypes: {title: "Titre", description: "Description"},
            },
            site: {
                type: "map", label: "Lien externe",
                fields: {
                    link_text: {type: "string", label: "Texte du lien"},
                    link: {type: "string", label: "URL", placeholder: "https://…"},
                },
            },
            visible: {type: "boolean", label: "Visible sur le site", default: true},
            is_promoted: {type: "boolean", label: "Mis en avant (cartes de l'accueil)", default: false},
            order: {type: "number", label: "Ordre d'affichage", description: "Les projets sont triés par ordre croissant"},
        },
    },
    {
        id: "gallery",
        name: "Galerie (The wall)",
        singular: "Visuel",
        columns: ["visual", "home_gallery_part.is_forward_on_home"],
        fields: {
            visual: {type: "file", label: "Visuel", storage: "gallery", required: true},
            home_gallery_part: {
                type: "map", label: "Accueil",
                fields: {
                    is_forward_on_home: {type: "boolean", label: "Afficher dans la galerie de l'accueil", default: false},
                    home_visual: {type: "file", label: "Visuel spécifique à l'accueil (optionnel)", storage: "gallery"},
                },
            },
        },
    },
    {
        id: "landing",
        name: "Accueil",
        singular: "Accueil",
        singleton: true,
        columns: ["background_file", "image", "link"],
        fields: {
            background_file: {type: "file", label: "Fond (vidéo ou image)", storage: "Landing"},
            image: {type: "file", label: "Image de la grille", storage: "images"},
            link: {type: "string", label: "Texte du lien de scroll"},
            model: {type: "file", label: "Modèle 3D (.glb)", storage: "images", description: "Non utilisé par le site actuellement"},
        },
    },
    {
        id: "about",
        name: "À propos",
        singular: "À propos",
        singleton: true,
        columns: ["image", "title"],
        fields: {
            title: {type: "string", label: "Titre"},
            image: {type: "file", label: "Photo", storage: "images"},
            content: {type: "text", label: "Texte"},
        },
    },
    {
        id: "contact",
        name: "Contact",
        singular: "Contact",
        singleton: true,
        columns: ["letter.title", "letter.email", "social.tag"],
        fields: {
            letter: {
                type: "map", label: "Lettre",
                fields: {
                    title: {type: "string", label: "Titre"},
                    subtitle: {type: "string", label: "Sous-titre"},
                    email: {type: "string", label: "E-mail"},
                    timbre: {type: "file", label: "Timbre", storage: ""},
                },
            },
            social: {
                type: "map", label: "Réseau social",
                fields: {
                    tag: {type: "string", label: "Pseudo affiché"},
                    link: {type: "string", label: "URL", placeholder: "https://…"},
                },
            },
        },
    },
    {
        id: "gallery_part",
        name: "Section galerie",
        singular: "Section galerie",
        singleton: true,
        columns: ["title", "link"],
        fields: {
            title: {type: "string", label: "Titre"},
            link: {type: "string", label: "Texte du lien"},
        },
    },
    {
        id: "assets",
        name: "Assets",
        singular: "Asset",
        columns: ["asset_img", "name", "asset_name"],
        fields: {
            name: {type: "string", label: "Nom"},
            asset_name: {type: "select", label: "Identifiant", options: {arrow: "arrow", available_dot: "available_dot"}},
            asset_img: {type: "file", label: "Fichier", storage: "assets"},
        },
    },
];

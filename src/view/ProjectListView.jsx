import ProjectView from "./ProjectView";

const ProjectListView = () => {
    const projectData = [
        {
            id: "FUvoV4Lwb815q8prhZTu",
            name: "Frogys",
            content: [
                {
                    type: "text",
                    value: "Create a new frogy about a playful green amphibian.",
                },
                {
                    type: "quote",
                    value: "\"Create a new frogy about a playful green amphibian.\"",
                },
            ],
            header_image: "images/y89q6_icon_moving.png",
            publish_date: 1702940400000,
            reviewed: false,
            status: "draft",
            tags: ["playful", "green", "amphibian"],
            created_on: null,
        },
        {
            id: "ZSVQxv7idRuAuObtw9Ho",
            name: "Green Amphibian Frogy",
            content: [
                {
                    type: "text",
                    value: "Create a new frogy about a playful green amphibian.",
                },
                {
                    type: "quote",
                    value: "A playful green amphibian, emblematic of nature's diversity, adds a vibrant touch to our frogy collection.",
                },
                {
                    type: "text",
                    value: "The new green amphibian frogy brings uniqueness and verve to your collection. Perfect for those who love nature's diversity.",
                },
            ],
            header_image: "images/e32s6_Frogy.png",
            publish_date: null,
            reviewed: false,
            status: "published",
            tags: ["Frogy", "Amphibian", "Green", "Playful", "Nature", "Collection"],
            created_on: null,
        },
        // Ajoutez d'autres projets au besoin
    ];


    return (
        <div>
            {projectData.map((project) => (
                <ProjectView key={project.id} project={project}/>
            ))}
        </div>
    );
};

export default ProjectListView;

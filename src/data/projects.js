import dnbHubImage from '../assets/projects/dnb-hub.png';
import foundItImage from '../assets/projects/found-it.png';
import dancefloorDefenderImage from '../assets/projects/dancefloor-defender.png';

/**
 * PROJECTS DATA FILE
 * ==================
 * 
 * This is the ONLY file you need to edit to add new projects.
 * 
 * HOW TO ADD A NEW PROJECT:
 * -------------------------
 * 1. Copy the template below
 * 2. Paste it at the end of the projects array (before the closing bracket)
 * 3. Fill in your project details
 * 4. Save the file - your new project will appear automatically!
 * 
 * TEMPLATE:
 * {
 *   id: 4,  // Increment this number for each new project
 *   title: "Your Project Title",
 *   slug: "your-project-slug",  // URL-friendly identifier
 *   description: "A detailed description for the Projects page.",
 *   shortDescription: "A brief 1-sentence description for the Home page.",
 *   techStack: ["Tech1", "Tech2", "Tech3"],
 *   clientRepo: "https://github.com/yourusername/project-name",
 *   serverRepo: "https://github.com/yourusername/project-server",  // Optional - only if you have a separate backend repo
 *   liveLink: "https://your-project.netlify.app",
 *   image: yourImageImport,  // Optional - import images at the top of this file from src/assets/projects/
 *   featured: true  // Set to true to show on Home page
 * }
 * 
 * NOTES:
 * - id: Must be unique. Just increment from the last project.
 * - slug: URL-friendly identifier (e.g., "my-awesome-project")
 * - techStack: Array of strings. These appear as tags on your project card.
 *              Also used for filtering on the Projects page.
 * - image: Optional. If not provided, a placeholder will be shown.
 *          Import images at the top of this file: import myImage from '../assets/projects/image.png';
 * - featured: Set to true to display the project on the Home page.
 */

const projects = [
  {
    id: 1,
    slug: "dancefloor-defender",
    title: "Dancefloor Defender",
    description: "Dancefloor Defender is a small arcade-style game where the player must defend the dancefloor by reacting to incoming enemies. The project focuses on core JavaScript concepts such as game loops, collision detection, keyboard controls, and dynamic DOM updates.",
    shortDescription: "A browser-based arcade game built with JavaScript, focused on game logic and real-time interactions.",
    techStack: ["JavaScript", "HTML", "CSS", "Game Logic", "DOM Manipulation"],
    clientRepo: "https://github.com/wai-coding/dancefloor-defender-game-project",
    liveLink: "https://wai-coding.github.io/dancefloor-defender-game-project/",
    image: dancefloorDefenderImage,
    featured: false,
    keyFeatures: [
      "Real-time game loop and collision detection",
      "Keyboard-controlled player movement",
      "Dynamic DOM updates without frameworks"
    ]
  },
  {
    id: 2,
    slug: "foundit",
    title: "FoundIt",
    description: "FoundIt is a second-hand marketplace where users can browse products, view details, and manage listings. It includes client-side search, multi-filter + sorting, pagination, favorites stored in localStorage, and full CRUD (create, edit, delete) integrated with a mock REST API (json-server).",
    shortDescription: "A second-hand marketplace React app with search, filtering, pagination, favorites, and full CRUD via a REST API.",
    techStack: ["React", "JavaScript", "React Router", "Vite", "REST API", "JSON Server"],
    clientRepo: "https://github.com/wai-coding/foundit-app",
    serverRepo: "https://github.com/wai-coding/json-server-backend",
    liveLink: "https://foundit-app.netlify.app/",
    image: foundItImage,
    featured: false,
    keyFeatures: [
      "Product search, filtering, sorting & pagination",
      "Full CRUD integrated with a REST API",
      "Favorites persisted with localStorage"
    ]
  },
  {
    id: 3,
    slug: "dnb-hub",
    title: "DNB Hub",
    description: "DNB Hub is a full stack MERN application designed to centralize information about Drum & Bass events and community members. It features JWT-based authentication, protected routes, and full CRUD functionality for core entities such as events, artists, and promoters. The project focuses on building a structured REST API and integrating it with a React client in a clean and maintainable way.",
    shortDescription: "A full stack MERN web app for Drum & Bass events, artists, and promoters with JWT authentication and CRUD dashboards.",
    techStack: ["React", "JavaScript", "React Router", "Node.js", "Express.js", "MongoDB", "Mongoose", "REST API", "JWT Authentication"],
    clientRepo: "https://github.com/wai-coding/dnb-hub-client",
    serverRepo: "https://github.com/wai-coding/dnb-hub-server",
    liveLink: "https://dnbhub.netlify.app/",
    image: dnbHubImage,
    featured: true,
    keyFeatures: [
      "JWT authentication + protected routes",
      "REST API with Mongoose models and relationships",
      "Full CRUD dashboards for events, artists, and promoters"
    ],
    learningHighlights: [
      "Designed a REST API with real data relationships",
      "Implemented authentication and protected routes",
      "Learned how to structure a full-stack MERN project end-to-end"
    ]
  }
];

export default projects;

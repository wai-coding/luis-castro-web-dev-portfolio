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
    id: 3,
    slug: "dnb-hub",
    title: "DNB Hub",
    startYear: 2026,
    description: "Full-stack MERN platform to manage Drum & Bass events, artists, and promoters. Includes JWT authentication, protected routes, and CRUD dashboards powered by a structured REST API with clear separation between frontend and backend, using MongoDB and Mongoose relationships.",
    shortDescription: "Full-stack MERN app with JWT auth, protected routes, and CRUD dashboards for events, artists, and promoters.",
    techStack: ["React", "JavaScript", "React Router", "Node.js", "Express.js", "MongoDB", "Mongoose", "REST API", "JWT Authentication"],
    clientRepo: "https://github.com/wai-coding/dnb-hub-client",
    serverRepo: "https://github.com/wai-coding/dnb-hub-server",
    liveLink: "https://dnbhub.netlify.app/",
    image: dnbHubImage,
    featured: true,
    keyFeatures: [
      "JWT authentication and protected routes",
      "REST API with MongoDB/Mongoose models and relationships",
      "Full CRUD dashboards for events, artists, and promoters"
    ],
    learningHighlights: [
      "Designed data models and relationships in MongoDB with Mongoose",
      "Implemented authentication flows (signup/login/verify) with JWT",
      "Built and deployed a full-stack app end-to-end with clean separation of concerns"
    ]
  },
  {
    id: 2,
    slug: "foundit",
    title: "FoundIt",
    startYear: 2025,
    description: "A second-hand marketplace built with React. Includes client-side search, multi-filter + sorting, pagination, favorites via localStorage, and full CRUD connected to a mock REST API (json-server).",
    shortDescription: "React marketplace application with search, filters, sorting, pagination, favorites, and CRUD via REST API.",
    techStack: ["React", "JavaScript", "React Router", "Vite", "REST API", "JSON Server"],
    clientRepo: "https://github.com/wai-coding/foundit-app",
    serverRepo: "https://github.com/wai-coding/json-server-backend",
    liveLink: "https://foundit-app.netlify.app/",
    image: foundItImage,
    featured: false,
    keyFeatures: [
      "Search, multi-filtering and sorting",
      "Pagination with consistent UX on filter changes",
      "Favorites stored in localStorage",
      "Full CRUD (create/edit/delete) via REST API",
      "Product status handling (available/sold)"
    ]
  },
  {
    id: 1,
    slug: "dancefloor-defender",
    title: "Dancefloor Defender",
    startYear: 2025,
    description: "Retro arcade shooter built with vanilla JavaScript. Defend the dancefloor through progressive difficulty, multiple enemy behaviors, power-ups, and a persistent Top 10 leaderboard using localStorage.",
    shortDescription: "Vanilla JavaScript arcade shooter with progressive difficulty, mobile controls, and persistent high scores.",
    techStack: ["JavaScript", "HTML", "CSS", "Game Logic", "DOM Manipulation"],
    clientRepo: "https://github.com/wai-coding/dancefloor-defender",
    liveLink: "https://wai-coding.github.io/dancefloor-defender/",
    image: dancefloorDefenderImage,
    featured: false,
    keyFeatures: [
      "Progressive difficulty and level ramp",
      "Multiple enemy types and distinct behaviors",
      "Power-ups (risk/reward mechanic)",
      "Persistent leaderboard and settings via localStorage",
      "Touch-friendly controls for mobile"
    ]
  }
];

export default projects;

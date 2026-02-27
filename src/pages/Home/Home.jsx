import { Link } from 'react-router-dom';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import projects from '../../data/projects';
import './Home.css';

/**
 * Home Page Component
 * -------------------
 * The landing page of the portfolio.
 * Contains a hero section with introduction and call-to-action buttons.
 * Also displays featured projects from the projects data.
 */
const technologies = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", invert: true },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "REST API", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='16 18 22 12 16 6'/%3E%3Cpolyline points='8 6 2 12 8 18'/%3E%3C/svg%3E" },
  { name: "JWT Auth", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0110 0v4'/%3E%3C/svg%3E" },
  { name: "Git & GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "HTML & CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
];

function Home() {
  // Filter projects that have featured: true
  const featuredProjects = projects.filter((project) => project.featured);
  // Filter projects that are not featured
  const moreProjects = projects.filter((project) => !project.featured);

  return (
    <main className="home">
      <section className="hero">
        {/* Logo */}
        <img
          src="/favicon.png"
          alt="Luís Castro logo"
          className="hero-logo"
        />

        {/* Welcome Text */}
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name">Luís Castro</h1>
        <h2 className="hero-title">Full-Stack Web Developer (MERN)</h2>
        
        {/* Brief Introduction */}
        <p className="hero-headline">
          I build production-ready web applications using React, Node.js and MongoDB.
          I work across both frontend interfaces and backend REST APIs.
        </p>
        <p className="hero-description">
          Ironhack Web Development Bootcamp graduate (400+ hours). Based in Porto, Portugal. Open to remote and international roles.
        </p>

        {/* Quick Skills Overview (above CTA buttons) */}
        <div className="skills-preview" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="skills-title">Technologies I Work With</h2>
          <ul className="skills-grid" aria-label="Technical skills">
            {technologies.map((tech) => (
              <li key={tech.name} className="skill-item">
                <img
                  src={tech.icon}
                  alt=""
                  className="skill-icon"
                  style={tech.invert ? { filter: 'brightness(0) invert(1)' } : undefined}
                />
                <span className="skill-name">{tech.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Call to Action Buttons */}
        <div className="hero-buttons">
          <Link to="/projects" className="btn btn-primary hero-cta-btn">
            View Projects
          </Link>
          <Link to="/contact" className="btn btn-secondary hero-cta-btn">
            Contact Me
          </Link>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="featured-projects" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="featured-title">Featured Projects</h2>
          <div className="featured-grid">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                slug={project.slug}
                title={project.title}
                description={project.shortDescription}
                techStack={project.techStack}
                clientRepo={project.clientRepo}
                serverRepo={project.serverRepo}
                liveLink={project.liveLink}
                image={project.image}
                isFeatured={true}
                startYear={project.startYear}
              />
            ))}
          </div>
        </section>
      )}

      {/* More Projects Section */}
      {moreProjects.length > 0 && (
        <section className="more-projects" aria-labelledby="more-projects-heading">
          <h2 id="more-projects-heading" className="more-projects-title">More Projects</h2>
          <div className="more-projects-grid">
            {moreProjects.map((project) => (
              <ProjectCard
                key={project.id}
                slug={project.slug}
                title={project.title}
                description={project.shortDescription}
                techStack={project.techStack}
                clientRepo={project.clientRepo}
                serverRepo={project.serverRepo}
                liveLink={project.liveLink}
                image={project.image}
                startYear={project.startYear}
              />
            ))}
          </div>
          <div className="featured-cta">
            <Link to="/projects" className="btn btn-secondary">
              View All Projects
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;

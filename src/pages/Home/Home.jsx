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

        {/* Call to Action Buttons */}
        <div className="hero-buttons">
          <Link to="/projects" className="btn btn-primary">
            View Projects
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            Contact Me
          </Link>
          <a href="https://github.com/wai-coding" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/luiscastrocoding/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            LinkedIn
          </a>
        </div>
      </section>

      {/* Quick Skills Overview */}
      <section className="skills-preview" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="skills-title">Technologies I Work With</h2>
        <ul className="skills-list" aria-label="Technical skills">
          <li className="skill-item">React</li>
          <li className="skill-item">JavaScript</li>
          <li className="skill-item">Node.js</li>
          <li className="skill-item">Express.js</li>
          <li className="skill-item">MongoDB</li>
          <li className="skill-item">REST API</li>
          <li className="skill-item">JWT Authentication</li>
          <li className="skill-item">Git & GitHub</li>
          <li className="skill-item">HTML & CSS</li>
        </ul>
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

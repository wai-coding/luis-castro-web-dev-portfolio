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
        {/* Welcome Text */}
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name">Luís Castro</h1>
        <h2 className="hero-title">Junior Full Stack Developer</h2>
        
        {/* Brief Introduction */}
        <p className="hero-headline">
          I'm a Junior Full Stack Developer focused on building clean, practical web applications from frontend to backend.
        </p>
        <p className="hero-description">
          I enjoy working with React on the client side and Node.js / MongoDB on the server, turning ideas into functional products.
          I value clarity, maintainable code, and learning by building real projects.
        </p>

        {/* Call to Action Buttons */}
        <div className="hero-buttons">
          <Link to="/projects" className="btn btn-primary">
            View Projects
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            Contact Me
          </Link>
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
          <div className="featured-cta">
            <Link to="/projects" className="btn btn-secondary">
              View All Projects
            </Link>
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
        </section>
      )}
    </main>
  );
}

export default Home;

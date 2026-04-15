import { Link } from 'react-router-dom';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { useProjects } from '../../contexts/ProjectsContext';
import { useSiteContent } from '../../contexts/SiteContentContext';
import EditableText from '../../components/Editable/EditableText';
import './Home.css';

const defaultTechnologies = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", invert: true },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
];

function Home() {
  const { projects, loading } = useProjects();
  const { content } = useSiteContent();
  const home = content?.home || {};

  const greeting = home.greeting || "Hi, I'm";
  const name = home.name || "Luís Castro";
  const title = home.title || "Full-Stack Web Developer (MERN)";
  const headline = home.headline || "";
  const description = home.description || "";
  const ctaPrimaryLabel = home.ctaPrimaryLabel || "View Projects";
  const ctaSecondaryLabel = home.ctaSecondaryLabel || "Contact Me";
  const technologiesTitle = home.technologiesTitle || "Technologies I Work With";
  const featuredProjectsTitle = home.featuredProjectsTitle || "Featured Projects";
  const moreProjectsTitle = home.moreProjectsTitle || "More Projects";
  const viewAllProjectsLabel = home.viewAllProjectsLabel || "View All Projects";
  const technologies = home.technologies?.length > 0 ? home.technologies : defaultTechnologies;

  const sortByOrder = (a, b) => (a.displayOrder || 999) - (b.displayOrder || 999);
  const featuredProjects = projects.filter((p) => p.featured).sort(sortByOrder);
  const moreProjects = projects.filter((p) => !p.featured).sort(sortByOrder);

  if (loading) return null;

  return (
    <main className="home">
      <section className="hero">
        <img
          src="/favicon.png"
          alt={`${name} logo`}
          className="hero-logo"
        />

        <EditableText path={['home', 'greeting']} value={greeting} as="p" className="hero-greeting" />
        <EditableText path={['home', 'name']} value={name} as="h1" className="hero-name" />
        <EditableText path={['home', 'title']} value={title} as="h2" className="hero-title" />
        
        {headline && (
          <EditableText path={['home', 'headline']} value={headline} as="p" className="hero-headline" multiline />
        )}
        {description && (
          <EditableText path={['home', 'description']} value={description} as="p" className="hero-description" multiline />
        )}

        <div className="skills-preview" aria-labelledby="skills-heading">
          <EditableText path={['home', 'technologiesTitle']} value={technologiesTitle} as="h2" id="skills-heading" className="skills-title" />
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

        <div className="hero-buttons">
          <Link to="/projects" className="btn btn-primary hero-cta-btn">
            <EditableText path={['home', 'ctaPrimaryLabel']} value={ctaPrimaryLabel} />
          </Link>
          <Link to="/contact" className="btn btn-secondary hero-cta-btn">
            <EditableText path={['home', 'ctaSecondaryLabel']} value={ctaSecondaryLabel} />
          </Link>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="featured-projects" aria-labelledby="featured-heading">
          <EditableText path={['home', 'featuredProjectsTitle']} value={featuredProjectsTitle} as="h2" id="featured-heading" className="featured-title" />
          <div className="featured-grid">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </section>
      )}

      {moreProjects.length > 0 && (
        <section className="more-projects" aria-labelledby="more-projects-heading">
          <EditableText path={['home', 'moreProjectsTitle']} value={moreProjectsTitle} as="h2" id="more-projects-heading" className="more-projects-title" />
          <div className="more-projects-grid">
            {moreProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
          <div className="featured-cta">
            <Link to="/projects" className="btn btn-secondary">
              <EditableText path={['home', 'viewAllProjectsLabel']} value={viewAllProjectsLabel} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;

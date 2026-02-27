import { useParams, Link } from 'react-router-dom';
import projects from '../../data/projects';
import './ProjectDetails.css';

/**
 * ProjectDetails Page Component
 * -----------------------------
 * Displays full details of a single project.
 * Reads the slug from the URL and finds the matching project.
 * Shows complete description, key features, learning highlights,
 * tech stack, and action buttons.
 */
function ProjectDetails() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  // Project not found
  if (!project) {
    return (
      <main className="project-details">
        <div className="project-details-container">
          <div className="not-found">
            <h1 className="not-found-title">Project not found</h1>
            <p className="not-found-text">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/projects" className="btn btn-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="project-details">
      <div className="project-details-container">
        {/* Project Header */}
        <header className="details-header">
          <div className="details-title-row">
            <h1 className="details-title">{project.title}</h1>
            {project.featured && project.slug !== 'dnb-hub' && (
              <span className="details-badge">Main Project, Full Stack</span>
            )}
          </div>
          {project.startYear && (
            <p className="details-year">{project.startYear}</p>
          )}
        </header>

        {/* Project Image */}
        {project.image && (
          <div className="details-image-container">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail-image-link"
            >
              <img 
                src={project.image} 
                alt={`${project.title} screenshot`}
                className="project-image-full"
              />
            </a>
          </div>
        )}

        {/* Full Description */}
        <section className="details-section">
          <p className="details-description">{project.description}</p>
        </section>

        {/* Key Features */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <section className="details-section">
            <h2 className="details-section-title">Key Features</h2>
            <ul className="details-list">
              {project.keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Learning Highlights */}
        {project.learningHighlights && project.learningHighlights.length > 0 && (
          <section className="details-section">
            <h2 className="details-section-title">What I Learned</h2>
            <ul className="details-list">
              {project.learningHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Tech Stack */}
        <section className="details-section">
          <h2 className="details-section-title">Tech Stack</h2>
          <div className="details-tech-stack">
            {project.techStack.map((tech, index) => (
              <span key={index} className="details-tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="details-actions">
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Live Demo
          </a>
          <a
            href={project.clientRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Frontend Repo
          </a>
          {project.serverRepo && (
            <a
              href={project.serverRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Backend Repo
            </a>
          )}
        </section>

        {/* Back Link */}
        <div className="details-back">
          <Link to="/projects" className="back-link">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ProjectDetails;

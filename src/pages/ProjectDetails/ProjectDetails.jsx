import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';
import './ProjectDetails.css';

function ProjectDetails() {
  const { slug } = useParams();
  const { projects, loading } = useProjects();
  const project = projects.find((p) => p.slug === slug);

  if (loading) return null;

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
          <h1 className="details-title">{project.title}</h1>
          {project.startYear && (
            <p className="details-year">{project.startYear}</p>
          )}
        </header>

        {/* Project Image */}
        {project.image?.src && (
          <div className="details-image-container">
            {project.liveLink ? (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="project-detail-image-link"
              >
                <img 
                  src={project.image.src} 
                  alt={`${project.title} screenshot`}
                  className="project-image-full"
                />
              </a>
            ) : (
              <img 
                src={project.image.src} 
                alt={`${project.title} screenshot`}
                className="project-image-full"
              />
            )}
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

        {/* Action Buttons - only if at least one link exists */}
        {(project.liveLink || project.clientRepo || project.serverRepo) && (
          <section className="details-actions">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Live Demo
              </a>
            )}
            {project.clientRepo && (
              <a
                href={project.clientRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                {project.clientRepo && project.serverRepo ? 'Frontend Repo' : 'GitHub Repo'}
              </a>
            )}
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
        )}

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

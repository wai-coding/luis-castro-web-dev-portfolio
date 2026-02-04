import { Link } from 'react-router-dom';
import './ProjectCard.css';

/**
 * ProjectCard Component
 * ---------------------
 * A reusable card component that displays project information.
 * 
 * PROPS:
 * - slug: (string) URL-friendly identifier for the project
 * - title: (string) The project name
 * - description: (string) Brief description of the project (shortDescription)
 * - techStack: (array) Array of technologies used
 * - clientRepo: (string) URL to client/frontend GitHub repository
 * - serverRepo: (string|null) Optional URL to server/backend GitHub repository
 * - liveLink: (string) URL to live demo
 * - image: (string|null) Optional image path
 * - isFeatured: (boolean) Whether this is a featured project
 * 
 * This component is used by the Projects page to render each project
 * from the data/projects.js file.
 */
function ProjectCard({ slug, title, description, techStack, clientRepo, serverRepo, liveLink, image, isFeatured }) {
  return (
    <article className="project-card">
      {/* Project Image or Placeholder */}
      <Link to={`/projects/${slug}`} className="project-image-link">
        <div className="project-image">
          {image ? (
            <img src={image} alt={`Screenshot of ${title}`} />
          ) : (
            <div className="image-placeholder">
              <span>{title.charAt(0)}</span>
            </div>
          )}
          {isFeatured && <span className="featured-badge">Main Project — Full Stack</span>}
        </div>
      </Link>

      {/* Project Content */}
      <div className="project-content">
        <div className="project-header">
          <h3 className="project-title">
            <Link to={`/projects/${slug}`} className="project-title-link">{title}</Link>
          </h3>
        </div>
        
        <p className="project-description">{description}</p>

        {/* Tech Stack Tags */}
        <div className="tech-stack">
          {techStack.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        {/* Project Actions (Links + Details) */}
        <div className="project-actions">
          {/* Project Links */}
          <div className="project-links">
            <a 
              href={liveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link demo-link"
            >
              Live Demo
            </a>
            <a 
              href={clientRepo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link github-link"
            >
              Client Repo
            </a>
            {serverRepo && (
              <a 
                href={serverRepo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link server-link"
              >
                Server Repo
              </a>
            )}
          </div>

          {/* View Details Link */}
          <Link to={`/projects/${slug}`} className="view-details-link">
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;

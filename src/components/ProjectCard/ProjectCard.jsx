import { Link } from 'react-router-dom';
import { getCardImageStyle } from '../../utils/cropUtils';
import './ProjectCard.css';

function ProjectCard({ project }) {
  const { slug, title, shortDescription, techStack, clientRepo, serverRepo, liveLink, image, featured, startYear } = project;
  const imageSrc = image?.src || '';
  const imageStyle = getCardImageStyle(image);
  const hasLiveLink = liveLink && liveLink.trim();
  const hasClientRepo = clientRepo && clientRepo.trim();
  const hasServerRepo = serverRepo && serverRepo.trim();
  const clientRepoLabel = hasClientRepo && hasServerRepo ? 'Frontend Repo' : 'GitHub Repo';

  return (
    <article className="project-card" data-slug={slug}>
      {featured && (
        <span
          className="project-featured-star"
          aria-label="Featured project"
          title="Featured project"
        >
          ★
        </span>
      )}

      <Link to={`/projects/${slug}`} className="project-image-link">
        <div className="project-image">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`Screenshot of ${title}`}
              style={imageStyle}
            />
          ) : (
            <div className="image-placeholder">
              <span>{title.charAt(0)}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="project-content">
        <div className="project-header">
          <h3 className="project-title">
            <Link to={`/projects/${slug}`} className="project-title-link">{title}</Link>
          </h3>
          {startYear && <span className="project-year">{startYear}</span>}
        </div>
        
        <div className="project-card-top">
          <p className="project-description">{shortDescription}</p>
        </div>

        <div className="project-card-bottom">
          <div className="tech-stack">
            {techStack.map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>

          <div className="project-actions">
            <div className="project-links">
              {hasLiveLink && (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link demo-link"
                >
                  Live Demo
                </a>
              )}
              {hasClientRepo && (
                <a
                  href={clientRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link github-link"
                >
                  {clientRepoLabel}
                </a>
              )}
              {hasServerRepo && (
                <a
                  href={serverRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link server-link"
                >
                  Backend Repo
                </a>
              )}
            </div>

            <Link to={`/projects/${slug}`} className="view-details-link">
              View details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;

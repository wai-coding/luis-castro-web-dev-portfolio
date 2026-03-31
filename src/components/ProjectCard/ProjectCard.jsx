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
  const liveLinkText = (project.liveLinkLabel && project.liveLinkLabel.trim()) || 'Live Demo';
  const clientRepoText = (project.clientRepoLabel && project.clientRepoLabel.trim()) || (hasClientRepo && hasServerRepo ? 'Frontend Repo' : 'GitHub Repo');
  const serverRepoText = (project.serverRepoLabel && project.serverRepoLabel.trim()) || 'Backend Repo';

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
                  {liveLinkText}
                </a>
              )}
              {hasClientRepo && (
                <a
                  href={clientRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link github-link"
                >
                  {clientRepoText}
                </a>
              )}
              {hasServerRepo && (
                <a
                  href={serverRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link server-link"
                >
                  {serverRepoText}
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

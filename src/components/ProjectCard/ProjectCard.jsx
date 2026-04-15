import { Link } from 'react-router-dom';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { useEditor } from '../../contexts/EditorContext';
import EditableText from '../Editable/EditableText';
import { getCardImageStyle } from '../../utils/cropUtils';
import './ProjectCard.css';

function ProjectCard({ project }) {
  const { content } = useSiteContent();
  const editor = useEditor();
  const isEditing = editor?.editorMode;
  const common = content?.common || {};
  const { id, slug, title, shortDescription, techStack, clientRepo, serverRepo, liveLink, image, featured, startYear } = project;
  const imageSrc = image?.src || '';
  const imageStyle = getCardImageStyle(image);
  const hasLiveLink = liveLink && liveLink.trim();
  const hasClientRepo = clientRepo && clientRepo.trim();
  const hasServerRepo = serverRepo && serverRepo.trim();
  const liveLinkText = (project.liveLinkLabel && project.liveLinkLabel.trim()) || common.liveDemoLabel || 'Live Demo';
  const clientRepoText = (project.clientRepoLabel && project.clientRepoLabel.trim()) || (hasClientRepo && hasServerRepo ? (common.frontendRepoLabel || 'Frontend Repo') : (common.githubRepoLabel || 'GitHub Repo'));
  const serverRepoText = (project.serverRepoLabel && project.serverRepoLabel.trim()) || common.backendRepoLabel || 'Backend Repo';
  const viewDetailsLabel = common.viewDetailsLabel || 'View details';

  const handleFieldSave = (field) => (value) => {
    if (editor?.updateProject) editor.updateProject(id, field, value);
  };

  const handleStartYearSave = (value) => {
    const year = parseInt(value, 10);
    if (editor?.updateProject && !isNaN(year)) editor.updateProject(id, 'startYear', year);
  };

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
      {isEditing && editor.openProjectSettings && (
        <button
          className="project-settings-btn"
          data-editor-action="true"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); editor.openProjectSettings(id); }}
          title="Project settings"
        >
          ⚙
        </button>
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
          {isEditing && editor.openImageEditor && (
            <button
              className="project-image-edit-btn"
              data-editor-action="true"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); editor.openImageEditor(id); }}
              title="Edit project image"
            >
              ✎
            </button>
          )}
        </div>
      </Link>

      <div className="project-content">
        <div className="project-header">
          <h3 className="project-title">
            {isEditing ? (
              <EditableText value={title} className="project-title-link" onSave={handleFieldSave('title')} />
            ) : (
              <Link to={`/projects/${slug}`} className="project-title-link">{title}</Link>
            )}
          </h3>
          {startYear && (
            isEditing ? (
              <EditableText value={String(startYear)} className="project-year" onSave={handleStartYearSave} />
            ) : (
              <span className="project-year">{startYear}</span>
            )
          )}
        </div>
        
        <div className="project-card-top">
          {isEditing ? (
            <EditableText value={shortDescription} as="p" className="project-description" onSave={handleFieldSave('shortDescription')} multiline />
          ) : (
            <p className="project-description">{shortDescription}</p>
          )}
        </div>

        <div className="project-card-bottom">
          <div className="tech-stack">
            {(techStack || []).map((tech, index) => (
              <span key={index} className="tech-tag">
                {isEditing ? (
                  <EditableText value={tech} onSave={(val) => {
                    if (editor?.updateProject) {
                      const arr = [...(techStack || [])];
                      if (val.trim() === '') {
                        arr.splice(index, 1);
                      } else {
                        arr[index] = val;
                      }
                      editor.updateProject(id, 'techStack', arr);
                    }
                  }} />
                ) : tech}
              </span>
            ))}
            {isEditing && (
              <button className="inline-add-btn inline-add-btn-tag" data-editor-action="true" onClick={() => {
                if (editor?.updateProject) {
                  editor.updateProject(id, 'techStack', [...(techStack || []), 'New Tech']);
                }
              }}>+</button>
            )}
          </div>

          <div className="project-actions">
            <div className="project-links">
              {hasLiveLink && (isEditing ? (
                <span className="project-link demo-link">
                  <EditableText value={liveLinkText} onSave={handleFieldSave('liveLinkLabel')} />
                </span>
              ) : (
                <a
                  href={liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link demo-link"
                >
                  {liveLinkText}
                </a>
              ))}
              {hasClientRepo && (isEditing ? (
                <span className="project-link github-link">
                  <EditableText value={clientRepoText} onSave={handleFieldSave('clientRepoLabel')} />
                </span>
              ) : (
                <a
                  href={clientRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link github-link"
                >
                  {clientRepoText}
                </a>
              ))}
              {hasServerRepo && (isEditing ? (
                <span className="project-link server-link">
                  <EditableText value={serverRepoText} onSave={handleFieldSave('serverRepoLabel')} />
                </span>
              ) : (
                <a
                  href={serverRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link server-link"
                >
                  {serverRepoText}
                </a>
              ))}
            </div>

            <Link to={`/projects/${slug}`} className="view-details-link">
              {viewDetailsLabel} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;

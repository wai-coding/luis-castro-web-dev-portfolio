import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { useEditor } from '../../contexts/EditorContext';
import EditableText from '../../components/Editable/EditableText';
import './ProjectDetails.css';

function ProjectDetails({ projectSlug }) {
  const { slug: routeSlug } = useParams();
  const slug = projectSlug || routeSlug;
  const { projects, loading } = useProjects();
  const { content } = useSiteContent();
  const editor = useEditor();
  const isEditing = editor?.editorMode;
  const project = projects.find((p) => p.slug === slug);

  const pd = content?.projectDetails || {};
  const common = content?.common || {};
  const keyFeaturesTitle = pd.keyFeaturesTitle || 'Key Features';
  const whatILearnedTitle = pd.whatILearnedTitle || 'What I Learned';
  const techStackTitle = pd.techStackTitle || 'Tech Stack';
  const backToProjectsLabel = pd.backToProjectsLabel || 'Back to Projects';
  const notFoundTitle = pd.notFoundTitle || 'Project not found';
  const notFoundText = pd.notFoundText || "The project you're looking for doesn't exist or has been removed.";
  const notFoundButtonLabel = pd.notFoundButtonLabel || 'Back to Projects';
  const liveDemoLabel = common.liveDemoLabel || 'Live Demo';
  const frontendRepoLabel = common.frontendRepoLabel || 'Frontend Repo';
  const backendRepoLabel = common.backendRepoLabel || 'Backend Repo';
  const githubRepoLabel = common.githubRepoLabel || 'GitHub Repo';

  const handleFieldSave = (field) => (value) => {
    if (editor?.updateProject && project) editor.updateProject(project.id, field, value);
  };

  const handleStartYearSave = (value) => {
    const year = parseInt(value, 10);
    if (editor?.updateProject && project && !isNaN(year)) editor.updateProject(project.id, 'startYear', year);
  };

  const handleArrayItemSave = (field, index) => (value) => {
    if (editor?.updateProject && project) {
      const arr = [...(project[field] || [])];
      if (value.trim() === '') {
        arr.splice(index, 1);
      } else {
        arr[index] = value;
      }
      editor.updateProject(project.id, field, arr);
    }
  };

  const handleAddArrayItem = (field, defaultValue) => {
    if (editor?.updateProject && project) {
      editor.updateProject(project.id, field, [...(project[field] || []), defaultValue]);
    }
  };

  if (loading) return null;

  // Project not found
  if (!project) {
    return (
      <main className="project-details">
        <div className="project-details-container">
          <div className="not-found">
            <h1 className="not-found-title">{notFoundTitle}</h1>
            <p className="not-found-text">{notFoundText}</p>
            <Link to="/projects" className="btn btn-primary">
              {notFoundButtonLabel}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="project-details">
      <div className="project-details-container">
        <header className="details-header">
          {isEditing ? (
            <EditableText value={project.title} as="h1" className="details-title" onSave={handleFieldSave('title')} />
          ) : (
            <h1 className="details-title">{project.title}</h1>
          )}
          {project.startYear && (
            isEditing ? (
              <EditableText value={String(project.startYear)} as="p" className="details-year" onSave={handleStartYearSave} />
            ) : (
              <p className="details-year">{project.startYear}</p>
            )
          )}
          {isEditing && editor.openProjectSettings && (
            <button
              className="project-settings-btn project-settings-btn-details"
              data-editor-action="true"
              onClick={() => editor.openProjectSettings(project.id)}
              title="Project settings"
            >
              Settings
            </button>
          )}
        </header>

        {(project.image?.src || isEditing) && (
          <div className="details-image-container">
            {project.image?.src ? (
              project.liveLink && !isEditing ? (
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
              )
            ) : (
              <div className="details-image-placeholder">No image</div>
            )}
            {isEditing && editor.openImageEditor && (
              <button
                className="project-image-edit-btn project-image-edit-btn-details"
                data-editor-action="true"
                onClick={() => editor.openImageEditor(project.id)}
                title="Edit project image"
              >
                Edit Image
              </button>
            )}
          </div>
        )}

        <section className="details-section">
          {isEditing ? (
            <EditableText value={project.description} as="p" className="details-description" onSave={handleFieldSave('description')} multiline />
          ) : (
            <p className="details-description">{project.description}</p>
          )}
        </section>

        {(project.keyFeatures && project.keyFeatures.length > 0 || isEditing) && (
          <section className="details-section">
            <h2 className="details-section-title">{keyFeaturesTitle}</h2>
            <ul className="details-list">
              {(project.keyFeatures || []).map((feature, index) => (
                <li key={index}>
                  {isEditing ? (
                    <EditableText value={feature} onSave={handleArrayItemSave('keyFeatures', index)} />
                  ) : feature}
                </li>
              ))}
            </ul>
            {isEditing && (
              <button className="inline-add-btn" data-editor-action="true" onClick={() => handleAddArrayItem('keyFeatures', 'New feature')}>+ Add Feature</button>
            )}
          </section>
        )}

        {(project.learningHighlights && project.learningHighlights.length > 0 || isEditing) && (
          <section className="details-section">
            <h2 className="details-section-title">{whatILearnedTitle}</h2>
            <ul className="details-list">
              {(project.learningHighlights || []).map((highlight, index) => (
                <li key={index}>
                  {isEditing ? (
                    <EditableText value={highlight} onSave={handleArrayItemSave('learningHighlights', index)} />
                  ) : highlight}
                </li>
              ))}
            </ul>
            {isEditing && (
              <button className="inline-add-btn" data-editor-action="true" onClick={() => handleAddArrayItem('learningHighlights', 'New highlight')}>+ Add Highlight</button>
            )}
          </section>
        )}

        <section className="details-section">
            <h2 className="details-section-title">{techStackTitle}</h2>
          <div className="details-tech-stack">
            {(project.techStack || []).map((tech, index) => (
              <span key={index} className="details-tech-tag">
                {isEditing ? (
                  <EditableText value={tech} onSave={handleArrayItemSave('techStack', index)} />
                ) : tech}
              </span>
            ))}
            {isEditing && (
              <button className="inline-add-btn inline-add-btn-tag" data-editor-action="true" onClick={() => handleAddArrayItem('techStack', 'New Tech')}>+</button>
            )}
          </div>
        </section>

        {(project.liveLink || project.clientRepo || project.serverRepo) && (
          <section className="details-actions">
            {project.liveLink && (isEditing ? (
              <span className="btn btn-primary">
                <EditableText value={(project.liveLinkLabel && project.liveLinkLabel.trim()) || liveDemoLabel} onSave={handleFieldSave('liveLinkLabel')} />
              </span>
            ) : (
              <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {(project.liveLinkLabel && project.liveLinkLabel.trim()) || liveDemoLabel}
              </a>
            ))}
            {project.clientRepo && (isEditing ? (
              <span className="btn btn-secondary">
                <EditableText value={(project.clientRepoLabel && project.clientRepoLabel.trim()) || (project.clientRepo && project.serverRepo ? frontendRepoLabel : githubRepoLabel)} onSave={handleFieldSave('clientRepoLabel')} />
              </span>
            ) : (
              <a href={project.clientRepo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                {(project.clientRepoLabel && project.clientRepoLabel.trim()) || (project.clientRepo && project.serverRepo ? frontendRepoLabel : githubRepoLabel)}
              </a>
            ))}
            {project.serverRepo && (isEditing ? (
              <span className="btn btn-secondary">
                <EditableText value={(project.serverRepoLabel && project.serverRepoLabel.trim()) || backendRepoLabel} onSave={handleFieldSave('serverRepoLabel')} />
              </span>
            ) : (
              <a href={project.serverRepo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                {(project.serverRepoLabel && project.serverRepoLabel.trim()) || backendRepoLabel}
              </a>
            ))}
          </section>
        )}

        <div className="details-back">
          <Link to="/projects" className="back-link">
            &larr; {backToProjectsLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ProjectDetails;

import { useState } from 'react';
import { normalizeSlug } from '../../utils/cropUtils';

function ProjectSettingsPopover({ project, onClose, onUpdate, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!project) return null;

  return (
    <div className="project-settings-overlay" onClick={onClose}>
      <div className="project-settings-panel" onClick={e => e.stopPropagation()}>
        <div className="psp-header">
          <h3>Project Settings</h3>
          <button className="psp-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="psp-body">
          <div className="psp-field">
            <label>Slug</label>
            <input
              type="text"
              value={project.slug || ''}
              onChange={e => onUpdate('slug', normalizeSlug(e.target.value))}
            />
          </div>
          <div className="psp-field">
            <label>Live Link</label>
            <input
              type="text"
              value={project.liveLink || ''}
              onChange={e => onUpdate('liveLink', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="psp-field">
            <label>Client Repo</label>
            <input
              type="text"
              value={project.clientRepo || ''}
              onChange={e => onUpdate('clientRepo', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className="psp-field">
            <label>Server Repo</label>
            <input
              type="text"
              value={project.serverRepo || ''}
              onChange={e => onUpdate('serverRepo', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className="psp-field psp-checkbox">
            <label>
              <input
                type="checkbox"
                checked={!!project.featured}
                onChange={e => onUpdate('featured', e.target.checked)}
              />
              Featured
            </label>
          </div>
          <div className="psp-actions">
            {confirmDelete ? (
              <div className="psp-confirm-delete">
                <span>Delete this project?</span>
                <button className="psp-btn psp-btn-danger" onClick={() => { onDelete(); onClose(); }}>
                  Yes, Delete
                </button>
                <button className="psp-btn" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="psp-btn psp-btn-danger" onClick={() => setConfirmDelete(true)}>
                Delete Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectSettingsPopover;

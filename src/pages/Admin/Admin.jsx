import { useState, useEffect, useCallback, useRef } from 'react';
import { useProjects } from '../../contexts/ProjectsContext';
import { useNavigationGuard } from '../../contexts/NavigationGuardContext';
import { normalizeSlug, computeViewport, computeCropParams } from '../../utils/cropUtils';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './Admin.css';

const API = '/api';

const emptyProject = {
  slug: '',
  title: '',
  startYear: new Date().getFullYear(),
  description: '',
  shortDescription: '',
  techStack: [],
  clientRepo: '',
  serverRepo: '',
  liveLink: '',
  image: { src: '', cardPositionX: 50, cardPositionY: 50, cardZoom: 1 },
  featured: false,
  keyFeatures: [],
  learningHighlights: []
};

function isPlausibleUrl(value) {
  if (!value || !value.trim()) return true;
  return /^https?:\/\/.+/i.test(value.trim());
}

function Admin() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ ...emptyProject });
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imgDimensions, setImgDimensions] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const savedFormRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDirtyRef = useRef(false);
  const savedImgDimensionsRef = useRef(null);
  const { refresh: refreshContext } = useProjects();
  const { setGuard, clearGuard } = useNavigationGuard();

  // Manage blob URL lifecycle for pending image preview
  useEffect(() => {
    if (pendingFile) {
      const url = URL.createObjectURL(pendingFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [pendingFile]);

  const previewSrc = previewUrl || form.image.src;

  const isDirty = pendingFile !== null ||
    (savedFormRef.current && JSON.stringify(form) !== JSON.stringify(savedFormRef.current));
  isDirtyRef.current = isDirty;

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/health`);
      setServerStatus(res.ok ? 'online' : 'offline');
    } catch {
      setServerStatus('offline');
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API}/projects`);
      const data = await res.json();
      data.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
      setProjects(data);
      setServerStatus('online');
    } catch {
      setServerStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    fetchProjects();
  }, [checkHealth, fetchProjects]);

  // Protect against losing unsaved changes on page close/refresh
  useEffect(() => {
    const handler = (e) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Register navigation guard for header links
  useEffect(() => {
    setGuard(() => {
      if (isDirtyRef.current) {
        return window.confirm('You have unsaved changes. Discard them?');
      }
      return true;
    });
    return () => clearGuard();
  }, [setGuard, clearGuard]);

  // Guard browser back/forward via popstate
  useEffect(() => {
    const handlePopState = () => {
      if (isDirtyRef.current) {
        if (!window.confirm('You have unsaved changes. Discard them?')) {
          window.history.pushState({ adminGuard: true }, '', '/admin');
          return;
        }
      }
    };
    // Tag current entry without adding to history stack
    window.history.replaceState({ adminGuard: true }, '', '/admin');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  const clearPendingImage = () => {
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectProject = (project) => {
    if (isDirtyRef.current && !window.confirm('You have unsaved changes. Discard them?')) {
      return;
    }
    clearPendingImage();
    setSelected(project.id);
    setIsNew(false);
    const projectForm = {
      ...emptyProject,
      ...project,
      image: { ...emptyProject.image, ...(project.image || {}) }
    };
    setForm(projectForm);
    savedFormRef.current = JSON.parse(JSON.stringify(projectForm));
    setConfirmDelete(null);
    setImgDimensions(null);
  };

  const startNew = () => {
    if (isDirtyRef.current && !window.confirm('You have unsaved changes. Discard them?')) {
      return;
    }
    clearPendingImage();
    setSelected(null);
    setIsNew(true);
    const newForm = { ...emptyProject, image: { ...emptyProject.image } };
    setForm(newForm);
    savedFormRef.current = JSON.parse(JSON.stringify(newForm));
    setConfirmDelete(null);
    setImgDimensions(null);
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateImageField = (field, value) => {
    setForm(prev => ({
      ...prev,
      image: { ...prev.image, [field]: value }
    }));
  };

  const handleDiscard = () => {
    if (!isDirty) return;
    if (!window.confirm('Discard all unsaved changes?')) return;
    if (savedFormRef.current) {
      setForm(JSON.parse(JSON.stringify(savedFormRef.current)));
    }
    if (pendingFile) {
      // Restore original image dimensions instead of nulling the viewport
      setImgDimensions(savedImgDimensionsRef.current);
      savedImgDimensionsRef.current = null;
    }
    clearPendingImage();
  };

  const handlePointerDown = (e) => {
    const params = computeCropParams(imgDimensions);
    if (!params) return;
    e.preventDefault();
    setDragging(true);

    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = form.image.cardPositionX;
    const startPosY = form.image.cardPositionY;
    const rect = el.getBoundingClientRect();
    const { rangeX, rangeY } = params;
    const zoom = form.image.cardZoom || 1;

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let newPosX = startPosX;
      let newPosY = startPosY;
      if (rangeX > 0.001) {
        newPosX = startPosX + (dx / rect.width) / rangeX * 100 / zoom;
      }
      if (rangeY > 0.001) {
        newPosY = startPosY + (dy / rect.height) / rangeY * 100 / zoom;
      }

      newPosX = Math.max(0, Math.min(100, Math.round(newPosX)));
      newPosY = Math.max(0, Math.min(100, Math.round(newPosY)));

      setForm(prev => ({
        ...prev,
        image: { ...prev.image, cardPositionX: newPosX, cardPositionY: newPosY }
      }));
    };

    const handleUp = (upEvent) => {
      setDragging(false);
      el.releasePointerCapture(upEvent.pointerId);
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerup', handleUp);
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerup', handleUp);
  };

  const handleSave = async () => {
    const slug = normalizeSlug(form.slug);
    if (!slug || !form.title) {
      showMessage('Slug and Title are required.');
      return;
    }

    const duplicateSlug = projects.find(p =>
      p.slug === slug && p.id !== selected
    );
    if (duplicateSlug) {
      showMessage(`Slug "${slug}" is already used by "${duplicateSlug.title}".`);
      return;
    }

    // Validate URLs if provided
    const linkChecks = [
      { field: 'liveLink', label: 'Live Link' },
      { field: 'clientRepo', label: 'Client Repo' },
      { field: 'serverRepo', label: 'Server Repo' }
    ];
    for (const { field, label } of linkChecks) {
      if (!isPlausibleUrl(form[field])) {
        showMessage(`${label} must be a valid URL (starting with http:// or https://).`);
        return;
      }
    }

    let imageSrc = form.image.src;

    // Upload pending image first
    if (pendingFile) {
      const uploadBody = new FormData();
      uploadBody.append('image', pendingFile);
      try {
        const uploadRes = await fetch(`${API}/projects/${slug}/upload`, {
          method: 'POST',
          body: uploadBody
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) {
          showMessage(uploadResult.error || 'Image upload failed.');
          return;
        }
        imageSrc = uploadResult.imagePath;
      } catch {
        showMessage('Image upload failed. Is the server running?');
        return;
      }
    }

    const formToSave = {
      ...form,
      slug,
      image: { ...form.image, src: imageSrc }
    };
    // displayOrder is managed exclusively by the reorder endpoint
    delete formToSave.displayOrder;

    try {
      if (isNew) {
        const res = await fetch(`${API}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formToSave)
        });
        const created = await res.json();
        if (res.ok) {
          showMessage('Project created!');
          clearPendingImage();
          savedImgDimensionsRef.current = null;
          isDirtyRef.current = false;
          await fetchProjects();
          refreshContext();
          selectProject(created);
          setIsNew(false);
        } else {
          showMessage(created.error || 'Failed to create.');
        }
      } else {
        const res = await fetch(`${API}/projects/${selected}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formToSave)
        });
        const updated = await res.json();
        if (res.ok) {
          showMessage('Project saved!');
          clearPendingImage();
          savedImgDimensionsRef.current = null;
          await fetchProjects();
          refreshContext();
          const updatedForm = {
            ...emptyProject,
            ...updated,
            image: { ...emptyProject.image, ...(updated.image || {}) }
          };
          setForm(updatedForm);
          savedFormRef.current = JSON.parse(JSON.stringify(updatedForm));
        } else {
          showMessage(updated.error || 'Failed to save.');
        }
      }
    } catch {
      showMessage('Failed to save. Is the server running?');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('Project deleted.');
        clearPendingImage();
        setSelected(null);
        setIsNew(false);
        setForm({ ...emptyProject });
        savedFormRef.current = null;
        setConfirmDelete(null);
        await fetchProjects();
        refreshContext();
      }
    } catch {
      showMessage('Failed to delete.');
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    savedImgDimensionsRef.current = imgDimensions;
    setPendingFile(file);
    setImgDimensions(null);
    setForm(prev => ({
      ...prev,
      image: { ...prev.image, cardPositionX: 50, cardPositionY: 50, cardZoom: 1 }
    }));
  };

  const arrayToText = (arr) => (arr || []).join('\n');
  const textToArray = (text) => text.split('\n').map(s => s.trim()).filter(Boolean);

  const handleImageLoad = (e) => {
    setImgDimensions({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  };

  const moveProject = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= projects.length) return;
    const newList = [...projects];
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setProjects(newList);
    try {
      const res = await fetch(`${API}/projects/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newList.map(p => p.id) })
      });
      if (res.ok) {
        refreshContext();
      } else {
        fetchProjects();
      }
    } catch {
      fetchProjects();
    }
  };

  const viewport = computeViewport(imgDimensions, form.image);

  return (
    <main className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Project Admin</h1>
        <p className="admin-subtitle">Local development only - manage your portfolio projects.</p>

        {serverStatus === 'offline' && (
          <div className="admin-server-status">
            <p>Server is not running. Start it with <code>npm run server</code> or <code>npm run dev:admin</code>.</p>
            <button className="admin-btn" onClick={() => { checkHealth(); fetchProjects(); }}>
              Retry Connection
            </button>
          </div>
        )}

        {message && <div className="admin-message">{message}</div>}

        <div className="admin-layout">
          {/* Sidebar - Project List */}
          <aside className="admin-sidebar">
            <button className="admin-btn admin-btn-new" onClick={startNew}>+ New Project</button>
            <ul className="admin-project-list">
              {projects.map((p, idx) => (
                <li
                  key={p.id}
                  className={`admin-project-item ${selected === p.id ? 'active' : ''}`}
                  onClick={() => selectProject(p)}
                >
                  <span className="admin-project-item-title">{p.title}</span>
                  <div className="admin-item-controls">
                    {p.featured && <span className="admin-star">★</span>}
                    <button
                      className="admin-reorder-btn"
                      onClick={(e) => { e.stopPropagation(); moveProject(idx, -1); }}
                      disabled={idx === 0}
                      title="Move up"
                    >▲</button>
                    <button
                      className="admin-reorder-btn"
                      onClick={(e) => { e.stopPropagation(); moveProject(idx, 1); }}
                      disabled={idx === projects.length - 1}
                      title="Move down"
                    >▼</button>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content - Form */}
          <section className="admin-form-section">
            {(selected || isNew) ? (
              <>
                <h2 className="admin-form-title">{isNew ? 'New Project' : `Edit: ${form.title}`}</h2>

                <div className="admin-form">
                  {/* Basic Fields */}
                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Title</label>
                      <input type="text" value={form.title} onChange={e => updateField('title', e.target.value)} />
                    </div>
                    <div className="admin-field">
                      <label>Slug</label>
                      <input type="text" value={form.slug} onChange={e => updateField('slug', normalizeSlug(e.target.value))} />
                    </div>
                  </div>

                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Start Year</label>
                      <input type="number" value={form.startYear} onChange={e => updateField('startYear', parseInt(e.target.value) || '')} />
                    </div>
                    <div className="admin-field admin-field-checkbox">
                      <label>
                        <input type="checkbox" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} />
                        Featured
                      </label>
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Short Description</label>
                    <textarea rows={2} value={form.shortDescription} onChange={e => updateField('shortDescription', e.target.value)} />
                  </div>

                  <div className="admin-field">
                    <label>Full Description</label>
                    <textarea rows={4} value={form.description} onChange={e => updateField('description', e.target.value)} />
                  </div>

                  {/* Links */}
                  <div className="admin-field-row">
                    <div className="admin-field">
                      <label>Live Link (optional)</label>
                      <input type="text" value={form.liveLink} onChange={e => updateField('liveLink', e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="admin-field">
                      <label>Client Repo (optional)</label>
                      <input type="text" value={form.clientRepo} onChange={e => updateField('clientRepo', e.target.value)} placeholder="https://github.com/..." />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Server Repo (optional)</label>
                    <input type="text" value={form.serverRepo || ''} onChange={e => updateField('serverRepo', e.target.value)} placeholder="https://github.com/..." />
                  </div>

                  {/* Arrays */}
                  <div className="admin-field">
                    <label>Tech Stack (one per line)</label>
                    <textarea rows={4} value={arrayToText(form.techStack)} onChange={e => updateField('techStack', textToArray(e.target.value))} />
                  </div>

                  <div className="admin-field">
                    <label>Key Features (one per line)</label>
                    <textarea rows={4} value={arrayToText(form.keyFeatures)} onChange={e => updateField('keyFeatures', textToArray(e.target.value))} />
                  </div>

                  <div className="admin-field">
                    <label>Learning Highlights (one per line)</label>
                    <textarea rows={4} value={arrayToText(form.learningHighlights)} onChange={e => updateField('learningHighlights', textToArray(e.target.value))} />
                  </div>

                  {/* Image Section */}
                  <div className="admin-image-section">
                    <h3>Project Image</h3>

                    <div className="admin-field">
                      <label>Upload Image {pendingFile && <span className="admin-pending-badge">(pending save)</span>}</label>
                      <input type="file" accept="image/*" onChange={handleImageSelect} ref={fileInputRef} />
                    </div>

                    {form.image.src && !pendingFile && (
                      <div className="admin-field">
                        <label>Image Path</label>
                        <input type="text" value={form.image.src} readOnly className="admin-readonly" />
                      </div>
                    )}

                    {previewSrc && (
                      <div className="admin-crop-editor">
                        <h4>Card Image Framing</h4>
                        <p className="admin-crop-hint">Drag the image to reposition. Use the zoom slider to adjust scale. The highlighted area shows what will be visible in project cards.</p>

                        <div className="crop-editor-layout">
                          <div className="crop-preview-container">
                          <div
                              className={`crop-full-image-wrapper${dragging ? ' dragging' : ''}`}
                              onPointerDown={handlePointerDown}
                            >
                              <img
                                src={previewSrc}
                                alt="Full preview"
                                className="crop-full-image"
                                onLoad={handleImageLoad}
                                draggable={false}
                              />
                              {viewport && (
                                <div className="crop-mask">
                                  <div
                                    className="crop-viewport"
                                    style={viewport}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="crop-controls">
                            <div className="crop-control">
                              <label>Zoom: {form.image.cardZoom.toFixed(2)}x</label>
                              <input
                                type="range"
                                min="100"
                                max="300"
                                value={Math.round(form.image.cardZoom * 100)}
                                onChange={e => updateImageField('cardZoom', parseInt(e.target.value) / 100)}
                              />
                            </div>
                            <p className="crop-drag-hint">Drag the image to adjust position</p>
                          </div>
                        </div>

                        <div className="card-previews-section">
                          <h4>Card Preview — Real Sizes</h4>
                          <div className="card-previews-grid">
                            {[
                              { label: 'Mobile (375px)', width: 343 },
                              { label: 'Tablet (1024px)', width: 476 },
                              { label: 'Desktop (1440px)', width: 341 },
                            ].map(({ label, width }) => (
                              <div key={label} className="card-preview-slot">
                                <span className="card-preview-label">{label}</span>
                                <div
                                  className="card-preview-frame"
                                  style={{ width: `${width}px` }}
                                >
                                  <ProjectCard project={{
                                    ...form,
                                    image: { ...form.image, src: previewSrc },
                                    slug: form.slug || 'preview',
                                    techStack: form.techStack || [],
                                    keyFeatures: form.keyFeatures || [],
                                    learningHighlights: form.learningHighlights || []
                                  }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="admin-actions">
                    <button className="admin-btn admin-btn-save" onClick={handleSave}>
                      {isNew ? 'Create Project' : 'Save Changes'}
                    </button>
                    {isDirty && (
                      <button className="admin-btn admin-btn-discard" onClick={handleDiscard}>
                        Discard Changes
                      </button>
                    )}
                    {!isNew && (
                      <>
                        {confirmDelete === selected ? (
                          <div className="admin-confirm-delete">
                            <span>Are you sure?</span>
                            <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(selected)}>
                              Yes, Delete
                            </button>
                            <button className="admin-btn admin-btn-cancel" onClick={() => setConfirmDelete(null)}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button className="admin-btn admin-btn-danger" onClick={() => setConfirmDelete(selected)}>
                            Delete Project
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="admin-empty">
                <p>Select a project to edit or create a new one.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Admin;

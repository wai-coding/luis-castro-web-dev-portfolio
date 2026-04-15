import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { SiteContentContext } from '../../contexts/SiteContentContext';
import { EditorProvider } from '../../contexts/EditorContext';
import { useProjects, ProjectsContext } from '../../contexts/ProjectsContext';
import SiteEditorToolbar from './SiteEditorToolbar';
import SiteEditorViewport from './SiteEditorViewport';
import StructuredEditorPanel from './StructuredEditorPanel';
import ProjectImageEditor from '../../components/Editable/ProjectImageEditor';
import ProjectSettingsPopover from '../../components/Editable/ProjectSettingsPopover';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Home from '../Home/Home';
import About from '../About/About';
import Contact from '../Contact/Contact';
import Projects from '../Projects/Projects';
import ProjectDetails from '../ProjectDetails/ProjectDetails';

const API = '/api';

const PAGE_COMPONENTS = {
  home: Home,
  about: About,
  contact: Contact,
  projects: Projects,
};

const PAGE_EDIT_ACTIONS = {
  home: [
    { section: 'header.navLinks', label: 'Edit Nav' },
    { section: 'home.technologies', label: 'Edit Technologies' },
    { section: 'common', label: 'Common Labels' },
    { section: 'footer', label: 'Edit Footer' },
  ],
  about: [
    { section: 'header.navLinks', label: 'Edit Nav' },
    { section: 'about.sections', label: 'Edit Sections' },
    { section: 'about.education', label: 'Edit Education' },
    { section: 'about.experience', label: 'Edit Experience' },
    { section: 'about.certifications', label: 'Edit Certifications' },
    { section: 'about.languages', label: 'Edit Languages' },
    { section: 'common', label: 'Common Labels' },
    { section: 'footer', label: 'Edit Footer' },
  ],
  contact: [
    { section: 'header.navLinks', label: 'Edit Nav' },
    { section: 'contact.introLines', label: 'Edit Intro Lines' },
    { section: 'contact.details', label: 'Edit Contact Details' },
    { section: 'common', label: 'Common Labels' },
    { section: 'footer', label: 'Edit Footer' },
  ],
  projects: [
    { section: 'header.navLinks', label: 'Edit Nav' },
    { section: 'projects.labels', label: 'Edit Project Labels' },
    { section: 'common', label: 'Common Labels' },
    { section: 'footer', label: 'Edit Footer' },
  ],
  'project-details': [
    { section: 'header.navLinks', label: 'Edit Nav' },
    { section: 'projectDetails', label: 'Project Details Labels' },
    { section: 'common', label: 'Common Labels' },
    { section: 'footer', label: 'Edit Footer' },
  ],
};

function SiteVisualEditor({ draftContent, isDirty, onUpdate, onSave, onDiscard, showControls, onProjectDirtyChange, showMessage }) {
  const [activePage, setActivePage] = useState('home');
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [editorMode, setEditorMode] = useState(true);
  const [highlightEditable, setHighlightEditable] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [viewingProjectSlug, setViewingProjectSlug] = useState(null);
  const [imageEditorProjectId, setImageEditorProjectId] = useState(null);
  const [settingsProjectId, setSettingsProjectId] = useState(null);
  const { projects, refresh: refreshProjects } = useProjects();

  // Project draft state
  const [draftProjects, setDraftProjects] = useState([]);
  const projectsInitRef = useRef(null);
  const pendingImageFilesRef = useRef({});

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingImageFilesRef.current).forEach(({ blobUrl }) => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      });
    };
  }, []);

  // Merge incoming projects without losing inline draft edits
  useEffect(() => {
    const json = JSON.stringify(projects);
    if (json !== projectsInitRef.current) {
      const oldInit = projectsInitRef.current ? JSON.parse(projectsInitRef.current) : [];
      setDraftProjects(prev => {
        const incoming = JSON.parse(json);
        if (!oldInit.length) return incoming;
        // Keep any _isNew draft projects that don't exist in incoming
        const newDrafts = prev.filter(p => p._isNew);
        const merged = incoming.map(np => {
          const dp = prev.find(p => p.id === np.id);
          const op = oldInit.find(p => p.id === np.id);
          if (!dp || !op) return np;
          const m = { ...np };
          for (const key of Object.keys(dp)) {
            if (JSON.stringify(dp[key]) !== JSON.stringify(op[key])) {
              m[key] = dp[key];
            }
          }
          return m;
        });
        return [...merged, ...newDrafts];
      });
      projectsInitRef.current = json;
    }
  }, [projects]);

  const projectsDirty = projectsInitRef.current !== null &&
    JSON.stringify(draftProjects) !== projectsInitRef.current;

  const combinedDirty = isDirty || projectsDirty;

  // Report project dirty state to parent
  useEffect(() => {
    if (onProjectDirtyChange) onProjectDirtyChange(projectsDirty);
  }, [projectsDirty, onProjectDirtyChange]);

  const updateProject = useCallback((projectId, field, value) => {
    setDraftProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, [field]: value } : p
    ));
  }, []);

  // Add a draft project
  const addProject = useCallback(() => {
    const tempId = -(Date.now());
    const newProject = {
      id: tempId,
      _isNew: true,
      slug: `new-project-${Math.abs(tempId) % 100000}`,
      title: 'New Project',
      startYear: new Date().getFullYear(),
      description: 'Project description...',
      shortDescription: 'Short description...',
      techStack: [],
      clientRepo: '',
      serverRepo: '',
      liveLink: '',
      liveLinkLabel: '',
      clientRepoLabel: '',
      serverRepoLabel: '',
      image: { src: '', cardPositionX: 50, cardPositionY: 50, cardZoom: 1 },
      featured: false,
      keyFeatures: [],
      learningHighlights: [],
      displayOrder: 999,
    };
    setDraftProjects(prev => [...prev, newProject]);
  }, []);

  // Delete a project
  const deleteProject = useCallback(async (projectId) => {
    const project = draftProjects.find(p => p.id === projectId);
    if (!project) return;

    if (project._isNew) {
      setDraftProjects(prev => prev.filter(p => p.id !== projectId));
      const pending = pendingImageFilesRef.current[projectId];
      if (pending?.blobUrl) URL.revokeObjectURL(pending.blobUrl);
      delete pendingImageFilesRef.current[projectId];
      return;
    }

    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${API}/projects/${projectId}`, { method: 'DELETE' });
      if (res.ok) {
        setDraftProjects(prev => prev.filter(p => p.id !== projectId));
        if (projectsInitRef.current) {
          const init = JSON.parse(projectsInitRef.current);
          projectsInitRef.current = JSON.stringify(init.filter(p => p.id !== projectId));
        }
        refreshProjects();
        if (showMessage) showMessage('Project deleted.');
      }
    } catch {
      if (showMessage) showMessage('Failed to delete project.');
    }
  }, [draftProjects, refreshProjects, showMessage]);

  // Store a pending project image file
  const setProjectImage = useCallback((projectId, file) => {
    const old = pendingImageFilesRef.current[projectId];
    if (old?.blobUrl) URL.revokeObjectURL(old.blobUrl);

    const blobUrl = URL.createObjectURL(file);
    pendingImageFilesRef.current[projectId] = { file, blobUrl };

    setDraftProjects(prev => prev.map(p =>
      p.id === projectId ? {
        ...p,
        image: { ...(p.image || {}), src: blobUrl, cardPositionX: 50, cardPositionY: 50, cardZoom: 1 }
      } : p
    ));
  }, []);

  const openImageEditor = useCallback((projectId) => {
    setImageEditorProjectId(projectId);
  }, []);

  const openProjectSettings = useCallback((projectId) => {
    setSettingsProjectId(projectId);
  }, []);

  // Reorder projects by array of IDs
  const reorderProjects = useCallback((orderedIds) => {
    setDraftProjects(prev => {
      const ordered = orderedIds
        .map(id => prev.find(p => p.id === id))
        .filter(Boolean);
      const rest = prev.filter(p => !orderedIds.includes(p.id));
      const merged = [...ordered, ...rest];
      return merged.map((p, i) => ({ ...p, displayOrder: i + 1 }));
    });
  }, []);

  const overrideValue = useMemo(() => ({
    content: draftContent,
    loading: false,
    refresh: () => {},
  }), [draftContent]);

  const handleEditSection = useCallback((section) => {
    setActiveSection(section);
  }, []);

  // Handle in-page navigation inside the visual editor
  const PAGE_MAP = { '/': 'home', '/about': 'about', '/contact': 'contact', '/projects': 'projects' };
  const handleLinkNavigate = useCallback((href) => {
    // Project detail link: /projects/:slug
    const detailMatch = href.match(/^\/projects\/([^/]+)$/);
    if (detailMatch) {
      setViewingProjectSlug(detailMatch[1]);
      setActivePage('projects');
      return;
    }
    if (PAGE_MAP[href]) {
      setActivePage(PAGE_MAP[href]);
      setViewingProjectSlug(null);
    }
  }, []);

  // Clear project detail view when switching away from projects page
  useEffect(() => {
    if (activePage !== 'projects') setViewingProjectSlug(null);
  }, [activePage]);

  const editorContextValue = useMemo(() => ({
    editorMode,
    highlightEditable,
    updateDraft: onUpdate,
    updateProject,
    onEditSection: handleEditSection,
    addProject,
    deleteProject,
    setProjectImage,
    openImageEditor,
    openProjectSettings,
    reorderProjects,
  }), [editorMode, highlightEditable, onUpdate, updateProject, handleEditSection, addProject, deleteProject, setProjectImage, openImageEditor, openProjectSettings, reorderProjects]);

  const projectsOverride = useMemo(() => ({
    projects: draftProjects,
    loading: false,
    refresh: () => {},
  }), [draftProjects]);

  // Persist project changes alongside site content
  const handleSaveAll = useCallback(async () => {
    await onSave();

    if (!projectsInitRef.current) return;

    let updatedDraft = [...draftProjects];
    const pending = { ...pendingImageFilesRef.current };

    // Create new projects first
    for (let i = 0; i < updatedDraft.length; i++) {
      const p = updatedDraft[i];
      if (!p._isNew) continue;

      const body = { ...p };
      delete body._isNew;
      delete body.id;
      delete body.displayOrder;
      // Don't send blob URL as image src
      if (body.image?.src?.startsWith('blob:')) {
        body.image = { ...body.image, src: '' };
      }

      try {
        const res = await fetch(`${API}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const created = await res.json();
          // Remap pending image from temp ID to real ID
          if (pending[p.id]) {
            pending[created.id] = pending[p.id];
            delete pending[p.id];
          }
          updatedDraft[i] = { ...created };
        }
      } catch { /* handled by feedback */ }
    }

    // Upload pending images
    for (const [pidStr, { file, blobUrl }] of Object.entries(pending)) {
      const pid = parseInt(pidStr);
      const proj = updatedDraft.find(d => d.id === pid);
      if (!proj) continue;

      const form = new FormData();
      form.append('image', file);
      try {
        const res = await fetch(`${API}/projects/${proj.slug}/upload`, { method: 'POST', body: form });
        if (res.ok) {
          const { imagePath } = await res.json();
          updatedDraft = updatedDraft.map(d =>
            d.id === pid ? { ...d, image: { ...d.image, src: imagePath } } : d
          );
          URL.revokeObjectURL(blobUrl);
        }
      } catch { /* handled by feedback */ }
    }

    // Update modified projects
    const original = JSON.parse(projectsInitRef.current);
    for (const proj of updatedDraft) {
      if (proj._isNew) continue; // failed to create, skip
      const orig = original.find(o => o.id === proj.id);
      if (orig && JSON.stringify(proj) === JSON.stringify(orig)) continue;

      try {
        const body = { ...proj };
        delete body.displayOrder;
        await fetch(`${API}/projects/${proj.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch { /* handled by feedback */ }
    }

    // Persist project order
    const originalOrder = JSON.parse(projectsInitRef.current);
    const cleanForReorder = updatedDraft.filter(p => !p._isNew && p.id > 0);
    const orderChanged = cleanForReorder.length > 0 && (
      cleanForReorder.length !== originalOrder.length ||
      cleanForReorder.some((p, i) => p.displayOrder !== originalOrder.find(o => o.id === p.id)?.displayOrder)
    );
    if (orderChanged) {
      try {
        const orderedIds = cleanForReorder
          .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999))
          .map(p => p.id);
        await fetch(`${API}/projects/reorder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds }),
        });
      } catch { /* handled by feedback */ }
    }

    // Refresh local state
    pendingImageFilesRef.current = {};
    const cleanDraft = updatedDraft.filter(p => !p._isNew);
    refreshProjects();
    projectsInitRef.current = JSON.stringify(cleanDraft);
    setDraftProjects(cleanDraft);
  }, [onSave, draftProjects, refreshProjects]);

  // Reset project drafts and pending images on discard
  const handleDiscardAll = useCallback(() => {
    onDiscard();
    if (projectsInitRef.current) {
      setDraftProjects(JSON.parse(projectsInitRef.current));
    }
    Object.values(pendingImageFilesRef.current).forEach(({ blobUrl }) => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    });
    pendingImageFilesRef.current = {};
    setImageEditorProjectId(null);
    setSettingsProjectId(null);
  }, [onDiscard]);

  const PageComponent = PAGE_COMPONENTS[activePage] || Home;
  const currentPageKey = viewingProjectSlug ? 'project-details' : activePage;

  if (!draftContent) {
    return (
      <div className="admin-empty">
        <p>Loading site content...</p>
      </div>
    );
  }

  const imageEditorProject = imageEditorProjectId ? draftProjects.find(p => p.id === imageEditorProjectId) : null;
  const settingsProject = settingsProjectId ? draftProjects.find(p => p.id === settingsProjectId) : null;

  return (
    <div className="site-visual-editor">
      {showControls && (
        <aside className="editor-side-panel">
          <SiteEditorToolbar
            editorMode={editorMode}
            onToggleEditorMode={() => setEditorMode(m => !m)}
            highlightEditable={highlightEditable}
            onToggleHighlight={() => setHighlightEditable(h => !h)}
            deviceMode={deviceMode}
            onDeviceChange={setDeviceMode}
            isDirty={combinedDirty}
            onSave={handleSaveAll}
            onDiscard={handleDiscardAll}
            activePage={activePage}
            onPageChange={setActivePage}
            viewingProjectSlug={viewingProjectSlug}
            viewingProjectTitle={viewingProjectSlug ? draftProjects.find(p => p.slug === viewingProjectSlug)?.title : null}
            onBackToProjects={() => setViewingProjectSlug(null)}
          />
        </aside>
      )}

      <SiteEditorViewport deviceMode={deviceMode} editorMode={editorMode} onLinkNavigate={handleLinkNavigate}>
        <EditorProvider value={editorContextValue}>
          <SiteContentContext.Provider value={overrideValue}>
            <ProjectsContext.Provider value={projectsOverride}>
              <div className="visual-editor-app">
                <Header />
                {viewingProjectSlug ? (
                  <ProjectDetails projectSlug={viewingProjectSlug} />
                ) : (
                  <PageComponent />
                )}
                <Footer />
              </div>
            </ProjectsContext.Provider>
          </SiteContentContext.Provider>
        </EditorProvider>
      </SiteEditorViewport>

      {showControls && editorMode && (
        <aside className="editor-right-panel">
          <div className="right-panel-header">Edit Actions</div>
          <div className="right-panel-actions">
            {(PAGE_EDIT_ACTIONS[currentPageKey] || []).map(action => (
              <button
                key={action.section}
                className="right-panel-btn"
                onClick={() => handleEditSection(action.section)}
              >
                {action.label}
              </button>
            ))}
            {currentPageKey === 'projects' && (
              <button
                className="right-panel-btn right-panel-btn-add"
                onClick={() => addProject()}
              >
                + Add Project
              </button>
            )}
          </div>
        </aside>
      )}

      {activeSection && (
        <StructuredEditorPanel
          section={activeSection}
          content={draftContent}
          onUpdate={onUpdate}
          onClose={() => setActiveSection(null)}
        />
      )}

      {imageEditorProject && (
        <ProjectImageEditor
          project={imageEditorProject}
          onClose={() => setImageEditorProjectId(null)}
          onUpdateImage={(updates) => {
            updateProject(imageEditorProjectId, 'image', { ...imageEditorProject.image, ...updates });
          }}
          onSelectFile={(file) => setProjectImage(imageEditorProjectId, file)}
        />
      )}

      {settingsProject && (
        <ProjectSettingsPopover
          project={settingsProject}
          onClose={() => setSettingsProjectId(null)}
          onUpdate={(field, value) => updateProject(settingsProjectId, field, value)}
          onDelete={() => {
            deleteProject(settingsProjectId);
            setSettingsProjectId(null);
          }}
        />
      )}

      {showControls && draftProjects.length === 0 && (activePage === 'home' || activePage === 'projects') && (
        <p className="admin-field-hint visual-editor-hint">
          No projects loaded yet. Home and Projects previews will be empty.
        </p>
      )}
    </div>
  );
}

export default SiteVisualEditor;

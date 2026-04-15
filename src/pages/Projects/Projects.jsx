import { useState, useRef } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import EditableText from '../../components/Editable/EditableText';
import { useProjects } from '../../contexts/ProjectsContext';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { useEditor } from '../../contexts/EditorContext';
import './Projects.css';

function Projects() {
  const { projects, loading } = useProjects();
  const { content } = useSiteContent();
  const editor = useEditor();
  const isEditing = editor?.editorMode;
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragCounterRef = useRef(0);

  const pc = content?.projects || {};
  const pageTitle = pc.pageTitle || 'My Projects';
  const pageDescription = pc.pageDescription || '';
  const filtersLabel = pc.filtersLabel || 'Filters';
  const clearFiltersLabel = pc.clearFiltersLabel || 'Clear all';
  const noResultsMessage = pc.noResultsMessage || 'No projects match the selected filters.';

  const sorted = [...projects].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  const allTechTags = [...new Set(projects.flatMap((project) => project.techStack || []))].sort();

  const filteredProjects = selectedTechs.length === 0
    ? sorted
    : sorted.filter((project) =>
        selectedTechs.every((tech) => (project.techStack || []).includes(tech))
      );

  if (loading) return null;

  const toggleTech = (tech) => {
    setSelectedTechs((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSelectedTechs([]);
  };

  // Enable drag-and-drop reordering only in editor mode with no active filters
  const canDrag = isEditing && selectedTechs.length === 0 && editor?.reorderProjects;

  const handleDragStart = (e, projectId) => {
    if (!canDrag) return;
    setDraggedId(projectId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(projectId));
  };

  const handleDragEnter = (e, projectId) => {
    if (!canDrag || draggedId === null) return;
    e.preventDefault();
    dragCounterRef.current++;
    setDragOverId(projectId);
  };

  const handleDragLeave = (e, projectId) => {
    if (!canDrag) return;
    dragCounterRef.current--;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      if (dragOverId === projectId) setDragOverId(null);
    }
  };

  const handleDragOver = (e) => {
    if (!canDrag) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    if (draggedId !== null && draggedId !== targetId && editor?.reorderProjects) {
      const currentOrder = sorted.map(p => p.id);
      const fromIndex = currentOrder.indexOf(draggedId);
      const toIndex = currentOrder.indexOf(targetId);
      if (fromIndex !== -1 && toIndex !== -1) {
        const newOrder = [...currentOrder];
        newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, draggedId);
        editor.reorderProjects(newOrder);
      }
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    dragCounterRef.current = 0;
  };

  return (
    <main className="projects">
      <div className="projects-container">
        <EditableText path={['projects', 'pageTitle']} value={pageTitle} as="h1" className="page-title" />
        {pageDescription && (
          <EditableText path={['projects', 'pageDescription']} value={pageDescription} as="p" className="page-description" />
        )}

        <div className="filters-wrapper">
          <button
            className="filters-toggle-btn"
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-expanded={filtersOpen}
          >
            {filtersLabel}{selectedTechs.length > 0 ? ` (${selectedTechs.length})` : ''}
            <span className={`filters-caret ${filtersOpen ? 'open' : ''}`}>&#9662;</span>
          </button>

          {filtersOpen && (
            <div className="filters-panel" role="group" aria-label="Filter projects by technology">
              <div className="filters-chips">
                {allTechTags.map((tech) => (
                  <button
                    key={tech}
                    className={`filter-chip ${selectedTechs.includes(tech) ? 'active' : ''}`}
                    onClick={() => toggleTech(tech)}
                    aria-pressed={selectedTechs.includes(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              {selectedTechs.length > 0 && (
                <button className="filters-clear-btn" onClick={clearFilters}>
                  {clearFiltersLabel}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            canDrag ? (
              <div
                key={project.id}
                className={`project-drag-wrapper${draggedId === project.id ? ' dragging' : ''}${dragOverId === project.id && draggedId !== project.id ? ' drag-over' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, project.id)}
                onDragEnter={(e) => handleDragEnter(e, project.id)}
                onDragLeave={(e) => handleDragLeave(e, project.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, project.id)}
                onDragEnd={handleDragEnd}
              >
                <span className="drag-handle" title="Drag to reorder">⠿</span>
                <ProjectCard project={project} />
              </div>
            ) : (
              <ProjectCard
                key={project.id}
                project={project}
              />
            )
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <EditableText path={['projects', 'noResultsMessage']} value={noResultsMessage} as="p" className="no-results" />
        )}
      </div>
    </main>
  );
}

export default Projects;

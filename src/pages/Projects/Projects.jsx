import { useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { useProjects } from '../../contexts/ProjectsContext';
import './Projects.css';

function Projects() {
  const { projects, loading } = useProjects();
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sorted = [...projects].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  const allTechTags = [...new Set(projects.flatMap((project) => project.techStack))].sort();

  // Filter projects: AND logic - show projects matching ALL selected techs
  const filteredProjects = selectedTechs.length === 0
    ? sorted
    : sorted.filter((project) =>
        selectedTechs.every((tech) => project.techStack.includes(tech))
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

  return (
    <main className="projects">
      <div className="projects-container">
        {/* Page Header */}
        <h1 className="page-title">My Projects</h1>
        <p className="page-description">
          Selected projects built during and after my bootcamp, focused on real-world features such as authentication, CRUD, filtering, and clean UI patterns. Click any project to see key features, what I learned, and the repos.
        </p>

        {/* Filters Toggle */}
        <div className="filters-wrapper">
          <button
            className="filters-toggle-btn"
            onClick={() => setFiltersOpen((prev) => !prev)}
            aria-expanded={filtersOpen}
          >
            Filters{selectedTechs.length > 0 ? ` (${selectedTechs.length})` : ''}
            <span className={`filters-caret ${filtersOpen ? 'open' : ''}`}>▾</span>
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
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <p className="no-results">No projects match the selected filters.</p>
        )}
      </div>
    </main>
  );
}

export default Projects;

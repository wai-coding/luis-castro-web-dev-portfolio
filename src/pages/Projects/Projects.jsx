import { useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import projects from '../../data/projects';
import './Projects.css';

/**
 * Projects Page Component
 * -----------------------
 * Displays all projects from the data file.
 * Includes filtering by technology stack.
 * 
 * HOW IT WORKS:
 * 1. Imports the projects array from data/projects.js
 * 2. Extracts unique tech tags for filter buttons
 * 3. Filters projects based on selected tech
 * 4. Renders a ProjectCard component for each filtered project
 * 
 * TO ADD A NEW PROJECT:
 * Simply edit the src/data/projects.js file - this page will 
 * automatically display any new projects you add there.
 * Tech tags are automatically extracted for the filter buttons.
 */
function Projects() {
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract all unique tech tags from projects for filter buttons
  const allTechTags = [...new Set(projects.flatMap((project) => project.techStack))].sort();

  // Filter projects: AND logic — show projects matching ALL selected techs
  const filteredProjects = selectedTechs.length === 0
    ? projects
    : projects.filter((project) =>
        selectedTechs.every((tech) => project.techStack.includes(tech))
      );

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
              slug={project.slug}
              title={project.title}
              description={project.shortDescription}
              techStack={project.techStack}
              clientRepo={project.clientRepo}
              serverRepo={project.serverRepo}
              liveLink={project.liveLink}
              image={project.image}
              isFeatured={project.featured}
              startYear={project.startYear}
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

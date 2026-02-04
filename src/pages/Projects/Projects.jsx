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
  // State for the currently selected tech filter
  const [selectedTech, setSelectedTech] = useState('All');

  // Extract all unique tech tags from projects for filter buttons
  const allTechTags = [...new Set(projects.flatMap((project) => project.techStack))].sort();

  // Filter projects based on selected tech
  const filteredProjects = selectedTech === 'All'
    ? projects
    : projects.filter((project) => project.techStack.includes(selectedTech));

  return (
    <main className="projects">
      <div className="projects-container">
        {/* Page Header */}
        <h1 className="page-title">My Projects</h1>
        <p className="projects-description">
          Here are some projects I've built during and after my bootcamp. 
          Each one taught me something new about web development.
        </p>

        {/* Filter Buttons */}
        <nav className="filter-buttons" aria-label="Filter projects by technology">
          <button
            className={`filter-btn ${selectedTech === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedTech('All')}
            aria-pressed={selectedTech === 'All'}
          >
            All
          </button>
          {allTechTags.map((tech) => (
            <button
              key={tech}
              className={`filter-btn ${selectedTech === tech ? 'active' : ''}`}
              onClick={() => setSelectedTech(tech)}
              aria-pressed={selectedTech === tech}
            >
              {tech}
            </button>
          ))}
        </nav>

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
            />
          ))}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <p className="no-results">No projects found for "{selectedTech}".</p>
        )}
      </div>
    </main>
  );
}

export default Projects;

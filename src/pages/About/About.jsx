import './About.css';

/**
 * About Page Component
 * --------------------
 * Tells your story and learning journey.
 * This is where you can share your background, 
 * bootcamp experience, and career goals.
 */
function About() {
  return (
    <main className="about">
      <div className="about-container">
        {/* Page Header */}
        <h1 className="page-title">About Me</h1>

        {/* Background */}
        <section className="about-section">
          <h2 className="section-title">Background</h2>
          <p className="about-text">
            I'm a Junior Full Stack Developer focused on building clean, practical web applications.
            Before transitioning into development, I had a background in DJing and music production, 
            which helped shape my creative and problem-solving approach.
          </p>
        </section>

        {/* Education */}
        <section className="about-section">
          <h2 className="section-title">Education</h2>
          <p className="about-text">
            I recently completed a Web Development bootcamp at Ironhack (2025–2026).
            During the program, I built a strong foundation in full stack development,
            working with React on the frontend and Node.js, Express.js, and MongoDB on the backend.
          </p>
        </section>

        {/* Career Goals */}
        <section className="about-section">
          <h2 className="section-title">Career Goals</h2>
          <p className="about-text">
            I'm looking for a junior full stack role where I can contribute to real-world applications, 
            improve my React and backend skills, and grow within a collaborative development team.
          </p>
        </section>

        {/* Strengths */}
        <section className="about-section">
          <h2 className="section-title">Strengths</h2>
          <ul className="about-text">
            <li>Strong fundamentals in full stack web development</li>
            <li>Attention to detail and clean code practices</li>
            <li>Fast learner with a hands-on, project-driven mindset</li>
          </ul>
        </section>

        {/* Skills Summary */}
        <section className="about-section">
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Frontend</h3>
              <ul>
                <li>React</li>
                <li>JavaScript</li>
                <li>HTML & CSS</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>REST API</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Tools</h3>
              <ul>
                <li>Git & GitHub</li>
                <li>VS Code</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;

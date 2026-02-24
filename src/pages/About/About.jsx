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
            I'm a Full-Stack Web Developer focused on building clean, maintainable web applications with the MERN stack.
            I care about readable code, good UX, and shipping features end-to-end.
            I focus on writing readable, maintainable code and understanding the full flow of an application.
          </p>
        </section>

        {/* Education */}
        <section className="about-section">
          <h2 className="section-title">Education</h2>
          <p className="about-text">
            I completed Ironhack's Web Development Bootcamp (2025–2026), where I built and deployed multiple projects covering frontend, backend, authentication, and REST API integration.
          </p>
        </section>

        {/* Career Goals */}
        <section className="about-section">
          <h2 className="section-title">Career Goals</h2>
          <p className="about-text">
            I'm looking for a Junior Frontend or Full-Stack role where I can contribute to production code, collaborate with experienced developers, and continue growing.
          </p>
        </section>

        {/* Strengths */}
        <section className="about-section">
          <h2 className="section-title">Strengths</h2>
          <ul className="about-text">
            <li>REST APIs with Node.js / Express and MongoDB (Mongoose)</li>
            <li>JWT authentication and protected routes</li>
            <li>Clean, component-based React UI (routing, state, reusable components)</li>
            <li>Strong debugging mindset and attention to detail</li>
            <li>Comfortable with Git and iterative releases</li>
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
                <li>JavaScript (ES6+)</li>
                <li>HTML5 / CSS3</li>
                <li>React Router</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB + Mongoose</li>
                <li>REST APIs</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Tools</h3>
              <ul>
                <li>Git / GitHub</li>
                <li>VS Code</li>
                <li>Netlify / GitHub Pages (deployment)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;

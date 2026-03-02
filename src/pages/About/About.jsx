import './About.css';

function About() {
  return (
    <main className="about">
      <div className="about-container">

        {/* Page Header */}
        <h1 className="page-title">About Me</h1>
        <p className="projects-description">
          A structured and system-oriented Junior Full Stack Developer with a background in technology-driven creative fields. Focused on building scalable applications using modern JavaScript technologies and clean architecture principles.
        </p>

        {/* Who Am I */}
        <section className="about-section">
          <h2 className="section-title">Who Am I</h2>
          <p className="about-text">
            Luis is a Junior Full Stack Developer building structured and
            scalable web applications with the MERN stack.
          </p>
          <p className="about-text">
            Clean architecture, maintainable systems, and long-term product
            thinking guide the way software is designed and implemented.
          </p>
          <p className="about-text">
            Based in Porto, Portugal and open to remote and international
            opportunities.
          </p>
        </section>

        {/* How I Think About Building */}
        <section className="about-section">
          <h2 className="section-title">How I Think About Building</h2>
          <p className="about-text">
            A background in digital audio production and interactive systems
            shaped a system-oriented mindset. Structure first, implementation
            second.
          </p>
          <p className="about-text">
            Applications are built with clarity and separation of concerns in
            mind. Backend logic follows MVC principles, RESTful APIs are
            designed for scalability, and React interfaces remain modular and
            predictable as products grow.
          </p>
          <p className="about-text">
            Shipping early, iterating fast, and refining architecture over time
            is a preferred workflow.
          </p>
        </section>

        {/* What I'm Looking For */}
        <section className="about-section">
          <h2 className="section-title">What I'm Looking For</h2>
          <p className="about-text">
            A Junior Full Stack or Frontend Developer role within a
            product-driven team.
          </p>
          <p className="about-text">
            Particular interest in startups or growing companies building
            meaningful platforms where ownership, clean architecture, and code
            quality matter.
          </p>
          <p className="about-text">
            Contributing to real-world systems while continuing to grow in a
            structured and collaborative environment is the next step.
          </p>
        </section>

        {/* Education */}
        <section className="about-section">
          <h2 className="section-title">Education</h2>
          <div className="education-entry">
            <h3>Full Stack Web Development Bootcamp</h3>
            <p className="institution">Ironhack, 2025-2026</p>
            <ul className="education-list">
              <li>Full-time immersive program (+400 hours) focused on modern JavaScript and full-stack development</li>
              <li>Built and deployed React-based frontend applications with modular component architecture</li>
              <li>Developed backend systems using Node.js and Express</li>
              <li>Designed RESTful APIs and implemented JWT-based authentication</li>
              <li>Applied client-server architecture and collaborative Git workflows</li>
            </ul>
          </div>
          <div className="education-entry">
            <h3>Bachelor of Arts in Music Production & Electronic Music</h3>
            <p className="institution">Instituto Politecnico de Castelo Branco, 2018-2021</p>
            <ul className="education-list">
              <li>Worked with programming-oriented tools such as Max/MSP, Java, and Arduino</li>
              <li>Focused on music production and technology-driven creative systems</li>
              <li>Extensive work with digital audio systems and signal flow design</li>
              <li>Strengthened analytical thinking and structured problem-solving</li>
            </ul>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="about-section">
          <h2 className="section-title">Professional Experience</h2>

          <div className="experience-entry">
            <h3>DJ & Music Producer</h3>
            <p className="institution">Freelance, 2012-Present</p>
            <ul className="experience-list">
              <li>Designed and maintained complex technical setups for live performances</li>
              <li>Worked with programming-oriented tools and hardware controllers</li>
              <li>Managed projects from planning to execution under strict deadlines</li>
            </ul>
          </div>

          <div className="experience-entry">
            <h3>DJ Teacher</h3>
            <p className="institution">35mm Portugal / WAI Studio / Freelance, 2023-Present</p>
            <ul className="experience-list">
              <li>Delivered structured lessons focused on digital audio tools and production workflows</li>
              <li>Guided students through technical setups and systematic problem-solving</li>
              <li>Adapted teaching methods to different learning styles</li>
              <li>Strengthened communication, mentoring, and planning abilities</li>
            </ul>
          </div>

          <div className="experience-entry">
            <h3>ICT Teacher & Music Teacher</h3>
            <p className="institution">Portuguese Public Education System, 2022</p>
            <ul className="experience-list">
              <li>Planned and delivered structured lessons within defined curricula</li>
              <li>Developed strong communication and classroom management skills</li>
              <li>Worked within institutional guidelines and deadlines</li>
            </ul>
          </div>

          <div className="experience-entry">
            <h3>Technical Advisor - Musical Instruments & Audio Equipment</h3>
            <p className="institution">Faminho, 2017-2018</p>
            <ul className="experience-list">
              <li>Provided technical consultation and troubleshooting</li>
              <li>Assisted clients in selecting and configuring audio equipment</li>
              <li>Strengthened technical support and communication skills</li>
            </ul>
          </div>
        </section>

        {/* Certifications */}
        <section className="about-section">
          <h2 className="section-title">Certifications</h2>
          <div className="certification-entry">
            <h3>First Certificate in English (FCE), 2012</h3>
            <p className="institution">Cambridge English Language Assessment</p>
          </div>
          <div className="certification-entry">
            <h3>Introduction to HTML, CSS & JavaScript, 2021</h3>
            <p className="institution">European Parliament</p>
          </div>
        </section>

        {/* Languages */}
        <section className="about-section">
          <h2 className="section-title">Languages</h2>
          <ul className="languages-list">
            <li>Portuguese (Native)</li>
            <li>English (Fluent)</li>
            <li>Spanish (Beginner)</li>
          </ul>
        </section>

      </div>
    </main>
  );
}

export default About;

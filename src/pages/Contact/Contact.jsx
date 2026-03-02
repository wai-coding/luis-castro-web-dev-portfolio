import './Contact.css';

/**
 * Contact Page Component
 * ----------------------
 * Simple contact section with email and social links.
 * No backend required - just direct links.
 * 
 * NOTE: The email link uses mailto: which opens the user's 
 * default email client. This is the simplest approach 
 * without needing a backend.
 */
function Contact() {
  return (
    <main className="contact">
      <div className="contact-container">
        {/* Page Header */}
        <h1 className="page-title">Get In Touch</h1>
        <p className="projects-description">
          Open to Junior Frontend or Full-Stack opportunities (remote or hybrid).
          Porto, Portugal, available worldwide. The fastest way to reach me is email or LinkedIn.
        </p>

        {/* Contact Options */}
        <div className="contact-options">
          {/* Email */}
          <div className="contact-card">
            <h2 className="contact-label">Email</h2>
            <a 
              href="mailto:luiscastrocoding@gmail.com" 
              className="contact-link"
            >
              luiscastrocoding@gmail.com
            </a>
          </div>

          {/* LinkedIn */}
          <div className="contact-card">
            <h2 className="contact-label">LinkedIn</h2>
            <a 
              href="https://www.linkedin.com/in/luiscastrocoding" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              linkedin.com/in/luiscastrocoding
            </a>
          </div>

          {/* GitHub */}
          <div className="contact-card">
            <h2 className="contact-label">GitHub</h2>
            <a 
              href="https://github.com/wai-coding" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              github.com/wai-coding
            </a>
          </div>
        </div>

        {/* Alternative: Direct Email Button */}
        <div className="email-cta">
          <a 
            href="mailto:luiscastrocoding@gmail.com" 
            className="email-button"
          >
            Send Me an Email
          </a>
        </div>
      </div>
    </main>
  );
}

export default Contact;

import { useState } from 'react';
import './Contact.css';

/**
 * Contact Page Component
 * ----------------------
 * Simple contact section with email and social links.
 * No backend required - just direct links.
 *
 * Uses inline SVG icons to avoid extra dependencies.
 */
function Contact() {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        {/* Page Header */}
        <h1 className="page-title">Get In Touch</h1>
        <div className="page-description">
          <p>Feel free to reach out through any of the options below.</p>
          <p>I&apos;m open to remote and international opportunities.</p>
          <p>Based in Santo Tirso (Porto, Portugal).</p>
        </div>

        {/* Contact Cards */}
        <div className="contact-grid">
          {/* Email */}
          <div className="contact-card">
            <span className="contact-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
              </svg>
            </span>
            <div className="contact-text">
              <h2 className="contact-label">Email</h2>
              <div className="contact-value-row">
                <a
                  href="mailto:luiscastrocoding@gmail.com"
                  className="contact-link"
                  aria-label="Send email to luiscastrocoding@gmail.com"
                >
                  luiscastrocoding@gmail.com
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy('luiscastrocoding@gmail.com', 'email')}
                  aria-label="Copy email"
                >
                  Copy
                </button>
                {copiedField === 'email' && (
                  <span className="copy-feedback">Email copied</span>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="contact-card">
            <span className="contact-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="24" height="24">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.83-48.3 93.97 0 111.31 61.9 111.31 142.3V448z"/>
              </svg>
            </span>
            <div className="contact-text">
              <h2 className="contact-label">LinkedIn</h2>
              <div className="contact-value-row">
                <a
                  href="https://www.linkedin.com/in/luiscastrocoding/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  aria-label="Visit LinkedIn profile"
                >
                  linkedin.com/in/luiscastrocoding
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy('https://www.linkedin.com/in/luiscastrocoding/', 'linkedin')}
                  aria-label="Copy LinkedIn"
                >
                  Copy
                </button>
                {copiedField === 'linkedin' && (
                  <span className="copy-feedback">LinkedIn copied</span>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="contact-card">
            <span className="contact-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="24" height="24">
                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
              </svg>
            </span>
            <div className="contact-text">
              <h2 className="contact-label">Location</h2>
              <div className="contact-value-row">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Vila%20das%20Aves%2C%20Santo%20Tirso%2C%20Portugal"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                  aria-label="Open location in Google Maps"
                >
                  Santo Tirso (Porto, Portugal)
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy('Santo Tirso (Porto, Portugal)', 'location')}
                  aria-label="Copy location"
                >
                  Copy
                </button>
                {copiedField === 'location' && (
                  <span className="copy-feedback">Location copied</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;

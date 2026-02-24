import './Footer.css';

/**
 * Footer Component
 * ----------------
 * Simple footer with social links and copyright.
 * Appears at the bottom of all pages.
 */
function Footer() {
  // Get current year dynamically for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Social Links */}
        <nav className="social-links" aria-label="Social media links">
          <a 
            href="https://github.com/wai-coding" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub Profile"
          >
            GitHub
          </a>
          <a 
            href="https://www.linkedin.com/in/luiscastrocoding" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn Profile"
          >
            LinkedIn
          </a>
        </nav>

        {/* Copyright */}
        <p className="copyright">
          © {currentYear} Luís Castro. Built with React.
        </p>

        <p className="continuity-note">
          Currently seeking a Junior Frontend or Full-Stack role. Open to remote opportunities.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

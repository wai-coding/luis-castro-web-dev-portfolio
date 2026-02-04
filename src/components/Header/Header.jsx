import { Link, useLocation } from 'react-router-dom';
import './Header.css';

/**
 * Header Component
 * ----------------
 * Main navigation header that appears on all pages.
 * Uses React Router's Link component for client-side navigation.
 * 
 * The useLocation hook highlights the current active page in the nav.
 */
function Header() {
  // Get current URL path to highlight active nav link
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo/Name - links back to home */}
        <Link to="/" className="logo">
          Luís Castro
        </Link>

        {/* Main Navigation */}
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
                aria-current={currentPath === '/' ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}
                aria-current={currentPath === '/about' ? 'page' : undefined}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/projects" 
                className={`nav-link ${currentPath === '/projects' ? 'active' : ''}`}
                aria-current={currentPath === '/projects' ? 'page' : undefined}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}
                aria-current={currentPath === '/contact' ? 'page' : undefined}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

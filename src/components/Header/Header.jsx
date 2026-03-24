import { Link, useLocation } from 'react-router-dom';
import { useNavigationGuard } from '../../contexts/NavigationGuardContext';
import './Header.css';

function GuardedLink({ to, children, ...props }) {
  const { canNavigate } = useNavigationGuard();

  const handleClick = (e) => {
    if (!canNavigate()) {
      e.preventDefault();
    }
  };

  return <Link to={to} onClick={handleClick} {...props}>{children}</Link>;
}

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="header">
      <div className="header-container">
        <nav className="nav">
          <ul className="nav-list">
            <li>
              <GuardedLink 
                to="/" 
                className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
                aria-current={currentPath === '/' ? 'page' : undefined}
              >
                Home
              </GuardedLink>
            </li>
            <li>
              <GuardedLink 
                to="/projects" 
                className={`nav-link ${currentPath === '/projects' ? 'active' : ''}`}
                aria-current={currentPath === '/projects' ? 'page' : undefined}
              >
                Projects
              </GuardedLink>
            </li>
            <li>
              <GuardedLink 
                to="/about" 
                className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}
                aria-current={currentPath === '/about' ? 'page' : undefined}
              >
                About Me
              </GuardedLink>
            </li>
            <li>
              <GuardedLink 
                to="/contact" 
                className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}
                aria-current={currentPath === '/contact' ? 'page' : undefined}
              >
                Contact
              </GuardedLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

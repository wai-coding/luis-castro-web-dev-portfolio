import { Link, useLocation } from 'react-router-dom';
import { useNavigationGuard } from '../../contexts/NavigationGuardContext';
import { useSiteContent } from '../../contexts/SiteContentContext';
import EditableText from '../Editable/EditableText';
import './Header.css';

const defaultNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'About Me', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

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
  const { content } = useSiteContent();

  const navLinks = content?.header?.navLinks?.length > 0
    ? content.header.navLinks
    : defaultNavLinks;

  return (
    <header className="header">
      <div className="header-container">
        <nav className="nav">
          <div className="nav-inner">
            <ul className="nav-list">
              {navLinks.map((link, idx) => (
                <li key={link.path || idx}>
                  <GuardedLink
                    to={link.path}
                    className={`nav-link ${currentPath === link.path ? 'active' : ''}`}
                    aria-current={currentPath === link.path ? 'page' : undefined}
                  >
                    <EditableText
                      path={['header', 'navLinks', idx, 'label']}
                      value={link.label}
                    />
                  </GuardedLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

      </div>
    </header>
  );
}

export default Header;

import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { NavigationGuardProvider } from './contexts/NavigationGuardContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import Contact from './pages/Contact/Contact';
import './App.css';

const Admin = import.meta.env.DEV
  ? lazy(() => import('./pages/Admin/Admin.jsx'))
  : null;

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <NavigationGuardProvider>
    <SiteContentProvider>
    <ProjectsProvider>
      <div className="app">
        {!isAdmin && <Header />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/contact" element={<Contact />} />
          {import.meta.env.DEV && Admin && (
            <Route path="/admin" element={
              <Suspense fallback={<div className="admin-loading">Loading admin...</div>}>
                <Admin />
              </Suspense>
            } />
          )}
        </Routes>

        {!isAdmin && <Footer />}
      </div>
    </ProjectsProvider>
    </SiteContentProvider>
    </NavigationGuardProvider>
  );
}

export default App;

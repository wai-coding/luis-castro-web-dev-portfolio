import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProjectsProvider } from './contexts/ProjectsContext';
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
  return (
    <NavigationGuardProvider>
    <ProjectsProvider>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/contact" element={<Contact />} />
          {import.meta.env.DEV && Admin && (
            <Route path="/admin" element={
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading admin...</div>}>
                <Admin />
              </Suspense>
            } />
          )}
        </Routes>

        <Footer />
      </div>
    </ProjectsProvider>
    </NavigationGuardProvider>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import Contact from './pages/Contact/Contact';
import './App.css';

/**
 * App Component
 * -------------
 * The root component that defines the application structure.
 * 
 * STRUCTURE:
 * - Header (appears on all pages)
 * - Routes (page content changes based on URL)
 * - Footer (appears on all pages)
 * 
 * ROUTES:
 * /          -> Home page
 * /about     -> About page
 * /projects  -> Projects page
 * /contact   -> Contact page
 */
function App() {
  return (
    <div className="app">
      {/* Navigation Header */}
      <Header />

      {/* Page Content - Changes based on route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

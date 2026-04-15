import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DATA_FILE = path.join(PUBLIC_DIR, 'data', 'projects.json');
const SITE_CONTENT_FILE = path.join(PUBLIC_DIR, 'data', 'siteContent.json');
const PROJECTS_DIR = path.join(PUBLIC_DIR, 'projects');

app.use(express.json());

const ALLOWED_FIELDS = [
  'title', 'startYear', 'description', 'shortDescription', 'techStack',
  'clientRepo', 'serverRepo', 'liveLink',
  'liveLinkLabel', 'clientRepoLabel', 'serverRepoLabel',
  'image', 'featured',
  'keyFeatures', 'learningHighlights'
];

function readProjects() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

function normalizeSlug(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function pickAllowed(body) {
  const result = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  // Sanitize strings
  const stringFields = ['title', 'description', 'shortDescription', 'clientRepo', 'serverRepo', 'liveLink', 'liveLinkLabel', 'clientRepoLabel', 'serverRepoLabel'];
  for (const key of stringFields) {
    if (result[key] !== undefined) {
      result[key] = typeof result[key] === 'string' ? result[key].trim() : '';
    }
  }
  // Enforce arrays
  const arrayFields = ['techStack', 'keyFeatures', 'learningHighlights'];
  for (const key of arrayFields) {
    if (result[key] !== undefined) {
      result[key] = Array.isArray(result[key])
        ? result[key].filter(item => typeof item === 'string').map(s => s.trim())
        : [];
    }
  }
  // Enforce boolean
  if (result.featured !== undefined) {
    result.featured = !!result.featured;
  }
  // Enforce numeric startYear
  if (result.startYear !== undefined) {
    const year = parseInt(result.startYear, 10);
    result.startYear = (!isNaN(year) && year >= 1970 && year <= 2100) ? year : new Date().getFullYear();
  }
  // Sanitize image object
  if (result.image !== undefined) {
    if (typeof result.image !== 'object' || result.image === null || Array.isArray(result.image)) {
      result.image = { src: '', cardPositionX: 50, cardPositionY: 50, cardZoom: 1 };
    } else {
      result.image = {
        src: typeof result.image.src === 'string' ? result.image.src.trim() : '',
        cardPositionX: typeof result.image.cardPositionX === 'number' ? Math.max(0, Math.min(100, result.image.cardPositionX)) : 50,
        cardPositionY: typeof result.image.cardPositionY === 'number' ? Math.max(0, Math.min(100, result.image.cardPositionY)) : 50,
        cardZoom: typeof result.image.cardZoom === 'number' ? Math.max(1, Math.min(3, result.image.cardZoom)) : 1
      };
    }
  }
  return result;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// List all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = readProjects();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read project' });
  }
});

// Create project
app.post('/api/projects', (req, res) => {
  try {
    const projects = readProjects();

    const slug = normalizeSlug(req.body.slug);
    if (!slug) {
      return res.status(400).json({ error: 'A valid slug is required.' });
    }
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (projects.some(p => p.slug === slug)) {
      return res.status(409).json({ error: `Slug "${slug}" is already in use.` });
    }

    const allowed = pickAllowed(req.body);
    const maxId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) : 0;
    const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.displayOrder || 0)) : 0;

    const newProject = {
      id: maxId + 1,
      slug,
      title: allowed.title || '',
      startYear: allowed.startYear || new Date().getFullYear(),
      description: allowed.description || '',
      shortDescription: allowed.shortDescription || '',
      techStack: allowed.techStack || [],
      clientRepo: allowed.clientRepo || '',
      serverRepo: allowed.serverRepo || '',
      liveLink: allowed.liveLink || '',
      liveLinkLabel: allowed.liveLinkLabel || '',
      clientRepoLabel: allowed.clientRepoLabel || '',
      serverRepoLabel: allowed.serverRepoLabel || '',
      image: allowed.image || { src: '', cardPositionX: 50, cardPositionY: 50, cardZoom: 1 },
      featured: allowed.featured || false,
      displayOrder: maxOrder + 1,
      keyFeatures: allowed.keyFeatures || [],
      learningHighlights: allowed.learningHighlights || []
    };

    // Create project image directory
    const projectDir = path.join(PROJECTS_DIR, newProject.slug);
    if (newProject.slug && !fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
app.put('/api/projects/:id', (req, res) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Project not found' });

    const oldSlug = projects[index].slug;
    const newSlug = normalizeSlug(req.body.slug || oldSlug);

    // Check for duplicate slug (excluding self)
    if (projects.some(p => p.slug === newSlug && p.id !== projects[index].id)) {
      return res.status(409).json({ error: `Slug "${newSlug}" is already in use by another project.` });
    }

    // Title: use provided value or keep existing
    const title = (typeof req.body.title === 'string' && req.body.title.trim())
      ? req.body.title.trim()
      : projects[index].title;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const updates = pickAllowed(req.body);

    // If slug changed, rename the image directory and update image src
    if (oldSlug && newSlug && oldSlug !== newSlug) {
      const oldDir = path.join(PROJECTS_DIR, oldSlug);
      const newDir = path.join(PROJECTS_DIR, newSlug);
      if (fs.existsSync(oldDir)) {
        if (fs.existsSync(newDir)) {
          fs.rmSync(oldDir, { recursive: true, force: true });
        } else {
          fs.renameSync(oldDir, newDir);
        }
      }
      // Update image src path in whichever source has it
      const imageObj = updates.image ? { ...updates.image } : { ...projects[index].image };
      if (imageObj && imageObj.src && imageObj.src.includes(`/projects/${oldSlug}/`)) {
        imageObj.src = imageObj.src.replace(`/projects/${oldSlug}/`, `/projects/${newSlug}/`);
      }
      updates.image = imageObj;
    }

    // Merge whitelisted updates, force id and normalized slug
    projects[index] = {
      ...projects[index],
      ...updates,
      id: projects[index].id,
      slug: newSlug
    };
    writeProjects(projects);
    res.json(projects[index]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Reorder projects
app.post('/api/projects/reorder', (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }
    const projects = readProjects();
    const existingIds = new Set(projects.map(p => p.id));

    // All IDs must be integers
    if (!orderedIds.every(id => Number.isInteger(id))) {
      return res.status(400).json({ error: 'All IDs must be integers' });
    }

    // No duplicate IDs
    if (new Set(orderedIds).size !== orderedIds.length) {
      return res.status(400).json({ error: 'Duplicate IDs are not allowed' });
    }

    // Must include exactly all existing projects
    if (orderedIds.length !== projects.length) {
      return res.status(400).json({ error: `Expected ${projects.length} IDs, received ${orderedIds.length}` });
    }

    for (const id of orderedIds) {
      if (!existingIds.has(id)) {
        return res.status(400).json({ error: `Invalid project ID: ${id}` });
      }
    }

    orderedIds.forEach((id, i) => {
      const project = projects.find(p => p.id === id);
      if (project) project.displayOrder = i + 1;
    });
    projects.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    writeProjects(projects);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Project not found' });

    const deleted = projects[index];

    // Remove image directory
    if (deleted.slug) {
      const projectDir = path.join(PROJECTS_DIR, deleted.slug);
      if (fs.existsSync(projectDir)) {
        fs.rmSync(projectDir, { recursive: true, force: true });
      }
    }

    projects.splice(index, 1);
    writeProjects(projects);
    res.json({ message: 'Project deleted', project: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Upload image
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const slug = normalizeSlug(req.params.slug);
      const dir = path.join(PROJECTS_DIR, slug);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `cover${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.post('/api/projects/:slug/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const slug = normalizeSlug(req.params.slug);
    const ext = path.extname(req.file.originalname).toLowerCase();
    const imagePath = `/projects/${slug}/cover${ext}`;

    // Remove old cover files with different extensions
    const projectDir = path.join(PROJECTS_DIR, slug);
    const existingFiles = fs.readdirSync(projectDir);
    existingFiles.forEach(f => {
      if (f.startsWith('cover') && f !== `cover${ext}`) {
        fs.unlinkSync(path.join(projectDir, f));
      }
    });

    res.json({ imagePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// ---- Site Content API ----

function readSiteContent() {
  const raw = fs.readFileSync(SITE_CONTENT_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeSiteContent(content) {
  fs.writeFileSync(SITE_CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
}

function sanitizeString(val) {
  return typeof val === 'string' ? val.trim() : '';
}

function sanitizeStringArray(val) {
  return Array.isArray(val) ? val.filter(v => typeof v === 'string').map(s => s.trim()) : [];
}

function sanitizeNavLinks(val) {
  if (!Array.isArray(val)) return [];
  return val.filter(item => item && typeof item === 'object')
    .map(item => ({
      label: sanitizeString(item.label),
      path: sanitizeString(item.path)
    }));
}

function sanitizeTechnologies(val) {
  if (!Array.isArray(val)) return [];
  return val.filter(item => item && typeof item === 'object')
    .map(item => {
      const tech = {
        name: sanitizeString(item.name),
        icon: sanitizeString(item.icon)
      };
      if (item.invert === true) tech.invert = true;
      return tech;
    });
}

function sanitizeEntries(val) {
  if (!Array.isArray(val)) return [];
  return val.filter(item => item && typeof item === 'object')
    .map(item => ({
      title: sanitizeString(item.title),
      institution: sanitizeString(item.institution),
      items: sanitizeStringArray(item.items || [])
    }));
}

function sanitizeCertifications(val) {
  if (!Array.isArray(val)) return [];
  return val.filter(item => item && typeof item === 'object')
    .map(item => ({
      title: sanitizeString(item.title),
      institution: sanitizeString(item.institution)
    }));
}

function sanitizeSections(val) {
  if (!Array.isArray(val)) return [];
  return val.filter(item => item && typeof item === 'object')
    .map(item => ({
      title: sanitizeString(item.title),
      paragraphs: sanitizeStringArray(item.paragraphs || [])
    }));
}

function sanitizeSiteContent(body) {
  const existing = readSiteContent();

  const result = {};

  // Common labels
  if (body.common && typeof body.common === 'object') {
    const c = body.common;
    result.common = {
      copyButtonLabel: c.copyButtonLabel !== undefined ? sanitizeString(c.copyButtonLabel) : (existing.common?.copyButtonLabel || ''),
      copyFailedLabel: c.copyFailedLabel !== undefined ? sanitizeString(c.copyFailedLabel) : (existing.common?.copyFailedLabel || ''),
      viewDetailsLabel: c.viewDetailsLabel !== undefined ? sanitizeString(c.viewDetailsLabel) : (existing.common?.viewDetailsLabel || ''),
      liveDemoLabel: c.liveDemoLabel !== undefined ? sanitizeString(c.liveDemoLabel) : (existing.common?.liveDemoLabel || ''),
      frontendRepoLabel: c.frontendRepoLabel !== undefined ? sanitizeString(c.frontendRepoLabel) : (existing.common?.frontendRepoLabel || ''),
      backendRepoLabel: c.backendRepoLabel !== undefined ? sanitizeString(c.backendRepoLabel) : (existing.common?.backendRepoLabel || ''),
      githubRepoLabel: c.githubRepoLabel !== undefined ? sanitizeString(c.githubRepoLabel) : (existing.common?.githubRepoLabel || '')
    };
  } else {
    result.common = existing.common || {};
  }

  // Header
  if (body.header && typeof body.header === 'object') {
    result.header = {
      navLinks: body.header.navLinks !== undefined
        ? sanitizeNavLinks(body.header.navLinks)
        : (existing.header?.navLinks || [])
    };
  } else {
    result.header = existing.header || {};
  }

  // Footer
  if (body.footer && typeof body.footer === 'object') {
    const f = body.footer;
    result.footer = {
      copyrightName: f.copyrightName !== undefined ? sanitizeString(f.copyrightName) : (existing.footer?.copyrightName || ''),
      copyrightSuffix: f.copyrightSuffix !== undefined ? sanitizeString(f.copyrightSuffix) : (existing.footer?.copyrightSuffix || ''),
      availabilityNote: f.availabilityNote !== undefined ? sanitizeString(f.availabilityNote) : (existing.footer?.availabilityNote || ''),
      linkedinUrl: f.linkedinUrl !== undefined ? sanitizeString(f.linkedinUrl) : (existing.footer?.linkedinUrl || ''),
      githubUrl: f.githubUrl !== undefined ? sanitizeString(f.githubUrl) : (existing.footer?.githubUrl || '')
    };
  } else {
    result.footer = existing.footer || {};
  }

  // Home
  if (body.home && typeof body.home === 'object') {
    const h = body.home;
    result.home = {
      greeting: h.greeting !== undefined ? sanitizeString(h.greeting) : (existing.home?.greeting || ''),
      name: h.name !== undefined ? sanitizeString(h.name) : (existing.home?.name || ''),
      title: h.title !== undefined ? sanitizeString(h.title) : (existing.home?.title || ''),
      headline: h.headline !== undefined ? sanitizeString(h.headline) : (existing.home?.headline || ''),
      description: h.description !== undefined ? sanitizeString(h.description) : (existing.home?.description || ''),
      ctaPrimaryLabel: h.ctaPrimaryLabel !== undefined ? sanitizeString(h.ctaPrimaryLabel) : (existing.home?.ctaPrimaryLabel || ''),
      ctaSecondaryLabel: h.ctaSecondaryLabel !== undefined ? sanitizeString(h.ctaSecondaryLabel) : (existing.home?.ctaSecondaryLabel || ''),
      technologiesTitle: h.technologiesTitle !== undefined ? sanitizeString(h.technologiesTitle) : (existing.home?.technologiesTitle || ''),
      featuredProjectsTitle: h.featuredProjectsTitle !== undefined ? sanitizeString(h.featuredProjectsTitle) : (existing.home?.featuredProjectsTitle || ''),
      moreProjectsTitle: h.moreProjectsTitle !== undefined ? sanitizeString(h.moreProjectsTitle) : (existing.home?.moreProjectsTitle || ''),
      viewAllProjectsLabel: h.viewAllProjectsLabel !== undefined ? sanitizeString(h.viewAllProjectsLabel) : (existing.home?.viewAllProjectsLabel || ''),
      technologies: h.technologies !== undefined ? sanitizeTechnologies(h.technologies) : (existing.home?.technologies || [])
    };
  } else {
    result.home = existing.home || {};
  }

  // Projects
  if (body.projects && typeof body.projects === 'object') {
    const p = body.projects;
    result.projects = {
      pageTitle: p.pageTitle !== undefined ? sanitizeString(p.pageTitle) : (existing.projects?.pageTitle || ''),
      pageDescription: p.pageDescription !== undefined ? sanitizeString(p.pageDescription) : (existing.projects?.pageDescription || ''),
      filtersLabel: p.filtersLabel !== undefined ? sanitizeString(p.filtersLabel) : (existing.projects?.filtersLabel || ''),
      clearFiltersLabel: p.clearFiltersLabel !== undefined ? sanitizeString(p.clearFiltersLabel) : (existing.projects?.clearFiltersLabel || ''),
      noResultsMessage: p.noResultsMessage !== undefined ? sanitizeString(p.noResultsMessage) : (existing.projects?.noResultsMessage || '')
    };
  } else {
    result.projects = existing.projects || {};
  }

  // About
  if (body.about && typeof body.about === 'object') {
    const a = body.about;
    result.about = {
      pageTitle: a.pageTitle !== undefined ? sanitizeString(a.pageTitle) : (existing.about?.pageTitle || ''),
      pageDescription: a.pageDescription !== undefined ? sanitizeString(a.pageDescription) : (existing.about?.pageDescription || ''),
      sections: a.sections !== undefined ? sanitizeSections(a.sections) : (existing.about?.sections || []),
      educationTitle: a.educationTitle !== undefined ? sanitizeString(a.educationTitle) : (existing.about?.educationTitle || ''),
      education: a.education !== undefined ? sanitizeEntries(a.education) : (existing.about?.education || []),
      experienceTitle: a.experienceTitle !== undefined ? sanitizeString(a.experienceTitle) : (existing.about?.experienceTitle || ''),
      experience: a.experience !== undefined ? sanitizeEntries(a.experience) : (existing.about?.experience || []),
      certificationsTitle: a.certificationsTitle !== undefined ? sanitizeString(a.certificationsTitle) : (existing.about?.certificationsTitle || ''),
      certifications: a.certifications !== undefined ? sanitizeCertifications(a.certifications) : (existing.about?.certifications || []),
      languagesTitle: a.languagesTitle !== undefined ? sanitizeString(a.languagesTitle) : (existing.about?.languagesTitle || ''),
      languages: a.languages !== undefined ? sanitizeStringArray(a.languages) : (existing.about?.languages || [])
    };
  } else {
    result.about = existing.about || {};
  }

  // Contact
  if (body.contact && typeof body.contact === 'object') {
    const c = body.contact;
    result.contact = {
      pageTitle: c.pageTitle !== undefined ? sanitizeString(c.pageTitle) : (existing.contact?.pageTitle || ''),
      introLines: c.introLines !== undefined ? sanitizeStringArray(c.introLines) : (existing.contact?.introLines || []),
      email: c.email && typeof c.email === 'object' ? {
        label: sanitizeString(c.email.label),
        value: sanitizeString(c.email.value)
      } : (existing.contact?.email || {}),
      linkedin: c.linkedin && typeof c.linkedin === 'object' ? {
        label: sanitizeString(c.linkedin.label),
        displayValue: sanitizeString(c.linkedin.displayValue),
        url: sanitizeString(c.linkedin.url)
      } : (existing.contact?.linkedin || {}),
      location: c.location && typeof c.location === 'object' ? {
        label: sanitizeString(c.location.label),
        value: sanitizeString(c.location.value),
        mapsUrl: sanitizeString(c.location.mapsUrl)
      } : (existing.contact?.location || {}),
      copyFeedback: c.copyFeedback && typeof c.copyFeedback === 'object' ? {
        email: sanitizeString(c.copyFeedback.email),
        linkedin: sanitizeString(c.copyFeedback.linkedin),
        location: sanitizeString(c.copyFeedback.location)
      } : (existing.contact?.copyFeedback || {})
    };
  } else {
    result.contact = existing.contact || {};
  }

  // Project Details
  if (body.projectDetails && typeof body.projectDetails === 'object') {
    const d = body.projectDetails;
    result.projectDetails = {
      keyFeaturesTitle: d.keyFeaturesTitle !== undefined ? sanitizeString(d.keyFeaturesTitle) : (existing.projectDetails?.keyFeaturesTitle || ''),
      whatILearnedTitle: d.whatILearnedTitle !== undefined ? sanitizeString(d.whatILearnedTitle) : (existing.projectDetails?.whatILearnedTitle || ''),
      techStackTitle: d.techStackTitle !== undefined ? sanitizeString(d.techStackTitle) : (existing.projectDetails?.techStackTitle || ''),
      backToProjectsLabel: d.backToProjectsLabel !== undefined ? sanitizeString(d.backToProjectsLabel) : (existing.projectDetails?.backToProjectsLabel || ''),
      notFoundTitle: d.notFoundTitle !== undefined ? sanitizeString(d.notFoundTitle) : (existing.projectDetails?.notFoundTitle || ''),
      notFoundText: d.notFoundText !== undefined ? sanitizeString(d.notFoundText) : (existing.projectDetails?.notFoundText || ''),
      notFoundButtonLabel: d.notFoundButtonLabel !== undefined ? sanitizeString(d.notFoundButtonLabel) : (existing.projectDetails?.notFoundButtonLabel || '')
    };
  } else {
    result.projectDetails = existing.projectDetails || {};
  }

  return result;
}

// Get site content
app.get('/api/site-content', (req, res) => {
  try {
    const content = readSiteContent();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read site content' });
  }
});

// Update site content
app.put('/api/site-content', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const sanitized = sanitizeSiteContent(req.body);
    writeSiteContent(sanitized);
    res.json(sanitized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save site content' });
  }
});

app.listen(PORT, () => {
  console.log(`Admin API running at http://localhost:${PORT}`);
});

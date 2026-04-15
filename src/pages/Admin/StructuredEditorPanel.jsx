const ALLOWED_PATHS = ['/', '/projects', '/about', '/contact'];

// Shared helpers for array <-> text conversion
function arrayToText(arr) {
  return (arr || []).join('\n');
}

function textToArray(text) {
  return text.split('\n').map(s => s.trim()).filter(Boolean);
}

function StructuredEditorPanel({ section, content, onUpdate, onClose }) {
  const sectionTitles = {
    'header.navLinks': 'Navigation Links',
    'home.technologies': 'Technologies',
    'about.sections': 'About Sections',
    'about.education': 'Education',
    'about.experience': 'Experience',
    'about.certifications': 'Certifications',
    'about.languages': 'Languages',
    'contact.introLines': 'Intro Lines',
    'contact.details': 'Contact Details',
    'footer': 'Footer',
    'common': 'Common Labels',
    'projectDetails': 'Project Details Labels',
    'projects.labels': 'Projects Page Labels',
  };

  const renderContent = () => {
    switch (section) {
      case 'header.navLinks':
        return <NavLinksEditor content={content} onUpdate={onUpdate} />;
      case 'home.technologies':
        return <TechnologiesEditor content={content} onUpdate={onUpdate} />;
      case 'about.sections':
        return <AboutSectionsEditor content={content} onUpdate={onUpdate} />;
      case 'about.education':
        return <EntriesEditor content={content} onUpdate={onUpdate} section="education" title="Education" />;
      case 'about.experience':
        return <EntriesEditor content={content} onUpdate={onUpdate} section="experience" title="Experience" />;
      case 'about.certifications':
        return <CertificationsEditor content={content} onUpdate={onUpdate} />;
      case 'about.languages':
        return (
          <StringArrayEditor
            items={content?.about?.languages || []}
            onChange={v => onUpdate(['about', 'languages'], v)}
            label="Language"
          />
        );
      case 'contact.introLines':
        return (
          <StringArrayEditor
            items={content?.contact?.introLines || []}
            onChange={v => onUpdate(['contact', 'introLines'], v)}
            label="Intro line"
          />
        );
      case 'contact.details':
        return <ContactDetailsEditor content={content} onUpdate={onUpdate} />;
      case 'footer':
        return <FooterEditor content={content} onUpdate={onUpdate} />;
      case 'common':
        return <CommonLabelsEditor content={content} onUpdate={onUpdate} />;
      case 'projectDetails':
        return <ProjectDetailsLabelsEditor content={content} onUpdate={onUpdate} />;
      case 'projects.labels':
        return <ProjectsLabelsEditor content={content} onUpdate={onUpdate} />;
      default:
        return <p>Unknown section: {section}</p>;
    }
  };

  return (
    <div className="structured-editor-overlay" onClick={onClose}>
      <div className="structured-editor-panel" onClick={e => e.stopPropagation()}>
        <div className="structured-editor-header">
          <h3>{sectionTitles[section] || section}</h3>
          <button className="structured-editor-close" onClick={onClose}>&times;</button>
        </div>
        <div className="structured-editor-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Reusable field components
function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="se-field">
      <label>{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows }) {
  return (
    <div className="se-field">
      <label>{label}</label>
      <textarea
        rows={rows || 3}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

// Nav Links
function NavLinksEditor({ content, onUpdate }) {
  const navLinks = content?.header?.navLinks || [];

  const updateLink = (idx, field, value) => {
    const links = JSON.parse(JSON.stringify(navLinks));
    links[idx][field] = value;
    onUpdate(['header', 'navLinks'], links);
  };

  const removeLink = (idx) => {
    const links = [...navLinks];
    links.splice(idx, 1);
    onUpdate(['header', 'navLinks'], links);
  };

  const addLink = () => {
    onUpdate(['header', 'navLinks'], [...navLinks, { label: '', path: '/' }]);
  };

  return (
    <div>
      {navLinks.map((link, idx) => (
        <div key={idx} className="se-repeatable">
          <div className="se-row">
            <Field label="Label" value={link.label} onChange={v => updateLink(idx, 'label', v)} />
            <div className="se-field">
              <label>Path</label>
              <select value={link.path || ''} onChange={e => updateLink(idx, 'path', e.target.value)}>
                <option value="">Select...</option>
                {ALLOWED_PATHS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <button className="se-remove-btn" onClick={() => removeLink(idx)} title="Remove">&times;</button>
          </div>
        </div>
      ))}
      <button className="se-add-btn" onClick={addLink}>+ Add Nav Link</button>
    </div>
  );
}

// Technologies
function TechnologiesEditor({ content, onUpdate }) {
  const techs = content?.home?.technologies || [];

  const updateTech = (idx, field, value) => {
    const arr = JSON.parse(JSON.stringify(techs));
    if (field === 'invert') {
      if (value) arr[idx].invert = true;
      else delete arr[idx].invert;
    } else {
      arr[idx][field] = value;
    }
    onUpdate(['home', 'technologies'], arr);
  };

  const removeTech = (idx) => {
    const arr = [...techs];
    arr.splice(idx, 1);
    onUpdate(['home', 'technologies'], arr);
  };

  const addTech = () => {
    onUpdate(['home', 'technologies'], [...techs, { name: '', icon: '' }]);
  };

  return (
    <div>
      {techs.map((tech, idx) => (
        <div key={idx} className="se-repeatable">
          <div className="se-row">
            <Field label="Name" value={tech.name} onChange={v => updateTech(idx, 'name', v)} />
            <Field label="Icon URL" value={tech.icon} onChange={v => updateTech(idx, 'icon', v)} />
            <div className="se-field se-field-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={!!tech.invert}
                  onChange={e => updateTech(idx, 'invert', e.target.checked)}
                />
                Invert
              </label>
            </div>
            <button className="se-remove-btn" onClick={() => removeTech(idx)}>&times;</button>
          </div>
        </div>
      ))}
      <button className="se-add-btn" onClick={addTech}>+ Add Technology</button>
    </div>
  );
}

// About Sections
function AboutSectionsEditor({ content, onUpdate }) {
  const sections = content?.about?.sections || [];

  const updateSection = (idx, field, value) => {
    const arr = JSON.parse(JSON.stringify(sections));
    arr[idx][field] = value;
    onUpdate(['about', 'sections'], arr);
  };

  const removeSection = (idx) => {
    const arr = [...sections];
    arr.splice(idx, 1);
    onUpdate(['about', 'sections'], arr);
  };

  const addSection = () => {
    onUpdate(['about', 'sections'], [...sections, { title: '', paragraphs: [] }]);
  };

  return (
    <div>
      {sections.map((section, idx) => (
        <div key={idx} className="se-repeatable">
          <div className="se-repeatable-header">
            <span>Section {idx + 1}</span>
            <button className="se-remove-btn" onClick={() => removeSection(idx)}>Remove</button>
          </div>
          <Field label="Title" value={section.title} onChange={v => updateSection(idx, 'title', v)} />
          <TextArea
            label="Paragraphs (one per line)"
            value={arrayToText(section.paragraphs)}
            rows={4}
            onChange={v => updateSection(idx, 'paragraphs', textToArray(v))}
          />
        </div>
      ))}
      <button className="se-add-btn" onClick={addSection}>+ Add Section</button>
    </div>
  );
}

// Education / Experience entries
function EntriesEditor({ content, onUpdate, section, title }) {
  const entries = content?.about?.[section] || [];
  const titleKey = `${section}Title`;

  const updateEntry = (idx, field, value) => {
    const arr = JSON.parse(JSON.stringify(entries));
    arr[idx][field] = value;
    onUpdate(['about', section], arr);
  };

  const removeEntry = (idx) => {
    const arr = [...entries];
    arr.splice(idx, 1);
    onUpdate(['about', section], arr);
  };

  const addEntry = () => {
    onUpdate(['about', section], [...entries, { title: '', institution: '', items: [] }]);
  };

  return (
    <div>
      <Field
        label={`${title} Section Title`}
        value={content?.about?.[titleKey] || ''}
        onChange={v => onUpdate(['about', titleKey], v)}
      />
      {entries.map((entry, idx) => (
        <div key={idx} className="se-repeatable">
          <div className="se-repeatable-header">
            <span>{title} {idx + 1}</span>
            <button className="se-remove-btn" onClick={() => removeEntry(idx)}>Remove</button>
          </div>
          <Field label="Title" value={entry.title} onChange={v => updateEntry(idx, 'title', v)} />
          <Field label="Institution" value={entry.institution} onChange={v => updateEntry(idx, 'institution', v)} />
          <TextArea
            label="Items (one per line)"
            value={arrayToText(entry.items)}
            rows={4}
            onChange={v => updateEntry(idx, 'items', textToArray(v))}
          />
        </div>
      ))}
      <button className="se-add-btn" onClick={addEntry}>+ Add {title}</button>
    </div>
  );
}

// Certifications
function CertificationsEditor({ content, onUpdate }) {
  const certs = content?.about?.certifications || [];

  const updateCert = (idx, field, value) => {
    const arr = JSON.parse(JSON.stringify(certs));
    arr[idx][field] = value;
    onUpdate(['about', 'certifications'], arr);
  };

  const removeCert = (idx) => {
    const arr = [...certs];
    arr.splice(idx, 1);
    onUpdate(['about', 'certifications'], arr);
  };

  const addCert = () => {
    onUpdate(['about', 'certifications'], [...certs, { title: '', institution: '' }]);
  };

  return (
    <div>
      <Field
        label="Certifications Section Title"
        value={content?.about?.certificationsTitle || ''}
        onChange={v => onUpdate(['about', 'certificationsTitle'], v)}
      />
      {certs.map((cert, idx) => (
        <div key={idx} className="se-repeatable">
          <div className="se-repeatable-header">
            <span>Certification {idx + 1}</span>
            <button className="se-remove-btn" onClick={() => removeCert(idx)}>Remove</button>
          </div>
          <Field label="Title" value={cert.title} onChange={v => updateCert(idx, 'title', v)} />
          <Field label="Institution" value={cert.institution} onChange={v => updateCert(idx, 'institution', v)} />
        </div>
      ))}
      <button className="se-add-btn" onClick={addCert}>+ Add Certification</button>
    </div>
  );
}

// String array
function StringArrayEditor({ items, onChange, label }) {
  const updateItem = (idx, value) => {
    const arr = [...items];
    arr[idx] = value;
    onChange(arr);
  };

  const removeItem = (idx) => {
    const arr = [...items];
    arr.splice(idx, 1);
    onChange(arr);
  };

  const addItem = () => {
    onChange([...items, '']);
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="se-repeatable se-inline">
          <div className="se-row">
            <Field label={`${label} ${idx + 1}`} value={item} onChange={v => updateItem(idx, v)} />
            <button className="se-remove-btn" onClick={() => removeItem(idx)}>&times;</button>
          </div>
        </div>
      ))}
      <button className="se-add-btn" onClick={addItem}>+ Add {label}</button>
    </div>
  );
}

// Contact details
function ContactDetailsEditor({ content, onUpdate }) {
  const contact = content?.contact || {};
  const email = contact.email || {};
  const linkedin = contact.linkedin || {};
  const location = contact.location || {};
  const feedback = contact.copyFeedback || {};

  return (
    <div>
      <h4 className="se-subtitle">Email</h4>
      <div className="se-row">
        <Field label="Label" value={email.label} onChange={v => onUpdate(['contact', 'email', 'label'], v)} />
        <Field label="Value" value={email.value} onChange={v => onUpdate(['contact', 'email', 'value'], v)} />
      </div>

      <h4 className="se-subtitle">LinkedIn</h4>
      <Field label="Label" value={linkedin.label} onChange={v => onUpdate(['contact', 'linkedin', 'label'], v)} />
      <div className="se-row">
        <Field label="Display Value" value={linkedin.displayValue} onChange={v => onUpdate(['contact', 'linkedin', 'displayValue'], v)} />
        <Field label="URL" value={linkedin.url} onChange={v => onUpdate(['contact', 'linkedin', 'url'], v)} />
      </div>

      <h4 className="se-subtitle">Location</h4>
      <div className="se-row">
        <Field label="Label" value={location.label} onChange={v => onUpdate(['contact', 'location', 'label'], v)} />
        <Field label="Value" value={location.value} onChange={v => onUpdate(['contact', 'location', 'value'], v)} />
      </div>
      <Field label="Maps URL" value={location.mapsUrl} onChange={v => onUpdate(['contact', 'location', 'mapsUrl'], v)} />

      <h4 className="se-subtitle">Copy Feedback Labels</h4>
      <div className="se-row">
        <Field label="Email" value={feedback.email} onChange={v => onUpdate(['contact', 'copyFeedback', 'email'], v)} />
        <Field label="LinkedIn" value={feedback.linkedin} onChange={v => onUpdate(['contact', 'copyFeedback', 'linkedin'], v)} />
      </div>
      <Field label="Location" value={feedback.location} onChange={v => onUpdate(['contact', 'copyFeedback', 'location'], v)} />
    </div>
  );
}

// Footer
function FooterEditor({ content, onUpdate }) {
  const footer = content?.footer || {};

  return (
    <div>
      <div className="se-row">
        <Field label="Copyright Name" value={footer.copyrightName} onChange={v => onUpdate(['footer', 'copyrightName'], v)} />
        <Field label="Copyright Suffix" value={footer.copyrightSuffix} onChange={v => onUpdate(['footer', 'copyrightSuffix'], v)} />
      </div>
      <Field label="Availability Note" value={footer.availabilityNote} onChange={v => onUpdate(['footer', 'availabilityNote'], v)} />
      <div className="se-row">
        <Field label="LinkedIn URL" value={footer.linkedinUrl} onChange={v => onUpdate(['footer', 'linkedinUrl'], v)} />
        <Field label="GitHub URL" value={footer.githubUrl} onChange={v => onUpdate(['footer', 'githubUrl'], v)} />
      </div>
    </div>
  );
}

// Common labels
function CommonLabelsEditor({ content, onUpdate }) {
  const common = content?.common || {};

  return (
    <div>
      <div className="se-row">
        <Field label="Copy Button Label" value={common.copyButtonLabel} onChange={v => onUpdate(['common', 'copyButtonLabel'], v)} />
        <Field label="Copy Failed Label" value={common.copyFailedLabel} onChange={v => onUpdate(['common', 'copyFailedLabel'], v)} />
      </div>
      <Field label="View Details Label" value={common.viewDetailsLabel} onChange={v => onUpdate(['common', 'viewDetailsLabel'], v)} />
      <div className="se-row">
        <Field label="Live Demo Label" value={common.liveDemoLabel} onChange={v => onUpdate(['common', 'liveDemoLabel'], v)} />
        <Field label="GitHub Repo Label" value={common.githubRepoLabel} onChange={v => onUpdate(['common', 'githubRepoLabel'], v)} />
      </div>
      <div className="se-row">
        <Field label="Frontend Repo Label" value={common.frontendRepoLabel} onChange={v => onUpdate(['common', 'frontendRepoLabel'], v)} />
        <Field label="Backend Repo Label" value={common.backendRepoLabel} onChange={v => onUpdate(['common', 'backendRepoLabel'], v)} />
      </div>
    </div>
  );
}

// Project details labels
function ProjectDetailsLabelsEditor({ content, onUpdate }) {
  const pd = content?.projectDetails || {};

  return (
    <div>
      <div className="se-row">
        <Field label="Key Features Title" value={pd.keyFeaturesTitle} onChange={v => onUpdate(['projectDetails', 'keyFeaturesTitle'], v)} />
        <Field label="What I Learned Title" value={pd.whatILearnedTitle} onChange={v => onUpdate(['projectDetails', 'whatILearnedTitle'], v)} />
      </div>
      <div className="se-row">
        <Field label="Tech Stack Title" value={pd.techStackTitle} onChange={v => onUpdate(['projectDetails', 'techStackTitle'], v)} />
        <Field label="Back to Projects Label" value={pd.backToProjectsLabel} onChange={v => onUpdate(['projectDetails', 'backToProjectsLabel'], v)} />
      </div>
      <h4 className="se-subtitle">Not Found Page</h4>
      <Field label="Not Found Title" value={pd.notFoundTitle} onChange={v => onUpdate(['projectDetails', 'notFoundTitle'], v)} />
      <TextArea label="Not Found Text" value={pd.notFoundText} rows={2} onChange={v => onUpdate(['projectDetails', 'notFoundText'], v)} />
      <Field label="Not Found Button Label" value={pd.notFoundButtonLabel} onChange={v => onUpdate(['projectDetails', 'notFoundButtonLabel'], v)} />
    </div>
  );
}

// Projects page labels
function ProjectsLabelsEditor({ content, onUpdate }) {
  const pc = content?.projects || {};

  return (
    <div>
      <Field label="Filters Label" value={pc.filtersLabel} onChange={v => onUpdate(['projects', 'filtersLabel'], v)} />
      <Field label="Clear Filters Label" value={pc.clearFiltersLabel} onChange={v => onUpdate(['projects', 'clearFiltersLabel'], v)} />
      <TextArea label="No Results Message" value={pc.noResultsMessage} rows={2} onChange={v => onUpdate(['projects', 'noResultsMessage'], v)} />
    </div>
  );
}

export default StructuredEditorPanel;

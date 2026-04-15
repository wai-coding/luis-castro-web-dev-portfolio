import { useSiteContent } from '../../contexts/SiteContentContext';
import EditableText from '../../components/Editable/EditableText';
import './About.css';

function About() {
  const { content } = useSiteContent();
  const about = content?.about || {};

  const pageTitle = about.pageTitle || 'About Me';
  const pageDescription = about.pageDescription || '';
  const sections = about.sections || [];
  const educationTitle = about.educationTitle || 'Education';
  const education = about.education || [];
  const experienceTitle = about.experienceTitle || 'Professional Experience';
  const experience = about.experience || [];
  const certificationsTitle = about.certificationsTitle || 'Certifications';
  const certifications = about.certifications || [];
  const languagesTitle = about.languagesTitle || 'Languages';
  const languages = about.languages || [];

  return (
    <main className="about">
      <div className="about-container">

        <EditableText path={['about', 'pageTitle']} value={pageTitle} as="h1" className="page-title" />
        {pageDescription && (
          <EditableText path={['about', 'pageDescription']} value={pageDescription} as="p" className="page-description" multiline />
        )}

        {sections.map((section, idx) => (
          <section key={idx} className="about-section">
            <EditableText path={['about', 'sections', idx, 'title']} value={section.title} as="h2" className="section-title" />
            {(section.paragraphs || []).map((text, pIdx) => (
              <EditableText key={pIdx} path={['about', 'sections', idx, 'paragraphs', pIdx]} value={text} as="p" className="about-text" multiline />
            ))}
          </section>
        ))}

        {education.length > 0 && (
          <section className="about-section">
            <EditableText path={['about', 'educationTitle']} value={educationTitle} as="h2" className="section-title" />
            {education.map((entry, idx) => (
              <div key={idx} className="education-entry">
                <EditableText path={['about', 'education', idx, 'title']} value={entry.title} as="h3" />
                {entry.institution && (
                  <EditableText path={['about', 'education', idx, 'institution']} value={entry.institution} as="p" className="institution" />
                )}
                {entry.items?.length > 0 && (
                  <ul className="education-list">
                    {entry.items.map((item, iIdx) => (
                      <li key={iIdx}>
                        <EditableText path={['about', 'education', idx, 'items', iIdx]} value={item} multiline />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {experience.length > 0 && (
          <section className="about-section">
            <EditableText path={['about', 'experienceTitle']} value={experienceTitle} as="h2" className="section-title" />
            {experience.map((entry, idx) => (
              <div key={idx} className="experience-entry">
                <EditableText path={['about', 'experience', idx, 'title']} value={entry.title} as="h3" />
                {entry.institution && (
                  <EditableText path={['about', 'experience', idx, 'institution']} value={entry.institution} as="p" className="institution" />
                )}
                {entry.items?.length > 0 && (
                  <ul className="experience-list">
                    {entry.items.map((item, iIdx) => (
                      <li key={iIdx}>
                        <EditableText path={['about', 'experience', idx, 'items', iIdx]} value={item} multiline />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section className="about-section">
            <EditableText path={['about', 'certificationsTitle']} value={certificationsTitle} as="h2" className="section-title" />
            {certifications.map((cert, idx) => (
              <div key={idx} className="certification-entry">
                <EditableText path={['about', 'certifications', idx, 'title']} value={cert.title} as="h3" />
                {cert.institution && (
                  <EditableText path={['about', 'certifications', idx, 'institution']} value={cert.institution} as="p" className="institution" />
                )}
              </div>
            ))}
          </section>
        )}

        {languages.length > 0 && (
          <section className="about-section">
            <EditableText path={['about', 'languagesTitle']} value={languagesTitle} as="h2" className="section-title" />
            <ul className="languages-list">
              {languages.map((lang, idx) => (
                <li key={idx}>
                  <EditableText path={['about', 'languages', idx]} value={lang} />
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </main>
  );
}

export default About;

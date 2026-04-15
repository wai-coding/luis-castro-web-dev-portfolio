import { useState, useRef, useEffect } from 'react';
import { useSiteContent } from '../../contexts/SiteContentContext';
import EditableText from '../../components/Editable/EditableText';
import './Contact.css';

function Contact() {
  const [copiedField, setCopiedField] = useState(null);
  const [copyError, setCopyError] = useState(false);
  const copyTimerRef = useRef(null);
  const { content } = useSiteContent();
  const c = content?.contact || {};

  const pageTitle = c.pageTitle || 'Get In Touch';
  const introLines = c.introLines || [];
  const common = content?.common || {};
  const copyButtonLabel = common.copyButtonLabel || 'Copy';
  const copyFailedLabel = common.copyFailedLabel || 'Copy failed';
  const email = c.email || { label: 'Email', value: 'luiscastrocoding@gmail.com' };
  const linkedin = c.linkedin || {
    label: 'LinkedIn',
    displayValue: 'linkedin.com/in/luiscastrocoding',
    url: 'https://www.linkedin.com/in/luiscastrocoding/'
  };
  const location = c.location || {
    label: 'Location',
    value: 'Santo Tirso (Porto, Portugal)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vila%20das%20Aves%2C%20Santo%20Tirso%2C%20Portugal'
  };
  const feedback = c.copyFeedback || {
    email: 'Email copied',
    linkedin: 'LinkedIn copied',
    location: 'Location copied'
  };

  // Clear pending timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = async (text, field) => {
    // Reset any pending feedback timer
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('unsupported');
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setCopyError(false);
    } catch {
      setCopiedField(field);
      setCopyError(true);
    }
    copyTimerRef.current = setTimeout(() => {
      setCopiedField(null);
      setCopyError(false);
    }, 1500);
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        <EditableText path={['contact', 'pageTitle']} value={pageTitle} as="h1" className="page-title" />
        {introLines.length > 0 && (
          <div className="page-description">
            {introLines.map((line, idx) => (
              <EditableText key={idx} path={['contact', 'introLines', idx]} value={line} as="p" />
            ))}
          </div>
        )}

        <div className="contact-grid">
          <div className="contact-card">
            <span className="contact-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
              </svg>
            </span>
            <div className="contact-text">
              <h2 className="contact-label"><EditableText path={['contact', 'email', 'label']} value={email.label || 'Email'} /></h2>
              <div className="contact-value-row">
                <a
                  href={`mailto:${email.value}`}
                  className="contact-link"
                  aria-label={`Send email to ${email.value}`}
                >
                  {email.value}
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(email.value, 'email')}
                  aria-label="Copy email"
                >
                  {copyButtonLabel}
                </button>
                {copiedField === 'email' && (
                  <span className={`copy-feedback${copyError ? ' copy-feedback-error' : ''}`}>
                    {copyError ? copyFailedLabel : (feedback.email || 'Copied')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="24" height="24">
                <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.83-48.3 93.97 0 111.31 61.9 111.31 142.3V448z"/>
              </svg>
            </span>
            <div className="contact-text">
              <h2 className="contact-label"><EditableText path={['contact', 'linkedin', 'label']} value={linkedin.label || 'LinkedIn'} /></h2>
              <div className="contact-value-row">
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  aria-label="Visit LinkedIn profile"
                >
                  {linkedin.displayValue || linkedin.url}
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(linkedin.url, 'linkedin')}
                  aria-label="Copy LinkedIn"
                >
                  {copyButtonLabel}
                </button>
                {copiedField === 'linkedin' && (
                  <span className={`copy-feedback${copyError ? ' copy-feedback-error' : ''}`}>
                    {copyError ? copyFailedLabel : (feedback.linkedin || 'Copied')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="contact-card">
            <span className="contact-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="24" height="24">
                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
              </svg>
            </span>
            <div className="contact-text">
              <h2 className="contact-label"><EditableText path={['contact', 'location', 'label']} value={location.label || 'Location'} /></h2>
              <div className="contact-value-row">
                <a
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                  aria-label="Open location in Google Maps"
                >
                  {location.value}
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(location.value, 'location')}
                  aria-label="Copy location"
                >
                  {copyButtonLabel}
                </button>
                {copiedField === 'location' && (
                  <span className={`copy-feedback${copyError ? ' copy-feedback-error' : ''}`}>
                    {copyError ? copyFailedLabel : (feedback.location || 'Copied')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;

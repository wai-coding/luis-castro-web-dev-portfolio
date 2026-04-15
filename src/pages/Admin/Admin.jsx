import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContent } from '../../contexts/SiteContentContext';
import { useNavigationGuard } from '../../contexts/NavigationGuardContext';
import SiteContentAdmin from './SiteContentAdmin';
import './Admin.css';

function Admin() {
  const [message, setMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const [showEditorControls, setShowEditorControls] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const siteContentDirtyRef = useRef(false);
  const { refresh: refreshSiteContent } = useSiteContent();
  const { setGuard, clearGuard } = useNavigationGuard();
  const navigate = useNavigate();

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      setServerStatus(res.ok ? 'online' : 'offline');
    } catch {
      setServerStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Warn before closing with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (siteContentDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Guard in-app navigation when there are unsaved changes
  useEffect(() => {
    setGuard(() => {
      if (siteContentDirtyRef.current) {
        return window.confirm('You have unsaved changes. Discard them?');
      }
      return true;
    });
    return () => clearGuard();
  }, [setGuard, clearGuard]);

  // Guard browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (siteContentDirtyRef.current) {
        if (!window.confirm('You have unsaved changes. Discard them?')) {
          window.history.pushState({ adminGuard: true }, '', '/admin');
          return;
        }
      }
    };
    window.history.replaceState({ adminGuard: true }, '', '/admin');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGoHome = () => {
    if (siteContentDirtyRef.current) {
      if (!window.confirm('You have unsaved changes. Discard them?')) return;
    }
    navigate('/');
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <main className="admin-page admin-content-active">
      <div className="admin-overlay-bar">
        <span className="admin-title">Admin Panel</span>
        <button className="admin-btn admin-btn-home" onClick={handleGoHome}>
          Home
        </button>
        <button
          className="admin-controls-toggle"
          onClick={() => setShowEditorControls(v => !v)}
        >
          {showEditorControls ? 'Hide Controls' : 'Show Controls'}
          {isDirty && <span className="editor-float-dirty-dot" aria-hidden="true" />}
        </button>
      </div>

      {serverStatus === 'offline' && (
        <div className="admin-server-status admin-server-status-overlay">
          <p>Server is not running. Start it with <code>npm run server</code> or <code>npm run dev:admin</code>.</p>
          <button className="admin-btn" onClick={checkHealth}>
            Retry Connection
          </button>
        </div>
      )}

      {message && <div className="admin-message">{message}</div>}

      <SiteContentAdmin
        showMessage={showMessage}
        onDirtyChange={(dirty) => { siteContentDirtyRef.current = dirty; setIsDirty(dirty); }}
        onSaved={refreshSiteContent}
        showControls={showEditorControls}
        onToggleControls={() => setShowEditorControls(v => !v)}
      />
    </main>
  );
}

export default Admin;

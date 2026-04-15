import { useState, useEffect, useCallback, useRef } from 'react';
import SiteVisualEditor from './SiteVisualEditor';

const API = '/api';

function SiteContentAdmin({ showMessage, onDirtyChange, onSaved, showControls, onToggleControls }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectsDirty, setProjectsDirty] = useState(false);
  const savedRef = useRef(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API}/site-content`);
      const data = await res.json();
      setContent(data);
      savedRef.current = JSON.stringify(data);
    } catch {
      showMessage('Failed to load site content.');
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const isDirty = content && savedRef.current && JSON.stringify(content) !== savedRef.current;
  const combinedDirty = isDirty || projectsDirty;

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(!!combinedDirty);
  }, [combinedDirty, onDirtyChange]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/site-content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        const saved = await res.json();
        setContent(saved);
        savedRef.current = JSON.stringify(saved);
        showMessage('Site content saved!');
        if (onSaved) onSaved();
      } else {
        const err = await res.json();
        showMessage(err.error || 'Failed to save.');
      }
    } catch {
      showMessage('Failed to save. Is the server running?');
    }
  };

  const handleDiscard = () => {
    if (!isDirty) return;
    if (!window.confirm('Discard all unsaved changes?')) return;
    setContent(JSON.parse(savedRef.current));
  };

  // Update a nested path in draft content (supports array indices)
  const update = useCallback((path, value) => {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (obj[path[i]] === undefined) {
          obj[path[i]] = typeof path[i + 1] === 'number' ? [] : {};
        }
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
  }, []);

  if (loading) {
    return <div className="admin-empty"><p>Loading site content...</p></div>;
  }

  if (!content) {
    return <div className="admin-empty"><p>Could not load site content.</p></div>;
  }

  return (
    <SiteVisualEditor
      draftContent={content}
      isDirty={!!isDirty}
      onUpdate={update}
      onSave={handleSave}
      onDiscard={handleDiscard}
      showControls={showControls}
      onToggleControls={onToggleControls}
      onProjectDirtyChange={setProjectsDirty}
      showMessage={showMessage}
    />
  );
}

export default SiteContentAdmin;

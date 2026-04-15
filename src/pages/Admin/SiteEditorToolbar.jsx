const DEVICES = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'tablet', label: 'Tablet' },
];

const PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'projects', label: 'Projects' },
];

function SiteEditorToolbar({
  editorMode, onToggleEditorMode,
  highlightEditable, onToggleHighlight,
  deviceMode, onDeviceChange,
  isDirty, onSave, onDiscard,
  activePage, onPageChange,
  viewingProjectSlug, viewingProjectTitle, onBackToProjects,
}) {
  return (
    <div className="site-editor-toolbar">
      <div className="toolbar-group">
        <div className="toolbar-page-tabs">
          {PAGES.map(p => (
            <button
              key={p.key}
              className={`toolbar-page-tab${activePage === p.key && !viewingProjectSlug ? ' active' : ''}`}
              onClick={() => { onPageChange(p.key); if (onBackToProjects) onBackToProjects(); }}
            >
              {p.label}
            </button>
          ))}
        </div>
        {viewingProjectSlug && (
          <div className="toolbar-breadcrumb">
            <button className="toolbar-btn toolbar-back-btn" onClick={onBackToProjects} title="Back to Projects list">
              &larr;
            </button>
            <span className="toolbar-breadcrumb-title">{viewingProjectTitle || viewingProjectSlug}</span>
          </div>
        )}
      </div>

      <div className="toolbar-group toolbar-center">
        <div className="toolbar-device-selector">
          {DEVICES.map(d => (
            <button
              key={d.key}
              className={`toolbar-device-btn${deviceMode === d.key ? ' active' : ''}`}
              onClick={() => onDeviceChange(d.key)}
              title={d.label}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-group toolbar-right">
        <div className="toolbar-mode-selector">
          <button
            className={`toolbar-mode-btn${editorMode ? ' active' : ''}`}
            onClick={() => { if (!editorMode) onToggleEditorMode(); }}
          >
            Edit Mode
          </button>
          <button
            className={`toolbar-mode-btn${!editorMode ? ' active' : ''}`}
            onClick={() => { if (editorMode) onToggleEditorMode(); }}
          >
            Preview Mode
          </button>
        </div>

        {editorMode && (
          <>
            <button
              className={`toolbar-btn${highlightEditable ? ' toolbar-btn-active' : ''}`}
              onClick={onToggleHighlight}
              title="Highlight editable regions"
            >
              Highlight
            </button>
          </>
        )}

        <button
          className="toolbar-btn save"
          onClick={onSave}
          disabled={!isDirty}
        >
          Save
        </button>
        {isDirty && (
          <button className="toolbar-btn discard" onClick={onDiscard}>
            Discard
          </button>
        )}
      </div>
    </div>
  );
}

export default SiteEditorToolbar;

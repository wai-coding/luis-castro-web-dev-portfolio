import { useRef, useEffect } from 'react';

const WIDTH_CONSTRAINTS = {
  desktop: null,
  mobile: 390,
  tablet: 1024,
};

function SiteEditorViewport({ deviceMode, editorMode, onLinkNavigate, children }) {
  const contentRef = useRef(null);
  const maxWidth = WIDTH_CONSTRAINTS[deviceMode] || null;

  // Prevent link navigation, form submissions, and stray button actions
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (anchor) {
        e.preventDefault();
        e.stopPropagation();
        if (onLinkNavigate) {
          const href = anchor.getAttribute('href');
          if (href && href.startsWith('/')) {
            onLinkNavigate(href);
          }
        }
        return;
      }
      const btn = e.target.closest('button');
      if (btn && !btn.closest('[contenteditable]') && !btn.dataset.editorAction) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const handleSubmit = (e) => {
      e.preventDefault();
    };
    el.addEventListener('click', handleClick, true);
    el.addEventListener('submit', handleSubmit, true);
    return () => {
      el.removeEventListener('click', handleClick, true);
      el.removeEventListener('submit', handleSubmit, true);
    };
  }, [onLinkNavigate]);

  return (
    <div
      className={`viewport-responsive${maxWidth ? ' viewport-responsive-constrained' : ''}`}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
    >
      <div
        ref={contentRef}
        className={`viewport-responsive-content ${editorMode ? 'viewport-edit-mode' : 'viewport-preview-mode'}`}
      >
        {children}
      </div>
    </div>
  );
}

export default SiteEditorViewport;

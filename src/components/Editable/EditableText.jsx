import { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import './Editable.css';

function EditableText({ path, value, as: Tag = 'span', className = '', multiline = false, onSave: onSaveProp, ...htmlProps }) {
  const editor = useEditor();
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);

  // Keep local state in sync while not editing
  useEffect(() => {
    if (!editing) setLocalValue(value || '');
  }, [value, editing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) inputRef.current.select();
    }
  }, [editing]);

  if (!editor || !editor.editorMode) {
    return <Tag className={className} {...htmlProps}>{value}</Tag>;
  }

  const { updateDraft, highlightEditable } = editor;

  const startEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalValue(value || '');
    setEditing(true);
  };

  const confirm = () => {
    if (onSaveProp) {
      onSaveProp(localValue);
    } else if (path && updateDraft) {
      updateDraft(path, localValue);
    }
    setEditing(false);
  };

  const cancel = () => {
    setLocalValue(value || '');
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { cancel(); return; }
    if (!multiline && e.key === 'Enter') { e.preventDefault(); confirm(); }
    if (multiline && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); confirm(); }
  };

  if (editing) {
    const InputTag = multiline ? 'textarea' : 'input';
    return (
      <Tag className={className} {...htmlProps}>
        <InputTag
          ref={inputRef}
          className={`editable-input ${multiline ? 'editable-textarea' : ''}`}
          value={localValue}
          onChange={e => setLocalValue(e.target.value)}
          onBlur={confirm}
          onKeyDown={handleKeyDown}
          rows={multiline ? 4 : undefined}
          type={multiline ? undefined : 'text'}
        />
      </Tag>
    );
  }

  const classNames = [
    className,
    'editable-field',
    highlightEditable ? 'editable-highlight' : ''
  ].filter(Boolean).join(' ');

  return (
    <Tag
      className={classNames}
      onDoubleClick={startEdit}
      title={highlightEditable ? 'Double-click to edit' : undefined}
      {...htmlProps}
    >
      {value}
    </Tag>
  );
}

export default EditableText;

import { useState, useRef } from 'react';
import { computeViewport, computeCropParams } from '../../utils/cropUtils';

function ProjectImageEditor({ project, onClose, onUpdateImage, onSelectFile }) {
  const [imgDimensions, setImgDimensions] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!project) return null;

  const image = project.image || { src: '', cardPositionX: 50, cardPositionY: 50, cardZoom: 1 };
  const previewSrc = image.src;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onSelectFile(file);
    setImgDimensions(null);
  };

  const handleImageLoad = (e) => {
    setImgDimensions({ w: e.target.naturalWidth, h: e.target.naturalHeight });
  };

  const handlePointerDown = (e) => {
    const params = computeCropParams(imgDimensions);
    if (!params) return;
    e.preventDefault();
    setDragging(true);

    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = image.cardPositionX;
    const startPosY = image.cardPositionY;
    const rect = el.getBoundingClientRect();
    const { rangeX, rangeY } = params;
    const zoom = image.cardZoom || 1;

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let newPosX = startPosX;
      let newPosY = startPosY;
      if (rangeX > 0.001) {
        newPosX = startPosX + (dx / rect.width) / rangeX * 100 / zoom;
      }
      if (rangeY > 0.001) {
        newPosY = startPosY + (dy / rect.height) / rangeY * 100 / zoom;
      }
      newPosX = Math.max(0, Math.min(100, Math.round(newPosX)));
      newPosY = Math.max(0, Math.min(100, Math.round(newPosY)));
      onUpdateImage({ cardPositionX: newPosX, cardPositionY: newPosY });
    };

    const handleUp = (upEvent) => {
      setDragging(false);
      el.releasePointerCapture(upEvent.pointerId);
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerup', handleUp);
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerup', handleUp);
  };

  const viewport = computeViewport(imgDimensions, image);

  return (
    <div className="project-image-editor-overlay" onClick={onClose}>
      <div className="project-image-editor-panel" onClick={e => e.stopPropagation()}>
        <div className="pie-header">
          <h3>Edit Project Image</h3>
          <button className="pie-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="pie-body">
          <div className="pie-upload-field">
            <label>Choose Image</label>
            <input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} />
          </div>

          {previewSrc && (
            <div className="pie-crop-section">
              <p className="pie-hint">Drag the image to reposition. Use the slider to adjust zoom.</p>
              <div className="pie-crop-layout">
                <div className="pie-crop-preview">
                  <div
                    className={`crop-full-image-wrapper${dragging ? ' dragging' : ''}`}
                    onPointerDown={handlePointerDown}
                  >
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="crop-full-image"
                      onLoad={handleImageLoad}
                      draggable={false}
                    />
                    {viewport && (
                      <div className="crop-mask">
                        <div className="crop-viewport" style={viewport} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="pie-zoom-control">
                  <label>Zoom: {(image.cardZoom || 1).toFixed(2)}x</label>
                  <input
                    type="range"
                    min="100"
                    max="300"
                    value={Math.round((image.cardZoom || 1) * 100)}
                    onChange={e => onUpdateImage({ cardZoom: parseInt(e.target.value) / 100 })}
                  />
                </div>
              </div>
            </div>
          )}

          {!previewSrc && (
            <p className="pie-no-image">No image set. Choose a file above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectImageEditor;

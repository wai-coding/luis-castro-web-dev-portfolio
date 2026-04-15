// Crop/viewport utilities for the Admin editor and ProjectCard.

export const CARD_ASPECT_RATIO = 300 / 140;

export function normalizeSlug(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Visible fractions and drag range for the card crop.
export function computeCropParams(imgDimensions) {
  if (!imgDimensions) return null;
  const imageAR = imgDimensions.w / imgDimensions.h;

  let visW, visH;
  if (imageAR > CARD_ASPECT_RATIO) {
    visW = CARD_ASPECT_RATIO / imageAR;
    visH = 1.0;
  } else {
    visW = 1.0;
    visH = imageAR / CARD_ASPECT_RATIO;
  }

  return { visW, visH, rangeX: 1 - visW, rangeY: 1 - visH };
}

/**
 * Compute the viewport rectangle for the crop editor overlay.
 */
export function computeViewport(imgDimensions, image) {
  const params = computeCropParams(imgDimensions);
  if (!params) return null;

  const { visW, visH } = params;
  const posX = (image?.cardPositionX ?? 50) / 100;
  const posY = (image?.cardPositionY ?? 50) / 100;
  const zoom = image?.cardZoom ?? 1;

  const startX = posX * (1 - visW);
  const startY = posY * (1 - visH);
  const centerX = startX + visW / 2;
  const centerY = startY + visH / 2;

  const zVisW = visW / zoom;
  const zVisH = visH / zoom;
  const zStartX = centerX - zVisW / 2;
  const zStartY = centerY - zVisH / 2;

  return {
    left: `${zStartX * 100}%`,
    top: `${zStartY * 100}%`,
    width: `${zVisW * 100}%`,
    height: `${zVisH * 100}%`
  };
}

/**
 * Compute inline style for a card image.
 */
export function getCardImageStyle(image) {
  const posX = image?.cardPositionX ?? 50;
  const posY = image?.cardPositionY ?? 50;
  const zoom = image?.cardZoom ?? 1;
  return {
    objectPosition: `${posX}% ${posY}%`,
    '--card-zoom': zoom
  };
}

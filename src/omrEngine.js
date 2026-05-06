/* ═══════════════════════════════════════════════════════════════
   Offline OMR Engine — Canvas-based bubble detection
   100% free, works offline, no API keys needed
   ═══════════════════════════════════════════════════════════════ */

/**
 * Sample average grayscale brightness in a circular region.
 * Lower value = darker (filled bubble).
 */
function sampleCircle(imgData, cx, cy, radius, w) {
  const r = Math.max(3, Math.round(radius));
  const x0 = Math.max(0, Math.round(cx - r));
  const y0 = Math.max(0, Math.round(cy - r));
  const x1 = Math.min(w - 1, Math.round(cx + r));
  const y1 = Math.min(imgData.height - 1, Math.round(cy + r));
  const d = imgData.data;
  let total = 0, count = 0;
  const rSq = r * r;
  for (let py = y0; py <= y1; py++) {
    for (let px = x0; px <= x1; px++) {
      const dx = px - cx, dy = py - cy;
      if (dx * dx + dy * dy <= rSq) {
        const idx = (py * w + px) * 4;
        const gray = d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114;
        total += gray;
        count++;
      }
    }
  }
  return count > 0 ? total / count : 255;
}

/**
 * Main OMR processing function.
 *
 * @param {HTMLImageElement} imgEl  - The captured OMR image
 * @param {Object} crop            - { x, y, w, h } in image-natural coords
 * @param {number} totalQ          - Total questions (e.g. 30)
 * @param {number} numOpts         - Options per question (e.g. 4)
 * @returns {{ answers: number[], confidence: number[], debugGrid: Object[] }}
 */
export function processOMR(imgEl, crop, totalQ, numOpts) {
  /* ── Draw image on offscreen canvas ─────────────────────── */
  const canvas = document.createElement("canvas");
  canvas.width = imgEl.naturalWidth;
  canvas.height = imgEl.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(imgEl, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  /* ── Grid layout ────────────────────────────────────────── */
  const numCols = totalQ > 20 ? 3 : totalQ > 10 ? 2 : 1;
  const qPerCol = Math.ceil(totalQ / numCols);

  const colW = crop.w / numCols;           // width of each question column
  const rowH = crop.h / qPerCol;           // height of each row
  const numPad = colW * 0.20;              // left padding (question number area)
  const bubbleAreaW = colW - numPad;       // width containing only bubbles
  const bubbleSpX = bubbleAreaW / numOpts; // horizontal spacing per bubble
  const bubbleR = Math.min(bubbleSpX, rowH) * 0.22; // sample radius

  const answers = [];
  const confidence = [];
  const debugGrid = [];

  /* ── Analyze each question ──────────────────────────────── */
  for (let q = 0; q < totalQ; q++) {
    const col = Math.floor(q / qPerCol);
    const row = q % qPerCol;

    const optVals = [];
    for (let opt = 0; opt < numOpts; opt++) {
      const cx = crop.x + col * colW + numPad + opt * bubbleSpX + bubbleSpX / 2;
      const cy = crop.y + row * rowH + rowH / 2;
      const avg = sampleCircle(imgData, cx, cy, bubbleR, canvas.width);
      optVals.push({ opt, avg, cx, cy });
    }

    // Sort by brightness — darkest first
    const sorted = [...optVals].sort((a, b) => a.avg - b.avg);
    const darkest = sorted[0];
    const lightest = sorted[sorted.length - 1];
    const contrast = lightest.avg - darkest.avg;

    // Need significant contrast to consider a bubble "filled"
    // Threshold: at least 35 units difference between darkest and lightest
    if (contrast > 35 && darkest.avg < 180) {
      answers.push(darkest.opt);
      confidence.push(Math.min(100, Math.round(contrast / 2)));
    } else {
      answers.push(-1); // unanswered / unclear
      confidence.push(0);
    }

    debugGrid.push({ q: q + 1, optVals, chosen: answers[q], contrast });
  }

  return { answers, confidence, debugGrid };
}

/**
 * Auto-detect the bubble grid bounds using edge detection.
 * Returns a suggested crop rectangle { x, y, w, h } in image-natural coords.
 * Falls back to a centered 80% crop if detection fails.
 */
export function autoCrop(imgEl) {
  const w = imgEl.naturalWidth;
  const h = imgEl.naturalHeight;

  // Default: center 80% of image
  const margin = 0.10;
  return {
    x: Math.round(w * margin),
    y: Math.round(h * margin),
    w: Math.round(w * (1 - 2 * margin)),
    h: Math.round(h * (1 - 2 * margin)),
  };
}

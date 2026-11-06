/**
 * canvas.js — logo « DMS » dessiné avec des courbes de Bézier.
 *
 * Deux formes superposées + le texte au centre. Les commandes de la page
 * (couleur, lettres, relief, épaisseur) modifient `state`, puis on redessine.
 */
(() => {
  'use strict';

  const canvas = document.querySelector('#logo-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const colorInput = document.querySelector('#color');
  const lettersInput = document.querySelector('#letters');
  const reliefSlider = document.querySelector('#slider');
  const reliefOutput = document.querySelector('#slider-out');
  const lineSelect = document.querySelector('#choix');
  const reliefButton = document.querySelector('#bouton');

  // Dimensions logiques (le CSS adapte l'affichage, la densité de pixels est gérée plus bas).
  const W = 500;
  const H = 500;
  const M = 20;

  // Points de contrôle de la page « Comprendre le code »
  const A = { x: W - M, y: H - M };
  const B = { x: M, y: H - M };
  const C = { x: W / 2, y: M };
  const D = { x: W - M, y: M };
  const E = { x: W / 2, y: H - M };

  const LOGO_TEXT = 'DMS';

  const state = {
    color: colorInput.value,
    removed: '',
    reliefSize: Number(reliefSlider.value),
    lineWidth: Number(lineSelect.value),
    relief: true,
  };

  // Net sur les écrans haute densité : on agrandit le buffer, pas l'affichage.
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = W * pixelRatio;
  canvas.height = H * pixelRatio;

  const visibleText = () => {
    const removed = new Set(state.removed.toUpperCase());
    return [...LOGO_TEXT].filter((letter) => !removed.has(letter)).join('');
  };

  const draw = () => {
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = state.color;
    ctx.strokeStyle = '#5034e0';
    ctx.lineWidth = state.lineWidth;

    ctx.shadowColor = state.relief ? 'rgba(0, 0, 0, 0.5)' : 'transparent';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = state.reliefSize;
    ctx.shadowOffsetY = state.reliefSize;

    // Forme 1 (couleur au choix)
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.bezierCurveTo(D.x, D.y, E.x, E.y, A.x, A.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Forme 2 (rose)
    ctx.fillStyle = '#e034b3';
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.bezierCurveTo(C.x, C.y, B.x, B.y, A.x, A.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Texte
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.floor(W / 3 - W / 10)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(visibleText(), W / 2, H / 2);
  };

  colorInput.addEventListener('input', () => {
    state.color = colorInput.value;
    draw();
  });

  lettersInput.addEventListener('input', () => {
    state.removed = lettersInput.value.trim();
    draw();
  });

  reliefSlider.addEventListener('input', () => {
    state.reliefSize = Number(reliefSlider.value);
    reliefOutput.textContent = reliefSlider.value;
    draw();
  });

  lineSelect.addEventListener('change', () => {
    state.lineWidth = Number(lineSelect.value);
    draw();
  });

  reliefButton.addEventListener('click', () => {
    state.relief = !state.relief;
    reliefButton.setAttribute('aria-pressed', String(state.relief));
    draw();
  });

  draw();
})();

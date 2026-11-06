/**
 * video.js — si le fichier vidéo est introuvable (ou illisible), on remplace
 * le lecteur vide par un message avec un lien vers la vidéo sur YouTube.
 */
(() => {
  'use strict';

  const YOUTUBE_URL = 'https://www.youtube.com/watch?v=GGhKPm18E48';

  const buildFallback = () => {
    const fallback = document.createElement('div');
    fallback.className = 'media-fallback';
    fallback.setAttribute('role', 'status');

    const message = document.createElement('p');
    message.textContent = 'La vidéo n’est pas disponible sur ce site pour le moment.';

    const link = document.createElement('a');
    link.className = 'btn';
    link.href = YOUTUBE_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '▶ Regarder sur YouTube';

    fallback.append(message, link);
    return fallback;
  };

  document.querySelectorAll('[data-video]').forEach((frame) => {
    const video = frame.querySelector('video');
    if (!video) return;

    const showFallback = () => frame.replaceWith(buildFallback());

    // L'erreur a pu se produire avant que ce script (différé) ne s'exécute.
    if (video.error) {
      showFallback();
    } else {
      video.addEventListener('error', showFallback, { once: true });
    }
  });
})();

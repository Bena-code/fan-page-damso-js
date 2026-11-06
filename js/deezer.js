/**
 * deezer.js — recherche musicale via l'API publique de Deezer.
 *
 * L'API Deezer n'envoie pas d'en-têtes CORS : `fetch` est donc bloqué depuis
 * un navigateur. On passe par JSONP (une balise <script> qui rappelle une
 * fonction), enveloppé ici dans une Promise pour pouvoir utiliser async/await.
 */
(() => {
  'use strict';

  const API = 'https://api.deezer.com/search';
  const MAX_RESULTS = 6;
  const TIMEOUT_MS = 8000;

  const form = document.querySelector('#deezer-form');
  const input = document.querySelector('#recherche');
  const status = document.querySelector('#deezer-status');
  const results = document.querySelector('#resultats');
  if (!form || !input || !status || !results) return;

  /** Requête JSONP avec nom de callback unique, délai maximal et nettoyage. */
  const jsonp = (url) =>
    new Promise((resolve, reject) => {
      const callbackName = `deezer_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');

      const cleanup = () => {
        clearTimeout(timer);
        delete window[callbackName];
        script.remove();
      };
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('Délai dépassé'));
      }, TIMEOUT_MS);

      window[callbackName] = (data) => {
        cleanup();
        resolve(data);
      };
      script.onerror = () => {
        cleanup();
        reject(new Error('Réseau indisponible'));
      };
      script.src = `${url}&output=jsonp&callback=${callbackName}`;
      document.head.append(script);
    });

  /** N'accepte que des URL https (les données viennent d'un service tiers). */
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : '';
    } catch {
      return '';
    }
  };

  const setStatus = (message, state = 'info') => {
    status.textContent = message;
    status.dataset.state = state;
  };

  /** Crée un élément en lui affectant des propriétés : el('a', { href }, enfant…) */
  const el = (tag, props = {}, ...children) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
  };

  /** Carte d'un titre — tout est inséré via textContent / propriétés (pas d'innerHTML). */
  const renderTrack = (track) => {
    const cover = safeUrl(track.album?.cover_medium);
    const preview = safeUrl(track.preview);
    const link = safeUrl(track.link);

    const card = el('li', { className: 'track' });

    if (cover) {
      card.append(
        el('img', {
          src: cover,
          alt: `Pochette de ${track.album?.title ?? track.title}`,
          width: 250,
          height: 250,
          loading: 'lazy',
        }),
      );
    }

    card.append(
      el('h3', { textContent: track.title, title: track.title }),
      el('p', { textContent: track.artist?.name ?? '' }),
    );

    if (preview) {
      card.append(
        el('audio', {
          controls: true,
          preload: 'none',
          src: preview,
          ariaLabel: `Extrait de ${track.title}`,
        }),
      );
    } else {
      card.append(el('p', { textContent: 'Pas d’extrait disponible.' }));
    }

    if (link) {
      card.append(el('a', { href: link, target: '_blank', rel: 'noopener noreferrer', textContent: 'Voir sur Deezer' }));
    }
    return card;
  };

  // Seule la dernière recherche compte si plusieurs sont lancées de suite.
  let lastRequest = 0;

  const search = async (query) => {
    const requestId = ++lastRequest;
    results.replaceChildren();
    setStatus(`Chargement des sons de « ${query} »…`);

    try {
      const data = await jsonp(`${API}?q=${encodeURIComponent(query)}`);
      if (requestId !== lastRequest) return;
      if (data?.error) throw new Error(data.error.message ?? 'Erreur Deezer');

      const tracks = (data?.data ?? []).slice(0, MAX_RESULTS);
      if (tracks.length === 0) {
        setStatus(`Aucun résultat pour « ${query} ».`);
        return;
      }
      results.append(...tracks.map(renderTrack));
      setStatus(`${tracks.length} résultats pour « ${query} ».`);
    } catch (error) {
      if (requestId !== lastRequest) return;
      setStatus(`Impossible de joindre Deezer pour le moment (${error.message}). Réessayez dans un instant.`, 'error');
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (query) search(query);
  });

  // Un seul extrait à la fois : on met en pause les autres lecteurs.
  results.addEventListener(
    'play',
    (event) => {
      results.querySelectorAll('audio').forEach((audio) => {
        if (audio !== event.target) audio.pause();
      });
    },
    true,
  );

  search(input.value.trim() || 'Damso');
})();

/**
 * albums.js — page « Vie d'artiste ».
 * Ouvre la fenêtre <dialog> correspondant à la pochette cliquée.
 * La fermeture (bouton ×, touche Échap) est gérée nativement ;
 * on ajoute seulement la fermeture au clic sur le fond sombre.
 */
(() => {
  'use strict';

  document.addEventListener('click', (event) => {
    // Ouverture : <button data-open="id-du-dialog">
    const trigger = event.target.closest('[data-open]');
    if (trigger) {
      document.getElementById(trigger.dataset.open)?.showModal();
      return;
    }

    // Clic sur le fond (::backdrop) : la cible est le <dialog> lui-même
    if (event.target instanceof HTMLDialogElement && event.target.open) {
      event.target.close();
    }
  });
})();

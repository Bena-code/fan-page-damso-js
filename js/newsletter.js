/**
 * newsletter.js — formulaire d'inscription.
 *
 * On s'appuie sur la validation native du navigateur (Constraint Validation API :
 * required, pattern, min, max…) et on affiche les erreurs en français, sous
 * chaque champ, à la place des bulles natives et du alert() d'origine.
 *
 * Aucune donnée n'est envoyée : à la validation, on affiche une confirmation.
 * Pour brancher un vrai service, remplacer `handleValid()` par un fetch().
 */
(() => {
  'use strict';

  const form = document.querySelector('#formulaire');
  if (!form) return;

  const summary = document.querySelector('#form-summary');
  const success = document.querySelector('#form-success');
  const rangeInput = form.elements.range;
  const rangeOutput = document.querySelector('#range-out');
  const photoInput = form.elements.photo;
  const photoPreview = document.querySelector('#photo-preview');

  // On gère l'affichage des erreurs nous-mêmes (sans JS, la validation native reste active).
  form.noValidate = true;

  /* ---------- Bornes dynamiques (dates relatives à aujourd'hui) ---------- */
  const pad = (n) => String(n).padStart(2, '0');

  const isoWeek = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day); // jeudi de la semaine ISO
    const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
    const week = Math.ceil(((d - yearStart) / 86_400_000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${pad(week)}`;
  };

  const toDateTimeLocal = (date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

  const setupDateLimits = () => {
    const now = new Date();
    form.elements.datenaissance.max = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    form.elements.moisnaissance.max = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    form.elements.semainenaissance.max = isoWeek(now);

    // Désinscription : à partir de maintenant, un an plus tard à midi par défaut.
    const unsubscribe = form.elements.datedesinscription;
    const inOneYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate(), 12, 0);
    unsubscribe.min = toDateTimeLocal(now);
    unsubscribe.defaultValue = toDateTimeLocal(inOneYear); // reprise par « Remise à zéro »
    unsubscribe.value = unsubscribe.defaultValue;
  };

  /* ---------- Messages d'erreur ---------- */
  const messageFor = (field) => {
    const { validity, dataset } = field;
    if (validity.customError) return field.validationMessage;
    if (validity.valueMissing) {
      if (field.type === 'checkbox') return 'Cette case doit être cochée.';
      if (field.type === 'radio') return 'Faites un choix.';
      if (field.type === 'file') return 'Ajoutez une photo.';
      if (field.tagName === 'SELECT') return 'Choisissez une option.';
      return 'Ce champ est obligatoire.';
    }
    if (validity.typeMismatch) {
      return field.type === 'email'
        ? 'Adresse e-mail invalide (ex. nom@domaine.fr).'
        : 'Adresse invalide : commencez par http:// ou https://.';
    }
    if (validity.patternMismatch) return dataset.msgPattern ?? 'Format invalide.';
    if (validity.tooShort) return `${field.minLength} caractères minimum.`;
    if (validity.rangeUnderflow) return dataset.msgUnderflow ?? `Valeur minimale : ${field.min}.`;
    if (validity.rangeOverflow) return dataset.msgOverflow ?? `Valeur maximale : ${field.max}.`;
    if (validity.badInput) return 'Valeur invalide.';
    return 'Valeur invalide.';
  };

  const hostOf = (field) => field.closest('[data-field]');
  const errorOf = (field) => hostOf(field)?.querySelector('.field__error');

  /** Affiche (ou efface) l'erreur d'un champ ; gère les groupes de boutons radio. */
  const setError = (field, message) => {
    const host = hostOf(field);
    const output = errorOf(field);
    if (!output) return;
    const controls = field.type === 'radio' ? host.querySelectorAll('input[type="radio"]') : [field];

    controls.forEach((control) => {
      if (message) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    });
    output.textContent = message;
    output.hidden = !message;
  };

  const validate = (field) => {
    const valid = field.checkValidity();
    setError(field, valid ? '' : messageFor(field));
    return valid;
  };

  // Champs à valider : ceux qui ont un emplacement d'erreur (la couleur, toujours valide, n'en a pas).
  const fields = () => [...form.elements].filter((el) => el.willValidate && el.name && errorOf(el));

  /* ---------- Événements ---------- */
  rangeInput.addEventListener('input', () => {
    rangeOutput.textContent = rangeInput.value;
  });

  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (photoPreview.src.startsWith('blob:')) URL.revokeObjectURL(photoPreview.src);

    // `accept` n'est qu'une suggestion : on vérifie vraiment le type.
    const wrongType = file && file.type !== 'image/jpeg';
    photoInput.setCustomValidity(wrongType ? 'Le fichier doit être une image JPEG.' : '');

    if (file && !wrongType) {
      photoPreview.src = URL.createObjectURL(file);
      photoPreview.hidden = false;
    } else {
      photoPreview.removeAttribute('src');
      photoPreview.hidden = true;
    }
    validate(photoInput);
  });

  // Dès qu'un champ a été signalé en erreur, on le revalide à chaque modification.
  form.addEventListener('input', (event) => {
    const field = event.target;
    if (field.willValidate && field.hasAttribute('aria-invalid')) validate(field);
  });

  // Validation à la sortie d'un champ renseigné (sans réprimander quand on ne fait que passer).
  form.addEventListener('focusout', (event) => {
    const field = event.target;
    if (!field.willValidate || !errorOf(field)) return;
    const hasValue = field.type === 'checkbox' || field.type === 'radio' ? false : field.value !== '';
    if (hasValue) validate(field);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    success.hidden = true;

    const invalid = fields().filter((field) => !validate(field));
    if (invalid.length > 0) {
      const count = new Set(invalid.map(hostOf)).size;
      summary.textContent =
        count === 1 ? 'Un champ est à corriger.' : `${count} champs sont à corriger.`;
      summary.hidden = false;
      invalid[0].focus();
      return;
    }

    summary.hidden = true;
    handleValid();
  });

  form.addEventListener('reset', () => {
    summary.hidden = true;
    success.hidden = true;
    fields().forEach((field) => setError(field, ''));
    photoInput.setCustomValidity('');
    photoPreview.removeAttribute('src');
    photoPreview.hidden = true;
    // Le navigateur remet les valeurs *après* l'événement : on synchronise l'affichage juste après.
    setTimeout(() => {
      rangeOutput.textContent = rangeInput.value;
    });
  });

  /** Appelé quand tout est valide. C'est ici qu'on enverrait les données à un serveur. */
  const handleValid = () => {
    const prenom = form.elements.prenom.value.trim();
    const heure = form.elements.heure.value;

    success.textContent = `Merci ${prenom} ! Votre inscription est enregistrée : vous recevrez la newsletter vers ${heure}.`;
    form.reset();
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  rangeOutput.textContent = rangeInput.value;
  setupDateLimits();
})();

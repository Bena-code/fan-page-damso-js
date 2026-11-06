# Site Fan Damso - Web App Musicale 🎵

Site web responsive dédié à l'artiste Damso, intégrant une consommation d'API REST en temps réel.

## 🚀 Fonctionnalités

* **Moteur de recherche musical** : connexion à l'API publique de **Deezer** pour rechercher des artistes et écouter des extraits (30 s) en direct (JSONP enveloppé dans une Promise, délai maximal, anti-XSS).
* **Dessin vectoriel** : module `<canvas>` interactif avec courbes de Bézier (logo DMS), net sur écrans haute densité.
* **Albums** : fenêtres `<dialog>` natives (Échap, focus et accessibilité gérés par le navigateur).
* **Formulaire complet** : validation HTML5 + messages d'erreur français sous chaque champ.
* **Navigation connectée** : menu, flèches précédent / suivant, sommaire et cartes de l'accueil sont générés depuis une seule liste (`js/layout.js`).

## 📁 Structure

```
html/   index.html (accueil) · page1 (sommaire) · page2 (vie d'artiste) · page3 (médias) · page4 (newsletter)
css/    feuilledestyle.css   (feuille unique : variables, base, layout, composants)
js/     layout.js   menu, pied de page, horloge, pager, sommaire (toutes les pages)
        albums.js   fenêtres d'albums (page 2)
        deezer.js   recherche Deezer (page 3)
        canvas.js   logo DMS (page 3)
        video.js    solution de repli si la vidéo est absente (page 3)
        newsletter.js  validation du formulaire (page 4)
image/  visuels, pochettes et extrait audio
```

Pour ajouter une page : créer le fichier HTML (copier une page existante) et ajouter une ligne dans `PAGES` en haut de `js/layout.js`.

## ▶️ Lancer le site

Le site est accessible en ligne sur [GitHub Pages](https://bena-code.github.io/fan-page-damso-js/html/index.html).

Pour le lancer localement, ouvrir `html/index.html` dans le navigateur (double-clic), ou, pour un rendu identique à la mise en ligne :

```
python3 -m http.server 8000
# puis http://localhost:8000/html/index.html
```

## 🛠️ Stack Technique

* **Frontend** : HTML5 sémantique, CSS3 moderne (variables, grid, nesting, `clamp()`, `:has()`), JavaScript vanilla (sans dépendance ni build).
* **API externe** : Deezer API.

## 📝 Notes

* La vidéo `image/Damso-Macarena.mp4` n'est pas dans le projet : tant qu'elle est absente, un lien YouTube s'affiche à la place.
* Le formulaire est une démonstration : aucune donnée n'est envoyée. Pour un vrai envoi, remplacer `handleValid()` dans `js/newsletter.js` par un `fetch()` vers un service (Formspree, API maison…).

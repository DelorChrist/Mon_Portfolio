# Portfolio — Delor Christ

Site statique pour présenter le portfolio professionnel de Delor Christ.

Fichiers principaux:
- `index.html` — page principale
- `css/style.css` — styles
- `js/main.js` — petites interactions (menu mobile, feedback formulaire)
- `assets/` — images et `CV-Delor-Christ.pdf` (placeholder)

Ouvrir localement:
1. Double-cliquez sur `index.html` ou ouvrez-le dans votre navigateur.

Remarques:
- Remplacez `assets/profile.svg` et les images `project-*.jpg` par vos visuels.
- Remplacez `assets/CV-Delor-Christ.pdf` par votre vrai CV pour le bouton "Télécharger CV".
- Pour la mise en production, hébergez sur GitHub Pages, Vercel ou Netlify.

Améliorations possibles:
- Ajout d'une vraie action backend pour le formulaire de contact.
- Optimisation des images et chargement paresseux.
- Intégration d'animations supplémentaires et tests d'accessibilité.

Ajouter des projets (timeline)
--------------------------------
Chaque projet est un bloc `.timeline-item` contenant une `.project-card`. Les items sont automatiquement alternés gauche/droite par CSS. Exemple :

```html
<div class="timeline-item">
	<article class="project-card">...</article>
</div>
```

L'animation d'apparition est gérée par `js/main.js` (IntersectionObserver) et applique une classe `.revealed` automatiquement quand la carte entre dans la vue.

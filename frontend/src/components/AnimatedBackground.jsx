// frontend/src/components/AnimatedBackground.jsx

import { useRef, useEffect } from 'react';

/**
 * Affiche un arrière-plan animé interactif optimisé.
 * S'arrête lorsque la page n'est pas visible et limite les FPS.
 */
const AnimatedBackground = () => {
  const refCanevas = useRef(null);
  const refEtat = useRef({
    souris: { x: -1000, y: -1000 },
    points: [],
    derniereFrame: 0,
  });

  // Paramètres de configuration
  const FPS_LIMITE = 30; // Limite à 30 FPS pour économiser la batterie/CPU
  const INTERVALLE_MS = 1000 / FPS_LIMITE;
  const TAILLE_GRILLE = 25; // Plus grand = moins de points = plus performant

  useEffect(() => {
    const canevas = refCanevas.current;
    if (!canevas) return;
    
    // Gestion DPI pour netteté sur écrans Retina
    const dpr = window.devicePixelRatio || 1;
    const contexte = canevas.getContext('2d');
    let idAnimation;

    const configurerGrille = () => {
      const largeur = window.innerWidth;
      const hauteur = window.innerHeight;

      // Ajustement de la résolution du canvas
      canevas.width = largeur * dpr;
      canevas.height = hauteur * dpr;
      canevas.style.width = `${largeur}px`;
      canevas.style.height = `${hauteur}px`;
      
      contexte.scale(dpr, dpr);

      refEtat.current.points = [];
      const colonnes = Math.ceil(largeur / TAILLE_GRILLE);
      const rangees = Math.ceil(hauteur / TAILLE_GRILLE);

      for (let i = 0; i < colonnes; i++) {
        for (let j = 0; j < rangees; j++) {
          refEtat.current.points.push({
            x: i * TAILLE_GRILLE + TAILLE_GRILLE / 2,
            y: j * TAILLE_GRILLE + TAILLE_GRILLE / 2
          });
        }
      }
    };

    const dessinerScene = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      contexte.clearRect(0, 0, width, height);
      contexte.fillStyle = 'rgba(0, 0, 0, 0.85)';
      
      const { points, souris } = refEtat.current;
      const rayonBase = 1;
      const rayonMax = 3.5;
      const rayonInfluence = 180; 

      // Optimisation : Utiliser une boucle for classique plus rapide que forEach
      for (let i = 0, len = points.length; i < len; i++) {
        const point = points[i];
        const deltaX = point.x - souris.x;
        const deltaY = point.y - souris.y;
        
        // Optimisation : Distance au carré pour éviter Math.sqrt coûteux si hors zone
        const distCarree = deltaX * deltaX + deltaY * deltaY;
        const influenceCarree = rayonInfluence * rayonInfluence;

        let rayon = rayonBase;

        if (distCarree < influenceCarree) {
          // Calcul précis uniquement si dans la zone d'influence
          const distance = Math.sqrt(distCarree);
          const attenuation = 1 - (distance / rayonInfluence);
          // Formule quadratique pour adoucir la transition
          rayon = rayonBase + (rayonMax - rayonBase) * (attenuation * attenuation);
        }

        contexte.beginPath();
        // Optimisation : Math.round pour éviter l'anti-aliasing sub-pixel inutile
        contexte.arc(Math.round(point.x), Math.round(point.y), rayon, 0, 2 * Math.PI);
        contexte.fill();
      }
    };

    const boucleAnimation = (timestamp) => {
      // 1. Vérifier si l'onglet est visible
      if (document.hidden) {
        idAnimation = requestAnimationFrame(boucleAnimation);
        return;
      }

      // 2. Limiter les FPS
      const delta = timestamp - refEtat.current.derniereFrame;
      if (delta > INTERVALLE_MS) {
        refEtat.current.derniereFrame = timestamp - (delta % INTERVALLE_MS);
        dessinerScene();
      }

      idAnimation = requestAnimationFrame(boucleAnimation);
    };

    // --- Listeners ---
    const gererMouvementSouris = (e) => {
      refEtat.current.souris.x = e.clientX;
      refEtat.current.souris.y = e.clientY;
    };

    const gererSortieSouris = () => {
      refEtat.current.souris.x = -1000;
      refEtat.current.souris.y = -1000;
    };

    // Debounce sur le resize pour performance
    let timeoutResize;
    const gererRedimensionnement = () => {
      clearTimeout(timeoutResize);
      timeoutResize = setTimeout(configurerGrille, 150);
    };

    // Init
    configurerGrille();
    idAnimation = requestAnimationFrame(boucleAnimation);

    window.addEventListener('mousemove', gererMouvementSouris);
    window.addEventListener('resize', gererRedimensionnement);
    document.addEventListener('mouseleave', gererSortieSouris);

    return () => {
      cancelAnimationFrame(idAnimation);
      window.removeEventListener('mousemove', gererMouvementSouris);
      window.removeEventListener('resize', gererRedimensionnement);
      document.removeEventListener('mouseleave', gererSortieSouris);
      clearTimeout(timeoutResize);
    };
  }, []);

  return (
    <canvas
      ref={refCanevas}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none', // Laisse passer les clics au contenu en dessous
      }}
    />
  );
};

export default AnimatedBackground;
// [Symbole Commentaire] FICHIER : frontend/src/components/AnimatedBackground.jsx

import { useRef, useEffect } from 'react';

/**
 * Arrière-plan animé interactif optimisé.
 * Exécution sur le Main Thread avec limitation de charge.
 */
const AnimatedBackground = () => {
  const refCanevas = useRef(null);
  const refEtat = useRef({
    souris: { x: -1000, y: -1000 },
    points: [],
    derniereFrame: 0,
    largeur: 0,
    hauteur: 0,
  });

  // Configuration de performance
  const FPS_LIMITE = 30;
  const INTERVALLE_MS = 1000 / FPS_LIMITE;
  
  // Paramètres géométriques
  const RAYON_BASE = 1;
  const RAYON_MAX = 3.5;
  const RAYON_INFLUENCE = 180;
  const RAYON_INFLUENCE_SQ = RAYON_INFLUENCE * RAYON_INFLUENCE; // Pré-calcul pour éviter Math.sqrt

  useEffect(() => {
    const canevas = refCanevas.current;
    if (!canevas) return;
    
    const contexte = canevas.getContext('2d', { alpha: true }); // Alpha activé pour la transparence
    let idAnimation;
    let timeoutResize;

    // Détermine la densité de la grille selon la puissance du device (taille d'écran comme proxy)
    const obtenirTailleGrille = () => {
      return window.innerWidth < 768 ? 45 : 25; // Moins de points sur mobile
    };

    const configurerGrille = () => {
      const largeur = window.innerWidth;
      const hauteur = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Mise à l'échelle DPI
      canevas.width = largeur * dpr;
      canevas.height = hauteur * dpr;
      canevas.style.width = `${largeur}px`;
      canevas.style.height = `${hauteur}px`;
      
      contexte.scale(dpr, dpr);
      
      // Mise à jour de l'état interne
      refEtat.current.largeur = largeur;
      refEtat.current.hauteur = hauteur;

      const tailleGrille = obtenirTailleGrille();
      const colonnes = Math.ceil(largeur / tailleGrille);
      const rangees = Math.ceil(hauteur / tailleGrille);
      
      // Réinitialisation et peuplement des points (Tableau plat pour itération rapide)
      const points = new Float32Array(colonnes * rangees * 2); // x, y entrelacés
      let index = 0;

      for (let i = 0; i < colonnes; i++) {
        for (let j = 0; j < rangees; j++) {
          points[index] = i * tailleGrille + tailleGrille / 2;
          points[index + 1] = j * tailleGrille + tailleGrille / 2;
          index += 2;
        }
      }
      refEtat.current.points = points;
    };

    const dessinerScene = () => {
      const { largeur, hauteur, points, souris } = refEtat.current;
      
      contexte.clearRect(0, 0, largeur, hauteur);
      contexte.fillStyle = 'rgba(0, 0, 0, 0.85)'; // Couleur des points
      
      contexte.beginPath(); // Batch path drawing

      for (let i = 0; i < points.length; i += 2) {
        const px = points[i];
        const py = points[i + 1];
        
        const dx = px - souris.x;
        const dy = py - souris.y;
        
        // Optimisation : Comparaison de distance au carré (évite Math.sqrt coûteux)
        const distSq = dx * dx + dy * dy;
        
        let rayon = RAYON_BASE;

        if (distSq < RAYON_INFLUENCE_SQ) {
          // Calcul coûteux uniquement si nécessaire (dans la zone d'influence)
          const dist = Math.sqrt(distSq);
          const facteur = 1 - (dist / RAYON_INFLUENCE);
          // Fonction d'atténuation quadratique (plus douce)
          rayon = RAYON_BASE + (RAYON_MAX - RAYON_BASE) * (facteur * facteur);
        }

        // Dessin du point
        contexte.moveTo(px + rayon, py);
        contexte.arc(px, py, rayon, 0, 2 * Math.PI);
      }
      
      contexte.fill();
    };

    const boucleAnimation = (timestamp) => {
      // 1. Coupe-circuit si l'onglet est inactif
      if (document.hidden) {
        idAnimation = requestAnimationFrame(boucleAnimation);
        return;
      }

      // 2. Throttling des FPS
      const delta = timestamp - refEtat.current.derniereFrame;
      if (delta > INTERVALLE_MS) {
        refEtat.current.derniereFrame = timestamp - (delta % INTERVALLE_MS);
        dessinerScene();
      }

      idAnimation = requestAnimationFrame(boucleAnimation);
    };

    // --- Gestionnaires d'événements ---
    
    const gererMouvementSouris = (e) => {
      // Mise à jour directe de la ref sans déclencher de re-render React
      refEtat.current.souris.x = e.clientX;
      refEtat.current.souris.y = e.clientY;
    };

    const gererSortieSouris = () => {
      refEtat.current.souris.x = -1000;
      refEtat.current.souris.y = -1000;
    };

    const gererRedimensionnement = () => {
      clearTimeout(timeoutResize);
      timeoutResize = setTimeout(() => {
        configurerGrille();
        dessinerScene(); // Redessin immédiat après resize
      }, 150);
    };

    // Initialisation
    configurerGrille();
    idAnimation = requestAnimationFrame(boucleAnimation);

    // Attachement des écouteurs
    window.addEventListener('mousemove', gererMouvementSouris, { passive: true });
    window.addEventListener('resize', gererRedimensionnement, { passive: true });
    document.addEventListener('mouseleave', gererSortieSouris);

    // Nettoyage
    return () => {
      cancelAnimationFrame(idAnimation);
      clearTimeout(timeoutResize);
      window.removeEventListener('mousemove', gererMouvementSouris);
      window.removeEventListener('resize', gererRedimensionnement);
      document.removeEventListener('mouseleave', gererSortieSouris);
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
        pointerEvents: 'none',
      }}
    />
  );
};

export default AnimatedBackground;
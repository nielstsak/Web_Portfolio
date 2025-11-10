// frontend/src/components/AnimatedBackground.jsx

import { useRef, useEffect } from 'react';

/**
 * Affiche un arrière-plan animé interactif avec une grille de points
 * qui réagissent à la position du curseur de la souris.
 */
const AnimatedBackground = () => {
  // Références React pour accéder au canevas et à l'état interne (mutable)
  const refCanevas = useRef(null);
  const refEtat = useRef({
    souris: { x: -1000, y: -1000 }, // Position initiale hors écran
    points: [],
  });

  useEffect(() => {
    const canevas = refCanevas.current;
    if (!canevas) return;
    const contexte = canevas.getContext('2d');

    // Initialise la grille de points en fonction de la taille de la fenêtre.
    const configurerGrille = () => {
      canevas.width = window.innerWidth;
      canevas.height = window.innerHeight;

      refEtat.current.points = [];
      const tailleGrille = 20; 
      const colonnes = Math.ceil(canevas.width / tailleGrille);
      const rangees = Math.ceil(canevas.height / tailleGrille);

      // Crée un point pour chaque intersection de la grille
      for (let i = 0; i < colonnes; i++) {
        for (let j = 0; j < rangees; j++) {
          const x = i * tailleGrille + tailleGrille / 2;
          const y = j * tailleGrille + tailleGrille / 2;
          refEtat.current.points.push({ x, y });
        }
      }
    };

    // --- Boucle d'animation principale (appelée à chaque frame) ---
    let idAnimation;
    const animer = () => {
      // Nettoie le canevas
      contexte.clearRect(0, 0, canevas.width, canevas.height);
      contexte.fillStyle = 'rgba(0, 0, 0, 0.85)';
      
      const { points, souris } = refEtat.current;
      const rayonBase = 1;
      const rayonMax = 3;
      const rayonInfluence = 150; // Zone d'effet de la souris

      points.forEach(point => {
        const deltaX = point.x - souris.x;
        const deltaY = point.y - souris.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Calcule l'atténuation : 1 (proche) à 0 (loin)
        const attenuation = 1 - Math.min(distance / rayonInfluence, 1);
        // Le rayon du point grossit exponentiellement à mesure qu'il est proche
        const rayon = rayonBase + (rayonMax - rayonBase) * Math.pow(attenuation, 2);

        // Dessine le point
        contexte.beginPath();
        contexte.arc(point.x, point.y, rayon, 0, 2 * Math.PI);
        contexte.fill();
      });

      idAnimation = requestAnimationFrame(animer);
    };

    // --- Gestionnaires d'événements ---
    const gererMouvementSouris = (evenement) => {
      refEtat.current.souris.x = evenement.clientX;
      refEtat.current.souris.y = evenement.clientY;
    };
    
    // Réinitialise la position de la souris lorsque le curseur quitte la fenêtre.
    const gererSortieSouris = () => {
      refEtat.current.souris.x = -1000;
      refEtat.current.souris.y = -1000;
    };

    const gererRedimensionnement = () => {
      configurerGrille();
    };

    // --- Initialisation et Nettoyage ---
    configurerGrille();
    animer();
    window.addEventListener('mousemove', gererMouvementSouris);
    window.addEventListener('resize', gererRedimensionnement);
    document.addEventListener('mouseleave', gererSortieSouris);

    // Fonction de nettoyage appelée lors du démontage du composant
    return () => {
      cancelAnimationFrame(idAnimation);
      window.removeEventListener('mousemove', gererMouvementSouris);
      window.removeEventListener('resize', gererRedimensionnement);
      document.removeEventListener('mouseleave', gererSortieSouris);
    };
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois.

  return (
    <canvas
      ref={refCanevas}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1, // Placé en arrière-plan
      }}
    />
  );
};

export default AnimatedBackground;
// frontend/src/components/AnimatedBackground.jsx

import { useRef, useEffect } from 'react';

/**
 * Affiche un arrière-plan animé interactif avec une grille de points
 * qui réagissent à la position du curseur de la souris.
 */
const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    mouse: { x: -1000, y: -1000 },
    dots: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Initialise la grille de points en fonction de la taille de la fenêtre.
    const setupGrid = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      stateRef.current.dots = [];
      const gridSize = 20; 
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize + gridSize / 2;
          const y = j * gridSize + gridSize / 2;
          stateRef.current.dots.push({ x, y });
        }
      }
    };

    // --- Boucle d'animation principale ---
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      
      const { dots, mouse } = stateRef.current;
      const baseRadius = 1;
      const maxRadius = 3;
      const influenceRadius = 150;

      dots.forEach(dot => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const falloff = 1 - Math.min(distance / influenceRadius, 1);
        const radius = baseRadius + (maxRadius - baseRadius) * Math.pow(falloff, 2);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, 2 * Math.PI);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // --- Gestionnaires d'événements ---
    const handleMouseMove = (event) => {
      stateRef.current.mouse.x = event.clientX;
      stateRef.current.mouse.y = event.clientY;
    };
    
    // Réinitialise la position de la souris lorsque le curseur quitte la fenêtre.
    const handleMouseLeave = () => {
      stateRef.current.mouse.x = -1000;
      stateRef.current.mouse.y = -1000;
    };

    const handleResize = () => {
      setupGrid();
    };

    // --- Initialisation et Nettoyage ---
    setupGrid();
    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une seule fois.

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1, 
      }}
    />
  );
};

export default AnimatedBackground;
// frontend/src/components/CodeBrowser.jsx

import { useState, useEffect, useCallback } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Utilise un thème sombre populaire pour la coloration syntaxique
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { clientApi } from '../store/appStore'; // Renommé depuis apiClient

/**
 * Extrait l'extension d'un nom de fichier.
 * @param {string} nomFichier - Le nom du fichier.
 * @returns {string} L'extension du fichier (ex: "jsx", "py").
 */
const obtenirExtensionFichier = (nomFichier) => {
  if (!nomFichier) return '';
  // Méthode robuste pour obtenir la dernière partie après le point.
  return nomFichier.slice(((nomFichier.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Composant récursif pour afficher un élément de l'arborescence (fichier ou dossier).
 * @param {{ 
 * element: object, 
 * onSelectionFichier: function, 
 * niveau: number 
 * }} props
 */
function ElementArborescence({ element, onSelectionFichier, niveau = 0 }) {
  const [estOuvert, setEstOuvert] = useState(false);

  const gererClic = () => {
    if (element.type === 'directory') {
      setEstOuvert(!estOuvert);
    } else {
      onSelectionFichier(element.path);
    }
  };

  return (
    <>
      <ListItem 
        button 
        onClick={gererClic} 
        // Indente l'élément en fonction de sa profondeur dans l'arborescence
        sx={{ pl: 2 + niveau * 2, py: 0.5 }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {element.type === 'directory' ? <FolderIcon fontSize="small" /> : <InsertDriveFileIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText primary={<Typography variant="body2">{element.name}</Typography>} />
        {/* Affiche une icône développer/réduire pour les dossiers */}
        {element.type === 'directory' ? estOuvert ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItem>
      
      {/* Contenu récursif pour les enfants du dossier */}
      {element.type === 'directory' && (
        <Collapse in={estOuvert} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {element.children.map(enfant => (
              <ElementArborescence 
                key={enfant.path} 
                element={enfant} 
                onSelectionFichier={onSelectionFichier} 
                niveau={niveau + 1} 
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

/**
 * Affiche un explorateur de code avec une arborescence de fichiers et un visualiseur.
 * @param {{ idProjet: number }} props
 */
function CodeBrowser({ idProjet }) {
  // --- États locaux ---
  const [arborescence, setArborescence] = useState([]);
  const [fichierSelectionne, setFichierSelectionne] = useState(null);
  const [contenuFichier, setContenuFichier] = useState('');
  const [chargeArborescence, setChargeArborescence] = useState(true);
  const [chargeFichier, setChargeFichier] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Effet pour charger l'arborescence des fichiers du projet.
  useEffect(() => {
    const chargerArborescence = async () => {
      if (!idProjet) return;
      setChargeArborescence(true);
      try {
        const reponse = await clientApi.get(`/projects/${idProjet}/source-code-tree/`);
        setArborescence(reponse.data);
        setErreur(null);
      } catch (err) {
        setErreur("Impossible de charger l'arborescence du code source.");
      } finally {
        setChargeArborescence(false);
      }
    };
    chargerArborescence();
  }, [idProjet]); // Se redéclenche si l'ID du projet change

  // Fonction pour charger le contenu d'un fichier sélectionné.
  const gererSelectionFichier = useCallback(async (chemin) => {
    setChargeFichier(true);
    setFichierSelectionne(chemin);
    try {
      const reponse = await clientApi.get(`/projects/${idProjet}/source-code-file/?path=${chemin}`);
      setContenuFichier(reponse.data.content);
      setErreur(null);
    } catch (err) {
      setErreur(`Impossible de charger le contenu du fichier : ${chemin}`);
      setContenuFichier('');
    } finally {
      setChargeFichier(false);
    }
  }, [idProjet]); // 'useCallback' mémorise la fonction

  // Réinitialise la vue du fichier pour revenir à l'état initial.
  const gererFermetureFichier = () => {
    setFichierSelectionne(null);
    setContenuFichier('');
  };

  // --- Rendu conditionnel ---
  if (chargeArborescence) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>;
  }
  if (erreur && !arborescence.length) {
    return <Alert severity="warning">{erreur}</Alert>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1 }}>
      
      {/* Panneau de l'arborescence des fichiers (gauche) */}
      <Box sx={{ width: '40%', borderRight: '1px solid rgba(0,0,0,0.12)', overflowY: 'auto' }}>
        <List dense>
          {arborescence.map(element => (
            <ElementArborescence key={element.path} element={element} onSelectionFichier={gererSelectionFichier} />
          ))}
        </List>
      </Box>

      {/* Panneau de visualisation du code (droite) */}
      <Box sx={{ width: '60%', position: 'relative', overflow: 'auto' }}>
        {fichierSelectionne ? (
          chargeFichier ? (
            // Affiche un spinner pendant le chargement du fichier
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            // Affiche le contenu du fichier
            <>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d2d2d', color: 'white' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{fichierSelectionne}</Typography>
                <IconButton size="small" onClick={gererFermetureFichier} sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
              </Box>
              <SyntaxHighlighter
                language={obtenirExtensionFichier(fichierSelectionne)}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{ margin: 0, height: 'calc(100% - 36px)', width: '100%' }}
                codeTagProps={{ style: { fontFamily: '"Fira Code", monospace' } }}
              >
                {contenuFichier}
              </SyntaxHighlighter>
            </>
          )
        ) : (
          // Message d'invite si aucun fichier n'est sélectionné
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
            <Typography>Sélectionnez un fichier pour voir son contenu</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CodeBrowser;
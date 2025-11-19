// frontend/src/components/CodeBrowser.jsx

import { useState, useEffect, useCallback } from 'react';
import { 
  Box, List, ListItem, ListItemIcon, ListItemText, Collapse, 
  Typography, CircularProgress, Alert, IconButton, Paper
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { clientApi } from '../store/appStore';

/**
 * Détermine le langage pour la coloration syntaxique de manière robuste.
 * @param {string} nomFichier
 * @returns {string} Identifiant du langage pour Prism.
 */
const determinerLangage = (nomFichier) => {
  if (!nomFichier) return 'text';

  const nom = nomFichier.toLowerCase();
  
  // 1. Gestion des noms de fichiers exacts (Docker, Configs)
  if (nom === 'dockerfile') return 'dockerfile';
  if (nom === 'makefile') return 'makefile';
  if (nom.startsWith('.env')) return 'properties';

  // 2. Extraction de l'extension
  const parts = nom.split('.');
  if (parts.length <= 1) return 'text'; // Pas d'extension
  
  const ext = parts.pop();

  // 3. Mappage des extensions vers les identifiants Prism
  const mapExtensions = {
    'js': 'javascript', 'jsx': 'jsx', 'mjs': 'javascript', 'cjs': 'javascript',
    'ts': 'typescript', 'tsx': 'tsx',
    'py': 'python', 'pyw': 'python',
    'html': 'html', 'htm': 'html',
    'css': 'css', 'scss': 'scss', 'sass': 'sass', 'less': 'less',
    'json': 'json',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'bash', 'bash': 'bash', 'zsh': 'bash',
    'yml': 'yaml', 'yaml': 'yaml',
    'xml': 'xml', 'svg': 'markup',
  };

  return mapExtensions[ext] || 'text';
};

/**
 * Composant récursif pour un élément de l'arborescence.
 */
function ElementArborescence({ element, onSelectionFichier, niveau = 0 }) {
  const [estOuvert, setEstOuvert] = useState(false);
  const estDossier = element.type === 'directory';

  const gererClic = () => {
    if (estDossier) {
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
        sx={{ 
          pl: 2 + niveau * 2, 
          py: 0.5,
          borderLeft: niveau > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none'
        }}
      >
        <ListItemIcon sx={{ minWidth: 32, color: estDossier ? 'primary.main' : 'text.secondary' }}>
          {estDossier ? <FolderIcon fontSize="small" /> : <InsertDriveFileIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText 
          primary={element.name} 
          primaryTypographyProps={{ variant: 'body2', noWrap: true }} 
        />
        {estDossier && (estOuvert ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
      </ListItem>
      
      {estDossier && (
        <Collapse in={estOuvert} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {element.children?.map(enfant => (
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

function CodeBrowser({ idProjet }) {
  const [arborescence, setArborescence] = useState([]);
  const [fichierSelectionne, setFichierSelectionne] = useState(null);
  const [contenuFichier, setContenuFichier] = useState('');
  const [chargeArborescence, setChargeArborescence] = useState(true);
  const [chargeFichier, setChargeFichier] = useState(false);
  const [erreur, setErreur] = useState(null);

  // Chargement de l'arborescence initiale
  useEffect(() => {
    if (!idProjet) return;
    
    let actif = true;
    setChargeArborescence(true);
    
    clientApi.get(`/projets/${idProjet}/source-code-tree/`)
      .then(res => {
        if (actif) {
          setArborescence(res.data);
          setErreur(null);
        }
      })
      .catch(err => {
        if (actif) setErreur("Impossible de charger l'arborescence.");
      })
      .finally(() => {
        if (actif) setChargeArborescence(false);
      });

    return () => { actif = false; };
  }, [idProjet]);

  // Chargement d'un fichier spécifique
  const gererSelectionFichier = useCallback(async (chemin) => {
    setChargeFichier(true);
    setFichierSelectionne(chemin);
    
    try {
      const res = await clientApi.get(`/projets/${idProjet}/source-code-file/`, {
        params: { path: chemin }
      });
      setContenuFichier(res.data.content);
    } catch (err) {
      setContenuFichier(`// Erreur de chargement : ${chemin}\n// Le fichier est peut-être binaire ou inaccessible.`);
    } finally {
      setChargeFichier(false);
    }
  }, [idProjet]);

  const gererFermeture = () => {
    setFichierSelectionne(null);
    setContenuFichier('');
  };

  // Rendu conditionnel global
  if (chargeArborescence) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (erreur) return <Alert severity="warning">{erreur}</Alert>;

  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: 'background.paper', overflow: 'hidden' }}>
      
      {/* Panneau Gauche : Arborescence */}
      <Box sx={{ width: '35%', minWidth: 200, borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto', bgcolor: '#fafafa' }}>
        <List dense>
          {arborescence.map(el => (
            <ElementArborescence key={el.path} element={el} onSelectionFichier={gererSelectionFichier} />
          ))}
        </List>
      </Box>

      {/* Panneau Droite : Éditeur */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e' }}>
        {fichierSelectionne ? (
          <>
            {/* En-tête fichier */}
            <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#252526', borderBottom: '1px solid #333' }}>
              <Typography variant="caption" sx={{ color: '#ccc', fontFamily: 'monospace' }}>
                {fichierSelectionne}
              </Typography>
              <IconButton size="small" onClick={gererFermeture} sx={{ color: '#ccc' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            {/* Contenu */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
              {chargeFichier ? (
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <CircularProgress size={30} sx={{ color: '#ccc' }} />
                </Box>
              ) : (
                <SyntaxHighlighter
                  language={determinerLangage(fichierSelectionne)}
                  style={vscDarkPlus}
                  showLineNumbers
                  customStyle={{ margin: 0, padding: '1rem', fontSize: '0.9rem', lineHeight: 1.5, backgroundColor: 'transparent' }}
                >
                  {contenuFichier}
                </SyntaxHighlighter>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
            <Typography variant="body2">Sélectionnez un fichier pour explorer le code</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CodeBrowser;
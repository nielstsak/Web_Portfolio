// frontend/src/components/CodeBrowser.jsx

import { useState, useEffect, useCallback } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { apiClient } from '../store/appStore';

/**
 * Extrait l'extension d'un nom de fichier.
 * @param {string} filename - Le nom du fichier.
 * @returns {string} L'extension du fichier.
 */
const getFileExtension = (filename) => {
  if (!filename) return '';
  // Utilise une méthode rapide et sûre pour obtenir la dernière partie après le point.
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Composant récursif pour afficher un élément de l'arborescence (fichier ou dossier).
 * @param {{ item: object, onFileSelect: function, level: number }} props
 */
function FileTreeItem({ item, onFileSelect, level = 0 }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (item.type === 'directory') {
      setOpen(!open);
    } else {
      onFileSelect(item.path);
    }
  };

  return (
    <>
      <ListItem button onClick={handleClick} sx={{ pl: 2 + level * 2, py: 0.5 }}>
        <ListItemIcon sx={{ minWidth: 36 }}>
          {item.type === 'directory' ? <FolderIcon fontSize="small" /> : <InsertDriveFileIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText primary={<Typography variant="body2">{item.name}</Typography>} />
        {item.type === 'directory' ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItem>
      {item.type === 'directory' && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map(child => (
              <FileTreeItem key={child.path} item={child} onFileSelect={onFileSelect} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

/**
 * Affiche un explorateur de code avec une arborescence de fichiers et un visualiseur.
 * @param {{ projectId: number }} props
 */
function CodeBrowser({ projectId }) {
  // --- États locaux ---
  const [tree, setTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [error, setError] = useState(null);

  // Effet pour charger l'arborescence des fichiers du projet.
  useEffect(() => {
    const fetchTree = async () => {
      if (!projectId) return;
      setLoadingTree(true);
      try {
        const response = await apiClient.get(`/projects/${projectId}/source-code-tree/`);
        setTree(response.data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger l'arborescence du code source.");
      } finally {
        setLoadingTree(false);
      }
    };
    fetchTree();
  }, [projectId]);

  // Fonction pour charger le contenu d'un fichier sélectionné.
  const handleFileSelect = useCallback(async (path) => {
    setLoadingFile(true);
    setSelectedFile(path);
    try {
      const response = await apiClient.get(`/projects/${projectId}/source-code-file/?path=${path}`);
      setFileContent(response.data.content);
      setError(null);
    } catch (err) {
      setError(`Impossible de charger le contenu du fichier : ${path}`);
      setFileContent('');
    } finally {
      setLoadingFile(false);
    }
  }, [projectId]);

  // Réinitialise la vue du fichier pour revenir à l'état initial.
  const handleCloseFile = () => {
    setSelectedFile(null);
    setFileContent('');
  };

  if (loadingTree) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box>;
  if (error && !tree.length) return <Alert severity="warning">{error}</Alert>;

  return (
    <Box sx={{ display: 'flex', height: '100%', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1 }}>
      {/* Panneau de l'arborescence des fichiers */}
      <Box sx={{ width: '40%', borderRight: '1px solid rgba(0,0,0,0.12)', overflowY: 'auto' }}>
        <List dense>
          {tree.map(item => <FileTreeItem key={item.path} item={item} onFileSelect={handleFileSelect} />)}
        </List>
      </Box>

      {/* Panneau de visualisation du code */}
      <Box sx={{ width: '60%', position: 'relative', overflow: 'auto' }}>
        {selectedFile ? (
          loadingFile ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d2d2d', color: 'white' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{selectedFile}</Typography>
                <IconButton size="small" onClick={handleCloseFile} sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
              </Box>
              <SyntaxHighlighter
                language={getFileExtension(selectedFile)}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{ margin: 0, height: 'calc(100% - 36px)', width: '100%' }}
                codeTagProps={{ style: { fontFamily: '"Fira Code", monospace' } }}
              >
                {fileContent}
              </SyntaxHighlighter>
            </>
          )
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
            <Typography>Sélectionnez un fichier pour voir son contenu</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default CodeBrowser;
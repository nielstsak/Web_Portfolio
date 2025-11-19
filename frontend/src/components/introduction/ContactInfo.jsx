// frontend/src/components/introduction/ContactInfo.jsx

import { Box, Typography, Avatar, Link, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useAppStore } from '../../store/appStore';

/**
 * Affiche la carte d'identité (Photo, Email) et les postes visés.
 * Connecté au store global.
 */
const InfosContact = () => {
  const presentation = useAppStore((state) => state.presentation);
  const postes = useAppStore((state) => state.postes);

  if (!presentation) return null;

  return (
    <Grid container spacing={2} alignItems="center">
      
      {/* Identité */}
      <Grid item size={{ xs: 12, md: 7 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {presentation.photo && (
            <Avatar
              src={presentation.photo}
              alt={`${presentation.prenom} ${presentation.nom}`}
              variant="rounded"
              sx={{ width: 90, height: 90, mr: 2.5, boxShadow: 2 }}
            />
          )}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {presentation.prenom} {presentation.nom}
            </Typography>
            <Link 
              href={`mailto:${presentation.email}`} 
              variant="body2" 
              underline="hover" 
              sx={{ color: 'primary.main', mt: 0.5, display: 'block' }}
            >
              {presentation.email}
            </Link>
          </Box>
        </Box>
      </Grid>

      {/* Postes Ciblés */}
      <Grid item size={{ xs: 12, md: 5 }}>
        {postes.length > 0 && (
          <Box sx={{ pl: { md: 2 }, borderLeft: { md: '1px solid rgba(0,0,0,0.08)' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Recherche Actuelle
            </Typography>
            <List dense disablePadding>
              {postes.map((poste) => (
                <ListItem key={poste.id} sx={{ px: 0, py: 0.2 }}>
                  <ListItemText 
                    primary={poste.nom} 
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Grid>

    </Grid>
  );
};

export default InfosContact;
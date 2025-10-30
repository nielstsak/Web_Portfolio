// frontend/src/components/introduction/ContactInfo.jsx

import { Box, Typography, Avatar, Link, Grid, List, ListItem, ListItemText } from '@mui/material';

/**
 * Affiche les informations de contact (photo, nom, email) et les postes ciblés.
 * @param {{
 * presentation: { photo: string, prenom: string, nom: string, email: string },
 * postes: Array<{id: number, nom: string}>
 * }} props
 */
const ContactInfo = ({ presentation, postes }) => (
  // La grille principale divise la section en deux : contact à gauche, postes à droite.
  <Grid container spacing={4} alignItems="center">
    
    {/* Partie Gauche : Photo, Nom, Email */}
    <Grid item size={{ xs: 12, md: 7 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {presentation?.photo && (
          <Avatar
            src={presentation.photo}
            alt={`${presentation?.prenom} ${presentation?.nom}`}
            variant="rounded"
            sx={{ width: 100, height: 100, mr: 2.5 }}
          />
        )}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {`${presentation?.prenom} ${presentation?.nom}`}
          </Typography>
          <Link href={`mailto:${presentation?.email}`} variant="body2" color="primary">
            {presentation?.email}
          </Link>
        </Box>
      </Box>
    </Grid>

    {/* Partie Droite : Postes ciblés */}
    <Grid item size={{ xs: 12, md: 5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Postes ciblés
      </Typography>
      <List dense>
        {postes.map((poste) => (
          <ListItem key={poste.id} sx={{ p: 0 }}>
            <ListItemText primary={poste.nom} />
          </ListItem>
        ))}
      </List>
    </Grid>

  </Grid>
);

export default ContactInfo;
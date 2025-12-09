// frontend/src/pages/LandingPage.jsx

import { Box } from '@mui/material';
import Introduction from '../components/Introduction';
import { useAppStore } from '../store/appStore';
import SectionChronologie from '../components/SectionChronologie';

function LandingPage() {
  const evenementsFiltres = useAppStore((state) => state.evenementsFiltres());

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div id="introduction">
        <Introduction estVisible={true} />
      </div>
      <div id="chronologie">
        <SectionChronologie evenementsFiltres={evenementsFiltres} />
      </div>
    </Box>
  );
}

export default LandingPage;
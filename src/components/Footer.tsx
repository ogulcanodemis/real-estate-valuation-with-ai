import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' '}
          <Link color="inherit" href="/">
            Emlak Değerleme
          </Link>
          {' - Tüm Hakları Saklıdır.'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Bu uygulama, emlak değerleme için benzer özelliklere sahip mülklerin verilerini kullanarak tahminler yapar.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Box,
  Paper
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box className="hero-section">
          <Typography variant="h2" component="h1" gutterBottom>
            Emlak Değerleme Uygulaması
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Mülkünüzün değerini benzer özelliklere sahip emlakları analiz ederek tahmin edin
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={RouterLink} 
            to="/estimate"
            sx={{ mt: 2 }}
          >
            Hemen Değerleme Yap
          </Button>
        </Box>

        <Box className="section">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Nasıl Çalışır?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box className="feature-icon">
                  <HomeIcon fontSize="inherit" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Mülk Bilgilerini Girin
                </Typography>
                <Typography variant="body1">
                  Değerlemek istediğiniz mülkün konum, alan, oda sayısı gibi özelliklerini girin.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box className="feature-icon">
                  <CalculateIcon fontSize="inherit" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Benzer Mülkleri Analiz Edelim
                </Typography>
                <Typography variant="body1">
                  Sistemimiz veritabanındaki benzer özelliklere sahip mülkleri bulur ve analiz eder.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Box className="feature-icon">
                  <TrendingUpIcon fontSize="inherit" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Değerleme Sonucunu Alın
                </Typography>
                <Typography variant="body1">
                  Benzer mülklerin fiyatlarına dayalı olarak hesaplanan tahmini değeri görüntüleyin.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box className="section">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Popüler Bölgeler
          </Typography>
          <Grid container spacing={3}>
            {['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Ataşehir'].map((location) => (
              <Grid item xs={12} sm={6} md={3} key={location}>
                <Card className="card">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="h3">
                        {location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {location} bölgesindeki emlak değerlerini inceleyin.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      component={RouterLink} 
                      to={`/estimate?location=${location}`}
                    >
                      Bu Bölgede Değerleme Yap
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default HomePage; 
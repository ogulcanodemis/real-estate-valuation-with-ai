import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Hakkında
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
            Emlak Değerleme Uygulamamız Hakkında Bilgiler
          </Typography>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Uygulama Hakkında
            </Typography>
            <Typography variant="body1" paragraph>
              Emlak Değerleme uygulamamız, kullanıcıların mülklerinin tahmini değerini hesaplamalarına yardımcı olmak için geliştirilmiş bir araçtır. 
              Uygulama, benzer özelliklere sahip mülklerin verilerini analiz ederek, kullanıcının girdiği özelliklere en yakın mülkleri bulur ve 
              bu mülklerin fiyatlarına dayalı olarak bir değerleme tahmini sunar.
            </Typography>
            <Typography variant="body1" paragraph>
              Değerleme algoritması, mülkün konumu, alanı, oda sayısı, yaşı ve diğer özelliklerini dikkate alarak benzerlik skorları hesaplar. 
              Daha sonra bu skorlara göre ağırlıklı bir ortalama alarak tahmini değeri belirler.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Nasıl Çalışır?
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    1. Veri Girişi
                  </Typography>
                  <Typography variant="body2">
                    Kullanıcı, değerlemek istediği mülkün özelliklerini girer.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    2. Benzer Mülklerin Analizi
                  </Typography>
                  <Typography variant="body2">
                    Sistem, veritabanındaki benzer özelliklere sahip mülkleri bulur.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    3. Değerleme Sonucu
                  </Typography>
                  <Typography variant="body2">
                    Benzer mülklerin fiyatlarına dayalı olarak tahmini değer hesaplanır.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1">
              Değerleme algoritması, mülkün özelliklerine göre benzerlik skorları hesaplar ve bu skorlara göre ağırlıklı bir ortalama alarak 
              tahmini değeri belirler. Algoritma, alan, oda sayısı, konum, yaş gibi temel özelliklere daha yüksek ağırlık verir.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Sıkça Sorulan Sorular
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Değerleme sonuçları ne kadar doğrudur?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Değerleme sonuçları, veritabanımızdaki benzer mülklerin fiyatlarına dayalı bir tahmindir. 
                  Gerçek piyasa değeri; ekonomik koşullar, mülkün durumu, pazarlık payı gibi birçok faktöre bağlı olarak değişebilir. 
                  Sonuçlar, genel bir fikir vermek için tasarlanmıştır ve profesyonel bir değerleme raporu yerine geçmez.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Hangi özellikler değerleme sonucunu etkiler?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Değerleme sonucunu etkileyen başlıca özellikler: konum, alan (m²), oda sayısı, bina yaşı, kat, balkon, garaj ve asansör 
                  gibi ek özelliklerdir. Konum ve alan genellikle en büyük etkiye sahip faktörlerdir.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Veritabanınızda ne kadar mülk var?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Veritabanımız sürekli güncellenmektedir. Şu anda farklı bölgelerde çeşitli özelliklere sahip mülkler bulunmaktadır. 
                  Veri kalitesini ve çeşitliliğini artırmak için sürekli çalışmaktayız.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Benzer mülk bulunamazsa ne olur?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Eğer girdiğiniz özelliklere benzer mülk bulunamazsa, sistem size bir hata mesajı gösterecektir. 
                  Bu durumda, daha yaygın özelliklere sahip bir mülk için değerleme yapmayı veya bazı kriterleri değiştirmeyi deneyebilirsiniz.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default AboutPage; 
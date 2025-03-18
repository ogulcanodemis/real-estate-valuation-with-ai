import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BusinessIcon from '@mui/icons-material/Business';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SchoolIcon from '@mui/icons-material/School';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CampaignIcon from '@mui/icons-material/Campaign';

interface BuyerProfile {
  profileType: string;
  matchPercentage: number;
  description: string;
  ageRange: string;
  incomeLevel: string;
  likelyMotivation: string;
  keyFeatures: string[];
}

interface BuyerProfileProps {
  buyerProfile: {
    potentialBuyers: BuyerProfile[];
    marketingTips: string[];
  };
}

const BuyerProfilePanel: React.FC<BuyerProfileProps> = ({ buyerProfile }) => {
  if (!buyerProfile || !buyerProfile.potentialBuyers) {
    return <Typography>Alıcı profili bilgisi bulunamadı</Typography>;
  }

  const { potentialBuyers, marketingTips } = buyerProfile;

  // Profil için renk belirle
  const getProfileColor = (profileType: string) => {
    switch (profileType.toLowerCase()) {
      case 'aile':
      case 'genç aile':
        return { bg: '#4caf50', avatar: '#2e7d32' }; // Yeşil
      case 'yatırımcı':
        return { bg: '#ff9800', avatar: '#e65100' }; // Turuncu
      case 'genç profesyonel':
      case 'profesyonel':
        return { bg: '#2196f3', avatar: '#0d47a1' }; // Mavi
      case 'emekli':
      case 'emekli çift':
        return { bg: '#9c27b0', avatar: '#6a1b9a' }; // Mor
      case 'öğrenci':
        return { bg: '#f44336', avatar: '#c62828' }; // Kırmızı
      case 'ilk kez ev alacaklar':
        return { bg: '#00bcd4', avatar: '#00838f' }; // Cyan
      default:
        return { bg: '#78909c', avatar: '#455a64' }; // Gri
    }
  };

  // Profil tipine göre Avatar icon'u belirle
  const getProfileIcon = (profileType: string) => {
    switch (profileType.toLowerCase()) {
      case 'aile':
      case 'genç aile':
        return <FamilyRestroomIcon />;
      case 'yatırımcı':
        return <BusinessCenterIcon />;
      case 'genç profesyonel':
      case 'profesyonel':
        return <BusinessIcon />;
      case 'emekli':
      case 'emekli çift':
        return <PersonIcon />;
      case 'öğrenci':
        return <SchoolIcon />;
      case 'ilk kez ev alacaklar':
        return <PersonIcon />;
      default:
        return <PeopleIcon />;
    }
  };

  // Eşleşme yüzdesine göre renk belirle
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Potansiyel Alıcı Profili
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Yapay zeka mülkünüzün özellikleri ve konumu açısından potansiyel alıcı kitlelerini ve bunların mülkünüze uygunluğunu değerlendirdi.
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {potentialBuyers.map((profile, index) => {
          const profileColors = getProfileColor(profile.profileType);
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%', 
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    bgcolor: profileColors.bg, 
                    color: 'white', 
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: profileColors.avatar,
                        mr: 2
                      }}
                    >
                      {getProfileIcon(profile.profileType)}
                    </Avatar>
                    <Typography variant="h6" component="div">
                      {profile.profileType}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${profile.matchPercentage}% Eşleşme`} 
                    color={getMatchColor(profile.matchPercentage)}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="body2" paragraph>
                    {profile.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Yaş Aralığı
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {profile.ageRange}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Gelir Seviyesi
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {profile.incomeLevel}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Muhtemel Motivasyon
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {profile.likelyMotivation}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {profile.keyFeatures && profile.keyFeatures.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Önem Verdiği Özellikler
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {profile.keyFeatures.map((feature, i) => (
                          <Chip 
                            key={i} 
                            label={feature} 
                            size="small" 
                            variant="outlined"
                            sx={{ margin: '2px' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      <Paper elevation={3} sx={{ p: 3, bgcolor: 'rgba(156, 39, 176, 0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CampaignIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Pazarlama Önerileri
          </Typography>
        </Box>
        <List>
          {marketingTips.map((tip, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemIcon>
                <LightbulbIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={tip} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default BuyerProfilePanel; 
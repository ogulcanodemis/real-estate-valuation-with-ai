import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface InvestmentOption {
  title: string;
  description: string;
  estimatedCost: number;
  valueIncrease: number;
  roi: number;
  implementationTime: string;
  difficulty: 'low' | 'medium' | 'high';
}

interface InvestmentOptionsProps {
  investmentOptions: {
    options: InvestmentOption[];
    generalAdvice: string;
  };
  formatPrice: (price: number) => string;
}

const InvestmentOptionsPanel: React.FC<InvestmentOptionsProps> = ({ 
  investmentOptions, 
  formatPrice
}) => {
  if (!investmentOptions || !investmentOptions.options) {
    return <Typography>Yatırım seçenekleri bulunamadı</Typography>;
  }

  const { options, generalAdvice } = investmentOptions;

  // Zorluğa göre renk belirle
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  // ROI değerine göre renk belirle
  const getROIColor = (roi: number) => {
    if (roi >= 20) return 'success.main';
    if (roi >= 10) return 'warning.main';
    return 'text.secondary';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mülk Değerini Artıracak Yatırım Seçenekleri
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Yapay zeka, mülkünüzün özelliklerine göre en etkili yatırım seçeneklerini belirledi.
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Genel Tavsiye:
        </Typography>
        <Typography variant="body1">
          {generalAdvice}
        </Typography>
      </Paper>
      
      {options.length > 0 && (
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Box sx={{ p: 2, bgcolor: 'success.light', color: 'white', display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Önerilen İlk Yatırım
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6">{options[0].title}</Typography>
            <Typography variant="body1" paragraph>
              {options[0].description}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Tahmini Maliyet:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatPrice(options[0].estimatedCost)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Potansiyel Değer Artışı:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" color="success.main">
                    {formatPrice(options[0].valueIncrease)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white' }}><strong>Yatırım Seçeneği</strong></TableCell>
              <TableCell align="right" sx={{ color: 'white' }}><strong>Tahmini Maliyet</strong></TableCell>
              <TableCell align="right" sx={{ color: 'white' }}><strong>Değer Artışı</strong></TableCell>
              <TableCell align="right" sx={{ color: 'white' }}><strong>ROI</strong></TableCell>
              <TableCell align="right" sx={{ color: 'white' }}><strong>Süre</strong></TableCell>
              <TableCell align="right" sx={{ color: 'white' }}><strong>Zorluk</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } 
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" fontWeight="medium">{option.title}</Typography>
                </TableCell>
                <TableCell align="right">{formatPrice(option.estimatedCost)}</TableCell>
                <TableCell align="right" sx={{ color: 'success.main' }}>
                  {formatPrice(option.valueIncrease)}
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Box sx={{ width: '100%', maxWidth: 100, mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(option.roi, 100)} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 5,
                          bgcolor: 'grey.300',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getROIColor(option.roi)
                          }
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      sx={{ color: getROIColor(option.roi) }}
                    >
                      %{option.roi}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    icon={<TimerIcon />}
                    label={option.implementationTime}
                    size="small"
                    sx={{ fontWeight: 'medium' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    icon={<BuildIcon />}
                    label={option.difficulty === 'low' ? 'Kolay' : option.difficulty === 'medium' ? 'Orta' : 'Zor'}
                    color={getDifficultyColor(option.difficulty)}
                    size="small"
                    sx={{ fontWeight: 'medium' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'primary.main', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom display="flex" alignItems="center">
          <PriorityHighIcon fontSize="small" sx={{ mr: 0.5 }} />
          Unutmayın
        </Typography>
        <Typography variant="body2">
          Yatırım maliyetleri ve değer artışları tahminidir. Gerçek maliyetler ve getiriler piyasa koşullarına, işçilik kalitesine ve diğer faktörlere bağlı olarak değişebilir.
        </Typography>
      </Box>
    </Box>
  );
};

export default InvestmentOptionsPanel; 
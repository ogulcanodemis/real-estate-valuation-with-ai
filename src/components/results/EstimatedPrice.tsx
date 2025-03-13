import React from 'react';
import { Typography, Box, Divider, Slider, Paper, Chip, Tooltip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CalculateIcon from '@mui/icons-material/Calculate';
import InfoIcon from '@mui/icons-material/Info';

interface EstimatedPriceProps {
  price: number;
  formatPrice: (price: number) => string;
  confidenceLevel?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  aiExplanation?: string;
  traditionalEstimate?: number;
  aiEstimate?: number;
}

const EstimatedPrice: React.FC<EstimatedPriceProps> = ({ 
  price, 
  formatPrice, 
  confidenceLevel = 85,
  priceRange,
  aiExplanation,
  traditionalEstimate,
  aiEstimate
}) => {
  // Fiyat aralığı hesaplama (±%10) - eğer priceRange prop'u verilmemişse
  const lowerBound = priceRange?.min || Math.round(price * 0.9);
  const upperBound = priceRange?.max || Math.round(price * 1.1);
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Tahmini Değer
      </Typography>
      <Typography variant="h4" color="primary" gutterBottom>
        {formatPrice(price)}
      </Typography>
      
      <Box sx={{ mt: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatPrice(lowerBound)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatPrice(upperBound)}
          </Typography>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1, 
            bgcolor: 'rgba(0, 0, 0, 0.04)', 
            borderRadius: 2,
            position: 'relative'
          }}
        >
          <Slider
            value={price}
            min={lowerBound}
            max={upperBound}
            disabled
            sx={{
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                bgcolor: 'primary.main',
              },
              '& .MuiSlider-track': {
                height: 8,
              },
              '& .MuiSlider-rail': {
                height: 8,
              }
            }}
          />
        </Paper>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Güven Seviyesi:
          </Typography>
          <Box 
            sx={{ 
              width: `${confidenceLevel}%`, 
              height: 8, 
              bgcolor: confidenceLevel > 80 ? 'success.main' : confidenceLevel > 60 ? 'warning.main' : 'error.main',
              borderRadius: 1
            }} 
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            %{confidenceLevel}
          </Typography>
        </Box>
      </Box>
      
      {/* Değerleme Kaynakları */}
      {traditionalEstimate && aiEstimate && (
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Değerleme Kaynakları:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip 
              icon={<CalculateIcon />} 
              label={`Algoritma: ${formatPrice(traditionalEstimate)}`} 
              variant="outlined" 
              color="primary"
              size="small"
            />
            <Chip 
              icon={<SmartToyIcon />} 
              label={`Yapay Zeka: ${formatPrice(aiEstimate)}`} 
              variant="outlined" 
              color="secondary"
              size="small"
            />
            <Tooltip title="Nihai değer, algoritma ve yapay zeka tahminlerinin ağırlıklı ortalamasıdır">
              <InfoIcon color="action" fontSize="small" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
        </Box>
      )}
      
      {/* AI açıklamasını göster */}
      {aiExplanation && (
        <Paper elevation={1} sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SmartToyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              Yapay Zeka Değerlendirmesi
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
            {aiExplanation}
          </Typography>
        </Paper>
      )}
      
      <Divider sx={{ my: 2 }} />
    </>
  );
};

export default EstimatedPrice; 
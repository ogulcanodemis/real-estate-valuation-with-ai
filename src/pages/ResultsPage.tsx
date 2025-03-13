import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button
} from '@mui/material';

// Modüler bileşenler
import PropertyDetails from '../components/results/PropertyDetails';
import PropertySlider from '../components/results/PropertySlider';
import PriceChart from '../components/results/PriceChart';
import EstimatedPrice from '../components/results/EstimatedPrice';

interface Property {
  id: number;
  listing_id: string;
  title: string;
  description: string;
  price: number;
  province: string;
  district: string;
  neighborhood: string;
  property_type: string;
  gross_sqm: number;
  net_sqm: number;
  room_count: string;
  building_age: string;
  floor_location: string;
  total_floors: number;
  heating_type: string;
  bathroom_count: number;
  balcony: string;
  elevator: string;
  parking: string;
  furnished: string;
  usage_status: string;
  dues: number;
  suitable_for_credit: string;
  deed_status: string;
  trade: string;
  seller_name: string;
  seller_phone_office: string;
  seller_phone_mobile: string;
  seller_company_name: string;
  listing_date: string;
}

interface PropertyDetails {
  net_sqm: number;
  gross_sqm: number;
  room_count: string;
  district: string;
  neighborhood: string;
  building_age: string;
  floor_location: string;
  total_floors: number;
  heating_type: string;
  bathroom_count: number;
  balcony: boolean;
  parking: boolean;
  elevator: boolean;
  property_type: string;
  furnished: boolean;
  usage_status: string;
  dues: number;
  suitable_for_credit: boolean;
  deed_status: string;
  province: string;
}

interface LocationState {
  estimatedPrice: number;
  similarProperties: Property[];
  propertyDetails: PropertyDetails;
  confidenceLevel: number;
  priceRange: {
    min: number;
    max: number;
  };
  aiExplanation?: string;
  traditionalEstimate?: number;
  aiEstimate?: number;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
};

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // useEffect hook'u bileşenin en üst seviyesinde çağrılmalı
  useEffect(() => {
    // Eğer state yoksa (doğrudan URL ile erişim), ana sayfaya yönlendir
    if (!state) {
      navigate('/');
    }
  }, [navigate, state]);

  // Eğer state yoksa, içerik gösterme
  if (!state) {
    return null;
  }

  const { 
    estimatedPrice, 
    similarProperties, 
    propertyDetails, 
    confidenceLevel, 
    priceRange,
    aiExplanation,
    traditionalEstimate,
    aiEstimate
  } = state;

  // Benzer mülklerin fiyatlarını kontrol et ve düzelt
  const validatedProperties = similarProperties.map(property => {
    // Eğer fiyat string olarak geldiyse sayıya çevir
    if (typeof property.price === 'string') {
      const numericPrice = parseFloat(String(property.price).replace(/[^\d.-]/g, ''));
      return {
        ...property,
        price: isNaN(numericPrice) ? 0 : numericPrice
      };
    }
    
    // Fiyat geçerli bir sayı değilse 0 olarak ayarla
    if (property.price === null || property.price === undefined || isNaN(property.price)) {
      return {
        ...property,
        price: 0
      };
    }
    
    return property;
  });

  // Debug bilgisi
  console.log('Orijinal benzer mülkler:', similarProperties);
  console.log('Doğrulanmış benzer mülkler:', validatedProperties);
  console.log('Yapay Zeka Açıklaması:', aiExplanation);
  console.log('Yapay Zeka Tahmini:', aiEstimate);
  console.log('Geleneksel Tahmin:', traditionalEstimate);

  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Değerleme Sonuçları
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <EstimatedPrice 
                  price={estimatedPrice} 
                  formatPrice={formatPrice} 
                  confidenceLevel={confidenceLevel || 85}
                  priceRange={priceRange || {
                    min: Math.round(estimatedPrice * 0.9),
                    max: Math.round(estimatedPrice * 1.1)
                  }}
                  aiExplanation={aiExplanation}
                  traditionalEstimate={traditionalEstimate}
                  aiEstimate={aiEstimate}
                />
                <PropertyDetails propertyDetails={propertyDetails} />
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  component={RouterLink} 
                  to="/estimate" 
                  sx={{ mt: 3 }}
                >
                  Yeni Değerleme Yap
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <PriceChart properties={validatedProperties} estimatedPrice={estimatedPrice} />
                <PropertySlider properties={validatedProperties} formatPrice={formatPrice} />
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default ResultsPage; 
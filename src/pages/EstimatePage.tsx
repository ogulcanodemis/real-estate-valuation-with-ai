import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
  SelectChangeEvent
} from '@mui/material';
import Footer from '../components/Footer';
import FormTabs from '../components/FormTabs';
import { FormData, initialFormData } from '../types/FormData';

// Zorunlu alanları içeren dizi
const requiredFields = [
  'province',
  'district',
  'property_type',
  'net_sqm',
  'room_count',
  'building_age',
  'floor_location'
];

const EstimatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Form verilerinin geçerliliğini kontrol et
  useEffect(() => {
    const checkFormValidity = () => {
      // Tüm zorunlu alanların doldurulup doldurulmadığını kontrol et
      const isValid = requiredFields.every(field => {
        const value = formData[field as keyof FormData];
        if (typeof value === 'number') {
          return value > 0;
        }
        return Boolean(value);
      });
      
      setIsFormValid(isValid);
    };
    
    checkFormValidity();
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [name]: e.target.checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Form verilerini konsola yazdır
    console.log('Gönderilen form verileri:', formData);
    
    // Zorunlu alanları kontrol et ve eksik alanları göster
    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      if (typeof value === 'number') {
        return value <= 0;
      }
      return !value;
    });
    
    if (missingFields.length > 0) {
      console.error('Eksik alanlar:', missingFields);
      setError(`Lütfen şu zorunlu alanları doldurun: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      // API isteğini yapmadan önce gerekli alanların doldurulduğunu kontrol et
      if (!isFormValid) {
        setError('Lütfen tüm zorunlu alanları doldurun.');
        setLoading(false);
        return;
      }

      console.log('API isteği yapılıyor:', {
        url: 'http://localhost:5000/api/estimate',
        method: 'POST',
        data: formData
      });

      const response = await axios.post('http://localhost:5000/api/estimate', formData);
      
      console.log('API yanıtı:', response.data);
      
      // Sonuç sayfasına yönlendir
      navigate('/results', { state: { 
        formData, 
        estimatedPrice: response.data.estimatedPrice,
        similarProperties: response.data.similarProperties,
        propertyDetails: response.data.propertyDetails,
        confidenceLevel: response.data.confidenceLevel,
        priceRange: response.data.priceRange,
        aiExplanation: response.data.aiExplanation,
        traditionalEstimate: response.data.traditionalEstimate,
        aiEstimate: response.data.aiEstimate
      }});
    } catch (error: any) {
      console.error('Değerleme hatası:', error);
      
      // Daha detaylı hata bilgisi
      if (error.response) {
        console.error('Hata detayları:', {
          status: error.response.status,
          data: error.response.data
        });
        setError(`Değerleme yapılırken bir hata oluştu (${error.response.status}): ${error.response.data.message || 'Bilinmeyen hata'}`);
      } else if (error.request) {
        console.error('İstek yapıldı ama yanıt alınamadı:', error.request);
        setError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        console.error('İstek oluşturulurken hata:', error.message);
        setError(`İstek oluşturulurken hata: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Emlak Değerleme
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Emlak değerlemesi için aşağıdaki formu doldurun. Tüm alanları doldurmanız daha doğru bir değerleme yapılmasını sağlayacaktır.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FormTabs 
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || !isFormValid}
                sx={{ minWidth: 200 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Değerle'}
              </Button>
            </Box>
            
            {!isFormValid && (
              <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
                Lütfen tüm zorunlu alanları doldurun: İl, İlçe, Emlak Tipi, Net Alan, Oda Sayısı, Bina Yaşı ve Bulunduğu Kat
              </Typography>
            )}
          </form>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default EstimatePage; 
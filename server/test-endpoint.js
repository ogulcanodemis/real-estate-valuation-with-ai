// Test dosyası
const axios = require('axios');

const testData = {
  net_sqm: 100,
  gross_sqm: 110,
  room_count: '3+1',
  district: 'Beşiktaş',
  neighborhood: 'Etiler',
  building_age: '5-10',
  floor_location: '3',
  total_floors: 5,
  heating_type: 'Kombi',
  bathroom_count: 1,
  balcony: true,
  parking: true,
  elevator: true,
  property_type: 'Daire',
  furnished: false,
  usage_status: 'Boş',
  dues: 0,
  suitable_for_credit: true,
  deed_status: 'Kat Mülkiyetli',
  province: 'İstanbul'
};

async function testEstimateEndpoint() {
  try {
    console.log('Test verisi gönderiliyor:', testData);
    const response = await axios.post('http://localhost:5000/api/estimate', testData);
    console.log('Başarılı yanıt:', response.data);
  } catch (error) {
    console.error('Hata:', error.message);
    if (error.response) {
      console.error('Hata detayları:', error.response.data);
      console.error('Durum kodu:', error.response.status);
    }
  }
}

testEstimateEndpoint();

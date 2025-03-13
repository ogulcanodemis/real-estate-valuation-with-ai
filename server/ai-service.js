const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// API anahtarını .env dosyasından al
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Farklı model adlarını deneyecek fonksiyon
async function tryDifferentModels(prompt) {
  // Denenecek model adları
  const modelNames = [
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-pro-vision"
  ];
  
  let lastError = null;
  
  // Her model adını dene
  for (const modelName of modelNames) {
    try {
      console.log(`"${modelName}" modeli deneniyor...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error(`"${modelName}" modeli hatası:`, error.message);
      lastError = error;
    }
  }
  
  // Hiçbir model çalışmadıysa hata fırlat
  throw lastError || new Error("Hiçbir model çalışmadı");
}

async function estimatePropertyPrice(propertyDetails, similarProperties) {
  try {
    // Prompt oluştur
    const prompt = `
    Sen bir emlak değerleme uzmanısın. Aşağıdaki özelliklere sahip bir evin değerini tahmin etmen gerekiyor.
    
    Değerlendirilecek Ev Özellikleri:
    - İl: ${propertyDetails.province}
    - İlçe: ${propertyDetails.district}
    - Mahalle: ${propertyDetails.neighborhood}
    - Emlak Tipi: ${propertyDetails.property_type}
    - Net Alan: ${propertyDetails.net_sqm} m²
    - Brüt Alan: ${propertyDetails.gross_sqm} m²
    - Oda Sayısı: ${propertyDetails.room_count}
    - Bina Yaşı: ${propertyDetails.building_age}
    - Kat: ${propertyDetails.floor_location}
    - Toplam Kat: ${propertyDetails.total_floors}
    - Isıtma: ${propertyDetails.heating_type}
    
    Benzer Evlerin Fiyatları:
    ${similarProperties.map(p => `- ${p.price} TL: ${p.district}/${p.neighborhood}, ${p.net_sqm}m², ${p.room_count}, ${p.building_age}`).join('\n')}
    
    Lütfen aşağıdaki bilgileri JSON formatında döndür:
    {
      "estimatedPrice": [tahmini fiyat, TL cinsinden, sadece sayı],
      "priceRange": {
        "min": [minimum fiyat tahmini, TL cinsinden, sadece sayı],
        "max": [maksimum fiyat tahmini, TL cinsinden, sadece sayı]
      },
      "confidenceLevel": [güven seviyesi, 0-100 arası bir sayı],
      "explanation": [değerlendirme açıklaması, fiyatı etkileyen faktörler]
    }
    
    Sadece JSON formatında yanıt ver, başka açıklama ekleme. Yanıtında üç tırnak veya "json" kelimesi kullanma, doğrudan JSON objesi döndür.
    `;

    // Farklı modelleri dene
    const text = await tryDifferentModels(prompt);
    console.log("AI yanıtı:", text);
    
    try {
      // JSON yanıtını temizle ve parse et
      let cleanedText = text;
      
      // Backtick'leri ve "json" kelimesini temizle
      cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      console.log("Temizlenmiş AI yanıtı:", cleanedText);
      
      // JSON parse et
      const jsonResponse = JSON.parse(cleanedText);
      console.log("Başarıyla parse edildi:", jsonResponse);
      
      return jsonResponse;
    } catch (error) {
      console.error("AI yanıtı JSON formatında değil:", error.message);
      console.error("Temizleme sonrası metin:", text);
      
      // Fallback olarak basit bir yanıt döndür
      return {
        estimatedPrice: calculateAveragePrice(similarProperties),
        priceRange: {
          min: calculateAveragePrice(similarProperties) * 0.9,
          max: calculateAveragePrice(similarProperties) * 1.1
        },
        confidenceLevel: 70,
        explanation: "Benzer mülklerin ortalama fiyatına dayalı basit bir tahmin."
      };
    }
  } catch (error) {
    console.error("Gemini API hatası:", error);
    // Hata durumunda ortalama fiyatı döndür
    return {
      estimatedPrice: calculateAveragePrice(similarProperties),
      priceRange: {
        min: calculateAveragePrice(similarProperties) * 0.9,
        max: calculateAveragePrice(similarProperties) * 1.1
      },
      confidenceLevel: 70,
      explanation: "Yapay zeka servisi şu anda kullanılamıyor. Bu tahmin benzer mülklerin ortalamasına dayanmaktadır."
    };
  }
}

// Yardımcı fonksiyon: Benzer mülklerin ortalama fiyatını hesapla
function calculateAveragePrice(properties) {
  if (!properties || properties.length === 0) {
    console.log("Hesaplanacak mülk yok, varsayılan değer döndürülüyor");
    return 5000000; // Varsayılan değer olarak 5 milyon TL
  }
  
  const validProperties = properties.filter(p => p.price && !isNaN(p.price) && p.price > 0);
  
  if (validProperties.length === 0) {
    console.log("Geçerli fiyatlı mülk yok, varsayılan değer döndürülüyor");
    return 5000000; // Varsayılan değer olarak 5 milyon TL
  }
  
  console.log("Geçerli mülk sayısı:", validProperties.length);
  console.log("Mülk fiyatları:", validProperties.map(p => p.price));
  
  const sum = validProperties.reduce((total, property) => total + property.price, 0);
  const average = Math.round(sum / validProperties.length);
  
  console.log("Hesaplanan ortalama fiyat:", average);
  return average;
}

module.exports = { estimatePropertyPrice }; 
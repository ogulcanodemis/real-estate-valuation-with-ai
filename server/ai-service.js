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

// YENİ: Potansiyel alıcı profilini belirleyen fonksiyon
async function determineBuyerProfile(propertyDetails, estimatedPrice) {
  try {
    const prompt = `
    Sen bir emlak pazarlama uzmanısın. Aşağıdaki özelliklere sahip bir mülkün potansiyel alıcı profilini belirlemelisin.
    
    Mülk Özellikleri:
    - İl: ${propertyDetails.province}
    - İlçe: ${propertyDetails.district}
    - Mahalle: ${propertyDetails.neighborhood}
    - Emlak Tipi: ${propertyDetails.property_type}
    - Net Alan: ${propertyDetails.net_sqm} m²
    - Oda Sayısı: ${propertyDetails.room_count}
    - Bina Yaşı: ${propertyDetails.building_age}
    - Kat: ${propertyDetails.floor_location}
    - Tahmini Değer: ${estimatedPrice} TL
    
    Lütfen aşağıdaki bilgileri JSON formatında döndür:
    {
      "buyerProfiles": [
        {
          "profileType": [birincil hedef kitle profil türü, örn: "Genç Aile", "Yatırımcı", "Öğrenci", "Yönetici", "Emekli", vb.],
          "ageRange": [yaş aralığı, örn: "25-35", "35-50", vb.],
          "incomeLevel": [gelir seviyesi, örn: "Orta-Yüksek", "Yüksek", vb.],
          "likelyMotivation": [satın alma motivasyonu, örn: "Aile kurmak", "Yatırım", "Lokasyon", vb.],
          "matchPercentage": [bu profile uyum yüzdesi, 0-100 arası]
        },
        {
          "profileType": [ikincil hedef kitle],
          "ageRange": [yaş aralığı],
          "incomeLevel": [gelir seviyesi],
          "likelyMotivation": [satın alma motivasyonu],
          "matchPercentage": [bu profile uyum yüzdesi, 0-100 arası]
        }
      ],
      "marketingTips": [Bu mülkü satarken dikkat edilmesi gereken 3-5 maddelik pazarlama önerileri]
    }
    
    Sadece JSON formatında yanıt ver, başka açıklama ekleme.
    `;

    const text = await tryDifferentModels(prompt);
    console.log("Alıcı profili AI yanıtı:", text);
    
    let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Alıcı profili analizi hatası:", error);
    
    // Hata durumunda varsayılan profil döndür
    return {
      buyerProfiles: [
        {
          profileType: "Genel Alıcı",
          ageRange: "30-50",
          incomeLevel: "Orta-Yüksek",
          likelyMotivation: "Barınma veya Yatırım",
          matchPercentage: 80
        }
      ],
      marketingTips: [
        "Mülkün lokasyon avantajlarını vurgulayın",
        "Potansiyel alıcılara sanal tur imkanı sunun",
        "Sosyal medyada geniş kitlelere ulaşın"
      ]
    };
  }
}

// YENİ: Mülk değerini artıracak yatırım önerileri sunan fonksiyon
async function suggestInvestments(propertyDetails, estimatedPrice) {
  try {
    const prompt = `
    Sen bir emlak geliştirme ve renovasyon uzmanısın. Aşağıdaki özelliklere sahip bir mülkün değerini artırmak için hangi yatırımların yapılabileceğini önermelisin.
    
    Mülk Özellikleri:
    - İl: ${propertyDetails.province}
    - İlçe: ${propertyDetails.district}
    - Mahalle: ${propertyDetails.neighborhood}
    - Emlak Tipi: ${propertyDetails.property_type}
    - Net Alan: ${propertyDetails.net_sqm} m²
    - Oda Sayısı: ${propertyDetails.room_count}
    - Bina Yaşı: ${propertyDetails.building_age}
    - Kat: ${propertyDetails.floor_location}
    - Isıtma: ${propertyDetails.heating_type}
    - Tahmini Değer: ${estimatedPrice} TL
    - Balkon: ${propertyDetails.balcony ? 'Var' : 'Yok'}
    - Otopark: ${propertyDetails.parking ? 'Var' : 'Yok'}
    - Asansör: ${propertyDetails.elevator ? 'Var' : 'Yok'}
    
    Lütfen aşağıdaki bilgileri JSON formatında döndür:
    {
      "investmentOptions": [
        {
          "name": [İyileştirme/yatırım adı],
          "description": [Detaylı açıklama],
          "estimatedCost": [Tahmini maliyet, TL cinsinden],
          "potentialValueIncrease": [Potansiyel değer artışı, TL cinsinden],
          "roi": [Yatırımın geri dönüş oranı, %],
          "implementationTime": [Uygulama süresi, hafta/ay cinsinden],
          "difficulty": [Zorluk derecesi: "Kolay", "Orta", "Zor"]
        },
        {
          // Diğer iyileştirme/yatırım seçenekleri (3-5 arası öneri)
        }
      ],
      "recommendedFirst": [Öncelikli olarak yapılması önerilen iyileştirme adı],
      "generalAdvice": [Genel tavsiye ve değerlendirme]
    }
    
    Her iyileştirme önerisi için maliyet ve potansiyel değer artışını gerçekçi bir şekilde tahmin et. Mülkün tipine, yaşına ve konumuna uygun öneriler sun. Sadece JSON formatında yanıt ver, başka açıklama ekleme.
    `;

    const text = await tryDifferentModels(prompt);
    console.log("Yatırım önerileri AI yanıtı:", text);
    
    let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Yatırım önerileri analizi hatası:", error);
    
    // Hata durumunda varsayılan öneriler döndür
    return {
      investmentOptions: [
        {
          name: "Mutfak Renovasyonu",
          description: "Modern mutfak dolapları, tezgahlar ve ankastre cihazlarla mutfağın yenilenmesi",
          estimatedCost: 50000,
          potentialValueIncrease: 100000,
          roi: 100,
          implementationTime: "3-4 hafta",
          difficulty: "Orta"
        },
        {
          name: "Banyo Yenileme",
          description: "Banyonun modern armatürler ve seramiklerle yenilenmesi",
          estimatedCost: 30000,
          potentialValueIncrease: 50000,
          roi: 67,
          implementationTime: "2-3 hafta",
          difficulty: "Orta"
        },
        {
          name: "Boya ve Zemin Yenileme",
          description: "Tüm iç mekanın boyanması ve zemin kaplamalarının yenilenmesi",
          estimatedCost: 25000,
          potentialValueIncrease: 40000,
          roi: 60,
          implementationTime: "1-2 hafta",
          difficulty: "Kolay"
        }
      ],
      recommendedFirst: "Boya ve Zemin Yenileme",
      generalAdvice: "Mülkün değerini en hızlı ve etkili şekilde artırmak için öncelikle kozmetik iyileştirmelere odaklanın. Ardından bütçeniz doğrultusunda mutfak veya banyo renovasyonu düşünebilirsiniz."
    };
  }
}

// YENİ: Kredi ödeme planı ve yatırım geri dönüş analizi yapan fonksiyon
async function analyzeMortgageAndInvestment(propertyDetails, estimatedPrice) {
  try {
    // Güncel konut kredisi faiz oranlarını varsayalım (gerçek bir API'den alınabilir)
    const currentMortgageRate = 1.5; // Aylık %1.5
    
    const prompt = `
    Sen bir emlak finansmanı ve yatırım uzmanısın. Aşağıdaki mülk için kredi ödeme planı ve yatırım analizi yapmalısın.
    
    Mülk Özellikleri:
    - İl: ${propertyDetails.province}
    - İlçe: ${propertyDetails.district}
    - Mahalle: ${propertyDetails.neighborhood}
    - Emlak Tipi: ${propertyDetails.property_type}
    - Tahmini Değer: ${estimatedPrice} TL
    
    Güncel Konut Kredisi Aylık Faiz Oranı: %${currentMortgageRate}
    
    Lütfen aşağıdaki bilgileri JSON formatında döndür:
    {
      "mortgageAnalysis": {
        "loanScenarios": [
          {
            "downPaymentPercentage": 20,
            "downPaymentAmount": [Peşinat miktarı, TL],
            "loanAmount": [Kredi miktarı, TL],
            "term": 120, // 10 yıl
            "monthlyPayment": [Aylık ödeme, TL],
            "totalPayment": [Toplam ödeme, TL],
            "totalInterest": [Toplam faiz, TL]
          },
          {
            "downPaymentPercentage": 30,
            "downPaymentAmount": [Peşinat miktarı, TL],
            "loanAmount": [Kredi miktarı, TL],
            "term": 120, // 10 yıl
            "monthlyPayment": [Aylık ödeme, TL],
            "totalPayment": [Toplam ödeme, TL],
            "totalInterest": [Toplam faiz, TL]
          },
          {
            "downPaymentPercentage": 50,
            "downPaymentAmount": [Peşinat miktarı, TL],
            "loanAmount": [Kredi miktarı, TL],
            "term": 120, // 10 yıl
            "monthlyPayment": [Aylık ödeme, TL],
            "totalPayment": [Toplam ödeme, TL],
            "totalInterest": [Toplam faiz, TL]
          }
        ]
      },
      "investmentAnalysis": {
        "rentalEstimate": {
          "monthlyRental": [Aylık tahmini kira, TL],
          "annualRental": [Yıllık tahmini kira, TL],
          "rentalYield": [Kira getiri oranı, %]
        },
        "appreciationEstimate": {
          "annualAppreciationRate": [Yıllık değer artış oranı, %],
          "valueAfter5Years": [5 yıl sonraki tahmini değer, TL],
          "valueAfter10Years": [10 yıl sonraki tahmini değer, TL]
        },
        "breakEvenAnalysis": {
          "breakEvenPoint": [Yatırımın kendini amorti etme süresi, yıl],
          "cashFlowPositiveAfter": [Pozitif nakit akışına geçiş süresi, yıl (kredi ödemesi ile kira farkı)]
        }
      },
      "financialAdvice": [Finansal tavsiyeler, 3-5 madde]
    }
    
    Hesaplamaları güncel ekonomik koşullara göre gerçekçi bir şekilde yap. Özellikle kira getirisi ve değer artışını bölgesel faktörleri göz önünde bulundurarak hesapla. Sadece JSON formatında yanıt ver, başka açıklama ekleme.
    `;

    const text = await tryDifferentModels(prompt);
    console.log("Kredi ve yatırım analizi AI yanıtı:", text);
    
    let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Kredi ve yatırım analizi hatası:", error);
    
    // Hata durumunda basit bir varsayılan analiz döndür
    const downPayment20 = estimatedPrice * 0.2;
    const loanAmount20 = estimatedPrice - downPayment20;
    const monthlyPayment20 = calculateMonthlyPayment(loanAmount20, 1.5, 120); // 120 ay (10 yıl)
    
    const downPayment30 = estimatedPrice * 0.3;
    const loanAmount30 = estimatedPrice - downPayment30;
    const monthlyPayment30 = calculateMonthlyPayment(loanAmount30, 1.5, 120);
    
    const downPayment50 = estimatedPrice * 0.5;
    const loanAmount50 = estimatedPrice - downPayment50;
    const monthlyPayment50 = calculateMonthlyPayment(loanAmount50, 1.5, 120);
    
    const monthlyRental = Math.round(estimatedPrice * 0.005); // %0.5 kira getirisi varsayımı
    
    return {
      mortgageAnalysis: {
        loanScenarios: [
          {
            downPaymentPercentage: 20,
            downPaymentAmount: downPayment20,
            loanAmount: loanAmount20,
            term: 120,
            monthlyPayment: monthlyPayment20,
            totalPayment: monthlyPayment20 * 120,
            totalInterest: (monthlyPayment20 * 120) - loanAmount20
          },
          {
            downPaymentPercentage: 30,
            downPaymentAmount: downPayment30,
            loanAmount: loanAmount30,
            term: 120,
            monthlyPayment: monthlyPayment30,
            totalPayment: monthlyPayment30 * 120,
            totalInterest: (monthlyPayment30 * 120) - loanAmount30
          },
          {
            downPaymentPercentage: 50,
            downPaymentAmount: downPayment50,
            loanAmount: loanAmount50,
            term: 120,
            monthlyPayment: monthlyPayment50,
            totalPayment: monthlyPayment50 * 120,
            totalInterest: (monthlyPayment50 * 120) - loanAmount50
          }
        ]
      },
      investmentAnalysis: {
        rentalEstimate: {
          monthlyRental: monthlyRental,
          annualRental: monthlyRental * 12,
          rentalYield: 6 // %6 getiri varsayımı
        },
        appreciationEstimate: {
          annualAppreciationRate: 15, // %15 yıllık değer artışı varsayımı
          valueAfter5Years: Math.round(estimatedPrice * Math.pow(1.15, 5)),
          valueAfter10Years: Math.round(estimatedPrice * Math.pow(1.15, 10))
        },
        breakEvenAnalysis: {
          breakEvenPoint: 14, // Varsayılan değer
          cashFlowPositiveAfter: 5 // Varsayılan değer
        }
      },
      financialAdvice: [
        "En az %20 peşinat ile kredi kullanmanız finansal yükünüzü hafifletecektir.",
        "Aylık kira geliriniz, kredi ödemesinin bir kısmını karşılayacaktır.",
        "Uzun vadede (10+ yıl) mülk değer artışı, yatırım getirinizin önemli bir bileşeni olacaktır.",
        "Kredi faiz oranlarındaki değişimleri takip ederek, uygun zamanda refinansman yapabilirsiniz."
      ]
    };
  }
}

// Yardımcı fonksiyon: Aylık kredi ödemesi hesaplama
function calculateMonthlyPayment(loanAmount, monthlyInterestRate, termMonths) {
  const rate = monthlyInterestRate / 100;
  return Math.round(loanAmount * rate * Math.pow(1 + rate, termMonths) / (Math.pow(1 + rate, termMonths) - 1));
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

module.exports = { 
  estimatePropertyPrice,
  determineBuyerProfile,
  suggestInvestments,
  analyzeMortgageAndInvestment
}; 
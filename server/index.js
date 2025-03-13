const express = require('express');
const cors = require('cors');
const db = require('./db');
const { estimatePropertyPrice } = require('./ai-service');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// Emlak değerleme için endpoint
app.post('/api/estimate', async (req, res) => {
  try {
    const { 
      net_sqm, 
      gross_sqm,
      room_count, 
      district, 
      neighborhood, 
      building_age, 
      floor_location,
      total_floors,
      heating_type,
      bathroom_count,
      balcony, 
      parking, 
      elevator,
      property_type,
      furnished,
      usage_status,
      dues,
      suitable_for_credit,
      deed_status,
      province
    } = req.body;
    
    // Oda sayısını sayıya çevirme
    let roomsNumber = 0;
    if (room_count) {
      const roomMatch = room_count.match(/(\d+)/);
      if (roomMatch) {
        roomsNumber = parseInt(roomMatch[1]);
      }
    }
    
    // Bina yaşını sayıya çevirme
    let buildingAgeValue = 0;
    if (building_age) {
      if (building_age === '0') {
        buildingAgeValue = 0;
      } else if (building_age.includes('-')) {
        const ageParts = building_age.split('-');
        if (ageParts.length === 2) {
          const minAge = parseInt(ageParts[0]);
          const maxAge = parseInt(ageParts[1]);
          buildingAgeValue = Math.floor((minAge + maxAge) / 2);
        }
      } else {
        const ageMatch = building_age.match(/(\d+)/);
        if (ageMatch) {
          buildingAgeValue = parseInt(ageMatch[1]);
        }
      }
    }
    
    // Kat bilgisini sayıya çevirme
    let floorValue = 0;
    if (floor_location) {
      if (floor_location.toLowerCase().includes('giriş')) {
        floorValue = 0;
      } else if (floor_location.toLowerCase().includes('bodrum')) {
        floorValue = -1;
      } else if (floor_location.toLowerCase().includes('çatı')) {
        floorValue = 99; // Özel değer
      } else {
        const floorMatch = floor_location.match(/(\d+)/);
        if (floorMatch) {
          floorValue = parseInt(floorMatch[1]);
        }
      }
    }
    
    // Benzer özelliklere sahip emlakları veritabanından sorgulama
    // Önce bölge ve emlak tipine göre filtreleme yapıyoruz
    let baseQuery = `
      SELECT * FROM listings 
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    if (province) {
      baseQuery += ` AND province = $${paramIndex}`;
      queryParams.push(province);
      paramIndex++;
    }
    
    if (property_type) {
      baseQuery += ` AND property_type = $${paramIndex}`;
      queryParams.push(property_type);
      paramIndex++;
    }
    
    if (district) {
      baseQuery += ` AND district = $${paramIndex}`;
      queryParams.push(district);
      paramIndex++;
    }
    
    if (neighborhood) {
      baseQuery += ` AND neighborhood = $${paramIndex}`;
      queryParams.push(neighborhood);
      paramIndex++;
    }
    
    // Önce bölge ve emlak tipine göre ortalama metrekare fiyatını hesapla
    const avgPriceQuery = `
      SELECT AVG(price / NULLIF(net_sqm, 0)) as avg_sqm_price
      FROM listings
      WHERE district = $1
      ${neighborhood ? 'AND neighborhood = $2' : ''}
      ${property_type ? `AND property_type = $${neighborhood ? 3 : 2}` : ''}
      AND net_sqm > 0
    `;
    
    const avgPriceParams = [district];
    if (neighborhood) avgPriceParams.push(neighborhood);
    if (property_type) avgPriceParams.push(property_type);
    
    const avgPriceResult = await db.query(avgPriceQuery, avgPriceParams);
    const avgSqmPrice = avgPriceResult.rows[0]?.avg_sqm_price || 0;
    
    // Benzer özelliklere sahip emlakları getir
    baseQuery += ` ORDER BY 
      CASE WHEN net_sqm IS NOT NULL THEN ABS(net_sqm - $${paramIndex}) ELSE 999999 END * 2 +
      CASE WHEN room_count LIKE '%' || $${paramIndex+1} || '%' THEN 0 ELSE 100 END +
      CASE WHEN building_age LIKE '%' || $${paramIndex+2} || '%' THEN 0 ELSE 50 END +
      CASE WHEN district = $${paramIndex+3} THEN 0 ELSE 200 END +
      CASE WHEN neighborhood = $${paramIndex+4} THEN 0 ELSE 100 END
      LIMIT 10
    `;
    
    queryParams.push(
      net_sqm || 0, 
      roomsNumber.toString(), 
      buildingAgeValue.toString(),
      district || '',
      neighborhood || ''
    );
    
    const result = await db.query(baseQuery, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Benzer özellikte emlak bulunamadı' });
    }
    
    // Benzer emlakların fiyat ortalamasını hesaplama
    let totalPrice = 0;
    let totalWeight = 0;
    
    // Bölgedeki ortalama metrekare fiyatı
    const basePrice = avgSqmPrice * net_sqm;
    
    // Zaman bazlı değer düşüşü faktörü
    // Daha eski ilanlar daha az ağırlığa sahip olmalı
    const calculateTimeFactor = (listingDate) => {
      if (!listingDate) return 1.0;
      
      const listingTime = new Date(listingDate).getTime();
      const currentTime = new Date().getTime();
      const daysDifference = Math.floor((currentTime - listingTime) / (1000 * 60 * 60 * 24));
      
      // 90 günden eski ilanlar daha az ağırlığa sahip olacak
      if (daysDifference > 90) return 0.7;
      if (daysDifference > 60) return 0.8;
      if (daysDifference > 30) return 0.9;
      return 1.0;
    };
    
    result.rows.forEach(property => {
      // Benzerlik skoru hesaplama (daha düşük = daha benzer)
      const areaDiff = property.net_sqm ? Math.abs(property.net_sqm - (net_sqm || 0)) / (net_sqm || 1) * 100 : 100;
      
      let roomsDiff = 10; // Varsayılan fark
      if (property.room_count && room_count) {
        const propRoomMatch = property.room_count.match(/(\d+)/);
        if (propRoomMatch) {
          const propRooms = parseInt(propRoomMatch[1]);
          roomsDiff = Math.abs(propRooms - roomsNumber) * 20;
        }
      }
      
      let ageDiff = 20; // Varsayılan fark
      if (property.building_age && building_age) {
        // Yaş farkını hesapla
        if (property.building_age.includes('-')) {
          const propAgeParts = property.building_age.split('-');
          if (propAgeParts.length === 2) {
            const propMinAge = parseInt(propAgeParts[0]);
            const propMaxAge = parseInt(propAgeParts[1]);
            const propAvgAge = Math.floor((propMinAge + propMaxAge) / 2);
            ageDiff = Math.abs(propAvgAge - buildingAgeValue) * 2;
          }
        } else {
          const propAgeMatch = property.building_age.match(/(\d+)/);
          if (propAgeMatch) {
            const propAge = parseInt(propAgeMatch[1]);
            ageDiff = Math.abs(propAge - buildingAgeValue) * 2;
          }
        }
      }
      
      // Kat farkı hesaplama
      let floorDiff = 20;
      if (property.floor_location) {
        let propFloorValue = 0;
        if (property.floor_location.toLowerCase().includes('giriş')) {
          propFloorValue = 0;
        } else if (property.floor_location.toLowerCase().includes('bodrum')) {
          propFloorValue = -1;
        } else if (property.floor_location.toLowerCase().includes('çatı')) {
          propFloorValue = 99;
        } else {
          const propFloorMatch = property.floor_location.match(/(\d+)/);
          if (propFloorMatch) {
            propFloorValue = parseInt(propFloorMatch[1]);
          }
        }
        
        floorDiff = Math.abs(propFloorValue - floorValue) * 5;
      }
      
      // Banyo sayısı farkı
      let bathroomDiff = 0;
      if (property.bathroom_count !== null && bathroom_count !== null) {
        bathroomDiff = Math.abs(property.bathroom_count - bathroom_count) * 10;
      }
      
      // Brüt alan farkı
      let grossAreaDiff = 0;
      if (property.gross_sqm && gross_sqm) {
        grossAreaDiff = Math.abs(property.gross_sqm - gross_sqm) / gross_sqm * 50;
      }
      
      // Isıtma tipi karşılaştırma
      let heatingScore = 0;
      if (property.heating_type && heating_type) {
        if (property.heating_type.toLowerCase() !== heating_type.toLowerCase()) {
          heatingScore = 15;
        }
      }
      
      // Konum benzerliği
      const locationScore = property.neighborhood === neighborhood ? 0 : 50;
      
      // Ağırlıklı benzerlik skoru (daha düşük = daha benzer)
      const similarityScore = 1 / (1 + 
        areaDiff * 0.35 + // Alan farkına daha fazla ağırlık
        roomsDiff * 0.25 + 
        ageDiff * 0.15 + 
        floorDiff * 0.1 + 
        locationScore * 0.25 + // Konum benzerliğine daha fazla ağırlık
        bathroomDiff * 0.05 + 
        grossAreaDiff * 0.05 + 
        heatingScore * 0.05
      );
      
      // Ek özellikler için ayarlamalar
      let adjustmentFactor = 1.0;
      
      // Balkon
      if (balcony && property.balcony && 
         (typeof property.balcony === 'string' && (
          property.balcony.toLowerCase().includes('var') || 
          property.balcony.toLowerCase().includes('mevcut')))) {
        adjustmentFactor += 0.05;
      }
      
      // Otopark
      if (parking && property.parking && 
         (typeof property.parking === 'string' && (
          property.parking.toLowerCase().includes('var') || 
          property.parking.toLowerCase().includes('mevcut') ||
          property.parking.toLowerCase().includes('otopark')))) {
        adjustmentFactor += 0.08;
      }
      
      // Asansör
      if (elevator && property.elevator && 
         (typeof property.elevator === 'string' && (
          property.elevator.toLowerCase().includes('var') || 
          property.elevator.toLowerCase().includes('mevcut')))) {
        adjustmentFactor += 0.03;
      }
      
      // Eşyalı
      if (furnished && property.furnished && 
         (typeof property.furnished === 'string' && (
          property.furnished.toLowerCase().includes('var') || 
          property.furnished.toLowerCase().includes('evet') ||
          property.furnished.toLowerCase().includes('eşyalı')))) {
        adjustmentFactor += 0.07;
      }
      
      // Krediye uygunluk
      if (suitable_for_credit && property.suitable_for_credit && 
         (typeof property.suitable_for_credit === 'string' && (
          property.suitable_for_credit.toLowerCase().includes('var') || 
          property.suitable_for_credit.toLowerCase().includes('evet') ||
          property.suitable_for_credit.toLowerCase().includes('uygun')))) {
        adjustmentFactor += 0.03;
      }
      
      // Aidat karşılaştırma
      if (dues !== null && property.dues !== null) {
        if (property.dues < dues) {
          adjustmentFactor += 0.02; // Daha düşük aidat avantaj
        } else if (property.dues > dues * 1.5) {
          adjustmentFactor -= 0.02; // Çok yüksek aidat dezavantaj
        }
      }
      
      // Kat durumu
      if (property.floor_location === floor_location) {
        adjustmentFactor += 0.04;
      } else if (floorValue > 0 && property.floor_location && property.floor_location.match(/(\d+)/)) {
        // Yüksek katlar genellikle daha değerlidir
        const propFloorMatch = property.floor_location.match(/(\d+)/);
        if (propFloorMatch) {
          const propFloor = parseInt(propFloorMatch[1]);
          if (propFloor > 5) {
            adjustmentFactor += 0.02;
          }
        }
      }
      
      // Bina yaşı - yeni binalar daha değerlidir
      if (buildingAgeValue <= 5 && property.building_age && 
         (property.building_age === '0' || 
          property.building_age.includes('0-5') || 
          property.building_age.includes('Yeni'))) {
        adjustmentFactor += 0.1;
      }
      
      // Özel özellikler
      if (property.interior_features) {
        if (typeof property.interior_features === 'string' && property.interior_features.toLowerCase().includes('ankastre')) adjustmentFactor += 0.02;
        if (typeof property.interior_features === 'string' && property.interior_features.toLowerCase().includes('ebeveyn')) adjustmentFactor += 0.02;
        if (typeof property.interior_features === 'string' && property.interior_features.toLowerCase().includes('jakuzi')) adjustmentFactor += 0.03;
        if (typeof property.interior_features === 'string' && property.interior_features.toLowerCase().includes('akıllı ev')) adjustmentFactor += 0.05;
      }
      
      if (property.view_features) {
        if (typeof property.view_features === 'string' && property.view_features.toLowerCase().includes('deniz')) adjustmentFactor += 0.15;
        if (typeof property.view_features === 'string' && property.view_features.toLowerCase().includes('boğaz')) adjustmentFactor += 0.2;
        if (typeof property.view_features === 'string' && property.view_features.toLowerCase().includes('göl')) adjustmentFactor += 0.1;
        if (typeof property.view_features === 'string' && property.view_features.toLowerCase().includes('orman')) adjustmentFactor += 0.08;
      }
      
      // Zaman faktörü - daha yeni ilanlar daha güvenilir
      const timeFactor = calculateTimeFactor(property.listing_date);
      
      // Fiyat aykırı değer kontrolü
      // Ortalamadan çok farklı olan fiyatları daha az ağırlıklandır
      let outlierFactor = 1.0;
      if (avgSqmPrice > 0 && property.net_sqm > 0) {
        const propertySqmPrice = property.price / property.net_sqm;
        const priceDiffPercentage = Math.abs(propertySqmPrice - avgSqmPrice) / avgSqmPrice;
        
        if (priceDiffPercentage > 0.5) { // %50'den fazla farklıysa
          outlierFactor = 0.5;
        } else if (priceDiffPercentage > 0.3) { // %30'dan fazla farklıysa
          outlierFactor = 0.7;
        } else if (priceDiffPercentage > 0.2) { // %20'den fazla farklıysa
          outlierFactor = 0.9;
        }
      }
      
      // Ağırlıklı fiyat hesaplama - zaman faktörü ve aykırı değer faktörünü de ekle
      totalPrice += property.price * similarityScore * adjustmentFactor * timeFactor * outlierFactor;
      totalWeight += similarityScore * timeFactor * outlierFactor;
    });
    
    // Bölge ortalamasını da hesaba kat
    if (avgSqmPrice > 0) {
      totalPrice += basePrice * 0.4; // Bölge ortalamasına %40 ağırlık ver (önceden %30'du)
      totalWeight += 0.4;
    }
    
    // Piyasa trendlerini hesaba kat
    // Son 3 aydaki fiyat değişimini hesapla
    const marketTrendQuery = `
      SELECT 
        AVG(CASE WHEN listing_date >= NOW() - INTERVAL '1 month' THEN price / NULLIF(net_sqm, 0) ELSE NULL END) as last_month_avg,
        AVG(CASE WHEN listing_date >= NOW() - INTERVAL '3 month' AND listing_date < NOW() - INTERVAL '1 month' THEN price / NULLIF(net_sqm, 0) ELSE NULL END) as prev_months_avg
      FROM listings
      WHERE district = $1
      ${neighborhood ? 'AND neighborhood = $2' : ''}
      ${property_type ? `AND property_type = $${neighborhood ? 3 : 2}` : ''}
      AND net_sqm > 0
      AND listing_date >= NOW() - INTERVAL '3 month'
    `;
    
    const trendResult = await db.query(marketTrendQuery, avgPriceParams);
    const lastMonthAvg = trendResult.rows[0]?.last_month_avg || 0;
    const prevMonthsAvg = trendResult.rows[0]?.prev_months_avg || 0;
    
    // Piyasa trend faktörü hesapla
    let marketTrendFactor = 1.0;
    if (lastMonthAvg > 0 && prevMonthsAvg > 0) {
      const changePercentage = (lastMonthAvg - prevMonthsAvg) / prevMonthsAvg;
      
      // Son aydaki değişim oranına göre fiyatı ayarla
      if (changePercentage > 0.1) { // %10'dan fazla artış
        marketTrendFactor = 1.05;
      } else if (changePercentage > 0.05) { // %5'ten fazla artış
        marketTrendFactor = 1.03;
      } else if (changePercentage < -0.1) { // %10'dan fazla düşüş
        marketTrendFactor = 0.95;
      } else if (changePercentage < -0.05) { // %5'ten fazla düşüş
        marketTrendFactor = 0.97;
      }
    }
    
    // Trend faktörünü uygula
    let traditionalEstimate = 0;
    if (totalWeight > 0) {
      traditionalEstimate = Math.round((totalPrice / totalWeight) * marketTrendFactor);
    } else {
      // Eğer ağırlık sıfırsa, bölge ortalamasını kullan
      if (avgSqmPrice > 0 && net_sqm > 0) {
        traditionalEstimate = Math.round(avgSqmPrice * net_sqm);
        console.log("Ağırlık sıfır olduğu için bölge ortalaması kullanıldı:", traditionalEstimate);
      } else {
        // Bölge ortalaması da yoksa, benzer mülklerin ortalama fiyatını kullan
        const avgPrice = result.rows.reduce((sum, property) => sum + property.price, 0) / result.rows.length;
        traditionalEstimate = Math.round(avgPrice);
        console.log("Bölge ortalaması olmadığı için benzer mülklerin ortalaması kullanıldı:", traditionalEstimate);
      }
    }
    
    // Güven seviyesi hesaplama
    let confidenceLevel = 75; // Temel güven seviyesi
    
    // Benzer emlak sayısına göre güven seviyesini ayarla
    if (result.rows.length >= 8) {
      confidenceLevel += 10;
    } else if (result.rows.length >= 5) {
      confidenceLevel += 5;
    } else if (result.rows.length < 3) {
      confidenceLevel -= 10;
    }
    
    // Benzerlik skorlarının ortalamasına göre güven seviyesini ayarla
    const avgSimilarityScore = totalWeight / result.rows.length;
    if (avgSimilarityScore > 0.7) {
      confidenceLevel += 10;
    } else if (avgSimilarityScore > 0.5) {
      confidenceLevel += 5;
    } else if (avgSimilarityScore < 0.3) {
      confidenceLevel -= 10;
    }
    
    // Bölge veri yoğunluğuna göre güven seviyesini ayarla
    const regionDataQuery = `
      SELECT COUNT(*) as count
      FROM listings
      WHERE district = $1
      ${neighborhood ? 'AND neighborhood = $2' : ''}
    `;
    
    const regionDataResult = await db.query(regionDataQuery, [district, ...(neighborhood ? [neighborhood] : [])]);
    const regionDataCount = regionDataResult.rows[0]?.count || 0;
    
    if (regionDataCount > 100) {
      confidenceLevel += 5;
    } else if (regionDataCount < 20) {
      confidenceLevel -= 5;
    }
    
    // Güven seviyesini sınırla (0-100 arası)
    confidenceLevel = Math.max(0, Math.min(100, confidenceLevel));
    
    // Fiyat aralığı hesaplama
    // Güven seviyesi düşükse aralık daha geniş olmalı
    const priceRangePercent = 20 - (confidenceLevel / 10);
    const lowerBound = Math.round(traditionalEstimate * (1 - priceRangePercent / 100));
    const upperBound = Math.round(traditionalEstimate * (1 + priceRangePercent / 100));
    
    // Yapay zeka ile tahmini fiyat hesapla
    let aiEstimate;
    try {
      // En benzer 3 mülkü gönder
      const topSimilarProperties = result.rows.slice(0, 3);
      
      aiEstimate = await estimatePropertyPrice(
        {
          province, district, neighborhood, property_type, 
          net_sqm, gross_sqm, room_count, building_age,
          floor_location, total_floors, heating_type, bathroom_count,
          balcony, parking, elevator, furnished, usage_status,
          dues, suitable_for_credit, deed_status
        },
        topSimilarProperties
      );
      
      console.log("AI değerleme sonucu:", aiEstimate);
    } catch (error) {
      console.error("AI değerleme hatası:", error);
      // AI hatası durumunda sadece geleneksel tahmini kullan
      aiEstimate = {
        estimatedPrice: traditionalEstimate,
        priceRange: {
          min: lowerBound,
          max: upperBound
        },
        confidenceLevel: confidenceLevel,
        explanation: "Geleneksel algoritma ile hesaplanan değer."
      };
    }
    
    // İki tahmini birleştir (örneğin %60 AI, %40 geleneksel)
    const finalEstimate = Math.round(aiEstimate.estimatedPrice * 0.6 + traditionalEstimate * 0.4);
    
    // Güven seviyesini hesapla (AI ve mevcut güven seviyesini birleştir)
    const finalConfidenceLevel = Math.round((aiEstimate.confidenceLevel + confidenceLevel) / 2);
    
    // Fiyat aralığını hesapla
    const finalPriceRange = {
      min: Math.round((aiEstimate.priceRange.min + lowerBound) / 2),
      max: Math.round((aiEstimate.priceRange.max + upperBound) / 2)
    };
    
    res.json({
      estimatedPrice: finalEstimate,
      traditionalEstimate,
      aiEstimate: aiEstimate.estimatedPrice,
      confidenceLevel: finalConfidenceLevel,
      priceRange: finalPriceRange,
      aiExplanation: aiEstimate.explanation,
      similarProperties: result.rows,
      propertyDetails: {
        net_sqm,
        gross_sqm,
        room_count,
        district,
        neighborhood,
        building_age,
        floor_location,
        total_floors,
        heating_type,
        bathroom_count,
        balcony,
        parking,
        elevator,
        property_type,
        furnished,
        usage_status,
        dues,
        suitable_for_credit,
        deed_status,
        province
      }
    });
    
  } catch (error) {
    console.error('Değerleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Tüm ilçeleri getirme endpoint'i
app.get('/api/districts', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT district FROM listings WHERE district IS NOT NULL ORDER BY district');
    res.json(result.rows.map(row => row.district));
  } catch (error) {
    console.error('İlçe getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// İlçeye göre mahalleleri getirme endpoint'i
app.get('/api/neighborhoods/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const result = await db.query('SELECT DISTINCT neighborhood FROM listings WHERE district = $1 AND neighborhood IS NOT NULL ORDER BY neighborhood', [district]);
    res.json(result.rows.map(row => row.neighborhood));
  } catch (error) {
    console.error('Mahalle getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Emlak tiplerini getirme endpoint'i
app.get('/api/property-types', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT property_type FROM listings WHERE property_type IS NOT NULL ORDER BY property_type');
    res.json(result.rows.map(row => row.property_type));
  } catch (error) {
    console.error('Emlak tipi getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// İlleri getirme endpoint'i
app.get('/api/provinces', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT province FROM listings WHERE province IS NOT NULL ORDER BY province');
    res.json(result.rows.map(row => row.province));
  } catch (error) {
    console.error('İl getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Isıtma tiplerini getirme endpoint'i
app.get('/api/heating-types', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT heating_type FROM listings WHERE heating_type IS NOT NULL ORDER BY heating_type');
    res.json(result.rows.map(row => row.heating_type));
  } catch (error) {
    console.error('Isıtma tipi getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Oda sayılarını getirme endpoint'i
app.get('/api/room-counts', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT room_count FROM listings WHERE room_count IS NOT NULL ORDER BY room_count');
    res.json(result.rows.map(row => row.room_count));
  } catch (error) {
    console.error('Oda sayısı getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Bina yaşlarını getirme endpoint'i
app.get('/api/building-ages', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT building_age FROM listings WHERE building_age IS NOT NULL ORDER BY building_age');
    res.json(result.rows.map(row => row.building_age));
  } catch (error) {
    console.error('Bina yaşı getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kat konumlarını getirme endpoint'i
app.get('/api/floor-locations', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT floor_location FROM listings WHERE floor_location IS NOT NULL ORDER BY floor_location');
    res.json(result.rows.map(row => row.floor_location));
  } catch (error) {
    console.error('Kat konumu getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Kullanım durumlarını getirme endpoint'i
app.get('/api/usage-statuses', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT usage_status FROM listings WHERE usage_status IS NOT NULL ORDER BY usage_status');
    res.json(result.rows.map(row => row.usage_status));
  } catch (error) {
    console.error('Kullanım durumu getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Tapu durumlarını getirme endpoint'i
app.get('/api/deed-statuses', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT deed_status FROM listings WHERE deed_status IS NOT NULL ORDER BY deed_status');
    res.json(result.rows.map(row => row.deed_status));
  } catch (error) {
    console.error('Tapu durumu getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// Server'ı başlatma
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 